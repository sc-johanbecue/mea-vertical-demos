'use client';

import type { JSX } from 'react';
import { Placeholder, Text } from '@sitecore-content-sdk/nextjs';
import type { TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, dynamicPlaceholderKey } from '@/lib/component-utils';

export interface DocumentFilterGroupFields {
  Title: TextField;
}

const defaultFields: DocumentFilterGroupFields = {
  Title: { value: 'Filter group' },
};

export type DocumentFilterGroupProps = ComponentProps & { fields?: DocumentFilterGroupFields };

export const Default = (props: DocumentFilterGroupProps): JSX.Element => {
  const { params, fields = defaultFields, rendering } = props;
  const optionsPh = dynamicPlaceholderKey('filter-options', params);

  return (
    <fieldset
      key={componentKey(props)}
      className={`bma-filter-group ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <Text tag="legend" className="bma-filter-group__title" field={fields.Title} />
      <div className="bma-filter-group__options" role="radiogroup">
        <Placeholder name={optionsPh} rendering={rendering} />
      </div>
    </fieldset>
  );
};
