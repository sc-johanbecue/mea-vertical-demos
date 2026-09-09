'use client';

import type { JSX } from 'react';
import { Text, RichText, Link, Placeholder } from '@sitecore-content-sdk/nextjs';
import type { TextField, RichTextField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, dynamicPlaceholderKey } from '@/lib/component-utils';

export interface DigitalFeatureBlockFields {
  Eyebrow?: TextField;
  Title?: TextField;
  Body?: RichTextField;
  PrimaryLink?: LinkField;
}

const defaultFields: DigitalFeatureBlockFields = {
  Eyebrow: { value: 'Eyebrow' },
  Title: { value: 'Title' },
  Body: { value: '<p>Body</p>' },
  PrimaryLink: { value: { href: '#', text: 'PrimaryLink' } },
};

export type DigitalFeatureBlockProps = ComponentProps & { fields?: DigitalFeatureBlockFields };

export const Default = (props: DigitalFeatureBlockProps): JSX.Element => {
  const { params, fields = defaultFields, rendering } = props;
  const digitalFeaturesPh = dynamicPlaceholderKey('digital-features', params);
  const nextBestActionPh = dynamicPlaceholderKey('next-best-action', params);

  return (
    <div
      key={componentKey(props)}
      className={`deb-digital-feature-block ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {fields.Eyebrow ? <Text tag="span" field={fields.Eyebrow} className="deb-digital-feature-block__eyebrow" /> : null}
      {fields.Title ? <Text tag="span" field={fields.Title} className="deb-digital-feature-block__title" /> : null}
      {fields.Body ? <div className="deb-digital-feature-block__body"><RichText field={fields.Body} /></div> : null}
      {fields.PrimaryLink ? <Link field={fields.PrimaryLink} className="deb-digital-feature-block__primary-link" /> : null}
      <div className="deb-digital-feature-block__digital-features">
        <Placeholder name={digitalFeaturesPh} rendering={rendering} />
      </div>
      <div className="deb-digital-feature-block__next-best-action">
        <Placeholder name={nextBestActionPh} rendering={rendering} />
      </div>
    </div>
  );
};
