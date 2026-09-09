'use client';

import type { JSX } from 'react';
import { Text, RichText, Image, Link } from '@sitecore-content-sdk/nextjs';
import type { TextField, RichTextField, LinkField, ImageField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface ProductCardHeroFields {
  Eyebrow?: TextField;
  Title?: TextField;
  Body?: RichTextField;
  PrimaryLink?: LinkField;
  Image?: TextField;
  CardBrand?: TextField;
  CardTitle?: TextField;
  CardLogo?: ImageField;
}

const defaultFields: ProductCardHeroFields = {
  Eyebrow: { value: 'Eyebrow' },
  Title: { value: 'Title' },
  Body: { value: '<p>Body</p>' },
  PrimaryLink: { value: { href: '#', text: 'PrimaryLink' } },
  Image: { value: 'Image' },
  CardBrand: { value: 'CardBrand' },
  CardTitle: { value: 'CardTitle' },
  CardLogo: { value: { src: '', alt: 'CardLogo' } },
};

export type ProductCardHeroProps = ComponentProps & { fields?: ProductCardHeroFields };

export const Default = (props: ProductCardHeroProps): JSX.Element => {
  const { params, fields = defaultFields } = props;


  return (
    <div
      key={componentKey(props)}
      className={`deb-product-card-hero ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {fields.Eyebrow ? <Text tag="span" field={fields.Eyebrow} className="deb-product-card-hero__eyebrow" /> : null}
      {fields.Title ? <Text tag="span" field={fields.Title} className="deb-product-card-hero__title" /> : null}
      {fields.Body ? <div className="deb-product-card-hero__body"><RichText field={fields.Body} /></div> : null}
      {fields.PrimaryLink ? <Link field={fields.PrimaryLink} className="deb-product-card-hero__primary-link" /> : null}
      {fields.Image ? <Text tag="span" field={fields.Image} className="deb-product-card-hero__image" /> : null}
      {fields.CardBrand ? <Text tag="span" field={fields.CardBrand} className="deb-product-card-hero__card-brand" /> : null}
      {fields.CardTitle ? <Text tag="span" field={fields.CardTitle} className="deb-product-card-hero__card-title" /> : null}
      {fields.CardLogo?.value?.src ? <Image field={fields.CardLogo} className="deb-product-card-hero__card-logo" /> : null}

    </div>
  );
};
