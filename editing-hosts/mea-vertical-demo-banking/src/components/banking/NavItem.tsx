'use client';

import type { JSX } from 'react';
import { Text, Link } from '@sitecore-content-sdk/nextjs';
import type { TextField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface NavItemFields {
  Link?: LinkField;
  Label?: TextField;
}

const defaultFields: NavItemFields = {
  Link: { value: { href: '#', text: 'Link' } },
  Label: { value: 'Label' },
};

export type NavItemProps = ComponentProps & { fields?: NavItemFields };

export const Default = (props: NavItemProps): JSX.Element => {
  const { params, fields = defaultFields } = props;


  return (
    <div
      key={componentKey(props)}
      className={`deb-nav-item ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {fields.Link ? <Link field={fields.Link} className="deb-nav-item__link" /> : null}
      {fields.Label ? <Text tag="span" field={fields.Label} className="deb-nav-item__label" /> : null}

    </div>
  );
};
