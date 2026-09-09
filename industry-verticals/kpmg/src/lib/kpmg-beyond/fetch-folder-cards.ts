import { GraphQLRequestClient } from '@sitecore-content-sdk/core';
import { getEdgeProxyContentUrl } from '@sitecore-content-sdk/content/client';
import type { ImageField, LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import type { KpmgBeyondArticleCardFields } from '@/components/kpmg/KpmgBeyondArticleCard';
import { parseDroplinkItemId } from '@/lib/kpmg-beyond/parse-droplink';

export type FolderCardItem = KpmgBeyondArticleCardFields & {
  id: string;
  discover: boolean;
  recommended: boolean;
  onDemand: boolean;
  EventDay?: TextField;
  EventMonth?: TextField;
  Time?: TextField;
};

type GraphQLFieldResult = {
  jsonValue?: unknown;
};

type GraphQLChildStub = {
  id: string;
};

type GraphQLCardItem = GraphQLChildStub & {
  categoryLabel?: GraphQLFieldResult;
  dateLabel?: GraphQLFieldResult;
  title?: GraphQLFieldResult;
  summary?: GraphQLFieldResult;
  image?: GraphQLFieldResult;
  link?: GraphQLFieldResult;
  isOnDemandEvent?: GraphQLFieldResult;
  eventDay?: GraphQLFieldResult;
  eventMonth?: GraphQLFieldResult;
  time?: GraphQLFieldResult;
  discover?: GraphQLFieldResult;
  recommended?: GraphQLFieldResult;
};

type FolderChildrenListResult = {
  item?: {
    children?: {
      results?: GraphQLChildStub[];
    };
  };
};

type CardItemQueryResult = {
  item?: GraphQLCardItem | null;
};

const FOLDER_CHILDREN_PAGE_SIZE = 100;

/** Lightweight listing — Edge rejects many field() calls on large child sets. */
const LIST_FOLDER_CHILDREN_QUERY = `
  query ListFolderChildren($path: String!, $language: String!) {
    item(path: $path, language: $language) {
      children(first: ${FOLDER_CHILDREN_PAGE_SIZE}) {
        results {
          id
        }
      }
    }
  }
`;

const TAB_CARDS_FOLDER_QUERY = `
  query TabCardsFolder($path: String!, $language: String!) {
    item(path: $path, language: $language) {
      cardsFolder: field(name: "CardsFolder") {
        jsonValue
      }
    }
  }
`;

const CARD_ITEM_QUERY = `
  query CardItem($path: String!, $language: String!) {
    item(path: $path, language: $language) {
      id
      categoryLabel: field(name: "CategoryLabel") { jsonValue }
      dateLabel: field(name: "DateLabel") { jsonValue }
      title: field(name: "Title") { jsonValue }
      summary: field(name: "Summary") { jsonValue }
      image: field(name: "Image") { jsonValue }
      link: field(name: "Link") { jsonValue }
      isOnDemandEvent: field(name: "IsOnDemandEvent") { jsonValue }
      eventDay: field(name: "EventDay") { jsonValue }
      eventMonth: field(name: "EventMonth") { jsonValue }
      time: field(name: "Time") { jsonValue }
      discover: field(name: "Discover") { jsonValue }
      recommended: field(name: "Recommended") { jsonValue }
    }
  }
`;

/** Experience Edge `item(path:)` accepts site paths or GUID-based ids (braced or plain). */
function formatItemPath(identifier: string): string {
  const clean = identifier.replace(/[{}-]/g, '').toUpperCase();
  if (!/^[0-9A-F]{32}$/.test(clean)) {
    return identifier.trim();
  }
  return `{${clean.slice(0, 8)}-${clean.slice(8, 12)}-${clean.slice(12, 16)}-${clean.slice(16, 20)}-${clean.slice(20)}}`;
}

function asTextField(jsonValue: unknown): TextField {
  if (jsonValue && typeof jsonValue === 'object' && 'value' in (jsonValue as object)) {
    return jsonValue as TextField;
  }
  return { value: typeof jsonValue === 'string' ? jsonValue : '' };
}

function asImageField(jsonValue: unknown): ImageField {
  if (jsonValue && typeof jsonValue === 'object') {
    return jsonValue as ImageField;
  }
  return { value: { src: '', alt: '' } };
}

function asLinkField(jsonValue: unknown): LinkField {
  if (jsonValue && typeof jsonValue === 'object') {
    return jsonValue as LinkField;
  }
  return { value: { href: '#' } };
}

function checkboxFromJson(jsonValue: unknown): boolean {
  if (!jsonValue || typeof jsonValue !== 'object') {
    return false;
  }
  const value = (jsonValue as { value?: unknown }).value;
  if (typeof value === 'boolean') {
    return value;
  }
  const normalized = String(value ?? '')
    .trim()
    .toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes';
}

function mapItemToCard(item: GraphQLCardItem): FolderCardItem {
  const eventDay = asTextField(item.eventDay?.jsonValue);
  const eventMonth = asTextField(item.eventMonth?.jsonValue);
  const time = asTextField(item.time?.jsonValue);
  let dateLabel = asTextField(item.dateLabel?.jsonValue);
  const dateLabelText = dateLabel.value?.toString().trim();

  if (!dateLabelText && eventDay.value?.toString().trim() && eventMonth.value?.toString().trim()) {
    dateLabel = {
      value: `${eventDay.value?.toString().trim()} ${eventMonth.value?.toString().trim()}`,
    };
  }

  return {
    id: item.id,
    CategoryLabel: asTextField(item.categoryLabel?.jsonValue),
    DateLabel: dateLabel,
    ArticleTitle: asTextField(item.title?.jsonValue),
    Summary: asTextField(item.summary?.jsonValue),
    Image: asImageField(item.image?.jsonValue),
    Link: asLinkField(item.link?.jsonValue),
    IsOnDemandEvent: asTextField(item.isOnDemandEvent?.jsonValue),
    EventDay: eventDay,
    EventMonth: eventMonth,
    Time: time,
    discover: checkboxFromJson(item.discover?.jsonValue),
    recommended: checkboxFromJson(item.recommended?.jsonValue),
    onDemand: checkboxFromJson(item.isOnDemandEvent?.jsonValue),
  };
}

function hasTitle(item: Pick<GraphQLCardItem, 'title'>): boolean {
  return Boolean(asTextField(item.title?.jsonValue).value?.toString().trim());
}

function createGraphQLClient(): GraphQLRequestClient {
  const contextId = process.env.SITECORE_EDGE_CONTEXT_ID;
  if (!contextId) {
    throw new Error('SITECORE_EDGE_CONTEXT_ID is not configured');
  }

  const edgeHost =
    process.env.SITECORE_EDGE_URL ||
    process.env.NEXT_PUBLIC_SITECORE_EDGE_PLATFORM_HOSTNAME ||
    undefined;

  return new GraphQLRequestClient(getEdgeProxyContentUrl(edgeHost), {
    contextId,
  });
}

async function fetchCardById(
  client: GraphQLRequestClient,
  itemId: string,
  language: string
): Promise<FolderCardItem | null> {
  const data = await client.request<CardItemQueryResult>(CARD_ITEM_QUERY, {
    path: formatItemPath(itemId),
    language: language || 'en',
  });

  if (!data.item?.id || !hasTitle(data.item)) {
    return null;
  }

  return mapItemToCard(data.item);
}

async function collectCardsFromFolder(
  client: GraphQLRequestClient,
  folderItemId: string,
  language: string,
  collected: FolderCardItem[]
): Promise<void> {
  const data = await client.request<FolderChildrenListResult>(LIST_FOLDER_CHILDREN_QUERY, {
    path: formatItemPath(folderItemId),
    language: language || 'en',
  });

  const children = data.item?.children?.results ?? [];

  for (const child of children) {
    const card = await fetchCardById(client, child.id, language);
    if (card) {
      collected.push(card);
      continue;
    }

    const nested = await client.request<FolderChildrenListResult>(LIST_FOLDER_CHILDREN_QUERY, {
      path: formatItemPath(child.id),
      language: language || 'en',
    });
    const nestedCount = nested.item?.children?.results?.length ?? 0;
    if (nestedCount > 0) {
      await collectCardsFromFolder(client, child.id, language, collected);
    }
  }
}

function dedupeCardsById(cards: FolderCardItem[]): FolderCardItem[] {
  const seen = new Set<string>();
  return cards.filter((card) => {
    if (seen.has(card.id)) {
      return false;
    }
    seen.add(card.id);
    return true;
  });
}

type TabCardsFolderQueryResult = {
  item?: {
    cardsFolder?: GraphQLFieldResult;
  };
};

export async function resolveCardsFolderId(
  tabDataSourceId: string,
  language: string
): Promise<string | null> {
  const client = createGraphQLClient();
  const data = await client.request<TabCardsFolderQueryResult>(TAB_CARDS_FOLDER_QUERY, {
    path: formatItemPath(tabDataSourceId),
    language: language || 'en',
  });

  const jsonValue = data.item?.cardsFolder?.jsonValue;
  return parseDroplinkItemId(jsonValue) ?? parseDroplinkItemId({ value: jsonValue });
}

export async function fetchFolderCardItems(
  folderItemId: string,
  language: string
): Promise<FolderCardItem[]> {
  const client = createGraphQLClient();
  const collected: FolderCardItem[] = [];
  await collectCardsFromFolder(client, folderItemId, language, collected);
  return dedupeCardsById(collected);
}

export type CardListFilter = {
  showRecommended: boolean;
  showDiscover: boolean;
};

export type TopPickListTab = 'recommended' | 'discover';
export type EventsListTab = 'upcoming' | 'on-demand';

const MONTH_INDEX: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function parseDateLabel(label: string): Date | null {
  const trimmed = label.trim();
  if (!trimmed || /^on\s+demand$/i.test(trimmed)) {
    return null;
  }

  const normalized = trimmed.replace(/(\d+)(st|nd|rd|th)/gi, '$1');
  const parsed = Date.parse(normalized);
  if (Number.isNaN(parsed)) {
    return null;
  }

  return new Date(parsed);
}

function parseEventDayMonth(day: string, month: string, referenceDate: Date): Date | null {
  const dayNum = Number.parseInt(day.trim(), 10);
  if (Number.isNaN(dayNum)) {
    return null;
  }

  const monthIndex = MONTH_INDEX[month.trim().toLowerCase()];
  if (monthIndex === undefined) {
    return null;
  }

  const year = referenceDate.getFullYear();
  const candidate = new Date(year, monthIndex, dayNum);
  if (candidate < startOfDay(referenceDate)) {
    candidate.setFullYear(year + 1);
  }

  return candidate;
}

/** Resolve a card's event date from DateLabel or EventDay/EventMonth. */
export function resolveCardEventDate(
  card: FolderCardItem,
  referenceDate: Date = new Date()
): Date | null {
  const fromLabel = parseDateLabel(card.DateLabel?.value?.toString() ?? '');
  if (fromLabel) {
    return fromLabel;
  }

  const day = card.EventDay?.value?.toString() ?? '';
  const month = card.EventMonth?.value?.toString() ?? '';
  if (day.trim() && month.trim()) {
    return parseEventDayMonth(day, month, referenceDate);
  }

  return null;
}

export function isCardOnDemand(card: FolderCardItem): boolean {
  return card.onDemand;
}

export function isCardUpcoming(card: FolderCardItem, referenceDate: Date = new Date()): boolean {
  const eventDate = resolveCardEventDate(card, referenceDate);
  if (!eventDate) {
    return false;
  }

  return eventDate >= startOfDay(referenceDate);
}

/** Upcoming = future-dated cards; On demand = IsOnDemandEvent checkbox checked. */
export function filterCardsByEventsTab(
  cards: FolderCardItem[],
  tab: EventsListTab,
  referenceDate: Date = new Date()
): FolderCardItem[] {
  if (tab === 'upcoming') {
    return cards
      .filter((card) => isCardUpcoming(card, referenceDate))
      .sort((left, right) => {
        const leftDate = resolveCardEventDate(left, referenceDate)?.getTime() ?? 0;
        const rightDate = resolveCardEventDate(right, referenceDate)?.getTime() ?? 0;
        return leftDate - rightDate;
      });
  }

  return cards.filter((card) => isCardOnDemand(card));
}

/** Only cards with the matching Recommended/Discover checkbox checked. */
export function filterCardsByTab(cards: FolderCardItem[], tab: TopPickListTab): FolderCardItem[] {
  if (tab === 'recommended') {
    return cards.filter((card) => card.recommended);
  }
  return cards.filter((card) => card.discover);
}

/** @deprecated Use filterCardsByTab instead. */
export function filterFolderCards(cards: FolderCardItem[], filter: CardListFilter): FolderCardItem[] {
  if (filter.showRecommended) {
    return filterCardsByTab(cards, 'recommended');
  }
  if (filter.showDiscover) {
    return filterCardsByTab(cards, 'discover');
  }
  return cards;
}

/** Load article cards by Sitecore item id (for related content multilists). */
export async function fetchArticleCardsByIds(
  itemIds: string[],
  language: string
): Promise<FolderCardItem[]> {
  if (!itemIds.length) {
    return [];
  }

  const client = createGraphQLClient();
  const cards: FolderCardItem[] = [];

  for (const itemId of itemIds) {
    const card = await fetchCardById(client, itemId, language);
    if (card) {
      cards.push(card);
    }
  }

  return cards;
}

/** Unique category labels from folder card items (preserves first-seen casing). */
export function extractCategoryLabels(cards: FolderCardItem[]): string[] {
  const seen = new Set<string>();
  const labels: string[] = [];

  for (const card of cards) {
    const label = card.CategoryLabel?.value?.toString().trim();
    if (!label) {
      continue;
    }
    const key = label.toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    labels.push(label);
  }

  return labels;
}
