'use client';

import type { JSX } from 'react';
import { Text, RichText } from '@sitecore-content-sdk/nextjs';
import type { TextField, RichTextField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ArrowRight } from '@phosphor-icons/react';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';
import { FieldLink } from '@/components/banking/FieldLink';

export interface ProductValueHighlightFields {
  Eyebrow?: TextField;
  Title?: TextField;
  Body?: RichTextField;
  Link?: LinkField;
  CardEyebrow?: TextField;
  CardValue?: TextField;
  CardBody?: RichTextField;
}

const defaultFields: ProductValueHighlightFields = {
  Eyebrow: { value: 'DESIGNED FOR HOW YOU TRAVEL' },
  Title: { value: 'More rewarding from departure to arrival.' },
  Body: {
    value:
      '<p>The DEB Travel Credit Card combines Premium Banking benefits with travel-specific rewards.</p>',
  },
  Link: { value: { href: '#', text: 'View benefits guide' } },
  CardEyebrow: { value: 'Your potential annual value' },
  CardValue: { value: 'AED 2,000+' },
  CardBody: { value: '<p>Airport lounge access, travel insurance, rewards and more.</p>' },
};

export type ProductValueHighlightProps = ComponentProps & { fields?: ProductValueHighlightFields };

export const Default = (props: ProductValueHighlightProps): JSX.Element => {
  const { params, fields = defaultFields } = props;
  return (
    <section
      key={componentKey(props)}
      className={`content-section card-detail ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <div>
        {fields.Eyebrow ? <Text tag="p" field={fields.Eyebrow} className="overline" /> : null}
        {fields.Title ? <Text tag="h2" field={fields.Title} /> : null}
        {fields.Body ? <RichText field={fields.Body} /> : null}
        <FieldLink field={fields.Link} className="story-link">
          <ArrowRight aria-hidden="true" />
        </FieldLink>
      </div>
      <div className="comparison">
        {fields.CardEyebrow ? <Text tag="span" field={fields.CardEyebrow} /> : null}
        {fields.CardValue ? <Text tag="strong" field={fields.CardValue} /> : null}
        {fields.CardBody ? <RichText field={fields.CardBody} /> : null}
      </div>
    </section>
  );
};
