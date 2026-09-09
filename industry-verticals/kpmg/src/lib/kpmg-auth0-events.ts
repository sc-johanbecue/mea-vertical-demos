import type { User } from '@auth0/nextjs-auth0/types';

export const SUBSCRIBED_EVENT_IDS_METADATA_KEY = 'subscribed_event_ids';

const GUID_PATTERN =
  /^([0-9a-f]{8})-?([0-9a-f]{4})-?([0-9a-f]{4})-?([0-9a-f]{4})-?([0-9a-f]{12})$/i;

/** Canonical Sitecore item id: 32 lowercase hex chars, no braces or dashes. */
export function normalizeEventId(eventId: string): string {
  const trimmed = eventId.trim();
  if (!trimmed) {
    return '';
  }

  const unbraced = trimmed.replace(/^\{|\}$/g, '');
  const segments = unbraced.match(GUID_PATTERN);
  if (segments) {
    return `${segments[1]}${segments[2]}${segments[3]}${segments[4]}${segments[5]}`.toLowerCase();
  }

  return unbraced.replace(/[{}-]/g, '').toLowerCase();
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((entry) => normalizeEventId(String(entry))).filter(Boolean);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) {
      return [];
    }

    if (trimmed.startsWith('[')) {
      try {
        return asStringArray(JSON.parse(trimmed));
      } catch {
        // Fall through to comma-separated parsing.
      }
    }

    return trimmed
      .split(/[,|]/)
      .map((entry) => normalizeEventId(entry))
      .filter(Boolean);
  }

  return [];
}

export function readSubscribedEventIds(user: User | null | undefined): string[] {
  if (!user) {
    return [];
  }

  const metadata = asRecord((user as Record<string, unknown>).user_metadata);
  if (!metadata) {
    return [];
  }

  const fromSnake = metadata[SUBSCRIBED_EVENT_IDS_METADATA_KEY];
  const fromCamel = metadata.subscribedEventIds;
  const ids = asStringArray(fromSnake).length ? asStringArray(fromSnake) : asStringArray(fromCamel);

  return [...new Set(ids.map(normalizeEventId))];
}

export function isEventSubscribed(
  user: User | null | undefined,
  eventId: string,
  knownSubscribedIds?: string[]
): boolean {
  const normalized = normalizeEventId(eventId);
  if (!normalized) {
    return false;
  }

  const subscribedIds =
    knownSubscribedIds !== undefined
      ? knownSubscribedIds.map(normalizeEventId)
      : readSubscribedEventIds(user);

  return subscribedIds.includes(normalized);
}

export function withEventSubscription(
  existingIds: string[],
  eventId: string,
  subscribe: boolean
): string[] {
  const normalized = normalizeEventId(eventId);
  if (!normalized) {
    return existingIds.map(normalizeEventId);
  }

  const next = new Set(existingIds.map(normalizeEventId));
  if (subscribe) {
    next.add(normalized);
  } else {
    next.delete(normalized);
  }
  return [...next];
}

export function getSitecoreItemId(item: { id?: string; itemId?: string }): string {
  return normalizeEventId(item.id ?? item.itemId ?? '');
}

type SitecoreRouteLike = {
  itemId?: string;
  id?: string;
};

export function resolveSitecoreRouteItemId(
  page: { layout?: { sitecore?: { route?: SitecoreRouteLike | null } } } | null | undefined
): string | undefined {
  const route = page?.layout?.sitecore?.route;
  if (!route) {
    return undefined;
  }

  const candidate = route.itemId ?? route.id;
  const trimmed = candidate?.trim();
  return trimmed || undefined;
}
