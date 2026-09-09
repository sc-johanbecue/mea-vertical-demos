import type { User } from '@auth0/nextjs-auth0/types';
import {
  AUTH0_ENTITLEMENTS_CLAIM,
  AUTH0_NAMESPACE,
  AUTH0_ROLES_CLAIM,
  buildAuth0ProfileDisplay,
} from './auth0-profile';

const LOG_PREFIX = '[BC Auth0]';

const STANDARD_CLAIM_KEYS = new Set([
  'iss',
  'sub',
  'aud',
  'exp',
  'iat',
  'auth_time',
  'nonce',
  'at_hash',
  'name',
  'nickname',
  'picture',
  'email',
  'email_verified',
  'given_name',
  'family_name',
  'updated_at',
  'sid',
  'org_id',
  'azp',
  'scope',
  'permissions',
  'roles',
  'app_metadata',
  'user_metadata',
]);

function isTruthyEnv(value: string | undefined): boolean {
  return value === 'true' || value === '1';
}

export function isAuth0ClaimsDebugEnabled(): boolean {
  if (isTruthyEnv(process.env.AUTH0_DEBUG_CLAIMS)) {
    return true;
  }
  if (process.env.AUTH0_DEBUG_CLAIMS === 'false') {
    return false;
  }
  return process.env.NODE_ENV === 'development';
}

type ClaimSource = Record<string, unknown> | null | undefined;

function pickSuffixClaims(source: ClaimSource, suffix: string): Record<string, unknown> {
  if (!source) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(source).filter(([key]) => key.startsWith('http') && key.endsWith(suffix))
  );
}

export function snapshotAuth0Claims(source: ClaimSource) {
  if (!source) {
    return null;
  }

  const allKeys = Object.keys(source);
  const customClaimKeys = allKeys.filter((key) => key.startsWith('http'));
  const nonStandardKeys = allKeys.filter((key) => !STANDARD_CLAIM_KEYS.has(key));

  return {
    sub: source.sub,
    name: source.name,
    email: source.email,
    expected: {
      namespace: AUTH0_NAMESPACE,
      rolesClaim: AUTH0_ROLES_CLAIM,
      entitlementsClaim: AUTH0_ENTITLEMENTS_CLAIM,
      roles: source[AUTH0_ROLES_CLAIM] ?? 'MISSING',
      entitlements: source[AUTH0_ENTITLEMENTS_CLAIM] ?? 'MISSING',
    },
    app_metadata: source.app_metadata,
    allKeys,
    nonStandardKeys,
    customClaimKeys,
    customClaims: Object.fromEntries(customClaimKeys.map((key) => [key, source[key]])),
    discoveredNamespacedClaims: {
      roles: pickSuffixClaims(source, '/roles'),
      entitlements: pickSuffixClaims(source, '/entitlements'),
    },
  };
}

export function logAuth0ClaimsDebug(stage: string, payload: Record<string, unknown>): void {
  if (!isAuth0ClaimsDebugEnabled()) {
    return;
  }

  console.log(`${LOG_PREFIX} ${stage}`, JSON.stringify(payload, null, 2));
}

export function logAuth0UserDebug(stage: string, user: User | undefined | null): void {
  if (!isAuth0ClaimsDebugEnabled()) {
    return;
  }

  const record = user as Record<string, unknown> | undefined;
  console.log(
    `${LOG_PREFIX} ${stage}`,
    JSON.stringify(
      {
        claims: snapshotAuth0Claims(record),
        profileDisplay: buildAuth0ProfileDisplay(user ?? undefined),
      },
      null,
      2
    )
  );
}
