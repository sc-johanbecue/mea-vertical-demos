'use client';

import type { JSX } from 'react';
import { Text, RichText, Link, Placeholder } from '@sitecore-content-sdk/nextjs';
import type { TextField, RichTextField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, dynamicPlaceholderKey } from '@/lib/component-utils';

export interface PremiumValueSectionFields {
  Eyebrow?: TextField;
  Title?: TextField;
  Body?: RichTextField;
  Link?: LinkField;
}

const defaultFields: PremiumValueSectionFields = {
  Eyebrow: { value: 'Eyebrow' },
  Title: { value: 'Title' },
  Body: { value: '<p>Body</p>' },
  Link: { value: { href: '#', text: 'Link' } },
};

export type PremiumValueSectionProps = ComponentProps & { fields?: PremiumValueSectionFields };

export const Default = (props: PremiumValueSectionProps): JSX.Element => {
  const { params, fields = defaultFields, rendering } = props;
  const valueStatsPh = dynamicPlaceholderKey('value-stats', params);

  return (
    <div
      key={componentKey(props)}
      className={`deb-premium-value-section ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {fields.Eyebrow ? <Text tag="span" field={fields.Eyebrow} className="deb-premium-value-section__eyebrow" /> : null}
      {fields.Title ? <Text tag="span" field={fields.Title} className="deb-premium-value-section__title" /> : null}
      {fields.Body ? <div className="deb-premium-value-section__body"><RichText field={fields.Body} /></div> : null}
      {fields.Link ? <Link field={fields.Link} className="deb-premium-value-section__link" /> : null}
      <div className="deb-premium-value-section__value-stats">
        <Placeholder name={valueStatsPh} rendering={rendering} />
      </div>
    </div>
  );
};
