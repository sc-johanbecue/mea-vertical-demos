'use client';

import type { JSX } from 'react';
import { Placeholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, dynamicPlaceholderKey } from '@/lib/component-utils';

export type HighlightLinkGridProps = ComponentProps;

export const Default = (props: HighlightLinkGridProps): JSX.Element => {
  const { params, rendering } = props;
  const cardsPh = dynamicPlaceholderKey('highlight-cards', params);

  return (
    <section
      key={componentKey(props)}
      className={`bma-highlight-grid ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <div className="bma-highlight-grid__inner">
        <Placeholder name={cardsPh} rendering={rendering} />
      </div>
    </section>
  );
};
