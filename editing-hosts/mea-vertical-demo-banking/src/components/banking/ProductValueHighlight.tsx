'use client';

import type { JSX } from 'react';
import { Text, RichText, Link } from '@sitecore-content-sdk/nextjs';
import type { TextField, RichTextField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

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
  Eyebrow: { value: 'Eyebrow' },
  Title: { value: 'Title' },
  Body: { value: '<p>Body</p>' },
  Link: { value: { href: '#', text: 'Link' } },
  CardEyebrow: { value: 'CardEyebrow' },
  CardValue: { value: 'CardValue' },
  CardBody: { value: '<p>CardBody</p>' },
};

export type ProductValueHighlightProps = ComponentProps & { fields?: ProductValueHighlightFields };

export const Default = (props: ProductValueHighlightProps): JSX.Element => {
  const { params, fields = defaultFields } = props;


  return (
    <div
      key={componentKey(props)}
      className={`deb-product-value-highlight ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {fields.Eyebrow ? <Text tag="span" field={fields.Eyebrow} className="deb-product-value-highlight__eyebrow" /> : null}
      {fields.Title ? <Text tag="span" field={fields.Title} className="deb-product-value-highlight__title" /> : null}
      {fields.Body ? <div className="deb-product-value-highlight__body"><RichText field={fields.Body} /></div> : null}
      {fields.Link ? <Link field={fields.Link} className="deb-product-value-highlight__link" /> : null}
      {fields.CardEyebrow ? <Text tag="span" field={fields.CardEyebrow} className="deb-product-value-highlight__card-eyebrow" /> : null}
      {fields.CardValue ? <Text tag="span" field={fields.CardValue} className="deb-product-value-highlight__card-value" /> : null}
      {fields.CardBody ? <div className="deb-product-value-highlight__card-body"><RichText field={fields.CardBody} /></div> : null}

    </div>
  );
};
