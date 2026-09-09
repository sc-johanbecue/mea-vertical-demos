'use client';

import type { JSX } from 'react';
import { Placeholder } from '@sitecore-content-sdk/nextjs';
import type { TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, dynamicPlaceholderKey } from '@/lib/component-utils';

export interface BenefitStripFields {
  Title?: TextField;
}

const defaultFields: BenefitStripFields = {};
void defaultFields;

export type BenefitStripProps = ComponentProps & { fields?: BenefitStripFields };

export const Default = (props: BenefitStripProps): JSX.Element => {
  const { params, rendering } = props;
  const benefitItemsPh = dynamicPlaceholderKey('benefit-items', params);

  return (
    <div
      key={componentKey(props)}
      className={`deb-benefit-strip ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >

      <div className="deb-benefit-strip__benefit-items">
        <Placeholder name={benefitItemsPh} rendering={rendering} />
      </div>
    </div>
  );
};
