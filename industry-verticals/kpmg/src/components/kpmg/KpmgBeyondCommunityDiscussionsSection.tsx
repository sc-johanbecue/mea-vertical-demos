'use client';

import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RichText, Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import {
  normalizeSitecoreContentUrl,
  type DiscussionListItem,
} from '@/lib/kpmg-beyond/fetch-community-content';
import { useEditingHydrationProps } from './kpmg-editing-hydration';
import {
  useKpmgBeyondCommunityRouteItemId,
} from './kpmg-beyond-community-route-fields';
import { useKpmgBeyondCommunityMembership } from './kpmg-beyond-community-membership';

export type KpmgBeyondCommunityDiscussionsSectionProps = ComponentProps & {
  fields?: { NewDiscussionLabel?: { value?: string }; ViewAllLabel?: { value?: string } };
};

function DiscussionCard({
  discussion,
  communityId,
}: {
  discussion: DiscussionListItem;
  communityId: string;
}): JSX.Element {
  const baseHref = normalizeSitecoreContentUrl(discussion.url) ?? '#';
  const href =
    baseHref === '#'
      ? baseHref
      : `${baseHref}${baseHref.includes('?') ? '&' : '?'}communityId=${encodeURIComponent(communityId)}`;
  return (
    <article className="flex h-full flex-col bg-kpmg-card p-5">
      <p className="m-0 text-xs text-white/60">
        {discussion.fields.AuthorName?.value?.toString()} • {discussion.fields.AuthorCompany?.value?.toString()} •{' '}
        {discussion.fields.PublishedDate?.value?.toString()}
      </p>
      <Text tag="h3" field={discussion.fields.Title} className="mt-3 text-lg font-semibold text-white" />
      <RichText field={discussion.fields.Body} className="mt-2 line-clamp-4 text-sm text-white/80" />
      <div className="mt-auto flex items-center gap-4 pt-4 text-sm text-white/70">
        <span>♥ {discussion.fields.LikeCount?.value?.toString() || '0'}</span>
        <span>💬 {discussion.fields.CommentCount?.value?.toString() || '0'}</span>
        <span>👁 {discussion.fields.ViewCount?.value?.toString() || '0'}</span>
      </div>
      <Link href={href} className="mt-4 text-sm text-kpmg-purple underline">
        View Discussion
      </Link>
    </article>
  );
}

export const Default = (props: KpmgBeyondCommunityDiscussionsSectionProps): JSX.Element => {
  const communityId = useKpmgBeyondCommunityRouteItemId();
  const { page } = useSitecore();
  const routeTitle = (
    page.layout?.sitecore?.route?.fields as { Title?: { value?: string } } | undefined
  )?.Title?.value?.toString();
  const { joined } = useKpmgBeyondCommunityMembership(communityId ?? undefined, routeTitle);
  const editingHydration = useEditingHydrationProps();
  const [discussions, setDiscussions] = useState<DiscussionListItem[]>([]);

  useEffect(() => {
    if (!communityId || !joined) {
      setDiscussions([]);
      return;
    }
    let cancelled = false;
    fetch(`/api/kpmg-beyond/communities/discussions?communityId=${encodeURIComponent(communityId)}`)
      .then(async (response) => {
        const data = (await response.json()) as { discussions?: DiscussionListItem[] };
        if (!cancelled) {
          setDiscussions(data.discussions ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDiscussions([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [communityId, joined]);

  if (!joined) {
    return <></>;
  }

  return (
    <section
      {...editingHydration}
      data-cy="community-discussions"
      className="component kpmg-beyond-community-discussions w-full px-5 py-8 xl:px-[60px]"
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="m-0 text-xl font-semibold text-white">Discussions</h2>
          <button type="button" className="text-sm text-kpmg-purple">
            + {props.fields?.NewDiscussionLabel?.value?.toString() || 'New discussion'}
          </button>
        </div>
        {discussions.length === 0 ? (
          <p className="text-sm text-white/70">No discussions yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {discussions.slice(0, 2).map((discussion) => (
              <DiscussionCard key={discussion.id} discussion={discussion} communityId={communityId!} />
            ))}
          </div>
        )}
        {discussions.length > 2 ? (
          <div className="mt-8 text-center">
            <button type="button" className="rounded-full border border-white/30 px-6 py-2 text-sm text-white">
              {props.fields?.ViewAllLabel?.value?.toString() || 'View all'}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
};
