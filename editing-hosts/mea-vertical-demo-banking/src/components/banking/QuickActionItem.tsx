'use client';

import type { JSX } from 'react';
import { Text, Image, Link } from '@sitecore-content-sdk/nextjs';
import type { TextField, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface QuickActionItemFields {
  Icon?: ImageField;
  Label?: TextField;
  Link?: LinkField;
}

const defaultFields: QuickActionItemFields = {
  Icon: { value: { src: '', alt: 'Icon' } },
  Label: { value: 'Label' },
  Link: { value: { href: '#', text: 'Link' } },
};

export type QuickActionItemProps = ComponentProps & { fields?: QuickActionItemFields };

export const Default = (props: QuickActionItemProps): JSX.Element => {
  const { params, fields = defaultFields } = props;


  return (
    <div
      key={componentKey(props)}
      className={`deb-quick-action-item ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {fields.Icon?.value?.src ? <Image field={fields.Icon} className="deb-quick-action-item__icon" /> : null}
      {fields.Label ? <Text tag="span" field={fields.Label} className="deb-quick-action-item__label" /> : null}
      {fields.Link ? <Link field={fields.Link} className="deb-quick-action-item__link" /> : null}

    </div>
  );
};
