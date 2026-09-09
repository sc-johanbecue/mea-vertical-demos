import { decodeJwt } from 'jose';
import type { SessionData, User } from '@auth0/nextjs-auth0/types';
import type { KpmgAuth0AppMetadata } from './kpmg-auth0-profile';
import {
  AUTH0_COMMUNITIES_CLAIM,
  AUTH0_ENTITLEMENTS_CLAIM,
  AUTH0_ROLES_CLAIM,
  getAuth0AppMetadata,
} from './kpmg-auth0-profile';
import { AUTH0_NAMESPACE } from './kpmg-auth0-profile';
import { logAuth0ClaimsDebug, snapshotAuth0Claims } from './auth0-debug';
import { getAuth0ManagementApiToken } from './auth0-management';

const APP_METADATA_CLAIM = `${AUTH0_NAMESPACE}/app_metadata`;

type JwtClaims = Record<string, unknown>;

type CachedManagementProfile = {
  profile: {
    app_metadata?: KpmgAuth0AppMetadata;
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

function asAppMetadata(value: unknown): KpmgAuth0AppMetadata | undefined {
  if (!value || typeof value !== 'object') {
    return undefined;
  }

  const record = value as Record<string, unknown>;
  const entitlements =
    record.entitlements && typeof record.entitlements === 'object'
      ? (record.entitlements as Record<string, boolean>)
      : undefined;
  const communities =
    record.communities && typeof record.communities === 'object'
      ? (record.communities as Record<string, boolean>)
      : undefined;

  if (!entitlements && !communities) {
    return undefined;
  }

  return { entitlements, communities };
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
  const communities =
    claims[AUTH0_COMMUNITIES_CLAIM] ?? appMetadata?.communities ?? claims.communities;

  return {
    ...user,
    ...(roles.length ? { [AUTH0_ROLES_CLAIM]: roles } : {}),
    ...(appMetadata ? { app_metadata: appMetadata } : {}),
    ...(entitlements && typeof entitlements === 'object'
      ? { [AUTH0_ENTITLEMENTS_CLAIM]: entitlements }
      : {}),
    ...(communities && typeof communities === 'object'
      ? { [AUTH0_COMMUNITIES_CLAIM]: communities }
      : {}),
  };
}

async function getManagementApiToken(domain: string): Promise<string | null> {
  return getAuth0ManagementApiToken(domain);
}

async function fetchManagementUserProfile(
  domain: string,
  userId: string
): Promise<{ app_metadata?: KpmgAuth0AppMetadata; user_metadata?: Record<string, unknown>; roles: string[] } | null> {
  const cacheKey = `${domain}:${userId}`;
  const cached = managementProfileCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.profile;
  }

  const token = await getManagementApiToken(domain);
  if (!token) {
    logAuth0ClaimsDebug('management-api/profile', {
      ok: false,
      reason: 'no_management_api_token',
      userId,
    });
    return null;
  }

  const headers = { Authorization: `Bearer ${token}` };
  const encodedUserId = encodeURIComponent(userId);

  const [userResponse, rolesResponse] = await Promise.all([
    fetch(`https://${domain}/api/v2/users/${encodedUserId}`, { headers }),
    fetch(`https://${domain}/api/v2/users/${encodedUserId}/roles`, { headers }),
  ]);

  let app_metadata: KpmgAuth0AppMetadata | undefined;
  let user_metadata: Record<string, unknown> | undefined;
  if (userResponse.ok) {
    const userBody = (await userResponse.json()) as {
      app_metadata?: KpmgAuth0AppMetadata;
      user_metadata?: Record<string, unknown>;
    };
    app_metadata = userBody.app_metadata;
    user_metadata = userBody.user_metadata;
  }

  let roles: string[] = [];
  if (rolesResponse.ok) {
    roles = asRoleNames(await rolesResponse.json());
  }

  if (!app_metadata && !user_metadata && !roles.length) {
    logAuth0ClaimsDebug('management-api/profile', {
      ok: false,
      userStatus: userResponse.status,
      rolesStatus: rolesResponse.status,
      userId,
    });
    return null;
  }

  logAuth0ClaimsDebug('management-api/profile', {
    ok: true,
    userId,
    roles,
    app_metadata,
    user_metadata,
  });

  const profile = { app_metadata, user_metadata, roles };
  managementProfileCache.set(cacheKey, {
    profile,
    expiresAt: Date.now() + MANAGEMENT_PROFILE_CACHE_TTL_MS,
  });

  return profile;
}

export async function enrichAuth0SessionUser(session: SessionData, idToken: string | null): Promise<SessionData> {
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
    hasIdToken: Boolean(idToken ?? session.tokenSet.idToken),
    hasAccessToken: Boolean(session.tokenSet.accessToken),
  });

  user = mergeClaimsIntoUser(user, idClaims);
  user = mergeClaimsIntoUser(user, accessClaims);
  user = mergeClaimsIntoUser(user, user as JwtClaims);

  logAuth0ClaimsDebug('enrich/after-token-merge', {
    sub: user.sub,
    mergedUser: snapshotAuth0Claims(user as Record<string, unknown>),
  });

  if (domain && user.sub) {
    const metadata = getAuth0AppMetadata(user);
    const hasRoles = asRoleNames(user[AUTH0_ROLES_CLAIM]).length > 0;
    const hasCommunities = Boolean(metadata.communities && Object.keys(metadata.communities).length);
    const shouldFetchManagementProfile = !(hasRoles && hasCommunities);
    const managementProfile = shouldFetchManagementProfile
      ? await fetchManagementUserProfile(domain, user.sub)
      : null;
    if (managementProfile) {
      const meta = managementProfile.app_metadata;
      user = {
        ...user,
        ...(managementProfile.roles.length ? { [AUTH0_ROLES_CLAIM]: managementProfile.roles } : {}),
        ...(meta ? { app_metadata: meta } : {}),
        ...(managementProfile.user_metadata ? { user_metadata: managementProfile.user_metadata } : {}),
        ...(meta?.entitlements && typeof meta.entitlements === 'object'
          ? { [AUTH0_ENTITLEMENTS_CLAIM]: meta.entitlements }
          : {}),
        ...(meta?.communities && typeof meta.communities === 'object'
          ? { [AUTH0_COMMUNITIES_CLAIM]: meta.communities }
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
