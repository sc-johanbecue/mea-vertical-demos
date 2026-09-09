'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import type { User } from '@auth0/nextjs-auth0/types';
import type { Auth0CommunitiesRecord } from '@/lib/kpmg-auth0-communities';
import {
  canModerateCommunityComments,
  getCommunityMembershipFromRecord,
  getCommunityMembershipStatus,
  isCommunityAdmin,
  isCommunityMembershipActive,
  isCommunityOwner,
  listKnownCommunities,
  normalizeCommunityId,
  resolveCommunityIdFromMetadataKey,
  type KpmgCommunityMembershipStatus,
} from '@/lib/kpmg-auth0-communities';

const SUBSCRIPTIONS_CHANGED_EVENT = 'kpmg-beyond-communities-changed';

export const COMMUNITIES_CHANGED_EVENT = SUBSCRIPTIONS_CHANGED_EVENT;

export type CommunitiesChangedEventDetail = {
  communities?: Auth0CommunitiesRecord;
};

export function dispatchCommunitiesChanged(communities?: Auth0CommunitiesRecord): void {
  window.dispatchEvent(
    new CustomEvent<CommunitiesChangedEventDetail>(SUBSCRIPTIONS_CHANGED_EVENT, {
      detail: { communities },
    })
  );
}

function readCommunitiesFromChangedEvent(event: Event): Auth0CommunitiesRecord | undefined {
  return (event as CustomEvent<CommunitiesChangedEventDetail>).detail?.communities;
}

function normalizeMembershipValue(value: unknown): KpmgCommunityMembershipStatus | undefined {
  if (value === true || value === 'true' || value === 'joined') {
    return true;
  }
  if (value === 'owner') {
    return 'owner';
  }
  if (value === 'requested' || value === 'pending') {
    return 'requested';
  }
  if (value === false || value === 'false' || value === 'declined' || value === 'rejected') {
    return false;
  }
  if (typeof value === 'string' && value.trim().toLowerCase() === 'owner') {
    return 'owner';
  }
  return undefined;
}

async function fetchCommunitiesRecord(): Promise<Auth0CommunitiesRecord | null> {
  const response = await fetch('/api/kpmg-beyond/communities/membership', { cache: 'no-store' });
  const data = (await response.json().catch(() => null)) as {
    communities?: Auth0CommunitiesRecord;
  } | null;
  if (data?.communities) {
    return data.communities;
  }
  return null;
}

/** Prefer management/session API record; only fall back to JWT before the first fetch completes. */
function resolveCommunityMembershipStatus(
  authUser: User | undefined,
  communityId: string,
  communityTitle: string | undefined,
  serverCommunities: Auth0CommunitiesRecord | null
): KpmgCommunityMembershipStatus | undefined {
  if (serverCommunities !== null) {
    const fromServer = getCommunityMembershipFromRecord(serverCommunities, communityId, communityTitle);
    if (fromServer !== undefined) {
      return fromServer;
    }
    return undefined;
  }
  return getCommunityMembershipStatus(authUser, communityId, communityTitle);
}

export function useKpmgBeyondCommunityMembership(
  communityId: string | undefined,
  communityTitle?: string
) {
  const { user, isLoading: userLoading } = useUser();
  const authUser = user ?? undefined;
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverCommunities, setServerCommunities] = useState<Auth0CommunitiesRecord | null>(null);
  const title = communityTitle?.trim() || undefined;

  const refreshFromServer = useCallback(async () => {
    const record = await fetchCommunitiesRecord();
    if (record) {
      setServerCommunities(record);
    }
  }, []);

  useEffect(() => {
    void refreshFromServer();
  }, [refreshFromServer, authUser?.sub]);

  useEffect(() => {
    const handler = (event: Event) => {
      const communities = readCommunitiesFromChangedEvent(event);
      if (communities) {
        setServerCommunities(communities);
        return;
      }
      void refreshFromServer();
    };
    window.addEventListener(SUBSCRIPTIONS_CHANGED_EVENT, handler);
    return () => window.removeEventListener(SUBSCRIPTIONS_CHANGED_EVENT, handler);
  }, [refreshFromServer]);

  const status = useMemo((): KpmgCommunityMembershipStatus | undefined => {
    if (!communityId) {
      return undefined;
    }
    return resolveCommunityMembershipStatus(authUser, communityId, title, serverCommunities);
  }, [authUser, communityId, serverCommunities, title]);

  const applyOrJoin = useCallback(async () => {
    if (!communityId || pending) {
      return;
    }
    setPending(true);
    setError(null);
    try {
      const response = await fetch('/api/kpmg-beyond/communities/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ communityId }),
      });
      if (response.ok) {
        const data = (await response.json()) as { communities?: Auth0CommunitiesRecord };
        if (data.communities) {
          setServerCommunities(data.communities);
          dispatchCommunitiesChanged(data.communities);
        } else {
          await refreshFromServer();
          dispatchCommunitiesChanged();
        }
      } else {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error || `Join failed (${response.status})`);
      }
    } finally {
      setPending(false);
    }
  }, [communityId, pending, refreshFromServer]);

  const cancelApplication = useCallback(async () => {
    if (!communityId || pending || status !== 'requested') {
      return;
    }
    setPending(true);
    setError(null);
    try {
      const response = await fetch('/api/kpmg-beyond/communities/join/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ communityId }),
      });
      if (response.ok) {
        const data = (await response.json()) as { communities?: Auth0CommunitiesRecord };
        if (data.communities) {
          setServerCommunities(data.communities);
          dispatchCommunitiesChanged(data.communities);
        } else {
          await refreshFromServer();
          dispatchCommunitiesChanged();
        }
      } else {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error || `Cancel failed (${response.status})`);
      }
    } finally {
      setPending(false);
    }
  }, [communityId, pending, refreshFromServer, status]);

  const joined = isCommunityMembershipActive(status);
  const isOwner = status === 'owner' || (communityId ? isCommunityOwner(authUser, communityId, title) : false);
  const canModerateComments =
    isCommunityAdmin(authUser) ||
    isOwner ||
    (communityId ? canModerateCommunityComments(authUser, communityId, title) : false);
  const canReviewApplications = canModerateComments || isOwner;

  return {
    status,
    joined,
    isOwner,
    canModerateComments,
    canReviewApplications,
    isAdmin: isCommunityAdmin(authUser),
    pending,
    error,
    applyOrJoin,
    cancelApplication,
    applicationPending: status === 'requested',
    isLoading: userLoading,
  };
}

export function useKpmgBeyondJoinedCommunityIds(): string[] {
  const { user } = useUser();
  const authUser = user ?? undefined;
  const [ids, setIds] = useState<string[]>([]);

  const refresh = useCallback(async () => {
    const record = await fetchCommunitiesRecord();
    if (!record) {
      const { getJoinedCommunityIds } = await import('@/lib/kpmg-auth0-communities');
      setIds(getJoinedCommunityIds(authUser));
      return;
    }
    const joined = new Set<string>();
    for (const [key, value] of Object.entries(record)) {
      if (!isCommunityMembershipActive(normalizeMembershipValue(value))) {
        continue;
      }
      const resolved = resolveCommunityIdFromMetadataKey(key);
      if (resolved) {
        joined.add(normalizeCommunityId(resolved));
      }
    }
    setIds([...joined]);
  }, [authUser]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const handler = (event: Event) => {
      const communities = readCommunitiesFromChangedEvent(event);
      if (communities) {
        const joined = new Set<string>();
        for (const [key, value] of Object.entries(communities)) {
          if (!isCommunityMembershipActive(normalizeMembershipValue(value))) {
            continue;
          }
          const resolved = resolveCommunityIdFromMetadataKey(key);
          if (resolved) {
            joined.add(normalizeCommunityId(resolved));
          }
        }
        setIds([...joined]);
        return;
      }
      void refresh();
    };
    window.addEventListener(SUBSCRIPTIONS_CHANGED_EVENT, handler);
    return () => window.removeEventListener(SUBSCRIPTIONS_CHANGED_EVENT, handler);
  }, [refresh]);

  return ids;
}

function buildCommunityMembershipMapFromRecord(
  record: Auth0CommunitiesRecord
): Record<string, KpmgCommunityMembershipStatus> {
  const map: Record<string, KpmgCommunityMembershipStatus> = {};
  for (const [key, value] of Object.entries(record)) {
    const status = normalizeMembershipValue(value);
    if (status === undefined || status === false) {
      continue;
    }
    const resolved = resolveCommunityIdFromMetadataKey(key);
    if (resolved) {
      map[normalizeCommunityId(resolved)] = status;
    }
  }
  return map;
}

/** Normalized community id → membership status for listing cards and summaries. */
export function useKpmgBeyondCommunityMembershipMap(): Record<string, KpmgCommunityMembershipStatus> {
  const { user } = useUser();
  const authUser = user ?? undefined;
  const [serverCommunities, setServerCommunities] = useState<Auth0CommunitiesRecord | null>(null);

  const refresh = useCallback(async () => {
    const record = await fetchCommunitiesRecord();
    if (record) {
      setServerCommunities(record);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh, authUser?.sub]);

  useEffect(() => {
    const handler = (event: Event) => {
      const communities = readCommunitiesFromChangedEvent(event);
      if (communities) {
        setServerCommunities(communities);
        return;
      }
      void refresh();
    };
    window.addEventListener(SUBSCRIPTIONS_CHANGED_EVENT, handler);
    return () => window.removeEventListener(SUBSCRIPTIONS_CHANGED_EVENT, handler);
  }, [refresh]);

  return useMemo(() => {
    if (serverCommunities !== null) {
      return buildCommunityMembershipMapFromRecord(serverCommunities);
    }

    const map: Record<string, KpmgCommunityMembershipStatus> = {};
    for (const community of listKnownCommunities()) {
      const id = normalizeCommunityId(community.id);
      const status = getCommunityMembershipStatus(authUser, community.id, community.title);
      if (status !== undefined && status !== false) {
        map[id] = status;
      }
    }

    return map;
  }, [authUser, serverCommunities]);
}
