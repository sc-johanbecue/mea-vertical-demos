import type { TextField } from "@sitecore-content-sdk/nextjs";
import type { KpmgBeyondEventCardFields } from "./KpmgBeyondEventCard";
import {
  filterCardsByEventsTab,
  type EventsListTab,
  type FolderCardItem,
} from "@/lib/kpmg-beyond/fetch-folder-cards";
import { getSitecoreItemId, normalizeEventId } from "@/lib/kpmg-auth0-events";

export type KpmgBeyondEventSectionItem = {
  id: string;
  url?: string;
  fields: KpmgBeyondEventCardFields & {
    IsOnDemandEvent?: TextField;
    Location?: TextField;
    Summary?: TextField;
  };
};

export interface KpmgBeyondUpcomingOnDemandSectionFields {
  Title: TextField;
  TabUpcoming: TextField;
  TabOnDemand: TextField;
  ViewMoreLink?: { value?: { href?: string; text?: string } };
  items?: KpmgBeyondEventSectionItem[];
}

export interface KpmgBeyondMyEventsSectionFields {
  Title: TextField;
  EmptyMessage: TextField;
  items?: KpmgBeyondEventSectionItem[];
}

export const defaultUpcomingOnDemandSectionFields: KpmgBeyondUpcomingOnDemandSectionFields =
  {
    Title: { value: "Upcoming events" },
    TabUpcoming: { value: "Upcoming" },
    TabOnDemand: { value: "On demand" },
    items: [],
  };

export const defaultMyEventsSectionFields: KpmgBeyondMyEventsSectionFields = {
  Title: { value: "My Events" },
  EmptyMessage: { value: "You don't have any event subscriptions yet." },
  items: [],
};

function isOnDemandValue(value: string | number | undefined): boolean {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes";
}

function toFilterCard(item: KpmgBeyondEventSectionItem): FolderCardItem {
  return {
    id: item.id,
    CategoryLabel: item.fields.CategoryLabel,
    DateLabel: { value: "" },
    ArticleTitle: item.fields.EventTitle,
    Summary: item.fields.Summary ?? { value: "" },
    Image: item.fields.Image,
    Link: item.fields.Link,
    IsOnDemandEvent: item.fields.IsOnDemandEvent ?? { value: "" },
    EventDay: item.fields.EventDay,
    EventMonth: item.fields.EventMonth,
    Time: item.fields.Time,
    discover: false,
    recommended: false,
    onDemand: isOnDemandValue(item.fields.IsOnDemandEvent?.value),
  };
}

export function getEventItemsFromFields(
  fields?: { items?: KpmgBeyondEventSectionItem[] },
  renderingFields?: { items?: KpmgBeyondEventSectionItem[] },
): KpmgBeyondEventSectionItem[] {
  const items = fields?.items ?? renderingFields?.items ?? [];
  return items.filter(
    (item) => item.fields && Object.keys(item.fields).length > 0,
  );
}

export { getSitecoreItemId };

export function filterEventItemsByTab(
  items: KpmgBeyondEventSectionItem[],
  tab: EventsListTab,
  referenceDate: Date = new Date(),
): KpmgBeyondEventSectionItem[] {
  const cards = items.map(toFilterCard);
  const filteredIds = new Set(
    filterCardsByEventsTab(cards, tab, referenceDate).map((card) =>
      normalizeEventId(card.id),
    ),
  );
  return items.filter((item) => filteredIds.has(normalizeEventId(item.id)));
}

export function extractEventCategoryLabels(
  items: KpmgBeyondEventSectionItem[],
): string[] {
  const labels = new Set<string>();
  for (const item of items) {
    const label = item.fields.CategoryLabel?.value?.toString().trim();
    if (label) {
      labels.add(label);
    }
  }
  return [...labels].sort((left, right) => left.localeCompare(right));
}

export function resolveUpcomingOnDemandSectionFields(
  fields?: KpmgBeyondUpcomingOnDemandSectionFields,
  renderingFields?: KpmgBeyondUpcomingOnDemandSectionFields,
): KpmgBeyondUpcomingOnDemandSectionFields {
  return {
    ...defaultUpcomingOnDemandSectionFields,
    ...renderingFields,
    ...fields,
  };
}

export function resolveMyEventsSectionFields(
  fields?: KpmgBeyondMyEventsSectionFields,
  renderingFields?: KpmgBeyondMyEventsSectionFields,
): KpmgBeyondMyEventsSectionFields {
  return { ...defaultMyEventsSectionFields, ...renderingFields, ...fields };
}
