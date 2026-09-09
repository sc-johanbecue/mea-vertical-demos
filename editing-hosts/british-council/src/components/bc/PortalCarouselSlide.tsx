'use client';

import type { JSX } from 'react';
import { Image, Link as SitecoreLink, Text } from '@sitecore-content-sdk/nextjs';
import type { ImageField, LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface PortalCarouselSlideFields {
  Title?: TextField;
  Image?: ImageField;
  Link?: LinkField;
}

const defaults: Required<PortalCarouselSlideFields> = {
  Title: { value: 'New Additions' },
  Image: { value: { src: '', alt: '' } },
  Link: { value: { href: '/', text: 'Learn more' } },
};

export type PortalCarouselSlideProps = ComponentProps & { fields?: PortalCarouselSlideFields };

function Layout(props: PortalCarouselSlideProps, extra = ''): JSX.Element {
  const { params } = props;
  const fields = { ...defaults, ...props.fields } as typeof defaults;
  return (
    <article
      key={componentKey(props)}
      className={`bc-portal-slide component ${extra} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <div className="bc-portal-slide__bg">
        <Image field={fields.Image} />
      </div>
      <div className="bc-portal-slide__content">
        <SitecoreLink field={fields.Link}>
          <Text tag="h2" className="bc-portal-slide__title" field={fields.Title} />
        </SitecoreLink>
      </div>
    </article>
  );
}

export const Default = (p: PortalCarouselSlideProps): JSX.Element => Layout(p);
export const Inversed = (p: PortalCarouselSlideProps): JSX.Element => Layout(p, 'component--inversed');
export const Animated = (p: PortalCarouselSlideProps): JSX.Element => Layout(p, 'component--animated');
export const InversedAnimated = (p: PortalCarouselSlideProps): JSX.Element =>
  Layout(p, 'component--inversed component--animated');
