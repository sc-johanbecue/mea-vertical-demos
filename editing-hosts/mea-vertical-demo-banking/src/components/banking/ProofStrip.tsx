'use client';

import type { JSX } from 'react';
import { Placeholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, dynamicPlaceholderKey } from '@/lib/component-utils';

export type ProofStripProps = ComponentProps;

export const Default = (props: ProofStripProps): JSX.Element => {
  const { params, rendering } = props;
  const proofItemsPh = dynamicPlaceholderKey('proof-items', params);
  return (
    <section
      key={componentKey(props)}
      className={`proof-strip ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
      aria-label="Highlights"
    >
      <Placeholder name={proofItemsPh} rendering={rendering} />
    </section>
  );
};
