'use client';

import type { JSX } from 'react';
import { Text, Image, Link } from '@sitecore-content-sdk/nextjs';
import type { TextField, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface ConfidenceCtaBarFields {
  LeftIcon?: ImageField;
  LeftTitle?: TextField;
  LeftBody?: TextField;
  RightIcon?: ImageField;
  RightTitle?: TextField;
  RightBody?: TextField;
  PrimaryLink?: LinkField;
}

const defaultFields: ConfidenceCtaBarFields = {
  LeftIcon: { value: { src: '', alt: 'LeftIcon' } },
  LeftTitle: { value: 'LeftTitle' },
  LeftBody: { value: 'LeftBody' },
  RightIcon: { value: { src: '', alt: 'RightIcon' } },
  RightTitle: { value: 'RightTitle' },
  RightBody: { value: 'RightBody' },
  PrimaryLink: { value: { href: '#', text: 'PrimaryLink' } },
};

export type ConfidenceCtaBarProps = ComponentProps & { fields?: ConfidenceCtaBarFields };

export const Default = (props: ConfidenceCtaBarProps): JSX.Element => {
  const { params, fields = defaultFields } = props;


  return (
    <div
      key={componentKey(props)}
      className={`deb-confidence-cta-bar ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {fields.LeftIcon?.value?.src ? <Image field={fields.LeftIcon} className="deb-confidence-cta-bar__left-icon" /> : null}
      {fields.LeftTitle ? <Text tag="span" field={fields.LeftTitle} className="deb-confidence-cta-bar__left-title" /> : null}
      {fields.LeftBody ? <Text tag="span" field={fields.LeftBody} className="deb-confidence-cta-bar__left-body" /> : null}
      {fields.RightIcon?.value?.src ? <Image field={fields.RightIcon} className="deb-confidence-cta-bar__right-icon" /> : null}
      {fields.RightTitle ? <Text tag="span" field={fields.RightTitle} className="deb-confidence-cta-bar__right-title" /> : null}
      {fields.RightBody ? <Text tag="span" field={fields.RightBody} className="deb-confidence-cta-bar__right-body" /> : null}
      {fields.PrimaryLink ? <Link field={fields.PrimaryLink} className="deb-confidence-cta-bar__primary-link" /> : null}

    </div>
  );
};
