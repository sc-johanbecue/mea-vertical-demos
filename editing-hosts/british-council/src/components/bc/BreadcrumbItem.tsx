'use client';

import type { JSX } from 'react';
import { Link as SitecoreLink, Text } from '@sitecore-content-sdk/nextjs';
import type { LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';


export interface BreadcrumbItemFields {
  Title: TextField;
  Link: LinkField;
}

const defaultFields: BreadcrumbItemFields = {
  Title: { value: 'Home' },
  Link: { value: { href: '/', text: 'Home' } },
};

export type BreadcrumbItemProps = ComponentProps & { fields?: BreadcrumbItemFields };

function Layout(props: BreadcrumbItemProps, extra = ''): JSX.Element {
  const { params, fields = defaultFields } = props;
  return (
    <li
      key={componentKey(props)}
      className={`bc-breadcrumb-item component ${extra} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <SitecoreLink field={fields.Link}>
        <Text tag="span" field={fields.Title} />
      </SitecoreLink>
    </li>
  );
}

export const Default = (p: BreadcrumbItemProps): JSX.Element => Layout(p);
export const Inversed = (p: BreadcrumbItemProps): JSX.Element => Layout(p, 'component--inversed');
export const Animated = (p: BreadcrumbItemProps): JSX.Element => Layout(p, 'component--animated');
export const InversedAnimated = (p: BreadcrumbItemProps): JSX.Element =>
  Layout(p, 'component--inversed component--animated');
