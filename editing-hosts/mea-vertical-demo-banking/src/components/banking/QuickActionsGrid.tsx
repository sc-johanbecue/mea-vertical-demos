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
  Title: { value: 'Quick actions' },
};

export type QuickActionsGridProps = ComponentProps & { fields?: QuickActionsGridFields };

export const Default = (props: QuickActionsGridProps): JSX.Element => {
  const { params, fields = defaultFields, rendering } = props;
  const quickActionsPh = dynamicPlaceholderKey('quick-actions', params);

  return (
    <section
      key={componentKey(props)}
      className={`content-section ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <div className="section-title">{fields.Title ? <Text tag="h2" field={fields.Title} /> : null}</div>
      <div className="quick-actions">
        <Placeholder name={quickActionsPh} rendering={rendering} />
      </div>
    </section>
  );
};
