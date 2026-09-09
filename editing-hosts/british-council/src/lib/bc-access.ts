import type { User } from '@auth0/nextjs-auth0/types';
import { getAuth0AppMetadata, getAuth0Roles } from './auth0-profile';
import { resolveAuth0KeyFromIdOrName } from './bc-access-catalog';

export type BcAccessRef = {
  id?: string;
  name?: string;
  displayName?: string;
  fields?: {
    Auth0?: { value?: string | { value?: string } };
  };
};

export type BcAccessOperator = {
  id?: string;
  name?: string;
  displayName?: string;
  fields?: Record<string, unknown>;
};

export type BcAccessFields = {
  Entitlements?: BcAccessRef[] | null;
  EntitlementsOperator?: BcAccessOperator | null;
  Roles?: BcAccessRef[] | null;
  RolesOperator?: BcAccessOperator | null;
};

function unwrapFieldValue(value: unknown): unknown {
  if (value && typeof value === 'object' && 'value' in (value as Record<string, unknown>)) {
    return (value as { value: unknown }).value;
  }
  return value;
}

function asList(value: unknown): BcAccessRef[] {
  const unwrapped = unwrapFieldValue(value);

  if (Array.isArray(unwrapped)) {
    return unwrapped as BcAccessRef[];
  }

  if (typeof unwrapped === 'string' && unwrapped.trim()) {
    return unwrapped
      .split('|')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((id) => ({ id }));
  }

  return [];
}

function operatorFromUnknown(value: unknown): BcAccessOperator | null {
  const unwrapped = unwrapFieldValue(value);
  if (!unwrapped) {
    return null;
  }
  if (typeof unwrapped === 'string') {
    return { name: unwrapped };
  }
  if (typeof unwrapped === 'object') {
    return unwrapped as BcAccessOperator;
  }
  return null;
}

function auth0KeyFromRef(ref: BcAccessRef): string {
  const raw = ref.fields?.Auth0?.value;
  if (typeof raw === 'string' && raw.trim()) {
    return raw.trim();
  }
  if (raw && typeof raw === 'object' && typeof raw.value === 'string' && raw.value.trim()) {
    return raw.value.trim();
  }

  return resolveAuth0KeyFromIdOrName(ref.id, ref.name || ref.displayName);
}

function operatorIsAll(operator: BcAccessOperator | null | undefined): boolean {
  const label = (operator?.name || operator?.displayName || '').trim().toLowerCase();
  return label === 'all';
}

function matchesAnyOrAll(
  required: string[],
  hasMatch: (key: string) => boolean,
  requireAll: boolean
): boolean {
  if (!required.length) {
    return true;
  }
  return requireAll ? required.every(hasMatch) : required.some(hasMatch);
}

/** Normalize raw Sitecore/layout/API payloads into access fields. */
export function normalizeBcAccessFields(raw: unknown): BcAccessFields {
  if (!raw || typeof raw !== 'object') {
    return {};
  }

  const record = raw as Record<string, unknown>;
  return {
    Entitlements: asList(record.Entitlements),
    Roles: asList(record.Roles),
    EntitlementsOperator: operatorFromUnknown(record.EntitlementsOperator),
    RolesOperator: operatorFromUnknown(record.RolesOperator),
  };
}

export function hasBcAccessRules(fields: BcAccessFields | null | undefined): boolean {
  const normalized = normalizeBcAccessFields(fields);
  return (normalized.Entitlements?.length ?? 0) > 0 || (normalized.Roles?.length ?? 0) > 0;
}

/**
 * Evaluate Sitecore Entitlements/Roles fields against the Auth0 user.
 * - No rules → allow
 * - Entitlements and Roles are evaluated separately (Any/All operator each)
 * - When both sides have rules, access is granted if either side passes
 */
export function userCanAccessFields(
  user: User | null | undefined,
  fields: BcAccessFields | null | undefined,
  options?: { skip?: boolean }
): boolean {
  if (options?.skip) {
    return true;
  }

  const normalized = normalizeBcAccessFields(fields);
  const entitlements = normalized.Entitlements ?? [];
  const roles = normalized.Roles ?? [];

  if (!entitlements.length && !roles.length) {
    return true;
  }

  const entitlementKeys = entitlements.map(auth0KeyFromRef).filter(Boolean);
  const roleKeys = roles.map(auth0KeyFromRef).filter(Boolean);

  // Rules selected but Auth0 keys missing from layout → treat as restricted.
  if (entitlements.length && !entitlementKeys.length && roles.length && !roleKeys.length) {
    return false;
  }
  if (entitlements.length && !entitlementKeys.length && !roles.length) {
    return false;
  }
  if (roles.length && !roleKeys.length && !entitlements.length) {
    return false;
  }

  const userEntitlements = getAuth0AppMetadata(user ?? undefined).entitlements ?? {};
  const userRoles = new Set(
    getAuth0Roles(user ?? undefined)
      .map((role) => role.trim())
      .filter(Boolean)
  );

  const entitlementsPass =
    !entitlementKeys.length ||
    matchesAnyOrAll(
      entitlementKeys,
      (key) => userEntitlements[key] === true,
      operatorIsAll(normalized.EntitlementsOperator)
    );

  const rolesPass =
    !roleKeys.length ||
    matchesAnyOrAll(roleKeys, (key) => userRoles.has(key), operatorIsAll(normalized.RolesOperator));

  if (entitlementKeys.length && roleKeys.length) {
    return entitlementsPass || rolesPass;
  }

  return entitlementKeys.length ? entitlementsPass : rolesPass;
}

/** Hide restricted items while Auth0 is loading; unrestricted items stay visible. */
export function userCanAccessFieldsWhileLoading(
  user: User | null | undefined,
  fields: BcAccessFields | null | undefined,
  options: { skip?: boolean; isLoading?: boolean }
): boolean {
  if (options.skip) {
    return true;
  }
  if (!hasBcAccessRules(fields)) {
    return true;
  }
  if (options.isLoading) {
    return false;
  }
  return userCanAccessFields(user, fields);
}
