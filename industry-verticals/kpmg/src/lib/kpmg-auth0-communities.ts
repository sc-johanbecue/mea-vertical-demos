import type { User } from '@auth0/nextjs-auth0/types';
import { getAuth0AppMetadata, getAuth0Roles } from '@/lib/kpmg-auth0-profile';

export const COMMUNITY_ADMIN_ROLE = 'CommunityAdmin';
export const COMMUNITIES_METADATA_KEY = 'communities';

/** joined=true, requested='requested', owner='owner', declined/not-member=false */
export type KpmgCommunityMembershipStatus = boolean | 'requested' | 'owner';

export type KpmgCommunityMembershipMap = Record<string, KpmgCommunityMembershipStatus>;

export type Auth0CommunitiesRecord = Record<string, string | boolean>;

const KNOWN_COMMUNITIES: Array<{ id: string; title: string; metadataKey: string }> = [
  { id: 'd5100001-0001-4000-8000-000000000001', title: 'Beyond Lounge', metadataKey: 'Beyond Lounge' },
  { id: 'd5100001-0001-4000-8000-000000000002', title: 'NHS Operational Excellence', metadataKey: 'NHS' },
  { id: '19cf9dc2-d540-4af7-a6e9-03de119bdff1', title: 'Sustainability', metadataKey: 'Sustainability' },
  {
    id: '584f52b5-23fe-4137-9495-9ef435e04ada',
    title: 'Diversity Equity and Inclusion',
    metadataKey: 'Diversity Equity and Inclusion',
  },
  {
    id: '23d5a760-5b58-4325-a9eb-a0c44d07597f',
    title: 'Technology & Innovation',
    metadataKey: 'Technology & Innovation',
  },
];

const METADATA_KEY_OVERRIDES: Record<string, string> = {
  'nhs operational excellence': 'NHS',
};

/** Loose match for Auth0 keys that differ in punctuation (e.g. "Diversity, Equity & Inclusion"). */
export function normalizeCommunityLookupKey(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export type KnownCommunityContext = {
  id: string;
  title: string;
  metadataKey: string;
};

export function listKnownCommunities(): KnownCommunityContext[] {
  return KNOWN_COMMUNITIES.map((community) => ({ ...community }));
}

export function normalizeCommunityId(raw: string): string {
  return raw.replace(/[{}-]/g, '').toLowerCase();
}

/** Normalizes community display names for metadata key lookup. */
export function normalizeCommunityName(raw: string): string {
  return raw.trim().toLowerCase();
}

/** Auth0 app_metadata key for a community (human-readable, e.g. "Beyond Lounge", "NHS"). */
export function resolveCommunityMetadataKey(title: string): string {
  const override = METADATA_KEY_OVERRIDES[normalizeCommunityName(title)];
  return override ?? title.trim();
}

export function serializeCommunityMembershipForMetadata(
  status: KpmgCommunityMembershipStatus
): string | boolean {
  if (status === true) {
    return 'joined';
  }
  if (status === 'requested') {
    return 'requested';
  }
  if (status === 'owner') {
    return 'owner';
  }
  return false;
}

function normalizeMembershipValue(value: unknown): KpmgCommunityMembershipStatus {
  if (value === true) {
    return true;
  }
  if (value === false) {
    return false;
  }
  if (value === 'requested') {
    return 'requested';
  }
  if (value === 'owner') {
    return 'owner';
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'requested' || normalized === 'pending') {
      return 'requested';
    }
    if (normalized === 'owner') {
      return 'owner';
    }
    if (
      normalized === 'joined' ||
      normalized === 'true' ||
      normalized === 'yes' ||
      normalized === '1'
    ) {
      return true;
    }
    if (
      normalized === 'declined' ||
      normalized === 'rejected' ||
      normalized === 'false' ||
      normalized === '0'
    ) {
      return false;
    }
  }
  return Boolean(value);
}

function asCommunitiesRecord(value: unknown): Auth0CommunitiesRecord {
  if (!value || typeof value !== 'object') {
    return {};
  }
  const result: Auth0CommunitiesRecord = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    if (entry === true || entry === false) {
      result[key] = entry;
    } else if (typeof entry === 'string') {
      result[key] = entry;
    } else {
      result[key] = Boolean(entry);
    }
  }
  return result;
}

export function readRawCommunitiesRecord(
  source: User | Record<string, unknown> | undefined
): Auth0CommunitiesRecord {
  if (!source) {
    return {};
  }

  if ('sub' in source) {
    return asCommunitiesRecord(getAuth0AppMetadata(source as User).communities);
  }

  const appMetadata = source.app_metadata;
  if (appMetadata && typeof appMetadata === 'object') {
    return asCommunitiesRecord((appMetadata as Record<string, unknown>).communities);
  }

  return asCommunitiesRecord(source.communities);
}

function communityMembershipKeysMatch(
  key: string,
  communityId: string,
  communityTitle?: string
): boolean {
  const normalizedCommunityId = normalizeCommunityId(communityId);
  if (normalizeCommunityId(key) === normalizedCommunityId) {
    return true;
  }
  const resolvedFromKey = resolveCommunityIdFromMetadataKey(key);
  if (resolvedFromKey && normalizeCommunityId(resolvedFromKey) === normalizedCommunityId) {
    return true;
  }

  const titlesToMatch = new Set<string>();
  if (communityTitle?.trim()) {
    titlesToMatch.add(communityTitle.trim());
    titlesToMatch.add(resolveCommunityMetadataKey(communityTitle));
  }
  const knownTitle = getKnownCommunityTitle(communityId);
  if (knownTitle) {
    titlesToMatch.add(knownTitle);
    titlesToMatch.add(resolveCommunityMetadataKey(knownTitle));
  }

  const normalizedKey = normalizeCommunityLookupKey(key);
  for (const title of titlesToMatch) {
    if (key === title) {
      return true;
    }
    if (normalizeCommunityName(key) === normalizeCommunityName(title)) {
      return true;
    }
    if (normalizeCommunityLookupKey(title) === normalizedKey) {
      return true;
    }
  }

  return false;
}

/** Merges membership into the Auth0 communities object using display keys and joined/requested values. */
export function mergeCommunityMembershipInMetadata(
  existing: Auth0CommunitiesRecord,
  communityId: string,
  communityTitle: string | undefined,
  status: KpmgCommunityMembershipStatus
): Auth0CommunitiesRecord {
  const metadataKey = resolveCommunityMetadataKey(communityTitle || communityId);
  let nextStatus = status;
  for (const [key, value] of Object.entries(existing)) {
    if (!communityMembershipKeysMatch(key, communityId, communityTitle)) {
      continue;
    }
    if (normalizeMembershipValue(value) === 'owner' && status === true) {
      nextStatus = 'owner';
    }
    break;
  }
  const serialized = serializeCommunityMembershipForMetadata(nextStatus);
  const next: Auth0CommunitiesRecord = {};

  for (const [key, value] of Object.entries(existing)) {
    if (communityMembershipKeysMatch(key, communityId, communityTitle)) {
      continue;
    }
    next[key] = value;
  }

  if (serialized !== false) {
    next[metadataKey] = serialized;
  }

  return next;
}

export function readCommunityMembershipMap(user: User | undefined): KpmgCommunityMembershipMap {
  const communities = readRawCommunitiesRecord(user);
  const result: KpmgCommunityMembershipMap = {};
  for (const [key, value] of Object.entries(communities)) {
    result[normalizeCommunityId(key)] = normalizeMembershipValue(value);
  }
  return result;
}

export function resolveCommunityIdFromMetadataKey(key: string): string | undefined {
  const normalizedKey = normalizeCommunityId(key);
  const lookupKey = normalizeCommunityLookupKey(key);
  for (const community of KNOWN_COMMUNITIES) {
    if (normalizeCommunityId(community.id) === normalizedKey) {
      return community.id;
    }
    if (normalizeCommunityName(community.metadataKey) === normalizedKey) {
      return community.id;
    }
    if (normalizeCommunityName(community.title) === normalizedKey) {
      return community.id;
    }
    if (normalizeCommunityLookupKey(community.metadataKey) === lookupKey) {
      return community.id;
    }
    if (normalizeCommunityLookupKey(community.title) === lookupKey) {
      return community.id;
    }
  }
  if (/^[0-9a-f]{32}$/.test(normalizedKey)) {
    return key;
  }
  return undefined;
}

export function getKnownCommunityTitle(communityId: string): string | undefined {
  const normalized = normalizeCommunityId(communityId);
  return KNOWN_COMMUNITIES.find(
    (community) => normalizeCommunityId(community.id) === normalized
  )?.title;
}

/** Resolves a community from a public Sitecore content path or browser pathname. */
export function resolveCommunityContextFromPathname(
  pathname: string | null | undefined
): KnownCommunityContext | null {
  if (!pathname) {
    return null;
  }

  const communitiesSegment = pathname.match(/\/communities\/([^/?#]+)/i);
  if (!communitiesSegment?.[1]) {
    return null;
  }

  const segment = decodeURIComponent(communitiesSegment[1])
    .replace(/,-a-,/gi, '&')
    .replace(/-/g, ' ')
    .replace(/,/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const normalizedSegment = normalizeCommunityLookupKey(segment);

  for (const community of KNOWN_COMMUNITIES) {
    const candidates = [
      normalizeCommunityLookupKey(community.title),
      normalizeCommunityLookupKey(community.metadataKey),
    ];
    if (candidates.some((candidate) => candidate === normalizedSegment)) {
      return { ...community };
    }
  }

  return null;
}

export function getCommunityMembershipFromRecord(
  record: Auth0CommunitiesRecord,
  communityId: string,
  communityTitle?: string
): KpmgCommunityMembershipStatus | undefined {
  for (const [key, rawValue] of Object.entries(record)) {
    if (!communityMembershipKeysMatch(key, communityId, communityTitle)) {
      continue;
    }
    return normalizeMembershipValue(rawValue);
  }
  return undefined;
}

export function getCommunityMembershipStatus(
  user: User | undefined,
  communityId: string,
  communityTitle?: string
): KpmgCommunityMembershipStatus | undefined {
  return getCommunityMembershipFromRecord(
    readRawCommunitiesRecord(user),
    communityId,
    communityTitle
  );
}

export function isCommunityMembershipActive(
  status: KpmgCommunityMembershipStatus | undefined
): boolean {
  return status === true || status === 'owner';
}

export function isCommunityJoined(
  user: User | undefined,
  communityId: string,
  communityTitle?: string
): boolean {
  return isCommunityMembershipActive(
    getCommunityMembershipStatus(user, communityId, communityTitle)
  );
}

export function isCommunityOwner(
  user: User | undefined,
  communityId: string,
  communityTitle?: string
): boolean {
  return getCommunityMembershipStatus(user, communityId, communityTitle) === 'owner';
}

export function canModerateCommunityComments(
  user: User | undefined,
  communityId: string,
  communityTitle?: string
): boolean {
  return (
    isCommunityAdmin(user) ||
    isCommunityOwner(user, communityId, communityTitle)
  );
}

export function canReviewCommunityJoinApplications(
  user: User | undefined,
  communityId: string,
  communityTitle?: string
): boolean {
  return canModerateCommunityComments(user, communityId, communityTitle);
}

export function isCommunityApplicationPending(
  user: User | undefined,
  communityId: string,
  communityTitle?: string
): boolean {
  return getCommunityMembershipStatus(user, communityId, communityTitle) === 'requested';
}

export function getJoinedCommunityIds(user: User | undefined): string[] {
  const ids = new Set<string>();
  for (const [key, status] of Object.entries(readCommunityMembershipMap(user))) {
    if (!isCommunityMembershipActive(status)) {
      continue;
    }
    const resolved = resolveCommunityIdFromMetadataKey(key);
    if (resolved) {
      ids.add(normalizeCommunityId(resolved));
    }
  }
  return [...ids];
}

export function isCommunityAdmin(user: User | undefined): boolean {
  return getAuth0Roles(user).some(
    (role) => role.toLowerCase() === COMMUNITY_ADMIN_ROLE.toLowerCase()
  );
}

/** @deprecated Use mergeCommunityMembershipInMetadata for Auth0 writes. */
export function withCommunityMembership(
  existing: KpmgCommunityMembershipMap,
  communityId: string,
  status: KpmgCommunityMembershipStatus
): KpmgCommunityMembershipMap {
  const key = normalizeCommunityId(communityId);
  return { ...existing, [key]: status };
}

export type CommunityJoinRequest = {
  userId: string;
  email: string;
  name: string;
  requestedAt: string;
};

export function parseCommunityJoinRequests(raw: unknown): CommunityJoinRequest[] {
  if (!raw) {
    return [];
  }
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw) as unknown;
      return parseCommunityJoinRequests(parsed);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw
    .map((entry) => {
      if (!entry || typeof entry !== 'object') {
        return null;
      }
      const record = entry as Record<string, unknown>;
      const userId = String(record.userId ?? record.user_id ?? '').trim();
      if (!userId) {
        return null;
      }
      return {
        userId,
        email: String(record.email ?? '').trim(),
        name: String(record.name ?? '').trim(),
        requestedAt: String(record.requestedAt ?? record.requested_at ?? new Date().toISOString()),
      };
    })
    .filter((entry): entry is CommunityJoinRequest => Boolean(entry));
}

export function appendCommunityJoinRequest(
  existing: CommunityJoinRequest[],
  request: CommunityJoinRequest
): CommunityJoinRequest[] {
  const filtered = existing.filter(
    (entry) => normalizeCommunityId(entry.userId) !== normalizeCommunityId(request.userId)
  );
  return [...filtered, request];
}

export function removeCommunityJoinRequest(
  existing: CommunityJoinRequest[],
  userId: string
): CommunityJoinRequest[] {
  const normalized = normalizeCommunityId(userId);
  return existing.filter((entry) => normalizeCommunityId(entry.userId) !== normalized);
}
