import { decodeJwt } from 'jose';
import type { SessionData, User } from '@auth0/nextjs-auth0/types';
import {
  AUTH0_ENTITLEMENTS_CLAIM,
  AUTH0_NAMESPACE,
  AUTH0_ROLES_CLAIM,
} from './auth0-profile';
import type { BcAuth0AppMetadata } from './auth0-profile';
import { logAuth0ClaimsDebug, snapshotAuth0Claims } from './auth0-debug';
import { getAuth0ManagementApiToken } from './auth0-management';

const APP_METADATA_CLAIM = `${AUTH0_NAMESPACE}/app_metadata`;

type JwtClaims = Record<string, unknown>;

type CachedManagementProfile = {
  profile: {
    given_name?: string;
    family_name?: string;
    name?: string;
    email?: string;
    app_metadata?: BcAuth0AppMetadata;
    user_metadata?: Record<string, unknown>;
    roles: string[];
  };
  expiresAt: number;
};

const MANAGEMENT_PROFILE_CACHE_TTL_MS = 60_000;
const managementProfileCache = new Map<string, CachedManagementProfile>();

function decodeTokenClaims(token: string | undefined): JwtClaims | null {
  if (!token) {
    return null;
  }

  try {
    return decodeJwt(token) as JwtClaims;
  } catch {
    return null;
  }
}

function asAppMetadata(value: unknown): BcAuth0AppMetadata | undefined {
  if (!value || typeof value !== 'object') {
    return undefined;
  }

  const record = value as Record<string, unknown>;
  const entitlements =
    record.entitlements && typeof record.entitlements === 'object'
      ? (record.entitlements as Record<string, boolean>)
      : undefined;

  if (!entitlements) {
    return undefined;
  }

  return { entitlements };
}

function asRoleNames(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => {
      if (typeof entry === 'string') {
        return entry;
      }
      if (entry && typeof entry === 'object' && 'name' in entry) {
        return String((entry as { name: unknown }).name);
      }
      return '';
    })
    .filter(Boolean);
}

function mergeClaimsIntoUser(user: User, claims: JwtClaims | null): User {
  if (!claims) {
    return user;
  }

  const roles = asRoleNames(claims[AUTH0_ROLES_CLAIM] ?? claims.roles);
  const appMetadata = asAppMetadata(claims.app_metadata ?? claims[APP_METADATA_CLAIM]);
  const entitlements =
    claims[AUTH0_ENTITLEMENTS_CLAIM] ?? appMetadata?.entitlements ?? claims.entitlements;

  return {
    ...user,
    ...(roles.length ? { [AUTH0_ROLES_CLAIM]: roles } : {}),
    ...(appMetadata ? { app_metadata: appMetadata } : {}),
    ...(entitlements && typeof entitlements === 'object'
      ? { [AUTH0_ENTITLEMENTS_CLAIM]: entitlements }
      : {}),
  };
}

export function invalidateAuth0ManagementProfileCache(userId?: string): void {
  if (!userId) {
    managementProfileCache.clear();
    return;
  }

  for (const key of managementProfileCache.keys()) {
    if (key.endsWith(`:${userId}`)) {
      managementProfileCache.delete(key);
    }
  }
}

export async function fetchManagementUserProfile(
  domain: string,
  userId: string,
  options?: { bypassCache?: boolean }
): Promise<{
  given_name?: string;
  family_name?: string;
  name?: string;
  email?: string;
  app_metadata?: BcAuth0AppMetadata;
  user_metadata?: Record<string, unknown>;
  roles: string[];
} | null> {
  const cacheKey = `${domain}:${userId}`;
  const cached = managementProfileCache.get(cacheKey);
  if (!options?.bypassCache && cached && cached.expiresAt > Date.now()) {
    return cached.profile;
  }

  const token = await getAuth0ManagementApiToken(domain);
  if (!token) {
    return null;
  }

  const headers = { Authorization: `Bearer ${token}` };
  const encodedUserId = encodeURIComponent(userId);

  const [userResponse, rolesResponse] = await Promise.all([
    fetch(`https://${domain}/api/v2/users/${encodedUserId}`, { headers }),
    fetch(`https://${domain}/api/v2/users/${encodedUserId}/roles`, { headers }),
  ]);

  let given_name: string | undefined;
  let family_name: string | undefined;
  let name: string | undefined;
  let email: string | undefined;
  let app_metadata: BcAuth0AppMetadata | undefined;
  let user_metadata: Record<string, unknown> | undefined;
  if (userResponse.ok) {
    const userBody = (await userResponse.json()) as {
      given_name?: string;
      family_name?: string;
      name?: string;
      email?: string;
      app_metadata?: BcAuth0AppMetadata;
      user_metadata?: Record<string, unknown>;
    };
    given_name = userBody.given_name?.toString().trim() || undefined;
    family_name = userBody.family_name?.toString().trim() || undefined;
    name = userBody.name?.toString().trim() || undefined;
    email = userBody.email?.toString().trim() || undefined;
    app_metadata = userBody.app_metadata;
    user_metadata = userBody.user_metadata;
  }

  let roles: string[] = [];
  if (rolesResponse.ok) {
    roles = asRoleNames(await rolesResponse.json());
  }

  if (
    !given_name &&
    !family_name &&
    !name &&
    !email &&
    !app_metadata &&
    !user_metadata &&
    !roles.length
  ) {
    return null;
  }

  const profile = {
    given_name,
    family_name,
    name,
    email,
    app_metadata,
    user_metadata,
    roles,
  };
  managementProfileCache.set(cacheKey, {
    profile,
    expiresAt: Date.now() + MANAGEMENT_PROFILE_CACHE_TTL_MS,
  });

  return profile;
}

export async function enrichAuth0SessionUser(
  session: SessionData,
  idToken: string | null
): Promise<SessionData> {
  const domain = process.env.AUTH0_DOMAIN;
  let user = session.user;

  const idClaims = decodeTokenClaims(idToken ?? session.tokenSet.idToken);
  const accessClaims = decodeTokenClaims(session.tokenSet.accessToken);

  logAuth0ClaimsDebug('enrich/start', {
    sub: user.sub,
    configuredNamespace: AUTH0_NAMESPACE,
    sessionUser: snapshotAuth0Claims(user as Record<string, unknown>),
    idTokenClaims: snapshotAuth0Claims(idClaims),
    accessTokenClaims: snapshotAuth0Claims(accessClaims),
  });

  user = mergeClaimsIntoUser(user, idClaims);
  user = mergeClaimsIntoUser(user, accessClaims);
  user = mergeClaimsIntoUser(user, user as JwtClaims);

  if (domain && user.sub) {
    // Always enrich from Management API so profile names / user_metadata are available
    // even when roles/entitlements already arrived via ID token claims.
    const managementProfile = await fetchManagementUserProfile(domain, user.sub);
    if (managementProfile) {
      const meta = managementProfile.app_metadata;
      const metadataFirst =
        typeof managementProfile.user_metadata?.first_name === 'string'
          ? managementProfile.user_metadata.first_name.trim()
          : '';
      const metadataLast =
        typeof managementProfile.user_metadata?.last_name === 'string'
          ? managementProfile.user_metadata.last_name.trim()
          : '';
      const givenName = managementProfile.given_name || metadataFirst || undefined;
      const familyName = managementProfile.family_name || metadataLast || undefined;
      const composedName = [givenName, familyName].filter(Boolean).join(' ');

      user = {
        ...user,
        ...(givenName ? { given_name: givenName } : {}),
        ...(familyName ? { family_name: familyName } : {}),
        ...(composedName
          ? { name: composedName }
          : managementProfile.name
            ? { name: managementProfile.name }
            : {}),
        ...(managementProfile.email ? { email: managementProfile.email } : {}),
        ...(managementProfile.roles.length ? { [AUTH0_ROLES_CLAIM]: managementProfile.roles } : {}),
        ...(meta ? { app_metadata: meta } : {}),
        ...(managementProfile.user_metadata
          ? { user_metadata: managementProfile.user_metadata }
          : {}),
        ...(meta?.entitlements && typeof meta.entitlements === 'object'
          ? { [AUTH0_ENTITLEMENTS_CLAIM]: meta.entitlements }
          : {}),
      };
    }
  }

  logAuth0ClaimsDebug('enrich/final', {
    sub: user.sub,
    finalUser: snapshotAuth0Claims(user as Record<string, unknown>),
  });

  return {
    ...session,
    user,
  };
}
