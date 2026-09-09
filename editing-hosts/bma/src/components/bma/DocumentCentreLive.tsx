'use client';

import type { FormEvent, JSX, ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type {
  DocumentFacetOption,
  DocumentFacets,
  DocumentResult,
  DocumentSearchResult,
} from '@/lib/content-hub/documents';

type FilterKey = 'docTypes' | 'categories' | 'topics' | 'media';

export type DocumentCentreFilterVisibility = {
  search: boolean;
  viewable: boolean;
  docTypes: boolean;
  categories: boolean;
  topics: boolean;
  media: boolean;
};

const DEFAULT_FILTER_VISIBILITY: DocumentCentreFilterVisibility = {
  search: true,
  viewable: true,
  docTypes: true,
  categories: true,
  topics: true,
  media: true,
};

type DocumentCentreState = {
  contentHubEnabled: boolean;
  facets: DocumentFacets;
  enabledFilters: DocumentCentreFilterVisibility;
  draftQ: string;
  setDraftQ: (value: string) => void;
  onSearchSubmit: (event: FormEvent) => void;
  docTypes: string[];
  categories: string[];
  topics: string[];
  media: string[];
  viewableOnly: boolean;
  setViewableOnly: (value: boolean) => void;
  onToggle: (key: FilterKey, id: string) => void;
  clearFilters: () => void;
  sort: 'date' | 'title';
  setSort: (value: 'date' | 'title') => void;
  results: DocumentResult[];
  total: number;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasNext: boolean;
  loadMore: () => void;
  resultsCountLabel: string;
};

const EMPTY_FACETS: DocumentFacets = {
  docTypes: [],
  categories: [],
  topics: [],
  mediaTypes: [],
};

const DocumentCentreContext = createContext<DocumentCentreState | null>(null);

function useDocumentCentre(): DocumentCentreState {
  const value = useContext(DocumentCentreContext);
  if (!value) {
    throw new Error('Document centre components must be used within DocumentCentreProvider');
  }
  return value;
}

function toggleValue(values: string[], value: string): string[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function buildQuery(params: {
  q: string;
  docTypes: string[];
  categories: string[];
  topics: string[];
  media: string[];
  viewableOnly: boolean;
  sort: 'date' | 'title';
  after?: string;
}): string {
  const search = new URLSearchParams();
  if (params.q.trim()) search.set('q', params.q.trim());
  if (params.docTypes.length) search.set('docTypes', params.docTypes.join(','));
  if (params.categories.length) search.set('categories', params.categories.join(','));
  if (params.topics.length) search.set('topics', params.topics.join(','));
  if (params.media.length) search.set('media', params.media.join(','));
  if (params.viewableOnly) search.set('viewableOnly', '1');
  search.set('sort', params.sort);
  if (params.after) search.set('after', params.after);
  return search.toString();
}

export function DocumentCentreProvider({
  children,
  resultsCountLabel = 'Results',
  enabledFilters = DEFAULT_FILTER_VISIBILITY,
  contentHubEnabled = true,
}: {
  children: ReactNode;
  resultsCountLabel?: string;
  enabledFilters?: DocumentCentreFilterVisibility;
  /** When false (Sitecore edit mode), skip all Content Hub / Edge requests. */
  contentHubEnabled?: boolean;
}): JSX.Element {
  const [facets, setFacets] = useState<DocumentFacets>(EMPTY_FACETS);
  const [q, setQ] = useState('');
  const [draftQ, setDraftQ] = useState('');
  const [docTypes, setDocTypes] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [media, setMedia] = useState<string[]>([]);
  const [viewableOnly, setViewableOnly] = useState(false);
  const [sort, setSort] = useState<'date' | 'title'>('date');
  const [results, setResults] = useState<DocumentResult[]>([]);
  const [total, setTotal] = useState(0);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(contentHubEnabled);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeDocTypes = enabledFilters.docTypes ? docTypes : [];
  const activeCategories = enabledFilters.categories ? categories : [];
  const activeTopics = enabledFilters.topics ? topics : [];
  const activeMedia = enabledFilters.media ? media : [];
  const activeViewableOnly = enabledFilters.viewable ? viewableOnly : false;
  const activeQ = enabledFilters.search ? q : '';

  const queryString = useMemo(
    () =>
      buildQuery({
        q: activeQ,
        docTypes: activeDocTypes,
        categories: activeCategories,
        topics: activeTopics,
        media: activeMedia,
        viewableOnly: activeViewableOnly,
        sort,
      }),
    [activeQ, activeDocTypes, activeCategories, activeTopics, activeMedia, activeViewableOnly, sort]
  );

  useEffect(() => {
    if (!enabledFilters.search) {
      setDraftQ('');
      setQ('');
    }
    if (!enabledFilters.docTypes) setDocTypes([]);
    if (!enabledFilters.categories) setCategories([]);
    if (!enabledFilters.topics) setTopics([]);
    if (!enabledFilters.media) setMedia([]);
    if (!enabledFilters.viewable) setViewableOnly(false);
  }, [
    enabledFilters.search,
    enabledFilters.docTypes,
    enabledFilters.categories,
    enabledFilters.topics,
    enabledFilters.media,
    enabledFilters.viewable,
  ]);

  useEffect(() => {
    if (!contentHubEnabled) {
      setFacets(EMPTY_FACETS);
      setResults([]);
      setTotal(0);
      setEndCursor(null);
      setHasNext(false);
      setLoading(false);
      setLoadingMore(false);
      setError(null);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const response = await fetch('/api/content-hub/facets');
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || 'Failed to load filters');
        if (!cancelled) setFacets(payload as DocumentFacets);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load filters');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [contentHubEnabled]);

  const loadDocuments = useCallback(
    async (mode: 'replace' | 'append', cursor?: string) => {
      if (!contentHubEnabled) {
        setLoading(false);
        setLoadingMore(false);
        return;
      }

      if (mode === 'replace') setLoading(true);
      else setLoadingMore(true);
      setError(null);

      try {
        const qs = buildQuery({
          q: activeQ,
          docTypes: activeDocTypes,
          categories: activeCategories,
          topics: activeTopics,
          media: activeMedia,
          viewableOnly: activeViewableOnly,
          sort,
          after: cursor,
        });
        const response = await fetch(`/api/content-hub/documents?${qs}`);
        const payload = (await response.json()) as DocumentSearchResult & { error?: string };
        if (!response.ok) throw new Error(payload.error || 'Failed to search documents');

        setEndCursor(payload.endCursor);
        setHasNext(payload.hasNext);
        setResults((current) => {
          const base = mode === 'append' ? current : [];
          const seen = new Set(base.map((item) => item.id));
          const next = [...base];
          for (const item of payload.results) {
            if (seen.has(item.id)) continue;
            seen.add(item.id);
            next.push(item);
          }
          setTotal(activeViewableOnly ? next.length : payload.total);
          return next;
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to search documents');
        if (mode === 'replace') {
          setResults([]);
          setTotal(0);
          setHasNext(false);
          setEndCursor(null);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [
      contentHubEnabled,
      activeQ,
      activeDocTypes,
      activeCategories,
      activeTopics,
      activeMedia,
      activeViewableOnly,
      sort,
    ]
  );

  useEffect(() => {
    if (!contentHubEnabled) return;
    void loadDocuments('replace');
  }, [contentHubEnabled, loadDocuments, queryString]);

  const onSearchSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!contentHubEnabled) return;
    setQ(draftQ);
  };

  const onToggle = (key: FilterKey, id: string) => {
    if (!contentHubEnabled) return;
    const setters: Record<FilterKey, typeof setDocTypes> = {
      docTypes: setDocTypes,
      categories: setCategories,
      topics: setTopics,
      media: setMedia,
    };
    setters[key]((current) => toggleValue(current, id));
  };

  const clearFilters = () => {
    setDraftQ('');
    setQ('');
    setDocTypes([]);
    setCategories([]);
    setTopics([]);
    setMedia([]);
    setViewableOnly(false);
    setSort('date');
  };

  const value: DocumentCentreState = {
    contentHubEnabled,
    facets,
    enabledFilters,
    draftQ,
    setDraftQ,
    onSearchSubmit,
    docTypes,
    categories,
    topics,
    media,
    viewableOnly,
    setViewableOnly: contentHubEnabled ? setViewableOnly : () => undefined,
    onToggle,
    clearFilters,
    sort,
    setSort: contentHubEnabled ? setSort : () => undefined,
    results,
    total,
    loading,
    loadingMore,
    error,
    hasNext,
    loadMore: () => {
      if (!contentHubEnabled || !endCursor) return;
      void loadDocuments('append', endCursor);
    },
    resultsCountLabel,
  };

  return <DocumentCentreContext.Provider value={value}>{children}</DocumentCentreContext.Provider>;
}

function FacetGroup(props: {
  title: string;
  options: DocumentFacetOption[];
  selected: string[];
  onToggle: (id: string) => void;
  preview?: boolean;
}): JSX.Element | null {
  const { title, options, selected, onToggle, preview = false } = props;
  if (!preview && !options.length) return null;

  return (
    <fieldset className="bma-filter-group">
      <legend className="bma-filter-group__title">{title}</legend>
      <div className="bma-filter-group__options">
        {preview && !options.length ? (
          <p className="bma-doc-centre__filter-hint">Options load from Content Hub outside the page editor.</p>
        ) : (
          options.map((option) => {
            const inputId = `bma-live-filter-${title}-${option.id}`.replace(/\W+/g, '-');
            const checked = selected.includes(option.id);
            return (
              <label
                key={option.id}
                className={`bma-filter-option ${checked ? 'is-selected' : ''}`.trim()}
                htmlFor={inputId}
              >
                <input
                  id={inputId}
                  className="bma-filter-option__input"
                  type="checkbox"
                  checked={checked}
                  disabled={preview}
                  onChange={() => onToggle(option.id)}
                />
                <span className="bma-filter-option__label">{option.label}</span>
              </label>
            );
          })
        )}
      </div>
    </fieldset>
  );
}

export function DocumentCentreSidebarControls(): JSX.Element {
  const {
    contentHubEnabled,
    facets,
    enabledFilters,
    draftQ,
    setDraftQ,
    onSearchSubmit,
    docTypes,
    categories,
    topics,
    media,
    viewableOnly,
    setViewableOnly,
    onToggle,
    clearFilters,
  } = useDocumentCentre();

  const preview = !contentHubEnabled;
  const hasAnyFilter =
    enabledFilters.viewable ||
    enabledFilters.docTypes ||
    enabledFilters.categories ||
    enabledFilters.topics ||
    enabledFilters.media;

  return (
    <>
      {enabledFilters.search ? (
        <form className="bma-doc-centre__search-ui" role="search" onSubmit={onSearchSubmit}>
          <label className="u-sr-only" htmlFor="bma-doc-search">
            Search documents
          </label>
          <input
            id="bma-doc-search"
            className="bma-doc-centre__search-input"
            type="search"
            placeholder="Search documents…"
            value={draftQ}
            disabled={preview}
            onChange={(event) => setDraftQ(event.target.value)}
          />
          <button type="submit" className="bma-doc-centre__search-btn" disabled={preview}>
            Search
          </button>
        </form>
      ) : null}

      {hasAnyFilter ? (
        <div className="bma-doc-centre__filters">
          {enabledFilters.viewable ? (
            <>
              <label
                className={`bma-filter-option ${viewableOnly ? 'is-selected' : ''}`.trim()}
                htmlFor="bma-live-filter-viewable"
              >
                <input
                  id="bma-live-filter-viewable"
                  className="bma-filter-option__input"
                  type="checkbox"
                  checked={viewableOnly}
                  disabled={preview}
                  onChange={(event) => setViewableOnly(event.target.checked)}
                />
                <span className="bma-filter-option__label">Viewable / downloadable only</span>
              </label>
              <p className="bma-doc-centre__filter-hint">
                Only documents that have a public link (viewable/downloadable).
              </p>
            </>
          ) : null}

          {enabledFilters.docTypes ? (
            <FacetGroup
              title="Document type"
              options={facets.docTypes}
              selected={docTypes}
              preview={preview}
              onToggle={(id) => onToggle('docTypes', id)}
            />
          ) : null}
          {enabledFilters.categories ? (
            <FacetGroup
              title="Document categorisation"
              options={facets.categories}
              selected={categories}
              preview={preview}
              onToggle={(id) => onToggle('categories', id)}
            />
          ) : null}
          {enabledFilters.topics ? (
            <FacetGroup
              title="Topic / sector"
              options={facets.topics}
              selected={topics}
              preview={preview}
              onToggle={(id) => onToggle('topics', id)}
            />
          ) : null}
          {enabledFilters.media ? (
            <FacetGroup
              title="Asset media"
              options={facets.mediaTypes}
              selected={media}
              preview={preview}
              onToggle={(id) => onToggle('media', id)}
            />
          ) : null}
          <button type="button" className="bma-doc-centre__clear" onClick={clearFilters} disabled={preview}>
            Clear filters
          </button>
        </div>
      ) : null}
    </>
  );
}

function ResultCard({ item }: { item: DocumentResult }): JSX.Element {
  const meta = [item.docType, ...item.categories.slice(0, 2)].filter(Boolean).join(' · ');

  return (
    <article className="bma-doc-card">
      <div className="bma-doc-card__main">
        <h3 className="bma-doc-card__title">{item.title}</h3>
        {item.publishedDate ? <p className="bma-doc-card__date">{item.publishedDate}</p> : null}
        {meta ? <p className="bma-doc-card__meta">{meta}</p> : null}
      </div>
      <div className="bma-doc-card__actions">
        {item.viewUrl ? (
          <a
            className="bma-doc-card__action bma-doc-card__action--view"
            href={item.viewUrl}
            target="_blank"
            rel="noreferrer"
          >
            View
          </a>
        ) : null}
        {item.downloadUrl ? (
          <a
            className="bma-doc-card__action bma-doc-card__action--download"
            href={item.downloadUrl}
            target="_blank"
            rel="noreferrer"
          >
            Download
          </a>
        ) : (
          <span className="bma-doc-card__action bma-doc-card__action--disabled" title="No public link on Edge yet">
            No link
          </span>
        )}
      </div>
    </article>
  );
}

export function DocumentCentreResultsPanel(): JSX.Element {
  const {
    contentHubEnabled,
    resultsCountLabel,
    total,
    loading,
    loadingMore,
    error,
    results,
    sort,
    setSort,
    hasNext,
    loadMore,
    viewableOnly,
  } = useDocumentCentre();

  if (!contentHubEnabled) {
    return (
      <p className="bma-doc-centre__status">
        Document results are not loaded in the page editor. Content Hub Experience Edge is only queried on the
        published/preview site.
      </p>
    );
  }

  return (
    <>
      <div className="bma-doc-centre__results-meta bma-doc-centre__results-meta--live">
        <span className="bma-doc-centre__count">
          {resultsCountLabel}: {loading ? '…' : `${total}${viewableOnly && hasNext ? '+' : ''}`}
        </span>
      </div>

      <div className="bma-doc-centre__toolbar">
        <label className="bma-doc-centre__sort">
          <span>Sort by</span>
          <select value={sort} onChange={(event) => setSort(event.target.value === 'title' ? 'title' : 'date')}>
            <option value="date">Published date</option>
            <option value="title">Title</option>
          </select>
        </label>
      </div>

      {error ? <p className="bma-doc-centre__error">{error}</p> : null}
      {loading ? <p className="bma-doc-centre__status">Loading documents…</p> : null}
      {!loading && !error && results.length === 0 ? (
        <p className="bma-doc-centre__status">No documents matched your filters.</p>
      ) : null}

      <div className="bma-doc-centre__list">
        {results.map((item) => (
          <ResultCard key={item.id} item={item} />
        ))}
      </div>

      {hasNext ? (
        <div className="bma-doc-centre__more">
          <button type="button" className="bma-doc-centre__more-btn" disabled={loadingMore} onClick={loadMore}>
            {loadingMore ? 'Loading…' : 'Load more'}
          </button>
        </div>
      ) : null}
    </>
  );
}
