'use client';

import type { JSX } from 'react';
import { Link as SitecoreLink, Placeholder, Text } from '@sitecore-content-sdk/nextjs';
import type { LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';


export interface VerticalTeaserGridFields {
  Title: TextField;
  Intro: TextField;
  ViewAllLink: LinkField;
}

const defaultFields: VerticalTeaserGridFields = {
  Title: { value: 'Voices Magazine' },
  Intro: { value: '' },
  ViewAllLink: { value: { href: '/', text: 'View all' } },
};

export type VerticalTeaserGridProps = ComponentProps & { fields?: VerticalTeaserGridFields };

function Layout(props: VerticalTeaserGridProps, extra = ''): JSX.Element {
  const { params, fields = defaultFields, rendering } = props;
  const ph = `teaser-cards-${params?.DynamicPlaceholderId ?? ''}`;
  return (
    <section
      key={componentKey(props)}
      className={`bc-teaser-section component ${extra} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <div className="bc-container">
        <div className="bc-featured__header">
          <div>
            <Text tag="h2" className="bc-section-title" field={fields.Title} />
            <Text tag="p" className="bc-section-intro" field={fields.Intro} />
          </div>
          <SitecoreLink field={fields.ViewAllLink} className="bc-btn bc-btn--primary" />
        </div>
        <div className="bc-teaser-grid">
          <Placeholder name={ph} rendering={rendering} />
        </div>
      </div>
    </section>
  );
}

export const Default = (p: VerticalTeaserGridProps): JSX.Element => Layout(p);
export const Inversed = (p: VerticalTeaserGridProps): JSX.Element => Layout(p, 'component--inversed');
export const Animated = (p: VerticalTeaserGridProps): JSX.Element => Layout(p, 'component--animated');
export const InversedAnimated = (p: VerticalTeaserGridProps): JSX.Element =>
  Layout(p, 'component--inversed component--animated');
