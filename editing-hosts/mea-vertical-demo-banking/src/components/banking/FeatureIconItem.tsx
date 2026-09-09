'use client';

import type { JSX } from 'react';
import { Text, RichText, Image } from '@sitecore-content-sdk/nextjs';
import type { TextField, ImageField, RichTextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface FeatureIconItemFields {
  Icon?: ImageField;
  Title?: TextField;
  Body?: RichTextField;
}

const defaultFields: FeatureIconItemFields = {
  Icon: { value: { src: '', alt: 'Icon' } },
  Title: { value: 'Title' },
  Body: { value: '<p>Body</p>' },
};

export type FeatureIconItemProps = ComponentProps & { fields?: FeatureIconItemFields };

export const Default = (props: FeatureIconItemProps): JSX.Element => {
  const { params, fields = defaultFields } = props;


  return (
    <div
      key={componentKey(props)}
      className={`deb-feature-icon-item ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {fields.Icon?.value?.src ? <Image field={fields.Icon} className="deb-feature-icon-item__icon" /> : null}
      {fields.Title ? <Text tag="span" field={fields.Title} className="deb-feature-icon-item__title" /> : null}
      {fields.Body ? <div className="deb-feature-icon-item__body"><RichText field={fields.Body} /></div> : null}

    </div>
  );
};
