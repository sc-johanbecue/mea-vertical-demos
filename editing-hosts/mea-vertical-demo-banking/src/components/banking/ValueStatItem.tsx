'use client';

import type { JSX } from 'react';
import { Text, Image } from '@sitecore-content-sdk/nextjs';
import type { TextField, ImageField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface ValueStatItemFields {
  Icon?: ImageField;
  Value?: TextField;
  Label?: TextField;
}

const defaultFields: ValueStatItemFields = {
  Icon: { value: { src: '', alt: 'Icon' } },
  Value: { value: 'Value' },
  Label: { value: 'Label' },
};

export type ValueStatItemProps = ComponentProps & { fields?: ValueStatItemFields };

export const Default = (props: ValueStatItemProps): JSX.Element => {
  const { params, fields = defaultFields } = props;


  return (
    <div
      key={componentKey(props)}
      className={`deb-value-stat-item ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {fields.Icon?.value?.src ? <Image field={fields.Icon} className="deb-value-stat-item__icon" /> : null}
      {fields.Value ? <Text tag="span" field={fields.Value} className="deb-value-stat-item__value" /> : null}
      {fields.Label ? <Text tag="span" field={fields.Label} className="deb-value-stat-item__label" /> : null}

    </div>
  );
};
