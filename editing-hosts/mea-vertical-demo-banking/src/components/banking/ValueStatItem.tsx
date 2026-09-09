'use client';

import type { JSX } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import type { TextField } from '@sitecore-content-sdk/nextjs';
import { Crown, Sparkle, TrendUp } from '@phosphor-icons/react';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface ValueStatItemFields {
  Value?: TextField;
  Label?: TextField;
}

const defaultFields: ValueStatItemFields = {
  Value: { value: 'AED 4,650+' },
  Label: { value: 'estimated annual value' },
};

const ICONS = [Crown, Sparkle, TrendUp];

export type ValueStatItemProps = ComponentProps & { fields?: ValueStatItemFields };

export const Default = (props: ValueStatItemProps): JSX.Element => {
  const { params, fields = defaultFields, rendering } = props;
  const digits = String(rendering?.uid ?? '0').replace(/\D/g, '');
  const Icon = ICONS[Number(digits.slice(-1) || '0') % ICONS.length];

  return (
    <div key={componentKey(props)} className={`${params?.styles ?? ''}`.trim()} id={params?.RenderingIdentifier}>
      <Icon />
      {fields.Value ? <Text tag="strong" field={fields.Value} /> : null}
      {fields.Label ? <Text tag="span" field={fields.Label} /> : null}
    </div>
  );
};
