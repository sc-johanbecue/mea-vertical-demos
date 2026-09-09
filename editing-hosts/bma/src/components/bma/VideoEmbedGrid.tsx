'use client';

import type { JSX } from 'react';
import { Placeholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, dynamicPlaceholderKey } from '@/lib/component-utils';

export type VideoEmbedGridProps = ComponentProps;

export const Default = (props: VideoEmbedGridProps): JSX.Element => {
  const { params, rendering } = props;
  const itemsPh = dynamicPlaceholderKey('video-items', params);

  return (
    <section
      key={componentKey(props)}
      className={`bma-video-grid ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <div className="bma-video-grid__inner">
        <Placeholder name={itemsPh} rendering={rendering} />
      </div>
    </section>
  );
};
