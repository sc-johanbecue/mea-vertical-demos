import type { TextField } from '@sitecore-content-sdk/nextjs';
import type { KpmgBeyondArticleCardFields } from './KpmgBeyondArticleCard';

export type KpmgBeyondSolutionSectionItem = {
  id: string;
  url?: string;
  fields: KpmgBeyondArticleCardFields;
};

export interface KpmgBeyondSolutionsSectionFields {
  PageTitle: TextField;
  SearchPlaceholder: TextField;
  CardsFolder?: TextField;
  items?: KpmgBeyondSolutionSectionItem[];
}

export const defaultKpmgBeyondSolutionsSectionFields: KpmgBeyondSolutionsSectionFields = {
  PageTitle: { value: 'Explore our solutions' },
  SearchPlaceholder: { value: 'Search for a solution...' },
  CardsFolder: { value: '' },
  items: [],
};

export function resolveKpmgBeyondSolutionsSectionFields(
  fields?: KpmgBeyondSolutionsSectionFields,
  renderingFields?: KpmgBeyondSolutionsSectionFields
): KpmgBeyondSolutionsSectionFields {
  return { ...defaultKpmgBeyondSolutionsSectionFields, ...renderingFields, ...fields };
}

export function getSolutionItemsFromFields(
  fields: KpmgBeyondSolutionsSectionFields,
  renderingFields?: KpmgBeyondSolutionsSectionFields
): KpmgBeyondSolutionSectionItem[] {
  const items = fields.items ?? renderingFields?.items ?? [];
  return items.filter((item) => item.fields && Object.keys(item.fields).length > 0);
}

export function matchesSolutionsSearch(item: KpmgBeyondSolutionSectionItem, query: string): boolean {
  if (!query.trim()) {
    return true;
  }
  const haystack = [
    item.fields.CategoryLabel?.value,
    item.fields.ArticleTitle?.value,
    item.fields.Summary?.value,
  ]
    .map((value) => value?.toString().toLowerCase() ?? '')
    .join(' ');
  return haystack.includes(query.trim().toLowerCase());
}
