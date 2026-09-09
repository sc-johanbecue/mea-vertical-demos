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

export interface PepsiCoCorporateStoryCardFields {
  Category: TextField;
  Title: TextField;
  Date: TextField;
  Image: ImageField;
  Link: LinkField;
}

const defaultFields: PepsiCoCorporateStoryCardFields = {
  Category: { value: 'Stories' },
  Title: {
    value:
      'Tostitos® enters the refrigerated aisle with new guacamole, marking next chapter in brand evolution',
  },
  Date: { value: 'May 2024' },
  Image: { value: { src: '', alt: '' } },
  Link: { value: { href: '#', text: 'Read more' } },
};

export type PepsiCoCorporateStoryCardProps = ComponentProps & {
  fields: PepsiCoCorporateStoryCardFields;
};

export const Default = (props: PepsiCoCorporateStoryCardProps): JSX.Element => {
  const id = props.params.RenderingIdentifier ?? props.rendering?.uid;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;
  const href = fields.Link?.value?.href?.trim();
  const hasLink = Boolean(href && href !== '#');

  const inner = (
    <article
      data-pepsico-story-card
      className={[
        'component pepsico-corporate-story-card flex h-full min-w-[min(85vw,20rem)] shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-white/10 text-left text-white backdrop-blur-sm md:min-w-[min(42vw,22rem)] lg:min-w-[min(32%,24rem)]',
        styles || '',
      ].join(' ')}
      id={id}
    >
      <div className="relative aspect-4/3 w-full overflow-hidden">
        <SitecoreImage
          field={fields.Image}
          className="h-full w-full object-cover"
          alt={fields.Image?.value?.alt ?? ''}
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 px-5 py-5 md:px-6 md:py-6">
        <Text
          tag="p"
          field={fields.Category}
          className="m-0 text-xs font-bold tracking-widest text-white/75 uppercase"
        />
        <Text
          tag="h3"
          field={fields.Title}
          className="m-0 text-lg leading-snug font-bold tracking-tight md:text-xl"
        />
        <Text tag="p" field={fields.Date} className="m-0 mt-auto text-sm text-white/70" />
      </div>
    </article>
  );

  if (hasLink) {
    return (
      <SitecoreLink
        field={fields.Link}
        className="block h-full text-inherit no-underline outline-offset-4 focus-visible:outline-2 focus-visible:outline-white/80"
      >
        {inner}
      </SitecoreLink>
    );
  }

  return inner;
};
