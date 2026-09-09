'use client';

import type { JSX } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import type { TextField, LinkField } from '@sitecore-content-sdk/nextjs';
import { PaperPlaneTilt, CreditCard, UsersThree, Wallet, ChartLineUp } from '@phosphor-icons/react';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';
import { FieldLink } from '@/components/banking/FieldLink';

export interface QuickActionItemFields {
  Label?: TextField;
  Link?: LinkField;
}

const defaultFields: QuickActionItemFields = {
  Label: { value: 'Transfer money' },
  Link: { value: { href: '#', text: 'Transfer' } },
};

const ICONS = [PaperPlaneTilt, CreditCard, UsersThree, Wallet, ChartLineUp];

export type QuickActionItemProps = ComponentProps & { fields?: QuickActionItemFields };

export const Default = (props: QuickActionItemProps): JSX.Element => {
  const { params, fields = defaultFields, rendering } = props;
  const digits = String(rendering?.uid ?? '0').replace(/\D/g, '');
  const Icon = ICONS[Number(digits.slice(-1) || '0') % ICONS.length];

  return (
    <button
      type="button"
      key={componentKey(props)}
      className={`${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <Icon />
      {fields.Label ? <Text tag="span" field={fields.Label} /> : <FieldLink field={fields.Link} />}
    </button>
  );
};
