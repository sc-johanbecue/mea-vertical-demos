'use client';

import type { JSX } from 'react';
import { Text, RichText, Image, Link } from '@sitecore-content-sdk/nextjs';
import type { TextField, ImageField, RichTextField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface ProductSolutionPanelFields {
  TabLabel?: TextField;
  TabIcon?: ImageField;
  Eyebrow?: TextField;
  Title?: TextField;
  Body?: RichTextField;
  Link?: LinkField;
  CardIcon?: ImageField;
  CardEyebrow?: TextField;
  CardItems?: RichTextField;
}

const defaultFields: ProductSolutionPanelFields = {
  TabLabel: { value: 'TabLabel' },
  TabIcon: { value: { src: '', alt: 'TabIcon' } },
  Eyebrow: { value: 'Eyebrow' },
  Title: { value: 'Title' },
  Body: { value: '<p>Body</p>' },
  Link: { value: { href: '#', text: 'Link' } },
  CardIcon: { value: { src: '', alt: 'CardIcon' } },
  CardEyebrow: { value: 'CardEyebrow' },
  CardItems: { value: '<p>CardItems</p>' },
};

export type ProductSolutionPanelProps = ComponentProps & { fields?: ProductSolutionPanelFields };

export const Default = (props: ProductSolutionPanelProps): JSX.Element => {
  const { params, fields = defaultFields } = props;


  return (
    <div
      key={componentKey(props)}
      className={`deb-product-solution-panel ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {fields.TabLabel ? <Text tag="span" field={fields.TabLabel} className="deb-product-solution-panel__tab-label" /> : null}
      {fields.TabIcon?.value?.src ? <Image field={fields.TabIcon} className="deb-product-solution-panel__tab-icon" /> : null}
      {fields.Eyebrow ? <Text tag="span" field={fields.Eyebrow} className="deb-product-solution-panel__eyebrow" /> : null}
      {fields.Title ? <Text tag="span" field={fields.Title} className="deb-product-solution-panel__title" /> : null}
      {fields.Body ? <div className="deb-product-solution-panel__body"><RichText field={fields.Body} /></div> : null}
      {fields.Link ? <Link field={fields.Link} className="deb-product-solution-panel__link" /> : null}
      {fields.CardIcon?.value?.src ? <Image field={fields.CardIcon} className="deb-product-solution-panel__card-icon" /> : null}
      {fields.CardEyebrow ? <Text tag="span" field={fields.CardEyebrow} className="deb-product-solution-panel__card-eyebrow" /> : null}
      {fields.CardItems ? <div className="deb-product-solution-panel__card-items"><RichText field={fields.CardItems} /></div> : null}

    </div>
  );
};
