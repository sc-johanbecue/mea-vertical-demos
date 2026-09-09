'use client';

import type { JSX } from 'react';
import { Placeholder, Text } from '@sitecore-content-sdk/nextjs';
import type { TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';


export interface HighlightsLinkGridFields {
  Title: TextField;
}

const defaultFields: HighlightsLinkGridFields = {
  Title: { value: 'Highlights' },
};

export type HighlightsLinkGridProps = ComponentProps & { fields?: HighlightsLinkGridFields };

function Layout(props: HighlightsLinkGridProps, extra = ''): JSX.Element {
  const { params, fields = defaultFields, rendering } = props;
  const ph = `highlight-items-${params?.DynamicPlaceholderId ?? ''}`;
  return (
    <section
      key={componentKey(props)}
      className={`bc-highlights component ${extra} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <div className="bc-container">
        <Text tag="h2" className="bc-section-title" field={fields.Title} />
        <div className="bc-highlights__grid">
          <Placeholder name={ph} rendering={rendering} />
        </div>
      </div>
    </section>
  );
}

export const Default = (p: HighlightsLinkGridProps): JSX.Element => Layout(p);
export const Inversed = (p: HighlightsLinkGridProps): JSX.Element => Layout(p, 'component--inversed');
export const Animated = (p: HighlightsLinkGridProps): JSX.Element => Layout(p, 'component--animated');
export const InversedAnimated = (p: HighlightsLinkGridProps): JSX.Element =>
  Layout(p, 'component--inversed component--animated');
