'use client';

import type { JSX } from 'react';
import {
  TextField,
  ImageField,
  LinkField,
  Text,
  Image as SitecoreImage,
  Link as SitecoreLink,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { PEPSICO_CORPORATE } from './pepsico-corporate-tokens';

export interface PepsiCoCorporateNewsArticleCardFields {
  Category: TextField;
  Title: TextField;
  Summary: TextField;
  Image: ImageField;
  Image2: ImageField;
  Image3: ImageField;
  Link: LinkField;
}

const defaultFields: PepsiCoCorporateNewsArticleCardFields = {
  Category: { value: 'Stories' },
  Title: { value: '7 PepsiCo protein products for your day' },
  Summary: {
    value:
      'Short teaser copy for the article card used on the newsroom featured row and latest grid.',
  },
  Image: { value: { src: '', alt: '' } },
  Image2: { value: { src: '', alt: '' } },
  Image3: { value: { src: '', alt: '' } },
  Link: { value: { href: '#', text: 'Read more' } },
};

export type PepsiCoCorporateNewsArticleCardProps = ComponentProps & {
  fields: PepsiCoCorporateNewsArticleCardFields;
};

function collectGalleryImages(fields: PepsiCoCorporateNewsArticleCardFields): ImageField[] {
  return [fields.Image, fields.Image2, fields.Image3].filter((field) =>
    Boolean(field?.value?.src?.trim())
  );
}

function CardImageGallery({ images }: { images: ImageField[] }): JSX.Element {
  const count = images.length;
  const gridClass =
    count >= 3
      ? 'grid grid-cols-3 gap-2 sm:gap-2.5'
      : count === 2
        ? 'grid grid-cols-2 gap-2 sm:gap-2.5'
        : 'grid grid-cols-1';

  return (
    <div className="rounded-2xl bg-white px-3 pt-3 pb-4 sm:rounded-[1.25rem] sm:px-3.5 sm:pt-3.5 sm:pb-5">
      <div className={gridClass}>
        {images.map((field, index) => (
          <div
            key={field?.value?.src ?? index}
            className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-white sm:rounded-2xl"
          >
            <SitecoreImage
              field={field}
              className="flex max-h-full max-w-full items-center justify-center [&_img]:block [&_img]:h-auto [&_img]:max-h-full [&_img]:w-auto [&_img]:max-w-full [&_img]:object-contain [&>span]:flex [&>span]:max-h-full [&>span]:max-w-full [&>span]:items-center [&>span]:justify-center"
              alt={field?.value?.alt ?? ''}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export const Default = (props: PepsiCoCorporateNewsArticleCardProps): JSX.Element => {
  const id = props.params.RenderingIdentifier ?? props.rendering?.uid;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;
  const href = fields.Link?.value?.href?.trim();
  const hasLink = Boolean(href && href !== '#');
  const category = String(fields.Category?.value ?? '').trim();
  const galleryImages = collectGalleryImages(fields);

  const inner = (
    <article
      data-pepsico-news-article-card
      data-news-category={category}
      className={[
        'component pepsico-corporate-news-article-card flex h-full flex-col rounded-[2rem] bg-[#f2f2f2] p-5 text-left sm:p-6',
        styles || '',
      ].join(' ')}
      id={id}
    >
      {galleryImages.length > 0 ? (
        <CardImageGallery images={galleryImages} />
      ) : (
        <div
          className="aspect-square w-full rounded-2xl bg-white sm:rounded-[1.25rem]"
          aria-hidden
        />
      )}

      <div className="mt-5 flex flex-col gap-2 sm:mt-6">
        <Text
          tag="p"
          field={fields.Category}
          className="m-0 text-sm font-semibold sm:text-base"
          style={{ color: PEPSICO_CORPORATE.blue }}
        />
        <Text
          tag="h3"
          field={fields.Title}
          className="m-0 text-xl leading-snug font-bold tracking-tight text-[#1a1a1a] sm:text-2xl"
        />
        <Text tag="p" field={fields.Summary} className="sr-only" />
      </div>
    </article>
  );

  if (hasLink) {
    return (
      <SitecoreLink
        field={fields.Link}
        className="block h-full text-inherit no-underline outline-offset-4 focus-visible:outline-2"
        style={{ outlineColor: PEPSICO_CORPORATE.blue }}
      >
        {inner}
      </SitecoreLink>
    );
  }

  return inner;
};
