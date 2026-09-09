'use client';

import type { JSX } from 'react';
import { Placeholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, dynamicPlaceholderKey } from '@/lib/component-utils';

export type BreadcrumbProps = ComponentProps;

export const Default = (props: BreadcrumbProps): JSX.Element => {
  const { params, rendering } = props;
  const itemsPh = dynamicPlaceholderKey('breadcrumb-items', params);

  return (
    <nav
      key={componentKey(props)}
      className={`bma-breadcrumb ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
      aria-label="Breadcrumb"
    >
      <ol className="bma-breadcrumb__list">
        <Placeholder name={itemsPh} rendering={rendering} />
      </ol>
    </nav>
  );
};
