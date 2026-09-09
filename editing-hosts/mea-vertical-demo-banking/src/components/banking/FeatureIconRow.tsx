'use client';

import type { JSX } from 'react';
import { Placeholder } from '@sitecore-content-sdk/nextjs';
import type { TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, dynamicPlaceholderKey } from '@/lib/component-utils';

export interface FeatureIconRowFields {
  Title?: TextField;
}

const defaultFields: FeatureIconRowFields = {};
void defaultFields;

export type FeatureIconRowProps = ComponentProps & { fields?: FeatureIconRowFields };

export const Default = (props: FeatureIconRowProps): JSX.Element => {
  const { params, rendering } = props;
  const featureItemsPh = dynamicPlaceholderKey('feature-items', params);

  return (
    <div
      key={componentKey(props)}
      className={`deb-feature-icon-row ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >

      <div className="deb-feature-icon-row__feature-items">
        <Placeholder name={featureItemsPh} rendering={rendering} />
      </div>
    </div>
  );
};
