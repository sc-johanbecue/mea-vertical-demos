'use client';

import type { JSX } from 'react';
import { Link as SitecoreLink, Text } from '@sitecore-content-sdk/nextjs';
import type { LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, hasLink } from '@/lib/component-utils';

export interface BreadcrumbItemFields {
  Link: LinkField;
  Title: TextField;
}

const defaultFields: BreadcrumbItemFields = {
  Link: { value: { href: '/', text: 'Home' } },
  Title: { value: 'Home' },
};

export type BreadcrumbItemProps = ComponentProps & { fields?: BreadcrumbItemFields };

export const Default = (props: BreadcrumbItemProps): JSX.Element => {
  const { params, fields = defaultFields } = props;

  return (
    <li
      key={componentKey(props)}
      className={`bma-breadcrumb-item ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {hasLink(fields.Link?.value) ? (
        <SitecoreLink field={fields.Link} className="bma-breadcrumb-item__link">
          <Text field={fields.Title} />
        </SitecoreLink>
      ) : (
        <Text tag="span" className="bma-breadcrumb-item__current" field={fields.Title} />
      )}
    </li>
  );
};
