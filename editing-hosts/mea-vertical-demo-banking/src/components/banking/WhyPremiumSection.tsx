'use client';

import type { JSX } from 'react';
import { Text, RichText, Placeholder } from '@sitecore-content-sdk/nextjs';
import type { TextField, RichTextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, dynamicPlaceholderKey } from '@/lib/component-utils';

export interface WhyPremiumSectionFields {
  Eyebrow?: TextField;
  Title?: TextField;
  Body?: RichTextField;
  Checklist?: RichTextField;
}

const defaultFields: WhyPremiumSectionFields = {
  Eyebrow: { value: 'Eyebrow' },
  Title: { value: 'Title' },
  Body: { value: '<p>Body</p>' },
  Checklist: { value: '<p>Checklist</p>' },
};

export type WhyPremiumSectionProps = ComponentProps & { fields?: WhyPremiumSectionFields };

export const Default = (props: WhyPremiumSectionProps): JSX.Element => {
  const { params, fields = defaultFields, rendering } = props;
  const valueStatsPh = dynamicPlaceholderKey('value-stats', params);

  return (
    <div
      key={componentKey(props)}
      className={`deb-why-premium-section ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {fields.Eyebrow ? <Text tag="span" field={fields.Eyebrow} className="deb-why-premium-section__eyebrow" /> : null}
      {fields.Title ? <Text tag="span" field={fields.Title} className="deb-why-premium-section__title" /> : null}
      {fields.Body ? <div className="deb-why-premium-section__body"><RichText field={fields.Body} /></div> : null}
      {fields.Checklist ? <div className="deb-why-premium-section__checklist"><RichText field={fields.Checklist} /></div> : null}
      <div className="deb-why-premium-section__value-stats">
        <Placeholder name={valueStatsPh} rendering={rendering} />
      </div>
    </div>
  );
};
