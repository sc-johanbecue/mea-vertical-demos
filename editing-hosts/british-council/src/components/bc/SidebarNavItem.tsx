'use client';

import type { JSX } from 'react';
import { Link as SitecoreLink, Text } from '@sitecore-content-sdk/nextjs';
import type { LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';


export interface SidebarNavItemFields {
  Link: LinkField;
  IsActive: TextField;
}

const defaultFields: SidebarNavItemFields = {
  Link: { value: { href: '/', text: 'Sidebar link' } },
  IsActive: { value: '' },
};

export type SidebarNavItemProps = ComponentProps & { fields?: SidebarNavItemFields };

function Layout(props: SidebarNavItemProps, extra = ''): JSX.Element {
  const { params, fields = defaultFields } = props;
  const active = Boolean(fields.IsActive?.value);
  return (
    <li
      key={componentKey(props)}
      className={`bc-sidebar-nav-item component ${active ? 'is-active' : ''} ${extra} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <SitecoreLink field={fields.Link} />
      <Text tag="span" className="sr-only" field={fields.IsActive} />
    </li>
  );
}

export const Default = (p: SidebarNavItemProps): JSX.Element => Layout(p);
export const Inversed = (p: SidebarNavItemProps): JSX.Element => Layout(p, 'component--inversed');
export const Animated = (p: SidebarNavItemProps): JSX.Element => Layout(p, 'component--animated');
export const InversedAnimated = (p: SidebarNavItemProps): JSX.Element =>
  Layout(p, 'component--inversed component--animated');
