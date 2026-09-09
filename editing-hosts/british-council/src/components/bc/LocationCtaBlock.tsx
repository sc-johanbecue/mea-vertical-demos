'use client';

import type { JSX } from 'react';
import { Link as SitecoreLink, Text } from '@sitecore-content-sdk/nextjs';
import type { LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';


export interface LocationCtaBlockFields {
  Title: TextField;
  PrimaryLink: LinkField;
  SecondaryLink: LinkField;
}

const defaultFields: LocationCtaBlockFields = {
  Title: { value: 'We think you are in Belgium' },
  PrimaryLink: { value: { href: '/', text: 'Visit our Belgium website' } },
  SecondaryLink: { value: { href: '/', text: 'Not in Belgium?' } },
};

export type LocationCtaBlockProps = ComponentProps & { fields?: LocationCtaBlockFields };

function Layout(props: LocationCtaBlockProps, extra = ''): JSX.Element {
  const { params, fields = defaultFields } = props;
  return (
    <section
      key={componentKey(props)}
      className={`bc-location-cta component ${extra} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <div className="bc-location-cta__card">
        <Text tag="h2" className="bc-location-cta__title" field={fields.Title} />
        <SitecoreLink field={fields.PrimaryLink} className="bc-btn bc-btn--light" />
        <SitecoreLink field={fields.SecondaryLink} className="bc-location-cta__secondary" />
      </div>
    </section>
  );
}

export const Default = (p: LocationCtaBlockProps): JSX.Element => Layout(p);
export const Inversed = (p: LocationCtaBlockProps): JSX.Element => Layout(p, 'component--inversed');
export const Animated = (p: LocationCtaBlockProps): JSX.Element => Layout(p, 'component--animated');
export const InversedAnimated = (p: LocationCtaBlockProps): JSX.Element =>
  Layout(p, 'component--inversed component--animated');
