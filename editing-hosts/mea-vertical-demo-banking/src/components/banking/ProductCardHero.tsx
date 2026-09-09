'use client';

import type { JSX } from 'react';
import { Text, RichText, Image } from '@sitecore-content-sdk/nextjs';
import type { TextField, RichTextField, LinkField, ImageField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';
import { FieldLink } from '@/components/banking/FieldLink';

export interface ProductCardHeroFields {
  Eyebrow?: TextField;
  Title?: TextField;
  Body?: RichTextField;
  PrimaryLink?: LinkField;
  Image?: ImageField;
  CardBrand?: TextField;
  CardTitle?: TextField;
  CardLogo?: TextField;
}

const defaultFields: ProductCardHeroFields = {
  Eyebrow: { value: 'DEB TRAVEL CREDIT CARD' },
  Title: { value: 'Make every journey feel first class.' },
  Body: {
    value:
      '<p>Earn accelerated miles, unlock unlimited lounge visits and enjoy travel protection wherever you go.</p>',
  },
  PrimaryLink: { value: { href: '#', text: 'Check your eligibility' } },
  Image: {
    value: {
      src: '/assets/deb-hero.png',
      alt: 'Sarah overlooking the Dubai skyline at sunrise',
    },
  },
  CardBrand: { value: 'DEB TRAVEL' },
  CardTitle: { value: 'Every journey,<br/>rewarded.' },
  CardLogo: { value: 'VISA' },
};

export type ProductCardHeroProps = ComponentProps & { fields?: ProductCardHeroFields };

function hasImage(field?: ImageField): boolean {
  const v = field?.value;
  if (!v) return false;
  return Boolean(v.src || (v as { mediaid?: string }).mediaid || (v as { mediaId?: string }).mediaId);
}

export const Default = (props: ProductCardHeroProps): JSX.Element => {
  const { params, fields = defaultFields } = props;
  return (
    <section
      className={`page-hero card-hero ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
      data-component={componentKey(props)}
    >
      {hasImage(fields.Image) && fields.Image ? (
        <Image field={fields.Image} className="hero-media" />
      ) : null}
      <div className="page-hero-copy">
        {fields.Eyebrow ? (
          <p className="eyebrow">
            <i className="eyebrow-rule" aria-hidden="true" />
            <Text field={fields.Eyebrow} className="eyebrow-text" />
          </p>
        ) : null}
        {fields.Title ? <Text tag="h1" field={fields.Title} /> : null}
        {fields.Body ? (
          <div className="page-hero-body">
            <RichText field={fields.Body} />
          </div>
        ) : null}
        <FieldLink field={fields.PrimaryLink} className="primary" />
      </div>
      <div className="debit-card">
        {fields.CardBrand ? <Text tag="small" field={fields.CardBrand} /> : null}
        {fields.CardTitle ? <Text tag="strong" field={fields.CardTitle} /> : null}
        {fields.CardLogo ? <Text tag="span" field={fields.CardLogo} /> : null}
      </div>
    </section>
  );
};
