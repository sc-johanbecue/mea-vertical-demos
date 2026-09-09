'use client';

import type { JSX } from 'react';
import { Image, Link as SitecoreLink, Text } from '@sitecore-content-sdk/nextjs';
import type { ImageField, LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';


export interface PromoTeaserCardFields {
  Image: ImageField;
  Title: TextField;
  Link: LinkField;
}

const defaultFields: PromoTeaserCardFields = {
  Image: { value: { src: '', alt: '' } },
  Title: { value: 'Promo title' },
  Link: { value: { href: '/', text: 'Learn more' } },
};

export type PromoTeaserCardProps = ComponentProps & { fields?: PromoTeaserCardFields };

function Layout(props: PromoTeaserCardProps, extra = ''): JSX.Element {
  const { params, fields = defaultFields } = props;
  return (
    <article
      key={componentKey(props)}
      className={`bc-promo-card component ${extra} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <SitecoreLink field={fields.Link} className="bc-promo-card__link">
        <Image field={fields.Image} />
        <Text tag="h2" className="bc-promo-card__title" field={fields.Title} />
      </SitecoreLink>
    </article>
  );
}

export const Default = (p: PromoTeaserCardProps): JSX.Element => Layout(p);
export const Inversed = (p: PromoTeaserCardProps): JSX.Element => Layout(p, 'component--inversed');
export const Animated = (p: PromoTeaserCardProps): JSX.Element => Layout(p, 'component--animated');
export const InversedAnimated = (p: PromoTeaserCardProps): JSX.Element =>
  Layout(p, 'component--inversed component--animated');
