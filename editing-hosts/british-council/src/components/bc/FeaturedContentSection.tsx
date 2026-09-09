'use client';

import type { JSX } from 'react';
import { Image, Link as SitecoreLink, Placeholder, Text } from '@sitecore-content-sdk/nextjs';
import type { ImageField, LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';


export interface FeaturedContentSectionFields {
  Title: TextField;
  Intro: TextField;
  ExploreLink: LinkField;
  FeaturedEyebrow: TextField;
  FeaturedTitle: TextField;
  FeaturedBody: TextField;
  FeaturedLink: LinkField;
  FeaturedImage: ImageField;
}

const defaultFields: FeaturedContentSectionFields = {
  Title: { value: 'Research and insight' },
  Intro: { value: '' },
  ExploreLink: { value: { href: '/', text: 'Explore' } },
  FeaturedEyebrow: { value: 'Podcast episode' },
  FeaturedTitle: { value: 'Featured title' },
  FeaturedBody: { value: '' },
  FeaturedLink: { value: { href: '/', text: 'Listen' } },
  FeaturedImage: { value: { src: '', alt: '' } },
};

export type FeaturedContentSectionProps = ComponentProps & { fields?: FeaturedContentSectionFields };

function Layout(props: FeaturedContentSectionProps, extra = ''): JSX.Element {
  const { params, fields = defaultFields, rendering } = props;
  const ph = `teaser-cards-${params?.DynamicPlaceholderId ?? ''}`;
  return (
    <section
      key={componentKey(props)}
      className={`bc-featured component ${extra} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <div className="bc-container">
        <div className="bc-featured__header">
          <div>
            <Text tag="h2" className="bc-section-title" field={fields.Title} />
            <Text tag="p" className="bc-section-intro" field={fields.Intro} />
          </div>
          <SitecoreLink field={fields.ExploreLink} className="bc-btn bc-btn--primary" />
        </div>
        <article className="bc-featured__hero">
          <div className="bc-featured__copy">
            <Text tag="p" className="bc-teaser-card__eyebrow" field={fields.FeaturedEyebrow} />
            <SitecoreLink field={fields.FeaturedLink}>
              <Text tag="h3" className="bc-featured__title" field={fields.FeaturedTitle} />
            </SitecoreLink>
            <Text tag="p" field={fields.FeaturedBody} />
          </div>
          <div className="bc-featured__media">
            <Image field={fields.FeaturedImage} />
          </div>
        </article>
        <div className="bc-teaser-grid">
          <Placeholder name={ph} rendering={rendering} />
        </div>
      </div>
    </section>
  );
}

export const Default = (p: FeaturedContentSectionProps): JSX.Element => Layout(p);
export const Inversed = (p: FeaturedContentSectionProps): JSX.Element => Layout(p, 'component--inversed');
export const Animated = (p: FeaturedContentSectionProps): JSX.Element => Layout(p, 'component--animated');
export const InversedAnimated = (p: FeaturedContentSectionProps): JSX.Element =>
  Layout(p, 'component--inversed component--animated');
