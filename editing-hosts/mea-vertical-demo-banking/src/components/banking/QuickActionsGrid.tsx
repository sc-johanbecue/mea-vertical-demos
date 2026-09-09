'use client';

import type { JSX } from 'react';
import { Text, Placeholder } from '@sitecore-content-sdk/nextjs';
import type { TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, dynamicPlaceholderKey } from '@/lib/component-utils';

export interface QuickActionsGridFields {
  Title?: TextField;
}

const defaultFields: QuickActionsGridFields = {
  Title: { value: 'Title' },
};

export type QuickActionsGridProps = ComponentProps & { fields?: QuickActionsGridFields };

export const Default = (props: QuickActionsGridProps): JSX.Element => {
  const { params, fields = defaultFields, rendering } = props;
  const quickActionsPh = dynamicPlaceholderKey('quick-actions', params);

  return (
    <div
      key={componentKey(props)}
      className={`deb-quick-actions-grid ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {fields.Title ? <Text tag="span" field={fields.Title} className="deb-quick-actions-grid__title" /> : null}
      <div className="deb-quick-actions-grid__quick-actions">
        <Placeholder name={quickActionsPh} rendering={rendering} />
      </div>
    </div>
  );
};
