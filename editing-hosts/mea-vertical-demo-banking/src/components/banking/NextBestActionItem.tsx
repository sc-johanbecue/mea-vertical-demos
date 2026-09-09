'use client';

import type { JSX } from 'react';
import { Text, RichText, Image, Link } from '@sitecore-content-sdk/nextjs';
import type { TextField, ImageField, RichTextField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface NextBestActionItemFields {
  Icon?: ImageField;
  Title?: TextField;
  Body?: RichTextField;
  Link?: LinkField;
}

const defaultFields: NextBestActionItemFields = {
  Icon: { value: { src: '', alt: 'Icon' } },
  Title: { value: 'Title' },
  Body: { value: '<p>Body</p>' },
  Link: { value: { href: '#', text: 'Link' } },
};

export type NextBestActionItemProps = ComponentProps & { fields?: NextBestActionItemFields };

export const Default = (props: NextBestActionItemProps): JSX.Element => {
  const { params, fields = defaultFields } = props;


  return (
    <div
      key={componentKey(props)}
      className={`deb-next-best-action-item ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {fields.Icon?.value?.src ? <Image field={fields.Icon} className="deb-next-best-action-item__icon" /> : null}
      {fields.Title ? <Text tag="span" field={fields.Title} className="deb-next-best-action-item__title" /> : null}
      {fields.Body ? <div className="deb-next-best-action-item__body"><RichText field={fields.Body} /></div> : null}
      {fields.Link ? <Link field={fields.Link} className="deb-next-best-action-item__link" /> : null}

    </div>
  );
};
