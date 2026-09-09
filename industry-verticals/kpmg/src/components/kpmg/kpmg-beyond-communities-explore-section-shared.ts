import type { TextField } from "@sitecore-content-sdk/nextjs";
import type { KpmgCommunityMembershipStatus } from "@/lib/kpmg-auth0-communities";
import type {
  CommunityCardFields,
  CommunityListItem,
} from "@/lib/kpmg-beyond/fetch-community-content";

export type KpmgBeyondCommunitySectionItem = {
  id: string;
  url?: string;
  fields: CommunityCardFields;
};

export interface KpmgBeyondCommunitiesExploreSectionFields {
  PageTitle: TextField;
  SearchPlaceholder: TextField;
  ResultsLabel: TextField;
  CardsFolder?: TextField;
  items?: KpmgBeyondCommunitySectionItem[];
}

export const defaultKpmgBeyondCommunitiesExploreSectionFields: KpmgBeyondCommunitiesExploreSectionFields =
  {
    PageTitle: { value: "Explore communities" },
    SearchPlaceholder: { value: "Search for a community" },
    ResultsLabel: { value: "Showing {count} of {total} communities" },
    CardsFolder: { value: "" },
    items: [],
  };

export function resolveKpmgBeyondCommunitiesExploreSectionFields(
  fields?: KpmgBeyondCommunitiesExploreSectionFields,
  renderingFields?: KpmgBeyondCommunitiesExploreSectionFields,
): KpmgBeyondCommunitiesExploreSectionFields {
  return {
    ...defaultKpmgBeyondCommunitiesExploreSectionFields,
    ...renderingFields,
    ...fields,
  };
}

export function getCommunityItemsFromFields(
  fields: KpmgBeyondCommunitiesExploreSectionFields,
  renderingFields?: KpmgBeyondCommunitiesExploreSectionFields,
): KpmgBeyondCommunitySectionItem[] {
  const items = fields.items ?? renderingFields?.items ?? [];
  return items.filter(
    (item) =>
      item.fields && Boolean(item.fields.Title?.value?.toString().trim()),
  );
}

export function communityListItemsToSectionItems(
  items: CommunityListItem[],
): KpmgBeyondCommunitySectionItem[] {
  return items.map((item) => ({ id: item.id, fields: item.fields }));
}

export function matchesCommunitySearch(
  item: KpmgBeyondCommunitySectionItem,
  query: string,
): boolean {
  if (!query.trim()) {
    return true;
  }
  const haystack = [
    item.fields.CategoryLabel?.value,
    item.fields.Title?.value,
    item.fields.Summary?.value,
  ]
    .map((value) => value?.toString().toLowerCase() ?? "")
    .join(" ");
  return haystack.includes(query.trim().toLowerCase());
}

export function formatCommunityResultsLabel(
  template: string | undefined,
  count: number,
  total: number,
): string {
  const value =
    template?.toString() || "Showing {count} of {total} communities";
  return value
    .replace("{count}", String(count))
    .replace("{total}", String(total));
}

export type CommunityListingStatusDisplay = {
  type: "split";
  primary: string;
  secondary: string;
};

/** Status line above the card title — split styling for open/closed/private communities. */
export function getCommunityListingStatusDisplay(
  fields: CommunityCardFields,
  membership?: KpmgCommunityMembershipStatus,
): CommunityListingStatusDisplay {
  const privacy =
    fields.PrivacyStatus?.value?.toString().trim().toLowerCase() ?? "";

  let display: CommunityListingStatusDisplay;

  if (privacy === "closed") {
    display = {
      type: "split",
      primary:
        fields.ClosedLabel?.value?.toString().trim().toUpperCase() || "CLOSED",
      secondary: "INVITE ONLY",
    };
  } else if (privacy === "private") {
    display = {
      type: "split",
      primary: "PRIVATE",
      secondary: "INVITE ONLY",
    };
  } else {
    display = {
      type: "split",
      primary: "OPEN",
      secondary: "APPLY TO JOIN",
    };
  }

  if (membership === "owner") {
    return { ...display, secondary: "OWNER" };
  }
  if (membership === true) {
    return { ...display, secondary: "JOINED" };
  }
  if (membership === "requested") {
    return { ...display, secondary: "APPLICATION PENDING" };
  }

  return display;
}

export function isTrackedYourCommunityMembership(
  membership: KpmgCommunityMembershipStatus | undefined,
): boolean {
  return membership === "owner" || membership === true || membership === "requested";
}

export function getYourCommunityMembershipStatusLabel(
  membership: KpmgCommunityMembershipStatus | undefined,
): string | null {
  if (membership === "owner") {
    return "Owner";
  }
  if (membership === true) {
    return "Joined";
  }
  if (membership === "requested") {
    return "Application pending";
  }
  return null;
}
