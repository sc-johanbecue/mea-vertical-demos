'use client';

import type { JSX } from 'react';
import { Text, Image } from '@sitecore-content-sdk/nextjs';
import type { TextField, ImageField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface ActivityItemFields {
  Icon?: ImageField;
  Title?: TextField;
  Date?: TextField;
  Amount?: TextField;
  AmountTone?: TextField;
}

const defaultFields: ActivityItemFields = {
  Icon: { value: { src: '', alt: 'Icon' } },
  Title: { value: 'Title' },
  Date: { value: 'Date' },
  Amount: { value: 'Amount' },
  AmountTone: { value: 'AmountTone' },
};

export type ActivityItemProps = ComponentProps & { fields?: ActivityItemFields };

export const Default = (props: ActivityItemProps): JSX.Element => {
  const { params, fields = defaultFields } = props;


  return (
    <div
      key={componentKey(props)}
      className={`deb-activity-item ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {fields.Icon?.value?.src ? <Image field={fields.Icon} className="deb-activity-item__icon" /> : null}
      {fields.Title ? <Text tag="span" field={fields.Title} className="deb-activity-item__title" /> : null}
      {fields.Date ? <Text tag="span" field={fields.Date} className="deb-activity-item__date" /> : null}
      {fields.Amount ? <Text tag="span" field={fields.Amount} className="deb-activity-item__amount" /> : null}
      {fields.AmountTone ? <Text tag="span" field={fields.AmountTone} className="deb-activity-item__amount-tone" /> : null}

    </div>
  );
};
