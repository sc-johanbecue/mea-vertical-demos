'use client';

import type { JSX } from 'react';
import { Text, RichText, Placeholder } from '@sitecore-content-sdk/nextjs';
import type { TextField, RichTextField } from '@sitecore-content-sdk/nextjs';
import { ShieldCheck, AirplaneTilt, User } from '@phosphor-icons/react';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, dynamicPlaceholderKey } from '@/lib/component-utils';

export interface WhyPremiumSectionFields {
  Eyebrow?: TextField;
  Title?: TextField;
  Body?: RichTextField;
  Checklist?: RichTextField;
}

const defaultFields: WhyPremiumSectionFields = {
  Eyebrow: { value: 'WHY PREMIUM' },
  Title: { value: 'Recognised wherever life takes you.' },
  Body: {
    value:
      '<p>Enjoy privileges that make travel more comfortable, investing more intentional and everyday banking effortlessly supported.</p>',
  },
  Checklist: {
    value:
      '<p>Waived fees on balances above AED 20,000</p><p>Unlimited airport lounge access</p><p>A dedicated relationship manager</p>',
  },
};

export type WhyPremiumSectionProps = ComponentProps & { fields?: WhyPremiumSectionFields };

export const Default = (props: WhyPremiumSectionProps): JSX.Element => {
  const { params, fields = defaultFields, rendering } = props;
  const valueStatsPh = dynamicPlaceholderKey('value-stats', params);

  return (
    <section
      key={componentKey(props)}
      className={`content-section split-story ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <div>
        {fields.Eyebrow ? <Text tag="p" field={fields.Eyebrow} className="overline" /> : null}
        {fields.Title ? <Text tag="h2" field={fields.Title} /> : null}
        {fields.Body ? <RichText field={fields.Body} /> : null}
        <ul>
          <li>
            <ShieldCheck />
            Waived fees on balances above AED 20,000
          </li>
          <li>
            <AirplaneTilt />
            Unlimited airport lounge access
          </li>
          <li>
            <User />A dedicated relationship manager
          </li>
        </ul>
        {fields.Checklist ? (
          <div className="sr-only">
            <RichText field={fields.Checklist} />
          </div>
        ) : null}
      </div>
      <div className="value-grid">
        <Placeholder name={valueStatsPh} rendering={rendering} />
      </div>
    </section>
  );
};
