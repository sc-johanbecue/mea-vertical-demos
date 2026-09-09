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
  Value: { value: '2 minutes' },
  Label: { value: 'to start your digital application' },
};

export type ProofItemProps = ComponentProps & { fields?: ProofItemFields };

export const Default = (props: ProofItemProps): JSX.Element => {
  const { params, fields = defaultFields } = props;
  return (
    <div key={componentKey(props)} className={`${params?.styles ?? ''}`.trim()} id={params?.RenderingIdentifier}>
      {fields.Value ? <Text tag="strong" field={fields.Value} /> : null}
      {fields.Label ? <Text tag="span" field={fields.Label} /> : null}
    </div>
  );
};
