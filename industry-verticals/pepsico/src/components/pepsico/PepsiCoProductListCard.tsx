'use client';

import type { JSX } from 'react';
import { Text, Image as SitecoreImage, Link as SitecoreLink } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import {
  defaultPepsiCoProductFields,
  PEPSICO_BRAND_RED,
  type PepsiCoProductFields,
} from '@/lib/pepsico-product-fields';

export type PepsiCoProductListCardFields = Pick<
  PepsiCoProductFields,
  'Image' | 'Category' | 'Title' | 'Cta'
>;

const defaultFields: PepsiCoProductListCardFields = {
  Image: defaultPepsiCoProductFields.Image,
  Category: { value: '' },
  Title: { value: 'WALKERS CRISPS' },
  Cta: defaultPepsiCoProductFields.Cta,
};

export type PepsiCoProductListCardProps = ComponentProps & {
  fields: PepsiCoProductListCardFields;
};

const BRAND_RED = PEPSICO_BRAND_RED;

/** Sitecore grid params (e.g. col-12) break horizontal product rows — strip them here */
function withoutGridColumnStyles(styles?: string) {
  return (styles ?? '')
    .split(/\s+/)
    .filter((cls) => cls && !/^col(-[a-z]+-\d+|-\d+)?$/i.test(cls))
    .join(' ');
}

export const Default = (props: PepsiCoProductListCardProps): JSX.Element => {
  const id = props.params.RenderingIdentifier ?? props.rendering?.uid;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;
  const hasImage = Boolean(fields.Image?.value?.src?.trim());
  const hasCategory = Boolean(fields.Category?.value?.toString().trim());
  const ctaText = fields.Cta?.value?.text?.trim() || 'View all';

  return (
    <article
      data-pepsico-product-list-card
      className={[
        'component pepsico-product-list-card col-auto mx-auto flex w-full max-w-[280px] shrink-0 flex-col items-center px-3 text-center sm:px-4',
        withoutGridColumnStyles(styles),
      ].join(' ')}
      id={id}
    >
      <div className="mb-5 flex w-full max-w-[220px] items-end justify-center sm:max-w-[260px] md:mb-6 md:max-w-[280px]">
        {hasImage ? (
          <SitecoreImage
            field={fields.Image}
            className="h-auto max-h-[min(52vw,18rem)] w-full object-contain drop-shadow-md md:max-h-[20rem]"
            alt={fields.Image?.value?.alt ?? ''}
          />
        ) : (
          <div
            className="aspect-[3/4] w-full max-w-[220px] rounded-lg bg-black/5 md:max-w-[280px]"
            aria-hidden
          />
        )}
      </div>

      <div className="mb-4 md:mb-5">
        {hasCategory ? (
          <Text
            tag="p"
            field={fields.Category}
            className="m-0 mb-1 text-sm font-extrabold tracking-wide uppercase antialiased sm:text-base"
            style={{ color: BRAND_RED }}
          />
        ) : null}
        <Text
          tag="h3"
          field={fields.Title}
          className="m-0 text-lg font-extrabold tracking-wide uppercase antialiased sm:text-xl md:text-[1.35rem]"
          style={{ color: BRAND_RED }}
        />
      </div>

      <SitecoreLink
        field={fields.Cta}
        className="inline-flex min-w-[9.5rem] items-center justify-center bg-[var(--pepsico-brand-red,#e31e24)] px-8 py-2.5 text-sm font-bold tracking-wide text-white uppercase no-underline transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pepsico-brand-red,#e31e24)]"
        style={{ backgroundColor: BRAND_RED }}
      >
        {ctaText}
      </SitecoreLink>
    </article>
  );
};
