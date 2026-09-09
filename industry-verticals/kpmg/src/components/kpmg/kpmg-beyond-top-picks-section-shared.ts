import type { TextField } from '@sitecore-content-sdk/nextjs';
import type { KpmgBeyondArticleCardFields } from './KpmgBeyondArticleCard';
import {
  extractCategoryLabels,
  filterCardsByTab,
  type FolderCardItem,
  type TopPickListTab,
} from '@/lib/kpmg-beyond/fetch-folder-cards';

export type KpmgBeyondTopPickSectionItem = {
  id: string;
  url?: string;
  fields: KpmgBeyondArticleCardFields;
};

export interface KpmgBeyondTopPicksSectionFields {
  Title: TextField;
  TabRecommended: TextField;
  TabDiscover: TextField;
  ViewMoreLink?: { value?: { href?: string; text?: string } };
  CardsFolder?: TextField;
  items?: KpmgBeyondTopPickSectionItem[];
}

export const defaultKpmgBeyondTopPicksSectionFields: KpmgBeyondTopPicksSectionFields = {
  Title: { value: 'Top picks for you' },
  TabRecommended: { value: 'Recommended' },
  TabDiscover: { value: 'Discover' },
  items: [],
};

function isCheckboxChecked(field?: TextField): boolean {
  const normalized = String(field?.value ?? '')
    .trim()
    .toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes';
}

function toFilterCard(item: KpmgBeyondTopPickSectionItem): FolderCardItem {
  const title =
    item.fields.ArticleTitle?.value?.toString().trim() ||
    (item.fields as KpmgBeyondArticleCardFields & { Title?: TextField }).Title?.value?.toString().trim() ||
    '';

  return {
    ...item.fields,
    ArticleTitle: item.fields.ArticleTitle?.value ? item.fields.ArticleTitle : { value: title },
    id: item.id,
    discover: isCheckboxChecked(item.fields.Discover),
    recommended: isCheckboxChecked(item.fields.Recommended),
    onDemand: isCheckboxChecked(item.fields.IsOnDemandEvent),
  };
}

export function resolveKpmgBeyondTopPicksSectionFields(
  fields?: KpmgBeyondTopPicksSectionFields,
  renderingFields?: KpmgBeyondTopPicksSectionFields
): KpmgBeyondTopPicksSectionFields {
  return { ...defaultKpmgBeyondTopPicksSectionFields, ...renderingFields, ...fields };
}

function checkboxField(checked: boolean): TextField {
  return { value: checked ? '1' : '' };
}

export function folderCardsToTopPickSectionItems(cards: FolderCardItem[]): KpmgBeyondTopPickSectionItem[] {
  return cards
    .filter((card) => Boolean(card.ArticleTitle?.value?.toString().trim()))
    .map((card) => ({
      id: card.id,
      fields: {
        CategoryLabel: card.CategoryLabel,
        DateLabel: card.DateLabel,
        ArticleTitle: card.ArticleTitle,
        Summary: card.Summary,
        Image: card.Image,
        Link: card.Link,
        IsOnDemandEvent: card.IsOnDemandEvent,
        Discover: checkboxField(card.discover),
        Recommended: checkboxField(card.recommended),
      },
    }));
}

export function getTopPickItemsFromFields(
  fields?: KpmgBeyondTopPicksSectionFields,
  renderingFields?: KpmgBeyondTopPicksSectionFields
): KpmgBeyondTopPickSectionItem[] {
  const items = fields?.items ?? renderingFields?.items ?? [];
  return items.filter((item) => {
    if (!item.fields || Object.keys(item.fields).length === 0) {
      return false;
    }
    const title =
      item.fields.ArticleTitle?.value?.toString().trim() ||
      (item.fields as KpmgBeyondArticleCardFields & { Title?: TextField }).Title?.value?.toString().trim();
    return Boolean(title);
  });
}

export function filterTopPickItemsByTab(
  items: KpmgBeyondTopPickSectionItem[],
  tab: TopPickListTab
): KpmgBeyondTopPickSectionItem[] {
  const cards = items.map(toFilterCard);
  const filteredIds = new Set(filterCardsByTab(cards, tab).map((card) => card.id));
  return items.filter((item) => filteredIds.has(item.id));
}

export function extractTopPickCategoryLabels(items: KpmgBeyondTopPickSectionItem[]): string[] {
  return extractCategoryLabels(items.map(toFilterCard));
}
