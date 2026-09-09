'use client';

import type { JSX } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import type { TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface PageTitleHeaderFields {
  Title: TextField;
}

const defaultFields: PageTitleHeaderFields = {
  Title: { value: 'Page title' },
};

export type PageTitleHeaderProps = ComponentProps & { fields?: PageTitleHeaderFields };

export const Default = (props: PageTitleHeaderProps): JSX.Element => {
  const { params, fields = defaultFields } = props;

  return (
    <header
      key={componentKey(props)}
      className={`bma-page-title ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <Text tag="h1" className="bma-page-title__heading" field={fields.Title} />
    </header>
  );
};
