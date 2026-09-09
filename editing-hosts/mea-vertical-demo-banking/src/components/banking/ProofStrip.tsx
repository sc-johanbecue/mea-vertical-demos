'use client';

import type { JSX } from 'react';
import { Placeholder } from '@sitecore-content-sdk/nextjs';
import type { TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, dynamicPlaceholderKey } from '@/lib/component-utils';

export interface ProofStripFields {
  Title?: TextField;
}

const defaultFields: ProofStripFields = {};
void defaultFields;

export type ProofStripProps = ComponentProps & { fields?: ProofStripFields };

export const Default = (props: ProofStripProps): JSX.Element => {
  const { params, rendering } = props;
  const proofItemsPh = dynamicPlaceholderKey('proof-items', params);

  return (
    <div
      key={componentKey(props)}
      className={`deb-proof-strip ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >

      <div className="deb-proof-strip__proof-items">
        <Placeholder name={proofItemsPh} rendering={rendering} />
      </div>
    </div>
  );
};
