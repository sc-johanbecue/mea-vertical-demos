'use client';

import type { JSX } from 'react';
import { Placeholder, Text } from '@sitecore-content-sdk/nextjs';
import type { TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, dynamicPlaceholderKey } from '@/lib/component-utils';

export interface LinkColumnFields {
  Title: TextField;
  Intro: TextField;
}

const defaultFields: LinkColumnFields = {
  Title: { value: 'Column title' },
  Intro: { value: '' },
};

export type LinkColumnProps = ComponentProps & { fields?: LinkColumnFields };

export const Default = (props: LinkColumnProps): JSX.Element => {
  const { params, fields = defaultFields, rendering } = props;
  const linksPh = dynamicPlaceholderKey('column-links', params);

  return (
    <div
      key={componentKey(props)}
      className={`bma-link-column ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <Text tag="h2" className="bma-link-column__title" field={fields.Title} />
      {fields.Intro?.value ? (
        <Text tag="p" className="bma-link-column__intro" field={fields.Intro} />
      ) : null}
      <ul className="bma-link-column__list">
        <Placeholder name={linksPh} rendering={rendering} />
      </ul>
    </div>
  );
};
