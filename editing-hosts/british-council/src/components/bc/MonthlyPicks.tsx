'use client';

import type { JSX } from 'react';
import { Placeholder, Text } from '@sitecore-content-sdk/nextjs';
import type { TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface MonthlyPicksFields {
  Title?: TextField;
}

const defaults: Required<MonthlyPicksFields> = {
  Title: { value: 'Monthly Picks' },
};

export type MonthlyPicksProps = ComponentProps & { fields?: MonthlyPicksFields };

function Layout(props: MonthlyPicksProps, extra = ''): JSX.Element {
  const { params, rendering } = props;
  const fields = { ...defaults, ...props.fields } as typeof defaults;
  const id = params?.DynamicPlaceholderId ?? '1';
  return (
    <section
      key={componentKey(props)}
      className={`bc-monthly-picks component ${extra} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <Text tag="h2" className="bc-portal-section__title" field={fields.Title} />
      <div className="bc-book-grid">
        <Placeholder name={`monthly-pick-books-${id}`} rendering={rendering} />
      </div>
    </section>
  );
}

export const Default = (p: MonthlyPicksProps): JSX.Element => Layout(p);
export const Inversed = (p: MonthlyPicksProps): JSX.Element => Layout(p, 'component--inversed');
export const Animated = (p: MonthlyPicksProps): JSX.Element => Layout(p, 'component--animated');
export const InversedAnimated = (p: MonthlyPicksProps): JSX.Element =>
  Layout(p, 'component--inversed component--animated');
