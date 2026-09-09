'use client';

import type { JSX } from 'react';
import { Image, Link as SitecoreLink, RichText, Text } from '@sitecore-content-sdk/nextjs';
import type { ImageField, LinkField, RichTextField, TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';


export interface HeroBannerFields {
  Title: TextField;
  Body: RichTextField;
  PrimaryLink: LinkField;
  Image: ImageField;
  AccentColor: TextField;
}

const defaultFields: HeroBannerFields = {
  Title: { value: 'We connect. We inspire.' },
  Body: { value: '' },
  PrimaryLink: { value: { href: '/', text: 'Watch the video' } },
  Image: { value: { src: '', alt: '' } },
  AccentColor: { value: '#00a9e0' },
};

export type HeroBannerProps = ComponentProps & { fields?: HeroBannerFields };

function Layout(props: HeroBannerProps, extra = ''): JSX.Element {
  const { params, fields = defaultFields } = props;
  const accent = String(fields.AccentColor?.value || '#00a9e0');
  return (
    <section
      key={componentKey(props)}
      className={`bc-hero component ${extra} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
      style={{ ['--bc-accent' as string]: accent }}
    >
      <div className="bc-hero__media">
        <Image field={fields.Image} />
      </div>
      <div className="bc-hero__card">
        <Text tag="h1" className="bc-hero__title" field={fields.Title} />
        <span className="bc-hero__accent" aria-hidden="true" />
        <RichText className="bc-hero__body" field={fields.Body} />
        <SitecoreLink field={fields.PrimaryLink} className="bc-btn bc-btn--primary" />
      </div>
    </section>
  );
}

export const Default = (p: HeroBannerProps): JSX.Element => Layout(p);
export const Inversed = (p: HeroBannerProps): JSX.Element => Layout(p, 'component--inversed');
export const Animated = (p: HeroBannerProps): JSX.Element => Layout(p, 'component--animated');
export const InversedAnimated = (p: HeroBannerProps): JSX.Element =>
  Layout(p, 'component--inversed component--animated');
