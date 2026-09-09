'use client';

import type { JSX } from 'react';
import { Image, Link as SitecoreLink, Text } from '@sitecore-content-sdk/nextjs';
import type { ImageField, LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';


export interface VerticalTeaserCardFields {
  Image: ImageField;
  Eyebrow: TextField;
  Title: TextField;
  Body: TextField;
  Link: LinkField;
}

const defaultFields: VerticalTeaserCardFields = {
  Image: { value: { src: '', alt: '' } },
  Eyebrow: { value: '' },
  Title: { value: 'Card title' },
  Body: { value: '' },
  Link: { value: { href: '/', text: 'Read more' } },
};

export type VerticalTeaserCardProps = ComponentProps & { fields?: VerticalTeaserCardFields };

function Layout(props: VerticalTeaserCardProps, extra = ''): JSX.Element {
  const { params, fields = defaultFields } = props;
  return (
    <article
      key={componentKey(props)}
      className={`bc-teaser-card component ${extra} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <SitecoreLink field={fields.Link} className="bc-teaser-card__media">
        <Image field={fields.Image} />
      </SitecoreLink>
      <div className="bc-teaser-card__body">
        <Text tag="p" className="bc-teaser-card__eyebrow" field={fields.Eyebrow} />
        <SitecoreLink field={fields.Link}>
          <Text tag="h3" className="bc-teaser-card__title" field={fields.Title} />
        </SitecoreLink>
        <Text tag="p" className="bc-teaser-card__text" field={fields.Body} />
      </div>
    </article>
  );
}

export const Default = (p: VerticalTeaserCardProps): JSX.Element => Layout(p);
export const Inversed = (p: VerticalTeaserCardProps): JSX.Element => Layout(p, 'component--inversed');
export const Animated = (p: VerticalTeaserCardProps): JSX.Element => Layout(p, 'component--animated');
export const InversedAnimated = (p: VerticalTeaserCardProps): JSX.Element =>
  Layout(p, 'component--inversed component--animated');
