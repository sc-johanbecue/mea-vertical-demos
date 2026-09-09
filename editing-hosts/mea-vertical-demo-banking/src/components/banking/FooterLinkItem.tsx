'use client';

import type { JSX } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import type { TextField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';
import { FieldLink } from '@/components/banking/FieldLink';

export interface FooterLinkItemFields {
  Link?: LinkField;
  Label?: TextField;
}

const defaultFields: FooterLinkItemFields = {
  Link: { value: { href: '#', text: 'Privacy' } },
  Label: { value: 'Privacy' },
};

export type FooterLinkItemProps = ComponentProps & { fields?: FooterLinkItemFields };

export const Default = (props: FooterLinkItemProps): JSX.Element => {
  const { params, fields = defaultFields } = props;
  return (
    <span key={componentKey(props)} className={`${params?.styles ?? ''}`.trim()} id={params?.RenderingIdentifier}>
      <FieldLink field={fields.Link} />
      {!fields.Link && fields.Label ? (
        <button type="button">
          <Text field={fields.Label} />
        </button>
      ) : null}
    </span>
  );
};
