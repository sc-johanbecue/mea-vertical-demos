'use client';

import type { JSX } from 'react';
import {
  ImageField,
  LinkField,
  Image as SitecoreImage,
  Link as SitecoreLink,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

export interface PepsiCoImageCarouselSlideFields {
  DesktopImage: ImageField;
  MobileImage: ImageField;
  Link: LinkField;
}

const emptyImage: ImageField = { value: { src: '', alt: '' } };

const defaultFields: PepsiCoImageCarouselSlideFields = {
  DesktopImage: emptyImage,
  MobileImage: emptyImage,
  Link: { value: { href: '', text: '' } },
};

export type PepsiCoImageCarouselSlideProps = ComponentProps & {
  fields: PepsiCoImageCarouselSlideFields;
};

/** Sitecore grid params (e.g. col-6) break carousel slides — strip them here */
function withoutGridColumnStyles(styles?: string) {
  return (styles ?? '')
    .split(/\s+/)
    .filter((cls) => cls && !/^col(-[a-z]+-\d+|-\d+)?$/i.test(cls))
    .join(' ');
}

const imageClass =
  'absolute inset-0 block size-full [&>span]:block [&>span]:size-full [&_img]:size-full [&_img]:object-cover [&_img]:object-center';

export const Default = (props: PepsiCoImageCarouselSlideProps): JSX.Element => {
  const id = props.params.RenderingIdentifier ?? props.rendering?.uid;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;
  const href = fields.Link?.value?.href?.trim();
  const hasLink = Boolean(href && href !== '#');

  const slide = (
    <div
      data-pepsico-carousel-slide
      className={[
        'component pepsico-image-carousel-slide relative w-full min-w-full shrink-0 grow-0 basis-full overflow-hidden',
        withoutGridColumnStyles(styles),
      ].join(' ')}
      id={id}
    >
      <div className="relative aspect-[4/5] w-full md:aspect-[2/1]">
        <SitecoreImage
          field={fields.MobileImage}
          className={`${imageClass} md:hidden`}
          alt={String(fields.MobileImage?.value?.alt ?? fields.DesktopImage?.value?.alt ?? '')}
        />
        <SitecoreImage
          field={fields.DesktopImage}
          className={`${imageClass} hidden md:block`}
          alt={String(fields.DesktopImage?.value?.alt ?? '')}
        />
      </div>
    </div>
  );

  if (hasLink) {
    return (
      <SitecoreLink
        field={fields.Link}
        className="block h-full w-full min-w-full shrink-0 basis-full text-inherit no-underline"
      >
        {slide}
      </SitecoreLink>
    );
  }

  return slide;
};
