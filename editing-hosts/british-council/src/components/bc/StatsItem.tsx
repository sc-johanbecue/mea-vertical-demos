'use client';

import type { JSX } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import type { TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';


export interface StatsItemFields {
  Value: TextField;
  Label: TextField;
  BackgroundColor: TextField;
}

const defaultFields: StatsItemFields = {
  Value: { value: '100' },
  Label: { value: 'Stat label' },
  BackgroundColor: { value: '#00a9a5' },
};

export type StatsItemProps = ComponentProps & { fields?: StatsItemFields };

function Layout(props: StatsItemProps, extra = ''): JSX.Element {
  const { params, fields = defaultFields } = props;
  const bg = String(fields.BackgroundColor?.value || '#00a9a5');
  return (
    <li
      key={componentKey(props)}
      className={`bc-stats-item component ${extra} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
      style={{ backgroundColor: bg }}
    >
      <Text tag="p" className="bc-stats-item__value" field={fields.Value} />
      <Text tag="p" className="bc-stats-item__label" field={fields.Label} />
    </li>
  );
}

export const Default = (p: StatsItemProps): JSX.Element => Layout(p);
export const Inversed = (p: StatsItemProps): JSX.Element => Layout(p, 'component--inversed');
export const Animated = (p: StatsItemProps): JSX.Element => Layout(p, 'component--animated');
export const InversedAnimated = (p: StatsItemProps): JSX.Element =>
  Layout(p, 'component--inversed component--animated');
