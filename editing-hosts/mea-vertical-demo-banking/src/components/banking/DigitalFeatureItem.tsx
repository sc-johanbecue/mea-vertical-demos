'use client';

import type { JSX } from 'react';
import { Text, RichText, Image } from '@sitecore-content-sdk/nextjs';
import type { TextField, ImageField, RichTextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface DigitalFeatureItemFields {
  Icon?: ImageField;
  Title?: TextField;
  Body?: RichTextField;
}

const defaultFields: DigitalFeatureItemFields = {
  Icon: { value: { src: '', alt: 'Icon' } },
  Title: { value: 'Title' },
  Body: { value: '<p>Body</p>' },
};

export type DigitalFeatureItemProps = ComponentProps & { fields?: DigitalFeatureItemFields };

export const Default = (props: DigitalFeatureItemProps): JSX.Element => {
  const { params, fields = defaultFields } = props;


  return (
    <div
      key={componentKey(props)}
      className={`deb-digital-feature-item ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {fields.Icon?.value?.src ? <Image field={fields.Icon} className="deb-digital-feature-item__icon" /> : null}
      {fields.Title ? <Text tag="span" field={fields.Title} className="deb-digital-feature-item__title" /> : null}
      {fields.Body ? <div className="deb-digital-feature-item__body"><RichText field={fields.Body} /></div> : null}

    </div>
  );
};
