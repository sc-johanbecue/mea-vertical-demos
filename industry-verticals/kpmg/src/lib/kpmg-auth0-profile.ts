import type { User } from '@auth0/nextjs-auth0/types';

export type KpmgAuth0AppMetadata = {
  entitlements?: Record<string, boolean>;
  communities?: Record<string, boolean | string>;
};

export type KpmgAuth0ProfileDisplay = {
  name: string;
  email: string;
  roles: string[];
  entitlements: Array<{ key: string; enabled: boolean }>;
  communities: Array<{ key: string; enabled: boolean }>;
};

/** Auth0 custom-claim namespace (must match Post-Login Action `namespace` variable exactly). */
function resolveAuth0Namespace(): string {
  const raw =
    process.env.AUTH0_CLAIM_NAMESPACE ||
    process.env.NEXT_PUBLIC_AUTH0_CLAIM_NAMESPACE ||
    'https://saidemo.eu.auth0.com';
  return raw.replace(/\/+$/, '');
}

export const AUTH0_NAMESPACE = resolveAuth0Namespace();

export const AUTH0_ROLES_CLAIM = `${AUTH0_NAMESPACE}/roles`;
export const AUTH0_ENTITLEMENTS_CLAIM = `${AUTH0_NAMESPACE}/entitlements`;
export const AUTH0_COMMUNITIES_CLAIM = `${AUTH0_NAMESPACE}/communities`;

const AUTH0_APP_METADATA_CLAIM = `${AUTH0_NAMESPACE}/app_metadata`;

export function getAuth0Roles(user: User | undefined): string[] {
  if (!user) {
    return [];
  }

  const claimRoles = user[AUTH0_ROLES_CLAIM];
  if (Array.isArray(claimRoles)) {
    return claimRoles.map((role) => String(role));
  }

  const genericRoles = (user as { roles?: unknown }).roles;
  if (Array.isArray(genericRoles)) {
    return genericRoles.map((role) => String(role));
  }

  return [];
}

function normalizeCommunitiesRecord(value: unknown): Record<string, boolean | string> | undefined {
  if (!value || typeof value !== 'object') {
    return undefined;
  }

  const result: Record<string, boolean | string> = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    if (entry === true || entry === false) {
      result[key] = entry;
    } else if (typeof entry === 'string') {
      result[key] = entry;
    } else {
      result[key] = Boolean(entry);
    }
  }

  return Object.keys(result).length ? result : undefined;
}

export function getAuth0AppMetadata(user: User | undefined): KpmgAuth0AppMetadata {
  const record = user as Record<string, unknown> | undefined;
  if (!record) {
    return {};
  }

  const direct = record.app_metadata;
  const namespaced = record[AUTH0_APP_METADATA_CLAIM];

  const metadata =
    (direct && typeof direct === 'object' ? (direct as KpmgAuth0AppMetadata) : undefined) ??
    (namespaced && typeof namespaced === 'object' ? (namespaced as KpmgAuth0AppMetadata) : undefined);

  // Auth0 Actions may expose entitlements/communities as separate namespaced claims (not under app_metadata).
  const entitlements =
    normalizeFlagRecord(record[AUTH0_ENTITLEMENTS_CLAIM]) ??
    normalizeFlagRecord(metadata?.entitlements);
  const communities =
    normalizeCommunitiesRecord(record[AUTH0_COMMUNITIES_CLAIM]) ??
    normalizeCommunitiesRecord(metadata?.communities);

  return { entitlements, communities };
}

function normalizeFlagRecord(value: unknown): Record<string, boolean> | undefined {
  if (!value || typeof value !== 'object') {
    return undefined;
  }

  const entries = Object.entries(value as Record<string, unknown>).map(([key, enabled]) => [
    key,
    Boolean(enabled),
  ]);

  return entries.length ? Object.fromEntries(entries) : undefined;
}

function mapFlagRecord(
  record: Record<string, boolean | string> | undefined
): Array<{ key: string; enabled: boolean }> {
  if (!record) {
    return [];
  }

  return Object.entries(record).map(([key, enabled]) => ({
    key,
    enabled: enabled === true,
  }));
}

export function buildAuth0ProfileDisplay(user: User | undefined): KpmgAuth0ProfileDisplay | null {
  if (!user) {
    return null;
  }

  const metadata = getAuth0AppMetadata(user);

  return {
    name: user.name?.toString() || user.nickname?.toString() || 'User',
    email: user.email?.toString() || '',
    roles: getAuth0Roles(user),
    entitlements: mapFlagRecord(metadata.entitlements),
    communities: mapFlagRecord(metadata.communities),
  };
}

export const dummyAuth0ProfileDisplay: KpmgAuth0ProfileDisplay = {
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  roles: ['Beyond Member', 'Insights Reader'],
  entitlements: [
    { key: 'premium', enabled: true },
    { key: 'standard', enabled: true },
  ],
  communities: [
    { key: 'community1', enabled: true },
    { key: 'community2', enabled: false },
  ],
};

function resolveAuthBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  return (
    process.env.APP_BASE_URL?.split(',')[0]?.trim() ||
    process.env.AUTH0_BASE_URL?.split(',')[0]?.trim() ||
    'http://localhost:3000'
  );
}

export function buildLoginUrl(returnTo: string): string {
  const base = resolveAuthBaseUrl();
  const absoluteReturnTo = returnTo.startsWith('http') ? returnTo : new URL(returnTo, base).toString();
  const params = new URLSearchParams({ returnTo: absoluteReturnTo });
  return `/auth/login?${params.toString()}`;
}

export function buildLogoutUrl(returnTo = '/'): string {
  const base = resolveAuthBaseUrl();
  const absoluteReturnTo = returnTo.startsWith('http') ? returnTo : new URL(returnTo, base).toString();
  const params = new URLSearchParams({ returnTo: absoluteReturnTo });
  return `/auth/logout?${params.toString()}`;
}
