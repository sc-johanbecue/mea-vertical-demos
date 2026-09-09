'use client';

import { useEffect, useMemo, useState } from 'react';
import type { User } from '@auth0/nextjs-auth0/types';
import {
  hasBcAccessRules,
  normalizeBcAccessFields,
  userCanAccessFields,
  type BcAccessFields,
} from '@/lib/bc-access';

type AccessResponse = {
  allowed?: boolean;
  hasRules?: boolean;
  fields?: BcAccessFields;
};

const accessResultCache = new Map<string, boolean>();

/**
 * Resolves whether the current user may see an item.
 * Prefers Entitlements/Roles already on `fields`; otherwise loads them for `path` or `id`
 * (used when rights live on a linked Collection/Book page, not the nav/card datasource).
 */
export function useBcAccessAllowed(options: {
  fields?: BcAccessFields | null;
  path?: string;
  id?: string;
  user: User | null | undefined;
  isUserLoading?: boolean;
  skip?: boolean;
}): { allowed: boolean; checking: boolean } {
  const { fields, path, id, user, isUserLoading, skip } = options;
  const localFields = useMemo(() => normalizeBcAccessFields(fields), [fields]);
  const hasLocalRules = hasBcAccessRules(localFields);
  const cacheKey = `${id || ''}|${path || ''}|${user?.sub || 'anon'}`;
  const [remoteAllowed, setRemoteAllowed] = useState<boolean | null>(() =>
    accessResultCache.has(cacheKey) ? Boolean(accessResultCache.get(cacheKey)) : null
  );
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (skip || hasLocalRules || (!path && !id)) {
      setRemoteAllowed(null);
      setChecking(false);
      return;
    }

    if (accessResultCache.has(cacheKey)) {
      setRemoteAllowed(Boolean(accessResultCache.get(cacheKey)));
      setChecking(false);
      return;
    }

    let cancelled = false;
    const params = new URLSearchParams();
    if (id) {
      params.set('id', id);
    } else if (path) {
      params.set('path', path);
    }

    setChecking(true);
    void fetch(`/api/bc/item-access?${params.toString()}`)
      .then(async (response) => {
        if (!response.ok) {
          return { allowed: true, hasRules: false } as AccessResponse;
        }
        return (await response.json()) as AccessResponse;
      })
      .then((body) => {
        if (cancelled) {
          return;
        }
        const allowed = body.hasRules ? Boolean(body.allowed) : true;
        accessResultCache.set(cacheKey, allowed);
        setRemoteAllowed(allowed);
      })
      .catch(() => {
        if (!cancelled) {
          setRemoteAllowed(true);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setChecking(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [skip, hasLocalRules, path, id, cacheKey]);

  if (skip) {
    return { allowed: true, checking: false };
  }

  if (hasLocalRules) {
    if (isUserLoading) {
      return { allowed: false, checking: true };
    }
    return {
      allowed: userCanAccessFields(user, localFields),
      checking: false,
    };
  }

  if (!path && !id) {
    return { allowed: true, checking: false };
  }

  if (checking || remoteAllowed === null) {
    return { allowed: false, checking: true };
  }

  return { allowed: remoteAllowed, checking: false };
}
