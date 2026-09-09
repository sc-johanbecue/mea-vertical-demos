'use client';

import type { JSX } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import type { TextField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';
import { FieldLink } from '@/components/banking/FieldLink';

export interface NavItemFields {
  Link?: LinkField;
  Label?: TextField;
}

const defaultFields: NavItemFields = {
  Link: { value: { href: '/', text: 'Home' } },
  Label: { value: 'Home' },
};

export type NavItemProps = ComponentProps & { fields?: NavItemFields };

export const Default = (props: NavItemProps): JSX.Element => {
  const { params, fields = defaultFields } = props;
  const label = String(fields.Label?.value ?? fields.Link?.value?.text ?? '');
  const active = /^(home)$/i.test(label) ? 'active' : '';

  return (
    <span key={componentKey(props)} className={`${params?.styles ?? ''}`.trim()} id={params?.RenderingIdentifier}>
      <FieldLink field={fields.Link} className={`nav-link ${active}`.trim()} />
      {!fields.Link && fields.Label ? (
        <button type="button" className={active}>
          <Text field={fields.Label} />
        </button>
      ) : null}
    </span>
  );
};
