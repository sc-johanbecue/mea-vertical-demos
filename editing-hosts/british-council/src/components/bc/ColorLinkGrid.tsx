'use client';

import type { JSX } from 'react';
import { Placeholder, Text } from '@sitecore-content-sdk/nextjs';
import type { TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';


export interface ColorLinkGridFields {
  Title: TextField;
}

const defaultFields: ColorLinkGridFields = {
  Title: { value: 'More from the British Council' },
};

export type ColorLinkGridProps = ComponentProps & { fields?: ColorLinkGridFields };

function Layout(props: ColorLinkGridProps, extra = ''): JSX.Element {
  const { params, fields = defaultFields, rendering } = props;
  const ph = `link-tiles-${params?.DynamicPlaceholderId ?? ''}`;
  return (
    <section
      key={componentKey(props)}
      className={`bc-color-grid component ${extra} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <div className="bc-container">
        <Text tag="h2" className="bc-section-title" field={fields.Title} />
        <ul className="bc-color-grid__list">
          <Placeholder name={ph} rendering={rendering} />
        </ul>
      </div>
    </section>
  );
}

export const Default = (p: ColorLinkGridProps): JSX.Element => Layout(p);
export const Inversed = (p: ColorLinkGridProps): JSX.Element => Layout(p, 'component--inversed');
export const Animated = (p: ColorLinkGridProps): JSX.Element => Layout(p, 'component--animated');
export const InversedAnimated = (p: ColorLinkGridProps): JSX.Element =>
  Layout(p, 'component--inversed component--animated');
