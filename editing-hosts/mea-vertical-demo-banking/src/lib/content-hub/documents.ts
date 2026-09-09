import { contentHubGraphql } from '@/lib/content-hub/client';

export type DocumentFacetOption = {
  id: string;
  label: string;
};

export type DocumentFacets = {
  docTypes: DocumentFacetOption[];
  categories: DocumentFacetOption[];
  topics: DocumentFacetOption[];
  mediaTypes: DocumentFacetOption[];
};

export type DocumentResult = {
  id: string;
  title: string;
  fileName: string;
  publishedDate: string;
  publishedDateIso: string | null;
  docType: string | null;
  categories: string[];
  topics: string[];
  mediaType: string | null;
  viewUrl: string | null;
  downloadUrl: string | null;
};

export type DocumentSearchParams = {
  q?: string;
  docTypes?: string[];
  categories?: string[];
  topics?: string[];
  media?: string[];
  /** Only assets where assetToPublicLink has at least one link. */
  viewableOnly?: boolean;
  sort?: 'date' | 'title';
  first?: number;
  after?: string;
};

export type DocumentSearchResult = {
  total: number;
  results: DocumentResult[];
  endCursor: string | null;
  hasNext: boolean;
};

type TaxonomyNode = {
  id: string;
  taxonomyName?: string | null;
  taxonomyLabel?: Record<string, string> | null;
};

type PublicUrlEntry = {
  url?: string;
  resource?: string;
  expiredOn?: string | null;
};

type PublicLinkRef = {
  id?: string;
  relativeUrl?: string | null;
  resource?: string | null;
  status?: string | null;
};

type AssetNode = {
  id: string;
  title?: string | null;
  fileName?: string | null;
  createdOn?: string | null;
  urls?: Record<string, PublicUrlEntry> | null;
  fileProperties?: {
    properties?: {
      title?: string;
      extension?: string;
      group?: string;
      content_type?: string;
    };
  } | null;
  assetToPublicLink?: {
    total?: number | null;
    results?: PublicLinkRef[] | null;
  } | null;
  bMA_Doc_Type?: TaxonomyNode | null;
  bMA_Doc_Category?: { results?: TaxonomyNode[] | null } | null;
  bMA_Doc_TopicOrSector?: { results?: TaxonomyNode[] | null } | null;
};

const ALL_DOC_TYPE_IDS = [
  'BMA.Doc.Type.RegulatoryLegislativeDocuments',
  'BMA.Doc.Type.Publications',
  'BMA.Doc.Type.NewsRoom',
  'BMA.Doc.Type.GeneralInformation',
];

const MEDIA_TYPES: DocumentFacetOption[] = [
  { id: 'pdf', label: 'PDF' },
  { id: 'word', label: 'Word' },
  { id: 'excel', label: 'Excel' },
  { id: 'powerpoint', label: 'PowerPoint' },
  { id: 'image', label: 'Image' },
];

const MEDIA_EXTENSIONS: Record<string, string[]> = {
  pdf: ['.pdf'],
  word: ['.doc', '.docx'],
  excel: ['.xls', '.xlsx'],
  powerpoint: ['.ppt', '.pptx'],
  image: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.tif', '.tiff'],
};

const ASSET_SELECTION = `
  id
  title
  fileName
  createdOn
  urls
  fileProperties
  assetToPublicLink {
    total
    results { id relativeUrl resource status }
  }
  bMA_Doc_Type { id taxonomyName taxonomyLabel }
  bMA_Doc_Category { results { id taxonomyName taxonomyLabel } }
  bMA_Doc_TopicOrSector { results { id taxonomyName taxonomyLabel } }
`;

function taxonomyLabel(node?: TaxonomyNode | null): string {
  if (!node) return '';
  const localized = node.taxonomyLabel?.['en-US'] || Object.values(node.taxonomyLabel || {})[0];
  return localized || node.taxonomyName || node.id;
}

function cleanTitle(fileName: string, fallbackTitle?: string | null, propertyTitle?: string): string {
  if (propertyTitle?.trim()) return propertyTitle.trim();
  const raw = (fallbackTitle || fileName || 'Untitled document').trim();
  return raw.replace(/^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}-/, '').replace(/[-_]+/g, ' ').trim() || raw;
}

function formatDate(iso?: string | null): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function pickPublicUrl(urls?: Record<string, PublicUrlEntry> | null): string | null {
  const entries = Object.values(urls || {}).filter((entry) => entry?.url && !entry.expiredOn);
  if (!entries.length) return null;
  const download = entries.find((entry) => entry.resource === 'downloadOriginal');
  return download?.url || entries[0]?.url || null;
}

function getPublicContentBase(): string | null {
  const explicit = process.env.CONTENT_HUB_PUBLIC_BASE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, '');

  const tokenUrl = process.env.CONTENT_HUB_TOKEN_URL?.trim();
  if (!tokenUrl) return null;
  try {
    return new URL(tokenUrl).origin;
  } catch {
    return null;
  }
}

/** True when the asset has at least one related public link. */
function hasPublicLink(asset: AssetNode): boolean {
  const total = asset.assetToPublicLink?.total;
  if (typeof total === 'number') return total > 0;
  return (asset.assetToPublicLink?.results?.length || 0) > 0;
}

function pickUrlFromPublicLinks(asset: AssetNode): string | null {
  const links = asset.assetToPublicLink?.results || [];
  if (!links.length) return null;

  const preferred =
    links.find((link) => link.resource === 'downloadOriginal' && link.relativeUrl) ||
    links.find((link) => link.relativeUrl);

  if (!preferred?.relativeUrl) return null;

  const base = getPublicContentBase();
  if (!base) return null;
  return `${base}/api/public/content/${preferred.relativeUrl}`;
}

function mediaTypeFromFile(fileName: string, extension?: string): string | null {
  const ext = (extension || fileName.split('.').pop() || '').toLowerCase().replace(/^\./, '');
  if (!ext) return null;
  for (const [id, extensions] of Object.entries(MEDIA_EXTENSIONS)) {
    if (extensions.includes(`.${ext}`)) return id;
  }
  return ext;
}

function relationOr(field: string, idsField: string, ids: string[]): Record<string, unknown> | null {
  if (!ids.length) return null;
  if (ids.length === 1) {
    return { [field]: { [idsField]: ids[0] } };
  }
  return {
    OR: ids.map((id) => ({ [field]: { [idsField]: id } })),
  };
}

function mediaWhere(media: string[]): Record<string, unknown> | null {
  const extensions = media.flatMap((id) => MEDIA_EXTENSIONS[id] || []);
  if (!extensions.length) return null;
  if (extensions.length === 1) {
    return { fileName_endswith: extensions[0] };
  }
  return {
    OR: extensions.map((extension) => ({ fileName_endswith: extension })),
  };
}

function buildWhere(params: DocumentSearchParams): Record<string, unknown> {
  const clauses: Record<string, unknown>[] = [];

  const docTypes = params.docTypes?.filter(Boolean) || [];
  const docTypeClause = relationOr(
    'bMA_Doc_Type',
    'bMA_Doc_Type_ids',
    docTypes.length ? docTypes : ALL_DOC_TYPE_IDS
  );
  if (docTypeClause) clauses.push(docTypeClause);

  const categoryClause = relationOr(
    'bMA_Doc_Category',
    'bMA_Doc_Categorisation_ids',
    params.categories?.filter(Boolean) || []
  );
  if (categoryClause) clauses.push(categoryClause);

  const topicClause = relationOr(
    'bMA_Doc_TopicOrSector',
    'bMA_Topic_Sector_ids',
    params.topics?.filter(Boolean) || []
  );
  if (topicClause) clauses.push(topicClause);

  const mediaClause = mediaWhere(params.media?.filter(Boolean) || []);
  if (mediaClause) clauses.push(mediaClause);

  const q = params.q?.trim();
  if (q) {
    clauses.push({
      OR: [{ title_contains: q }, { fileName_contains: q }],
    });
  }

  if (!clauses.length) return {};
  if (clauses.length === 1) return clauses[0];
  return { AND: clauses };
}

function toGraphQlInput(value: unknown): string {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return `[${value.map((item) => toGraphQlInput(item)).join(', ')}]`;
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .map(([key, nested]) => `${key}: ${toGraphQlInput(nested)}`)
      .join(', ');
    return `{ ${entries} }`;
  }
  return 'null';
}

function mapAsset(asset: AssetNode): DocumentResult {
  const publicUrl = pickPublicUrl(asset.urls) || pickUrlFromPublicLinks(asset);
  const fileName = asset.fileName || '';
  const extension = asset.fileProperties?.properties?.extension;
  return {
    id: asset.id,
    title: cleanTitle(fileName, asset.title, asset.fileProperties?.properties?.title),
    fileName,
    publishedDate: formatDate(asset.createdOn),
    publishedDateIso: asset.createdOn || null,
    docType: taxonomyLabel(asset.bMA_Doc_Type) || null,
    categories: (asset.bMA_Doc_Category?.results || []).map((item) => taxonomyLabel(item)).filter(Boolean),
    topics: (asset.bMA_Doc_TopicOrSector?.results || []).map((item) => taxonomyLabel(item)).filter(Boolean),
    mediaType: mediaTypeFromFile(fileName, extension),
    viewUrl: publicUrl,
    downloadUrl: publicUrl,
  };
}

async function fetchAssetPage(params: DocumentSearchParams, first: number, after: string | null) {
  const orderBy = params.sort === 'title' ? 'FILENAME_ASC' : 'CREATEDON_DESC';
  const where = buildWhere(params);
  const whereLiteral = Object.keys(where).length ? toGraphQlInput(where) : 'null';
  const afterLiteral = after ? JSON.stringify(after) : 'null';

  const searchQuery = `
query DocumentSearch {
  allM_Asset(
    first: ${first}
    after: ${afterLiteral}
    where: ${whereLiteral}
    orderBy: [${orderBy}]
  ) {
    total
    pageInfo {
      endCursor
      hasNext
    }
    results {
      ${ASSET_SELECTION}
    }
  }
}
`;

  const data = await contentHubGraphql<{
    allM_Asset: {
      total: number;
      pageInfo?: { endCursor?: string | null; hasNext?: boolean | null };
      results: AssetNode[];
    };
  }>(searchQuery);

  return data.allM_Asset;
}

const FACETS_QUERY = `
query DocumentFacets {
  docTypes: allBMA_Doc_Type(first: 50) {
    results { id taxonomyName taxonomyLabel }
  }
  categories: allBMA_Doc_Categorisation(first: 100) {
    results { id taxonomyName taxonomyLabel }
  }
  topics: allBMA_Topic_Sector(first: 100) {
    results { id taxonomyName taxonomyLabel }
  }
}
`;

export async function getDocumentFacets(): Promise<DocumentFacets> {
  const data = await contentHubGraphql<{
    docTypes: { results: TaxonomyNode[] };
    categories: { results: TaxonomyNode[] };
    topics: { results: TaxonomyNode[] };
  }>(FACETS_QUERY);

  const mapOptions = (nodes: TaxonomyNode[]) =>
    nodes
      .map((node) => ({ id: node.id, label: taxonomyLabel(node) }))
      .sort((a, b) => a.label.localeCompare(b.label));

  return {
    docTypes: mapOptions(data.docTypes.results || []),
    categories: mapOptions(data.categories.results || []),
    topics: mapOptions(data.topics.results || []),
    mediaTypes: MEDIA_TYPES,
  };
}

export async function searchDocuments(params: DocumentSearchParams): Promise<DocumentSearchResult> {
  const pageSize = Math.min(Math.max(params.first || 20, 1), 50);

  // Edge cannot filter M_Asset by assetToPublicLink in `where`, so when viewableOnly
  // is requested we keep paging assets and retain those with a non-empty relation.
  if (params.viewableOnly) {
    const matched: DocumentResult[] = [];
    let after: string | null = params.after || null;
    let endCursor: string | null = null;
    let hasNext = false;
    let guard = 0;

    while (matched.length < pageSize && guard < 20) {
      guard += 1;
      const page = await fetchAssetPage(params, 50, after);
      endCursor = page.pageInfo?.endCursor || null;
      hasNext = Boolean(page.pageInfo?.hasNext);

      for (const asset of page.results || []) {
        if (!hasPublicLink(asset)) continue;
        matched.push(mapAsset(asset));
        if (matched.length >= pageSize) break;
      }

      if (matched.length >= pageSize || !hasNext) break;
      after = endCursor;
      if (!after) break;
    }

    return {
      total: matched.length,
      results: matched.slice(0, pageSize),
      endCursor,
      hasNext: matched.length >= pageSize ? hasNext || Boolean(endCursor) : hasNext,
    };
  }

  const connection = await fetchAssetPage(params, pageSize, params.after || null);
  const results = (connection.results || []).map(mapAsset);
  const endCursor = connection.pageInfo?.endCursor || null;
  const hasNext =
    typeof connection.pageInfo?.hasNext === 'boolean'
      ? connection.pageInfo.hasNext
      : results.length === pageSize && results.length < connection.total;

  return {
    total: connection.total || 0,
    results,
    endCursor,
    hasNext,
  };
}

export function parseListParam(value: string | string[] | undefined): string[] {
  if (!value) return [];
  const raw = Array.isArray(value) ? value.join(',') : value;
  return raw
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
}
