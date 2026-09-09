'use client';

import type { JSX } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { Text, TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import type { Auth0CommunitiesRecord, CommunityJoinRequest } from '@/lib/kpmg-auth0-communities';
import { useEditingHydrationProps } from './kpmg-editing-hydration';
import {
  useKpmgBeyondCommunityPageFields,
  useKpmgBeyondCommunityRouteItemId,
} from './kpmg-beyond-community-route-fields';
import {
  COMMUNITIES_CHANGED_EVENT,
  dispatchCommunitiesChanged,
  useKpmgBeyondCommunityMembership,
} from './kpmg-beyond-community-membership';

export interface KpmgBeyondCommunityApplicationsAdminFields {
  Title: TextField;
  EmptyMessage: TextField;
}

const defaultFields: KpmgBeyondCommunityApplicationsAdminFields = {
  Title: { value: 'Pending applications' },
  EmptyMessage: { value: 'No pending applications.' },
};

export type KpmgBeyondCommunityApplicationsAdminProps = ComponentProps & {
  fields?: KpmgBeyondCommunityApplicationsAdminFields;
};

function formatRequestedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const Default = (props: KpmgBeyondCommunityApplicationsAdminProps): JSX.Element => {
  const fields = { ...defaultFields, ...props.fields };
  const communityId = useKpmgBeyondCommunityRouteItemId();
  const pageFields = useKpmgBeyondCommunityPageFields(props);
  const communityTitle = pageFields.Title?.value?.toString();
  const { canReviewApplications } = useKpmgBeyondCommunityMembership(
    communityId ?? undefined,
    communityTitle
  );
  const editingHydration = useEditingHydrationProps();
  const [applications, setApplications] = useState<CommunityJoinRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadApplications = useCallback(async () => {
    if (!communityId) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/kpmg-beyond/communities/applications?communityId=${encodeURIComponent(communityId)}`,
        { cache: 'no-store' }
      );
      const data = (await response.json()) as {
        applications?: CommunityJoinRequest[];
        error?: string;
      };
      if (!response.ok) {
        setApplications([]);
        setError(data.error || `Failed to load applications (${response.status})`);
        return;
      }
      setApplications(data.applications ?? []);
    } catch {
      setApplications([]);
      setError('Failed to load applications.');
    } finally {
      setLoading(false);
    }
  }, [communityId]);

  useEffect(() => {
    if (!canReviewApplications) {
      return;
    }
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) {
        void loadApplications();
      }
    });
    return () => {
      cancelled = true;
    };
  }, [canReviewApplications, loadApplications]);

  useEffect(() => {
    if (!canReviewApplications) {
      return;
    }
    const handler = () => {
      void loadApplications();
    };
    window.addEventListener(COMMUNITIES_CHANGED_EVENT, handler);
    return () => window.removeEventListener(COMMUNITIES_CHANGED_EVENT, handler);
  }, [canReviewApplications, loadApplications]);

  const review = async (userId: string, approve: boolean) => {
    if (!communityId) {
      return;
    }
    const snapshot = applications;
    // Optimistic: treat the review as done in the UI while CM + Auth0 finish and Edge publishes.
    setApplications((current) => current.filter((entry) => entry.userId !== userId));
    setPending(userId);
    setError(null);
    setActionMessage(null);
    try {
      const response = await fetch('/api/kpmg-beyond/communities/applications/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ communityId, userId, approve }),
      });
      const data = (await response.json().catch(() => null)) as {
        error?: string;
        applications?: CommunityJoinRequest[];
        communities?: Auth0CommunitiesRecord;
      } | null;
      if (!response.ok) {
        setApplications(snapshot);
        setError(data?.error || `Review failed (${response.status})`);
        return;
      }
      if (data?.applications) {
        setApplications(data.applications);
      }
      setActionMessage(approve ? 'Application approved.' : 'Application declined.');
      dispatchCommunitiesChanged(data?.communities);
    } catch {
      setApplications(snapshot);
      setError('Review failed. Please try again.');
    } finally {
      setPending(null);
    }
  };

  if (!canReviewApplications) {
    return <></>;
  }

  return (
    <section
      {...editingHydration}
      data-cy="community-applications-admin"
      className="component kpmg-beyond-community-applications w-full px-5 py-8 xl:px-[60px]"
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="w-full max-w-[520px]">
          <Text tag="h2" field={fields.Title} className="mb-4 text-xl font-semibold text-white" />
          {!loading && applications.length > 0 ? (
            <p className="mb-6 text-sm text-white/60">
              {applications.length} pending application{applications.length === 1 ? '' : 's'}
            </p>
          ) : (
            <div className="mb-6" />
          )}
          {error ? <p className="mb-4 text-sm text-red-300">{error}</p> : null}
          {actionMessage ? <p className="mb-4 text-sm text-green-300">{actionMessage}</p> : null}
          {loading ? (
            <p className="text-sm text-white/70">Loading applications…</p>
          ) : applications.length === 0 ? (
            <Text tag="p" field={fields.EmptyMessage} className="text-sm text-white/70" />
          ) : (
            <ul className="space-y-4">
              {applications.map((application) => (
                <li key={application.userId} className="flex items-center justify-between bg-kpmg-card px-4 py-4">
                  <div>
                    <p className="m-0 font-medium text-white">{application.name || application.email}</p>
                    <p className="m-0 text-sm text-white/70">{application.email}</p>
                    <p className="m-0 text-xs text-white/50">
                      Requested {formatRequestedAt(application.requestedAt)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={pending === application.userId}
                      onClick={() => void review(application.userId, true)}
                      className="rounded-full bg-kpmg-purple px-4 py-2 text-xs text-white disabled:opacity-60"
                    >
                      {pending === application.userId ? 'Saving…' : 'Approve'}
                    </button>
                    <button
                      type="button"
                      disabled={pending === application.userId}
                      onClick={() => void review(application.userId, false)}
                      className="rounded-full border border-white/30 px-4 py-2 text-xs text-white disabled:opacity-60"
                    >
                      Decline
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};
