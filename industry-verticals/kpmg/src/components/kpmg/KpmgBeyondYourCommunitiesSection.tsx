'use client';

import type { JSX } from 'react';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Image as SitecoreImage, Placeholder, Text, TextField } from '@sitecore-content-sdk/nextjs';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import {
  normalizeSitecoreContentUrl,
  type DiscussionListItem,
} from '@/lib/kpmg-beyond/fetch-community-content';
import { normalizeCommunityId, type KpmgCommunityMembershipStatus } from '@/lib/kpmg-auth0-communities';
import { useEditingHydrationProps } from './kpmg-editing-hydration';
import {
  useKpmgBeyondCommunityMembershipMap,
  useKpmgBeyondJoinedCommunityIds,
} from './kpmg-beyond-community-membership';
import {
  getYourCommunityMembershipStatusLabel,
  isTrackedYourCommunityMembership,
  type KpmgBeyondCommunitySectionItem,
} from './kpmg-beyond-communities-explore-section-shared';
import { KPMG_BEYOND_HOME_COMMUNITIES_FOLDER_ID } from './KpmgBeyondCommunitiesExploreSection';

export interface KpmgBeyondYourCommunitiesSectionFields {
  Title: TextField;
  ExploreLabel: TextField;
  ExploreLink: TextField;
  EmptyMessage: TextField;
}

const defaultFields: KpmgBeyondYourCommunitiesSectionFields = {
  Title: { value: 'Your communities' },
  ExploreLabel: { value: 'Explore Communities' },
  ExploreLink: { value: '/communities' },
  EmptyMessage: { value: 'You have not joined any communities yet.' },
};

export type KpmgBeyondYourCommunitiesSectionProps = ComponentProps & {
  fields: KpmgBeyondYourCommunitiesSectionFields;
};

function resolveCommunityHref(item: KpmgBeyondCommunitySectionItem): string {
  const linkHref = item.fields.Link?.value?.href?.toString().trim();
  if (linkHref && linkHref !== '#') {
    return linkHref;
  }
  if (item.url) {
    return item.url;
  }
  const title = item.fields.Title?.value?.toString().trim();
  if (title) {
    return `/communities/${encodeURIComponent(title.replace(/\s+/g, '-'))}`;
  }
  return '/communities';
}

function membershipSortRank(status: KpmgCommunityMembershipStatus | undefined): number {
  if (status === 'owner') {
    return 0;
  }
  if (status === true) {
    return 1;
  }
  if (status === 'requested') {
    return 2;
  }
  return 3;
}

function YourCommunityTile({
  item,
  statusLabel,
}: {
  item: KpmgBeyondCommunitySectionItem;
  statusLabel: string;
}): JSX.Element {
  const title = item.fields.Title?.value?.toString() || 'Community';
  const imageSrc = item.fields.Image?.value?.src?.toString().trim();

  return (
    <Link
      href={resolveCommunityHref(item)}
      className="flex w-[88px] flex-col items-center gap-2 text-center text-sm text-white no-underline sm:w-24"
      data-cy="your-community-tile"
    >
      <span className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-kpmg-card">
        {imageSrc ? (
          <SitecoreImage field={item.fields.Image} className="h-full w-full object-cover" />
        ) : (
          <span className="text-lg font-semibold text-white/80">{title.charAt(0)}</span>
        )}
      </span>
      <span className="line-clamp-2 max-w-full text-sm leading-5 text-white">{title}</span>
      <span className="text-[11px] font-semibold uppercase tracking-wide text-kpmg-label">{statusLabel}</span>
    </Link>
  );
}

export const Default = (props: KpmgBeyondYourCommunitiesSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = { ...defaultFields, ...props.rendering?.fields, ...props.fields };
  const editingHydration = useEditingHydrationProps();
  const ph = `kpmg-beyond-communities-${DynamicPlaceholderId ?? '1'}`;
  const { page } = useSitecore();
  const isEditing = Boolean(page.mode?.isEditing);
  const language = page.locale || 'en';
  const joinedIds = useKpmgBeyondJoinedCommunityIds();
  const membershipByCommunityId = useKpmgBeyondCommunityMembershipMap();
  const [communityItems, setCommunityItems] = useState<KpmgBeyondCommunitySectionItem[]>([]);
  const [recentDiscussions, setRecentDiscussions] = useState<
    Array<DiscussionListItem & { communityId: string }>
  >([]);

  useEffect(() => {
    if (isEditing) {
      return;
    }
    let cancelled = false;
    fetch(
      `/api/kpmg-beyond/communities/list?language=${encodeURIComponent(language)}&folderId=${encodeURIComponent(KPMG_BEYOND_HOME_COMMUNITIES_FOLDER_ID)}`
    )
      .then(async (response) => {
        const data = (await response.json()) as { items?: KpmgBeyondCommunitySectionItem[] };
        if (!cancelled) {
          setCommunityItems(data.items ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCommunityItems([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [isEditing, language]);

  const yourCommunities = useMemo(() => {
    return communityItems
      .map((item) => {
        const membership = membershipByCommunityId[normalizeCommunityId(item.id)];
        const statusLabel = getYourCommunityMembershipStatusLabel(membership);
        if (!isTrackedYourCommunityMembership(membership) || !statusLabel) {
          return null;
        }
        return { item, membership, statusLabel };
      })
      .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
      .sort((a, b) => {
        const rank = membershipSortRank(a.membership) - membershipSortRank(b.membership);
        if (rank !== 0) {
          return rank;
        }
        const titleA = a.item.fields.Title?.value?.toString() || '';
        const titleB = b.item.fields.Title?.value?.toString() || '';
        return titleA.localeCompare(titleB);
      });
  }, [communityItems, membershipByCommunityId]);

  useEffect(() => {
    if (!joinedIds.length) {
      setRecentDiscussions([]);
      return;
    }
    const params = new URLSearchParams({ communityIds: joinedIds.join(',') });
    fetch(`/api/kpmg-beyond/communities/recent-discussions?${params.toString()}`)
      .then(async (response) => {
        const data = (await response.json()) as {
          discussions?: Array<DiscussionListItem & { communityId: string }>;
        };
        setRecentDiscussions(data.discussions ?? []);
      })
      .catch(() => setRecentDiscussions([]));
  }, [joinedIds]);

  const exploreHref = fields.ExploreLink?.value?.toString() || '/communities';
  const exploreLabel = fields.ExploreLabel?.value?.toString() || 'Explore Communities';

  return (
    <section
      key={id ?? props.rendering?.uid}
      {...editingHydration}
      id={id}
      data-cy="your-communities-section"
      className={[
        'component kpmg-beyond-your-communities px-4 text-white xl:px-4',
        styles || '',
      ].join(' ')}
    >
      <Text tag="h2" field={fields.Title} className="m-0 text-xl font-semibold text-white xl:text-[28px]" />

      <div className="mt-4 flex flex-wrap gap-4 xl:gap-6">
        <Link
          href={exploreHref}
          className="flex w-[88px] flex-col items-center gap-2 text-center text-sm text-white no-underline sm:w-24"
          data-cy="explore-communities-tile"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-kpmg-purple text-2xl font-light text-white">
            +
          </span>
          <span className="line-clamp-2 max-w-full text-sm leading-5 text-white">{exploreLabel}</span>
        </Link>

        {isEditing ? (
          <Placeholder name={ph} rendering={props.rendering} />
        ) : (
          yourCommunities.map(({ item, statusLabel }) => (
            <YourCommunityTile key={item.id} item={item} statusLabel={statusLabel} />
          ))
        )}
      </div>

      {!isEditing && yourCommunities.length === 0 ? (
        <Text tag="p" field={fields.EmptyMessage} className="mt-4 text-sm text-white/70" />
      ) : null}

      {recentDiscussions.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {recentDiscussions.map((discussion) => (
            <article key={discussion.id} className="bg-kpmg-card p-5">
              <p className="m-0 text-xs text-white/60">{discussion.fields.PublishedDate?.value?.toString()}</p>
              <h3 className="mt-2 text-lg font-semibold text-white">
                {discussion.fields.Title?.value?.toString()}
              </h3>
              <p className="mt-2 line-clamp-3 text-sm text-white/80">
                {discussion.fields.Body?.value?.toString().replace(/<[^>]+>/g, '')}
              </p>
              <div className="mt-4 flex gap-4 text-sm text-white/70">
                <span>♥ {discussion.fields.LikeCount?.value?.toString() || '0'}</span>
                <span>💬 {discussion.fields.CommentCount?.value?.toString() || '0'}</span>
                <span>👁 {discussion.fields.ViewCount?.value?.toString() || '0'}</span>
              </div>
              <Link
                href={normalizeSitecoreContentUrl(discussion.url) ?? '#'}
                className="mt-3 inline-block text-sm text-kpmg-purple underline"
              >
                View Discussion
              </Link>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
};
