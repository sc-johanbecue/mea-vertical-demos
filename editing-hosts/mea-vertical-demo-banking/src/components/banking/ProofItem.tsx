'use client';

import type { JSX } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import type { TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface ProofItemFields {
  Value?: TextField;
  Label?: TextField;
}

const defaultFields: ProofItemFields = {
  Value: { value: 'Value' },
  Label: { value: 'Label' },
};

export type ProofItemProps = ComponentProps & { fields?: ProofItemFields };

export const Default = (props: ProofItemProps): JSX.Element => {
  const { params, fields = defaultFields } = props;


  return (
    <div
      key={componentKey(props)}
      className={`deb-proof-item ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {fields.Value ? <Text tag="span" field={fields.Value} className="deb-proof-item__value" /> : null}
      {fields.Label ? <Text tag="span" field={fields.Label} className="deb-proof-item__label" /> : null}

    </div>
  );
};
