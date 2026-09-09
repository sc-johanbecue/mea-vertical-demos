'use client';

import type { JSX } from 'react';
import { Link as SitecoreLink, Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { useEditingHydrationProps } from './kpmg-editing-hydration';
import { useKpmgBeyondArticlePageFields } from './kpmg-beyond-article-route-fields';

export type KpmgBeyondArticleCtaProps = ComponentProps;

export const Default = (props: KpmgBeyondArticleCtaProps): JSX.Element | null => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = useKpmgBeyondArticlePageFields(props);
  const editingHydration = useEditingHydrationProps();
  const ctaText = fields.CtaText?.value?.toString().trim();
  const ctaHref = fields.CtaLink?.value?.href?.trim();

  if (!ctaText && !ctaHref) {
    return null;
  }

  return (
    <section
      key={id ?? props.rendering?.uid}
      {...editingHydration}
      id={id}
      data-cy="article-cta"
      className={[
        'component kpmg-beyond-article-cta mx-auto w-full max-w-[860px] px-5 xl:px-[60px]',
        styles || '',
      ].join(' ')}
    >
      <div className="flex flex-col items-start justify-between gap-4 border border-white/20 px-5 py-6 sm:flex-row sm:items-center">
        <Text
          tag="p"
          field={fields.CtaText}
          className="m-0 max-w-[640px] text-base leading-6 text-white"
        />
        <SitecoreLink
          field={fields.CtaLink}
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-kpmg-purple px-8 py-3 text-sm font-semibold text-white no-underline hover:opacity-90"
        />
      </div>
    </section>
  );
};
