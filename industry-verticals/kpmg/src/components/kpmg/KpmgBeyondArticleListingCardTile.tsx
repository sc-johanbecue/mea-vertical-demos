'use client';

import type { JSX } from 'react';
import {
  Image as SitecoreImage,
  Link as SitecoreLink,
  Text,
} from '@sitecore-content-sdk/nextjs';
import type { KpmgBeyondArticleSectionItem } from './kpmg-beyond-articles-section-shared';
import { useEditingHydrationProps } from './kpmg-editing-hydration';

export type KpmgBeyondArticleListingCardTileProps = {
  item: KpmgBeyondArticleSectionItem;
  id?: string;
  className?: string;
  componentKey: string;
};

export function KpmgBeyondArticleListingCardTile({
  item,
  id,
  className,
  componentKey,
}: KpmgBeyondArticleListingCardTileProps): JSX.Element {
  const editingHydration = useEditingHydrationProps();
  const cardFields = item.fields;

  return (
    <SitecoreLink
      key={componentKey}
      {...editingHydration}
      field={cardFields.Link}
      className={[
        'component kpmg-beyond-article-listing-card group block no-underline',
        className || '',
      ].join(' ')}
      id={id}
      data-cy="article-listing-card"
    >
      <article className="flex h-full flex-col overflow-hidden bg-kpmg-card">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-kpmg-elevated">
          <SitecoreImage
            field={cardFields.Image}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
        <div className="flex flex-1 flex-col px-4 py-4">
          <Text
            tag="p"
            field={cardFields.CategoryLabel}
            className="m-0 text-xs font-semibold uppercase tracking-wide text-kpmg-label"
            data-cy="article-listing-category"
          />
          <Text
            tag="p"
            field={cardFields.DateLabel}
            className="mt-2 text-sm text-white/80"
            data-cy="article-listing-date"
          />
          <Text
            tag="h3"
            field={cardFields.ArticleTitle}
            className="mt-2 line-clamp-3 text-base font-semibold leading-6 text-white group-hover:underline xl:text-lg"
            data-cy="article-listing-title"
          />
        </div>
      </article>
    </SitecoreLink>
  );
}
