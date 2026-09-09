'use client';

import type { JSX } from 'react';
import {
  TextField,
  ImageField,
  LinkField,
  Image as SitecoreImage,
  Link as SitecoreLink,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { normalizeTabKey } from './pepsico-corporate-utils';

export interface PepsiCoCorporateBrandSlideFields {
  ProductImage: ImageField;
  BrandLogo: ImageField;
  /** food | drink | nutrition | all */
  Category: TextField;
  Link: LinkField;
}

const defaultFields: PepsiCoCorporateBrandSlideFields = {
  ProductImage: { value: { src: '', alt: 'Product' } },
  BrandLogo: { value: { src: '', alt: 'Brand' } },
  Category: { value: 'food' },
  Link: { value: { href: '#', text: '' } },
};

export type PepsiCoCorporateBrandSlideProps = ComponentProps & {
  fields: PepsiCoCorporateBrandSlideFields;
};

export const Default = (props: PepsiCoCorporateBrandSlideProps): JSX.Element => {
  const id = props.params.RenderingIdentifier ?? props.rendering?.uid;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;
  const category = normalizeTabKey(String(fields.Category?.value ?? 'food'));
  const href = fields.Link?.value?.href?.trim();
  const hasLink = Boolean(href && href !== '#');

  const card = (
    <article
      data-pepsico-brand-slide
      data-category={category}
      className={[
        'component pepsico-corporate-brand-slide flex shrink-0 flex-col items-center justify-end px-4 transition-opacity duration-300 md:px-8',
        'opacity-40 [&[data-active=true]]:opacity-100',
        styles || '',
      ].join(' ')}
      id={id}
    >
      <div className="relative flex w-[min(72vw,14rem)] flex-col items-center md:w-[min(22rem,20vw)]">
        <SitecoreImage
          field={fields.BrandLogo}
          className="mb-4 h-8 w-auto max-w-[5rem] object-contain opacity-70 md:h-10"
          alt={fields.BrandLogo?.value?.alt ?? ''}
        />
        <SitecoreImage
          field={fields.ProductImage}
          className="h-auto w-full max-w-[min(72vw,14rem)] object-contain drop-shadow-lg md:max-w-[18rem]"
          alt={fields.ProductImage?.value?.alt ?? ''}
        />
      </div>
    </article>
  );

  if (hasLink) {
    return (
      <SitecoreLink field={fields.Link} className="text-inherit no-underline">
        {card}
      </SitecoreLink>
    );
  }

  return card;
};
