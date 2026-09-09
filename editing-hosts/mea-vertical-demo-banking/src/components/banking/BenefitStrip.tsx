'use client';

import type { JSX } from 'react';
import { Placeholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, dynamicPlaceholderKey } from '@/lib/component-utils';

export type BenefitStripProps = ComponentProps;

export const Default = (props: BenefitStripProps): JSX.Element => {
  const { params, rendering } = props;
  const benefitItemsPh = dynamicPlaceholderKey('benefit-items', params);
  return (
    <div
      key={componentKey(props)}
      className={`benefit-strip light ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <Placeholder name={benefitItemsPh} rendering={rendering} />
    </div>
  );
};
