'use client';

import type { JSX } from 'react';
import { RichTextField, RichText } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * PepsiCoContentBlock — compact legal / disclaimer rich text (footer-style), left-aligned, Montserrat.
 */

export interface PepsiCoContentBlockFields {
  Body: RichTextField;
}

const defaultFields: PepsiCoContentBlockFields = {
  Body: {
    value: `<p>‡ Add one child under 20 to your policy at no extra cost when you take out a family policy. Family discount applies to Comprehensive and Treatment and Care policies. <a href="#">Terms and Conditions (PDF, 0.05MB)</a></p><p>PepsiCo, Inc. is a global food and beverage company. This placeholder copy is for demonstration only and does not constitute legal, financial, or insurance advice.</p>`,
  },
};

export type PepsiCoContentBlockProps = ComponentProps & {
  fields: PepsiCoContentBlockFields;
};

export const Default = (props: PepsiCoContentBlockProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  return (
    <section
      key={id ?? props.rendering?.uid}
      className={`component content-block bg-white py-8 md:py-10 ${styles || ''}`}
      id={id}
    >
      <div className="mx-auto max-w-4xl px-4 md:px-6 lg:px-8">
        {fields.Body?.value ? (
          <RichText
            field={fields.Body}
            className="text-left text-[0.8125rem] leading-relaxed text-[#5a5f66] [&_a]:font-medium [&_a]:text-[#0079c1] [&_a]:underline [&_p]:mb-3 [&_p:last-child]:mb-0"
          />
        ) : null}
      </div>
    </section>
  );
};
