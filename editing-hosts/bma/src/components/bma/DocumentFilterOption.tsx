'use client';

import type { JSX } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import type { TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface DocumentFilterOptionFields {
  Label: TextField;
  Value: TextField;
  IsSelected: TextField;
}

const defaultFields: DocumentFilterOptionFields = {
  Label: { value: 'Option' },
  Value: { value: 'option' },
  IsSelected: { value: '' },
};

export type DocumentFilterOptionProps = ComponentProps & { fields?: DocumentFilterOptionFields };

function isSelected(field?: TextField): boolean {
  const value = String(field?.value ?? '')
    .trim()
    .toLowerCase();
  return value === '1' || value === 'true' || value === 'yes';
}

export const Default = (props: DocumentFilterOptionProps): JSX.Element => {
  const { params, fields = defaultFields } = props;
  const value = fields.Value?.value?.toString() || 'option';
  const selected = isSelected(fields.IsSelected);
  const inputId = `bma-filter-${params?.RenderingIdentifier || value}`;

  return (
    <label
      key={componentKey(props)}
      className={`bma-filter-option ${selected ? 'is-selected' : ''} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
      htmlFor={inputId}
    >
      <input
        id={inputId}
        className="bma-filter-option__input"
        type="radio"
        name="bma-document-filter"
        value={value}
        defaultChecked={selected}
        disabled
        title="Live filtering arrives in Phase 2"
      />
      <Text tag="span" className="bma-filter-option__label" field={fields.Label} />
    </label>
  );
};
