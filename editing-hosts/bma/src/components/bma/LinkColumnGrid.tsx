'use client';

import type { JSX } from 'react';
import { Placeholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, dynamicPlaceholderKey } from '@/lib/component-utils';

export type LinkColumnGridProps = ComponentProps;

export const Default = (props: LinkColumnGridProps): JSX.Element => {
  const { params, rendering } = props;
  const columnsPh = dynamicPlaceholderKey('link-columns', params);

  return (
    <section
      key={componentKey(props)}
      className={`bma-link-columns ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <div className="bma-link-columns__inner">
        <Placeholder name={columnsPh} rendering={rendering} />
      </div>
    </section>
  );
};
