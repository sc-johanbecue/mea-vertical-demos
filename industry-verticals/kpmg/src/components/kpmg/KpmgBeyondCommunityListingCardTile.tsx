'use client';

import type { JSX } from 'react';
import Link from 'next/link';
import {
  Image as SitecoreImage,
  Link as SitecoreLink,
  Text,
} from '@sitecore-content-sdk/nextjs';
import {
  getCommunityListingStatusDisplay,
  type KpmgBeyondCommunitySectionItem,
} from './kpmg-beyond-communities-explore-section-shared';
import type { KpmgCommunityMembershipStatus } from '@/lib/kpmg-auth0-communities';
import { useEditingHydrationProps } from './kpmg-editing-hydration';

export type KpmgBeyondCommunityListingCardTileProps = {
  item: KpmgBeyondCommunitySectionItem;
  membershipStatus?: KpmgCommunityMembershipStatus;
  id?: string;
  className?: string;
  componentKey: string;
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
    return `/communities/${encodeURIComponent(title)}`;
  }
  return '/communities';
}

export function KpmgBeyondCommunityListingCardTile({
  item,
  membershipStatus,
  id,
  className,
  componentKey,
}: KpmgBeyondCommunityListingCardTileProps): JSX.Element {
  const editingHydration = useEditingHydrationProps();
  const fields = item.fields;
  const statusDisplay = getCommunityListingStatusDisplay(fields, membershipStatus);
  const linkHref = fields.Link?.value?.href?.toString().trim();
  const hasSitecoreLink = Boolean(linkHref && linkHref !== '#');

  const cardContent = (
    <article className="group flex flex-col overflow-hidden bg-[#1a1233] sm:flex-row sm:items-stretch">
      <div className="flex flex-col justify-center px-6 py-7 sm:w-[58%] sm:max-w-[58%] xl:px-8 xl:py-8">
        <p className="m-0 text-xs font-semibold uppercase tracking-wide xl:text-sm">
          <span className="text-kpmg-label">{statusDisplay.primary}</span>
          <span className="text-white/50"> • </span>
          <span className="text-white/70">{statusDisplay.secondary}</span>
        </p>
        <Text
          tag="h3"
          field={fields.Title}
          className="mt-3 text-lg font-semibold leading-7 text-white group-hover:underline xl:text-[22px] xl:leading-8"
        />
        <Text
          tag="p"
          field={fields.Summary}
          className="mt-3 line-clamp-3 text-sm leading-6 text-white/75 xl:text-base xl:leading-7"
        />
      </div>
      <div className="relative w-full shrink-0 sm:w-[42%] sm:max-w-[42%]">
        <div className="relative aspect-[4/3] w-full sm:aspect-auto sm:h-full sm:min-h-[220px]">
          <SitecoreImage field={fields.Image} className="h-full w-full object-cover object-center" />
          <span
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#1a1233] via-[#1a1233]/55 to-transparent sm:from-[#1a1233] sm:via-[#1a1233]/35 sm:to-transparent"
            aria-hidden
          />
        </div>
      </div>
    </article>
  );

  const wrapperClass = [
    'component kpmg-beyond-community-listing-card mb-4 block w-full max-w-[1200px] no-underline last:mb-0',
    className || '',
  ].join(' ');

  if (hasSitecoreLink) {
    return (
      <SitecoreLink
        key={componentKey}
        {...editingHydration}
        field={fields.Link}
        className={wrapperClass}
        id={id}
        data-cy="community-listing-card"
      >
        {cardContent}
      </SitecoreLink>
    );
  }

  return (
    <Link
      key={componentKey}
      {...editingHydration}
      href={resolveCommunityHref(item)}
      className={wrapperClass}
      id={id}
      data-cy="community-listing-card"
    >
      {cardContent}
    </Link>
  );
}
