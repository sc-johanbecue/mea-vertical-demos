'use client';

import type { JSX } from 'react';
import { Text, RichText, Image, Link } from '@sitecore-content-sdk/nextjs';
import type { TextField, RichTextField, LinkField, ImageField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface RecommendationCardFields {
  Category?: TextField;
  Title?: TextField;
  Body?: RichTextField;
  Link?: LinkField;
  Icon?: ImageField;
}

const defaultFields: RecommendationCardFields = {
  Category: { value: 'Category' },
  Title: { value: 'Title' },
  Body: { value: '<p>Body</p>' },
  Link: { value: { href: '#', text: 'Link' } },
  Icon: { value: { src: '', alt: 'Icon' } },
};

export type RecommendationCardProps = ComponentProps & { fields?: RecommendationCardFields };

export const Default = (props: RecommendationCardProps): JSX.Element => {
  const { params, fields = defaultFields } = props;


  return (
    <div
      key={componentKey(props)}
      className={`deb-recommendation-card ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {fields.Category ? <Text tag="span" field={fields.Category} className="deb-recommendation-card__category" /> : null}
      {fields.Title ? <Text tag="span" field={fields.Title} className="deb-recommendation-card__title" /> : null}
      {fields.Body ? <div className="deb-recommendation-card__body"><RichText field={fields.Body} /></div> : null}
      {fields.Link ? <Link field={fields.Link} className="deb-recommendation-card__link" /> : null}
      {fields.Icon?.value?.src ? <Image field={fields.Icon} className="deb-recommendation-card__icon" /> : null}

    </div>
  );
};


export const Inversed = (props: RecommendationCardProps): JSX.Element => {
  const { params } = props;
  return Default({
    ...props,
    params: { ...params, styles: `${params?.styles ?? ''} deb-recommendation-card--inversed`.trim() },
  });
};
