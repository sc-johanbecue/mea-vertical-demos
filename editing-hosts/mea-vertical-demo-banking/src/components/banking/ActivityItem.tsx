'use client';

import type { JSX } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import type { TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface ActivityItemFields {
  Title?: TextField;
  Date?: TextField;
  Amount?: TextField;
  AmountTone?: TextField;
}

const defaultFields: ActivityItemFields = {
  Title: { value: 'Salary credited' },
  Date: { value: 'Today' },
  Amount: { value: '+ AED 28,000' },
  AmountTone: { value: 'credit' },
};

export type ActivityItemProps = ComponentProps & { fields?: ActivityItemFields };

export const Default = (props: ActivityItemProps): JSX.Element => {
  const { params, fields = defaultFields } = props;
  const positive =
    String(fields.AmountTone?.value ?? '').toLowerCase() === 'credit' ||
    String(fields.Amount?.value ?? '').trim().startsWith('+');

  return (
    <div
      key={componentKey(props)}
      className={`transaction ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <span>
        <i />
        <strong>
          {fields.Title ? <Text field={fields.Title} /> : null}
          {fields.Date ? <Text tag="small" field={fields.Date} /> : null}
        </strong>
      </span>
      {fields.Amount ? <Text tag="b" field={fields.Amount} className={positive ? 'positive' : ''} /> : null}
    </div>
  );
};
