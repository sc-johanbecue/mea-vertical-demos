'use client';

import type { JSX } from 'react';
import { Placeholder, Text } from '@sitecore-content-sdk/nextjs';
import type { TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';


export interface StatsBarFields {
  Title: TextField;
  Intro: TextField;
}

const defaultFields: StatsBarFields = {
  Title: { value: 'We are global' },
  Intro: { value: '' },
};

export type StatsBarProps = ComponentProps & { fields?: StatsBarFields };

function Layout(props: StatsBarProps, extra = ''): JSX.Element {
  const { params, fields = defaultFields, rendering } = props;
  const ph = `stats-items-${params?.DynamicPlaceholderId ?? ''}`;
  return (
    <section
      key={componentKey(props)}
      className={`bc-stats component ${extra} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <div className="bc-container">
        <Text tag="h2" className="bc-section-title" field={fields.Title} />
        <Text tag="p" className="bc-section-intro" field={fields.Intro} />
        <ul className="bc-stats__grid">
          <Placeholder name={ph} rendering={rendering} />
        </ul>
      </div>
    </section>
  );
}

export const Default = (p: StatsBarProps): JSX.Element => Layout(p);
export const Inversed = (p: StatsBarProps): JSX.Element => Layout(p, 'component--inversed');
export const Animated = (p: StatsBarProps): JSX.Element => Layout(p, 'component--animated');
export const InversedAnimated = (p: StatsBarProps): JSX.Element =>
  Layout(p, 'component--inversed component--animated');
