'use client';

import type { JSX } from 'react';
import { Link as SitecoreLink } from '@sitecore-content-sdk/nextjs';
import type { LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface LinkListItemFields {
  Link: LinkField;
}

const defaultFields: LinkListItemFields = {
  Link: { value: { href: '#', text: 'Link item' } },
};

export type LinkListItemProps = ComponentProps & { fields?: LinkListItemFields };

export const Default = (props: LinkListItemProps): JSX.Element => {
  const { params, fields = defaultFields } = props;

  return (
    <li
      key={componentKey(props)}
      className={`bma-link-item ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <SitecoreLink field={fields.Link} className="bma-link-item__link" />
    </li>
  );
};
