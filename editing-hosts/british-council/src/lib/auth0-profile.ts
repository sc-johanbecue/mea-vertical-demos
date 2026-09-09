import type { User } from '@auth0/nextjs-auth0/types';

export type BcAuth0AppMetadata = {
  entitlements?: Record<string, boolean>;
};

export type BcAuth0ProfileDisplay = {
  name: string;
  email: string;
  roles: string[];
  entitlements: Array<{ key: string; enabled: boolean }>;
};

/** Auth0 custom-claim namespace (must match Post-Login Action `namespace` variable exactly). */
function resolveAuth0Namespace(): string {
  const raw =
    process.env.AUTH0_CLAIM_NAMESPACE ||
    process.env.NEXT_PUBLIC_AUTH0_CLAIM_NAMESPACE ||
    (process.env.AUTH0_DOMAIN ? `https://${process.env.AUTH0_DOMAIN}` : 'https://saidemo.eu.auth0.com');
  return raw.replace(/\/+$/, '');
}

export const AUTH0_NAMESPACE = resolveAuth0Namespace();

export const AUTH0_ROLES_CLAIM = `${AUTH0_NAMESPACE}/roles`;
export const AUTH0_ENTITLEMENTS_CLAIM = `${AUTH0_NAMESPACE}/entitlements`;

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

export function getAuth0AppMetadata(user: User | undefined): BcAuth0AppMetadata {
  const record = user as Record<string, unknown> | undefined;
  if (!record) {
    return {};
  }

  const direct = record.app_metadata;
  const namespaced = record[AUTH0_APP_METADATA_CLAIM];

  const metadata =
    (direct && typeof direct === 'object' ? (direct as BcAuth0AppMetadata) : undefined) ??
    (namespaced && typeof namespaced === 'object' ? (namespaced as BcAuth0AppMetadata) : undefined);

  const entitlements =
    normalizeFlagRecord(record[AUTH0_ENTITLEMENTS_CLAIM]) ??
    normalizeFlagRecord(metadata?.entitlements);

  return { entitlements };
}

function mapFlagRecord(
  record: Record<string, boolean> | undefined
): Array<{ key: string; enabled: boolean }> {
  if (!record) {
    return [];
  }

  return Object.entries(record).map(([key, enabled]) => ({
    key,
    enabled: enabled === true,
  }));
}

export function buildAuth0ProfileDisplay(user: User | undefined): BcAuth0ProfileDisplay | null {
  if (!user) {
    return null;
  }

  const metadata = getAuth0AppMetadata(user);

  return {
    name: user.name?.toString() || user.nickname?.toString() || 'User',
    email: user.email?.toString() || '',
    roles: getAuth0Roles(user),
    entitlements: mapFlagRecord(metadata.entitlements),
  };
}

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

function looksLikeEmail(value: string): boolean {
  return value.includes('@');
}

const ROLE_LIKE_DISPLAY_NAMES = new Set([
  'associate',
  'partner',
  'subscriber',
  'reader',
  'admin',
  'administrator',
  'owner',
  'portal owner',
  'british council reader',
  'british council partner',
  'british council subscriber',
  'user',
  'member',
]);

function normalizeLabel(value: string): string {
  return value.trim().toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ');
}

function looksLikeRoleOrTitle(value: string, user: User): boolean {
  const normalized = normalizeLabel(value);
  if (!normalized) {
    return true;
  }

  if (ROLE_LIKE_DISPLAY_NAMES.has(normalized)) {
    return true;
  }

  // Reject Auth0 role claim values (e.g. british_council_subscriber) and display labels.
  const roles = getAuth0Roles(user).map(normalizeLabel);
  if (roles.includes(normalized)) {
    return true;
  }

  if (normalized.startsWith('british council ') || normalized.startsWith('british_council_')) {
    return true;
  }

  return false;
}

function readMetadataNamePart(user: User, ...keys: string[]): string {
  const metadata = (user as Record<string, unknown>).user_metadata;
  if (!metadata || typeof metadata !== 'object') {
    return '';
  }

  const record = metadata as Record<string, unknown>;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  return '';
}

export function resolveDisplayName(user: User | null | undefined): string {
  if (!user) {
    return '';
  }

  const given =
    user.given_name?.toString().trim() ||
    readMetadataNamePart(user, 'first_name', 'firstName', 'firstname');
  const family =
    user.family_name?.toString().trim() ||
    readMetadataNamePart(user, 'last_name', 'lastName', 'lastname');
  const fullName = [given, family].filter(Boolean).join(' ');
  if (fullName) {
    return fullName;
  }

  const name = user.name?.toString().trim() || '';
  if (name && !looksLikeEmail(name) && !looksLikeRoleOrTitle(name, user)) {
    return name;
  }

  const nickname = user.nickname?.toString().trim() || '';
  if (nickname && !looksLikeEmail(nickname) && !looksLikeRoleOrTitle(nickname, user)) {
    return nickname;
  }

  const email = user.email?.toString().trim() || '';
  if (email) {
    return email;
  }

  return 'Account';
}

export function resolveDisplayInitials(user: User | null | undefined): string {
  const name = resolveDisplayName(user);
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || '?';
}
