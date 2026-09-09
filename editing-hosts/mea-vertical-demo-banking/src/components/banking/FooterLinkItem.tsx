'use client';

import type { JSX } from 'react';
import { Text, Link } from '@sitecore-content-sdk/nextjs';
import type { TextField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface FooterLinkItemFields {
  Link?: LinkField;
  Label?: TextField;
}

const defaultFields: FooterLinkItemFields = {
  Link: { value: { href: '#', text: 'Link' } },
  Label: { value: 'Label' },
};

export type FooterLinkItemProps = ComponentProps & { fields?: FooterLinkItemFields };

export const Default = (props: FooterLinkItemProps): JSX.Element => {
  const { params, fields = defaultFields } = props;


  return (
    <div
      key={componentKey(props)}
      className={`deb-footer-link-item ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {fields.Link ? <Link field={fields.Link} className="deb-footer-link-item__link" /> : null}
      {fields.Label ? <Text tag="span" field={fields.Label} className="deb-footer-link-item__label" /> : null}

    </div>
  );
};
