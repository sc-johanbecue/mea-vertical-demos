'use client';

import type { JSX } from 'react';
import { Text, RichText, Link, Placeholder } from '@sitecore-content-sdk/nextjs';
import type { TextField, RichTextField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, dynamicPlaceholderKey } from '@/lib/component-utils';

export interface PremiumHeroBannerFields {
  Eyebrow?: TextField;
  Title?: TextField;
  Body?: RichTextField;
  PrimaryLink?: LinkField;
  SecondaryLink?: LinkField;
  Image?: TextField;
}

const defaultFields: PremiumHeroBannerFields = {
  Eyebrow: { value: 'Eyebrow' },
  Title: { value: 'Title' },
  Body: { value: '<p>Body</p>' },
  PrimaryLink: { value: { href: '#', text: 'PrimaryLink' } },
  SecondaryLink: { value: { href: '#', text: 'SecondaryLink' } },
  Image: { value: 'Image' },
};

export type PremiumHeroBannerProps = ComponentProps & { fields?: PremiumHeroBannerFields };

export const Default = (props: PremiumHeroBannerProps): JSX.Element => {
  const { params, fields = defaultFields, rendering } = props;
  const heroBenefitsPh = dynamicPlaceholderKey('hero-benefits', params);

  return (
    <div
      key={componentKey(props)}
      className={`deb-premium-hero-banner ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {fields.Eyebrow ? <Text tag="span" field={fields.Eyebrow} className="deb-premium-hero-banner__eyebrow" /> : null}
      {fields.Title ? <Text tag="span" field={fields.Title} className="deb-premium-hero-banner__title" /> : null}
      {fields.Body ? <div className="deb-premium-hero-banner__body"><RichText field={fields.Body} /></div> : null}
      {fields.PrimaryLink ? <Link field={fields.PrimaryLink} className="deb-premium-hero-banner__primary-link" /> : null}
      {fields.SecondaryLink ? <Link field={fields.SecondaryLink} className="deb-premium-hero-banner__secondary-link" /> : null}
      {fields.Image ? <Text tag="span" field={fields.Image} className="deb-premium-hero-banner__image" /> : null}
      <div className="deb-premium-hero-banner__hero-benefits">
        <Placeholder name={heroBenefitsPh} rendering={rendering} />
      </div>
    </div>
  );
};
