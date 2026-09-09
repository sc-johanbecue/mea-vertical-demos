'use client';

import type { JSX } from 'react';
import { Placeholder, Text } from '@sitecore-content-sdk/nextjs';
import type { TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface ExploreSectionFields {
  Title?: TextField;
}

const defaults: Required<ExploreSectionFields> = {
  Title: { value: 'Explore' },
};

export type ExploreSectionProps = ComponentProps & { fields?: ExploreSectionFields };

function Layout(props: ExploreSectionProps, extra = ''): JSX.Element {
  const { params, rendering } = props;
  const fields = { ...defaults, ...props.fields } as typeof defaults;
  const id = params?.DynamicPlaceholderId ?? '1';
  return (
    <section
      key={componentKey(props)}
      className={`bc-explore-section component ${extra} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <Text tag="h2" className="bc-portal-section__title" field={fields.Title} />
      <div className="bc-explore-section__grid">
        <Placeholder name={`explore-collections-${id}`} rendering={rendering} />
      </div>
    </section>
  );
}

export const Default = (p: ExploreSectionProps): JSX.Element => Layout(p);
export const Inversed = (p: ExploreSectionProps): JSX.Element => Layout(p, 'component--inversed');
export const Animated = (p: ExploreSectionProps): JSX.Element => Layout(p, 'component--animated');
export const InversedAnimated = (p: ExploreSectionProps): JSX.Element =>
  Layout(p, 'component--inversed component--animated');
