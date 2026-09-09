'use client';

import type { JSX } from 'react';
import { Placeholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, dynamicPlaceholderKey } from '@/lib/component-utils';

export type FeatureIconRowProps = ComponentProps;

export const Default = (props: FeatureIconRowProps): JSX.Element => {
  const { params, rendering } = props;
  const featureItemsPh = dynamicPlaceholderKey('feature-items', params);
  return (
    <section
      key={componentKey(props)}
      className={`content-section feature-row ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <Placeholder name={featureItemsPh} rendering={rendering} />
    </section>
  );
};
