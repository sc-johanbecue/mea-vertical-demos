import type { TextField } from '@sitecore-content-sdk/nextjs';
import type { KpmgBeyondArticleCardFields } from './KpmgBeyondArticleCard';

export type KpmgBeyondArticleSectionItem = {
  id: string;
  url?: string;
  fields: KpmgBeyondArticleCardFields;
};

export type ArticleSortOption = 'newest' | 'oldest' | 'title-az';
export type ArticleContentTypeFilter = 'all' | 'articles' | 'on-demand';

export interface KpmgBeyondArticlesSectionFields {
  SearchPlaceholder: TextField;
  AllTopicsLabel: TextField;
  SortByLabel: TextField;
  ContentTypesLabel: TextField;
  ClearFiltersLabel: TextField;
  items?: KpmgBeyondArticleSectionItem[];
}

export const defaultKpmgBeyondArticlesSectionFields: KpmgBeyondArticlesSectionFields = {
  SearchPlaceholder: { value: 'Search articles...' },
  AllTopicsLabel: { value: 'All topics' },
  SortByLabel: { value: 'Sort by' },
  ContentTypesLabel: { value: 'Content types' },
  ClearFiltersLabel: { value: 'Clear filters' },
  items: [],
};

export function resolveKpmgBeyondArticlesSectionFields(
  fields?: KpmgBeyondArticlesSectionFields,
  renderingFields?: KpmgBeyondArticlesSectionFields
): KpmgBeyondArticlesSectionFields {
  return { ...defaultKpmgBeyondArticlesSectionFields, ...renderingFields, ...fields };
}

export function getArticleItemsFromFields(
  fields: KpmgBeyondArticlesSectionFields,
  renderingFields?: KpmgBeyondArticlesSectionFields
): KpmgBeyondArticleSectionItem[] {
  const items = fields.items ?? renderingFields?.items ?? [];
  return items.filter(
    (item) =>
      item.fields &&
      Object.keys(item.fields).length > 0 &&
      Boolean(item.fields.ArticleTitle?.value?.toString().trim())
  );
}

export function extractArticleTopics(items: KpmgBeyondArticleSectionItem[]): string[] {
  const topics = new Set<string>();
  for (const item of items) {
    const label = item.fields.CategoryLabel?.value?.toString().trim();
    if (label) {
      topics.add(label);
    }
  }
  return [...topics].sort((a, b) => a.localeCompare(b));
}

export function parseArticleDateLabel(label?: string | number): number {
  if (!label) {
    return 0;
  }
  const value = String(label);
  const match = value.match(/(\d{1,2})(?:st|nd|rd|th)?\s+(\w+),?\s+(\d{4})/i);
  if (!match) {
    return 0;
  }
  const parsed = Date.parse(`${match[2]} ${match[1]}, ${match[3]}`);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function isOnDemandArticle(fields: KpmgBeyondArticleCardFields): boolean {
  const value = String(fields.IsOnDemandEvent?.value ?? '').toLowerCase();
  return value === '1' || value === 'true' || value === 'yes';
}

export function matchesArticleContentType(
  item: KpmgBeyondArticleSectionItem,
  contentType: ArticleContentTypeFilter
): boolean {
  if (contentType === 'all') {
    return true;
  }
  const onDemand = isOnDemandArticle(item.fields);
  return contentType === 'on-demand' ? onDemand : !onDemand;
}

export function matchesArticleTopic(
  item: KpmgBeyondArticleSectionItem,
  topic: string | null
): boolean {
  if (!topic) {
    return true;
  }
  const label = item.fields.CategoryLabel?.value?.toString().trim().toLowerCase() ?? '';
  return label === topic.toLowerCase();
}

export function matchesArticleSearch(item: KpmgBeyondArticleSectionItem, query: string): boolean {
  if (!query.trim()) {
    return true;
  }
  const haystack = [
    item.fields.CategoryLabel?.value,
    item.fields.ArticleTitle?.value,
    item.fields.Summary?.value,
    item.fields.DateLabel?.value,
  ]
    .map((value) => value?.toString().toLowerCase() ?? '')
    .join(' ');
  return haystack.includes(query.trim().toLowerCase());
}

export function sortArticleItems(
  items: KpmgBeyondArticleSectionItem[],
  sortBy: ArticleSortOption
): KpmgBeyondArticleSectionItem[] {
  const sorted = [...items];
  sorted.sort((left, right) => {
    if (sortBy === 'title-az') {
      const leftTitle = left.fields.ArticleTitle?.value?.toString() ?? '';
      const rightTitle = right.fields.ArticleTitle?.value?.toString() ?? '';
      return leftTitle.localeCompare(rightTitle);
    }
    const leftDate = parseArticleDateLabel(left.fields.DateLabel?.value);
    const rightDate = parseArticleDateLabel(right.fields.DateLabel?.value);
    return sortBy === 'newest' ? rightDate - leftDate : leftDate - rightDate;
  });
  return sorted;
}

export function filterArticleItems({
  items,
  searchQuery,
  selectedTopic,
  contentType,
  sortBy,
}: {
  items: KpmgBeyondArticleSectionItem[];
  searchQuery: string;
  selectedTopic: string | null;
  contentType: ArticleContentTypeFilter;
  sortBy: ArticleSortOption;
}): KpmgBeyondArticleSectionItem[] {
  const filtered = items.filter(
    (item) =>
      matchesArticleSearch(item, searchQuery) &&
      matchesArticleTopic(item, selectedTopic) &&
      matchesArticleContentType(item, contentType)
  );
  return sortArticleItems(filtered, sortBy);
}
