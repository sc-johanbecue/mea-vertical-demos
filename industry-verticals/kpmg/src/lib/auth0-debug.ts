import type { User } from '@auth0/nextjs-auth0/types';
import {
  AUTH0_COMMUNITIES_CLAIM,
  AUTH0_ENTITLEMENTS_CLAIM,
  AUTH0_NAMESPACE,
  AUTH0_ROLES_CLAIM,
  buildAuth0ProfileDisplay,
} from './kpmg-auth0-profile';

const LOG_PREFIX = '[KPMG Auth0]';

/** Standard OIDC / Auth0 claims — not custom namespaced claims from Actions. */
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

/** Server-side: enabled in development, or when AUTH0_DEBUG_CLAIMS=true. Set AUTH0_DEBUG_CLAIMS=false to disable. */
export function isAuth0ClaimsDebugEnabled(): boolean {
  if (isTruthyEnv(process.env.AUTH0_DEBUG_CLAIMS)) {
    return true;
  }
  if (process.env.AUTH0_DEBUG_CLAIMS === 'false') {
    return false;
  }
  return process.env.NODE_ENV === 'development';
}

/** Client-side: set NEXT_PUBLIC_AUTH0_DEBUG_CLAIMS=true (or use development default). */
export function isAuth0ClaimsDebugEnabledClient(): boolean {
  if (isTruthyEnv(process.env.NEXT_PUBLIC_AUTH0_DEBUG_CLAIMS)) {
    return true;
  }
  if (process.env.NEXT_PUBLIC_AUTH0_DEBUG_CLAIMS === 'false') {
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

/** Find namespaced claims Auth0 Actions may have set under a different namespace than configured. */
export function discoverNamespacedClaims(source: ClaimSource) {
  if (!source) {
    return {
      roles: {},
      entitlements: {},
      communities: {},
    };
  }

  return {
    roles: pickSuffixClaims(source, '/roles'),
    entitlements: pickSuffixClaims(source, '/entitlements'),
    communities: pickSuffixClaims(source, '/communities'),
  };
}

export function snapshotAuth0Claims(source: ClaimSource) {
  if (!source) {
    return null;
  }

  const allKeys = Object.keys(source);
  const customClaimKeys = allKeys.filter((key) => key.startsWith('http'));
  const nonStandardKeys = allKeys.filter((key) => !STANDARD_CLAIM_KEYS.has(key));
  const discovered = discoverNamespacedClaims(source);

  const expected = {
    namespace: AUTH0_NAMESPACE,
    rolesClaim: AUTH0_ROLES_CLAIM,
    entitlementsClaim: AUTH0_ENTITLEMENTS_CLAIM,
    communitiesClaim: AUTH0_COMMUNITIES_CLAIM,
    roles: source[AUTH0_ROLES_CLAIM] ?? 'MISSING',
    entitlements: source[AUTH0_ENTITLEMENTS_CLAIM] ?? 'MISSING',
    communities: source[AUTH0_COMMUNITIES_CLAIM] ?? 'MISSING',
  };

  const hasExpectedClaims =
    source[AUTH0_ROLES_CLAIM] !== undefined ||
    source[AUTH0_ENTITLEMENTS_CLAIM] !== undefined ||
    source[AUTH0_COMMUNITIES_CLAIM] !== undefined;

  const hasOtherNamespaceClaims =
    Object.keys(discovered.roles).length > 0 ||
    Object.keys(discovered.entitlements).length > 0 ||
    Object.keys(discovered.communities).length > 0;

  let diagnosis: string;
  if (hasExpectedClaims) {
    diagnosis = 'Expected namespaced claims found on this object.';
  } else if (hasOtherNamespaceClaims) {
    diagnosis =
      'Claims exist under a DIFFERENT namespace than configured. Set AUTH0_CLAIM_NAMESPACE / NEXT_PUBLIC_AUTH0_CLAIM_NAMESPACE to match your Auth0 Action, then restart and log in again.';
  } else if (customClaimKeys.length === 0) {
    diagnosis =
      'No https:// custom claims on this object. Auth0 Post-Login Actions did not add claims to the ID token (Actions missing from Login flow, wrong trigger, or Action error). Management API fallback also failed — see management-api/token logs.';
  } else {
    diagnosis =
      'Some https:// claims exist but not the expected /roles, /entitlements, or /communities suffixes. Check Auth0 Action claim names.';
  }

  return {
    sub: source.sub,
    name: source.name,
    email: source.email,
    expected,
    app_metadata: source.app_metadata,
    allKeys,
    nonStandardKeys,
    customClaimKeys,
    customClaims: Object.fromEntries(customClaimKeys.map((key) => [key, source[key]])),
    discoveredNamespacedClaims: discovered,
    diagnosis,
  };
}

export function logAuth0ClaimsDebug(
  stage: string,
  payload: Record<string, unknown>
): void {
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

export function logAuth0ClaimsDebugClient(
  stage: string,
  user: User | undefined | null
): void {
  if (!isAuth0ClaimsDebugEnabledClient()) {
    return;
  }

  const record = user as Record<string, unknown> | undefined;
  const snapshot = snapshotAuth0Claims(record);

  console.groupCollapsed(`${LOG_PREFIX} ${stage} (browser)`);
  console.log('Diagnosis', snapshot?.diagnosis);
  console.log('Expected namespace / claims', snapshot?.expected);
  console.log('All keys on session.user', snapshot?.allKeys);
  console.log('Any https:// claims found', snapshot?.customClaims);
  console.log('Claims under other namespaces', snapshot?.discoveredNamespacedClaims);
  console.log('Profile display', buildAuth0ProfileDisplay(user ?? undefined));
  console.log('Raw session.user', user);
  console.groupEnd();
}
