'use client';

import type { JSX } from 'react';
import { Text, Image } from '@sitecore-content-sdk/nextjs';
import type { TextField, ImageField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface HeroBenefitItemFields {
  Icon?: ImageField;
  Title?: TextField;
  Subtitle?: TextField;
}

const defaultFields: HeroBenefitItemFields = {
  Icon: { value: { src: '', alt: 'Icon' } },
  Title: { value: 'Title' },
  Subtitle: { value: 'Subtitle' },
};

export type HeroBenefitItemProps = ComponentProps & { fields?: HeroBenefitItemFields };

export const Default = (props: HeroBenefitItemProps): JSX.Element => {
  const { params, fields = defaultFields } = props;


  return (
    <div
      key={componentKey(props)}
      className={`deb-hero-benefit-item ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {fields.Icon?.value?.src ? <Image field={fields.Icon} className="deb-hero-benefit-item__icon" /> : null}
      {fields.Title ? <Text tag="span" field={fields.Title} className="deb-hero-benefit-item__title" /> : null}
      {fields.Subtitle ? <Text tag="span" field={fields.Subtitle} className="deb-hero-benefit-item__subtitle" /> : null}

    </div>
  );
};
