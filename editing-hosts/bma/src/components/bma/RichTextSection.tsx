'use client';

import type { JSX } from 'react';
import { RichText } from '@sitecore-content-sdk/nextjs';
import type { RichTextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface RichTextSectionFields {
  Body: RichTextField;
}

const defaultFields: RichTextSectionFields = {
  Body: { value: '<p>Add page content here.</p>' },
};

export type RichTextSectionProps = ComponentProps & { fields?: RichTextSectionFields };

export const Default = (props: RichTextSectionProps): JSX.Element => {
  const { params, fields = defaultFields } = props;

  return (
    <section
      key={componentKey(props)}
      className={`bma-richtext ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <div className="bma-richtext__body">
        <RichText field={fields.Body} />
      </div>
    </section>
  );
};
