'use client';

import type { JSX } from 'react';
import { Text, RichText, Placeholder } from '@sitecore-content-sdk/nextjs';
import type { TextField, RichTextField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ArrowRight } from '@phosphor-icons/react';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, dynamicPlaceholderKey } from '@/lib/component-utils';
import { FieldLink } from '@/components/banking/FieldLink';

export interface DigitalFeatureBlockFields {
  Eyebrow?: TextField;
  Title?: TextField;
  Body?: RichTextField;
  PrimaryLink?: LinkField;
}

const defaultFields: DigitalFeatureBlockFields = {
  Eyebrow: { value: 'DIGITAL, WITH A HUMAN TOUCH' },
  Title: { value: 'Your bank should think one step ahead.' },
  Body: { value: '<p>DEB brings your goals, products and personal support together in one clear experience.</p>' },
  PrimaryLink: { value: { href: '#', text: 'See how digital banking works' } },
};

export type DigitalFeatureBlockProps = ComponentProps & { fields?: DigitalFeatureBlockFields };

export const Default = (props: DigitalFeatureBlockProps): JSX.Element => {
  const { params, fields = defaultFields, rendering } = props;
  const digitalFeaturesPh = dynamicPlaceholderKey('digital-features', params);
  const nextBestActionPh = dynamicPlaceholderKey('next-best-action', params);

  return (
    <section
      key={componentKey(props)}
      className={`content-section digital-section ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <div className="digital-copy">
        {fields.Eyebrow ? <Text tag="p" field={fields.Eyebrow} className="overline" /> : null}
        {fields.Title ? <Text tag="h2" field={fields.Title} /> : null}
        {fields.Body ? <RichText field={fields.Body} /> : null}
        <div className="digital-features">
          <Placeholder name={digitalFeaturesPh} rendering={rendering} />
        </div>
        <FieldLink field={fields.PrimaryLink} className="primary">
          <ArrowRight aria-hidden="true" />
        </FieldLink>
      </div>
      <Placeholder name={nextBestActionPh} rendering={rendering} />
    </section>
  );
};
