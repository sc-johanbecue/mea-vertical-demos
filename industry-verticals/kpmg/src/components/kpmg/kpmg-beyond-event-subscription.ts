'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import {
  normalizeEventId,
  readSubscribedEventIds,
} from '@/lib/kpmg-auth0-events';
import {
  trackBeyondEventCancellation,
  trackBeyondEventRegistration,
} from '@/lib/cdp/cdp-beyond-event-tracking';

const SUBSCRIPTIONS_CHANGED_EVENT = 'kpmg-beyond-subscriptions-changed';

type SubscriptionsChangedDetail = {
  subscribedEventIds: string[];
};

function normalizeSubscribedEventIds(ids: unknown): string[] {
  if (!Array.isArray(ids)) {
    return [];
  }

  return [...new Set(ids.map((entry) => normalizeEventId(String(entry))).filter(Boolean))];
}

function broadcastSubscriptionChange(subscribedEventIds: string[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<SubscriptionsChangedDetail>(SUBSCRIPTIONS_CHANGED_EVENT, {
      detail: { subscribedEventIds },
    })
  );
}

async function fetchSubscribedEventIds(): Promise<string[]> {
  const response = await fetch('/api/kpmg-beyond/events/subscriptions', {
    cache: 'no-store',
  });

  if (!response.ok) {
    return [];
  }

  const body = (await response.json()) as { subscribedEventIds?: unknown };
  if (!Array.isArray(body.subscribedEventIds)) {
    return [];
  }

  return normalizeSubscribedEventIds(body.subscribedEventIds);
}

export function useKpmgBeyondEventSubscription(eventId: string | undefined, eventName?: string) {
  const { user, isLoading: authLoading, invalidate } = useUser();
  const [pending, setPending] = useState(false);
  const [serverSubscribedIds, setServerSubscribedIds] = useState<string[]>([]);
  const [subscriptionsLoaded, setSubscriptionsLoaded] = useState(false);
  const normalizedId = eventId ? normalizeEventId(eventId) : '';

  useEffect(() => {
    let cancelled = false;

    if (authLoading) {
      return () => {
        cancelled = true;
      };
    }

    if (!user?.sub) {
      setServerSubscribedIds([]);
      setSubscriptionsLoaded(true);
      return () => {
        cancelled = true;
      };
    }

    setSubscriptionsLoaded(false);
    void fetchSubscribedEventIds()
      .then((ids) => {
        if (!cancelled) {
          setServerSubscribedIds(ids);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setSubscriptionsLoaded(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [authLoading, user?.sub]);

  useEffect(() => {
    const onSubscriptionsChanged = (event: Event) => {
      const detail = (event as CustomEvent<SubscriptionsChangedDetail>).detail;
      if (!detail?.subscribedEventIds) {
        return;
      }

      setServerSubscribedIds(normalizeSubscribedEventIds(detail.subscribedEventIds));
      setSubscriptionsLoaded(true);
    };

    window.addEventListener(SUBSCRIPTIONS_CHANGED_EVENT, onSubscriptionsChanged);
    return () => {
      window.removeEventListener(SUBSCRIPTIONS_CHANGED_EVENT, onSubscriptionsChanged);
    };
  }, []);

  const subscribedEventIds = useMemo(() => {
    if (subscriptionsLoaded) {
      return normalizeSubscribedEventIds(serverSubscribedIds);
    }

    return normalizeSubscribedEventIds(readSubscribedEventIds(user));
  }, [serverSubscribedIds, subscriptionsLoaded, user]);

  const subscribed = useMemo(() => {
    if (!normalizedId) {
      return false;
    }

    if (subscriptionsLoaded) {
      return subscribedEventIds.includes(normalizedId);
    }

    return readSubscribedEventIds(user).includes(normalizedId);
  }, [normalizedId, subscribedEventIds, subscriptionsLoaded, user]);

  const isLoading = authLoading || (Boolean(user?.sub) && !subscriptionsLoaded);

  const toggleSubscription = useCallback(async () => {
    if (!normalizedId || pending) {
      return;
    }

    setPending(true);
    const willSubscribe = !subscribed;
    const trimmedEventName = eventName?.trim() ?? '';

    try {
      const response = await fetch('/api/kpmg-beyond/events/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: normalizedId,
          subscribe: willSubscribe,
        }),
      });

      if (!response.ok) {
        return;
      }

      const body = (await response.json()) as { subscribedEventIds?: unknown };
      const refreshedIds = Array.isArray(body.subscribedEventIds)
        ? normalizeSubscribedEventIds(body.subscribedEventIds)
        : await fetchSubscribedEventIds();

      setServerSubscribedIds(refreshedIds);
      setSubscriptionsLoaded(true);
      broadcastSubscriptionChange(refreshedIds);

      if (trimmedEventName) {
        const track = willSubscribe ? trackBeyondEventRegistration : trackBeyondEventCancellation;
        void track({ eventId: normalizedId, eventName: trimmedEventName }).catch((error) => {
          console.debug('[CDP] Beyond event subscription tracking failed:', error);
        });
      }

      void invalidate();
    } finally {
      setPending(false);
    }
  }, [eventName, invalidate, normalizedId, pending, subscribed]);

  return {
    user,
    isLoading,
    subscribed,
    subscribedEventIds,
    pending,
    toggleSubscription,
  };
}
