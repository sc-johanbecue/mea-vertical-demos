'use client';

import type { JSX } from 'react';
import { Link as SitecoreLink, Placeholder, Text } from '@sitecore-content-sdk/nextjs';
import type { LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';


export interface SidebarNavigationFields {
  Title: TextField;
  ParentLink: LinkField;
}

const defaultFields: SidebarNavigationFields = {
  Title: { value: 'Learn English' },
  ParentLink: { value: { href: '/english', text: 'Learn English' } },
};

export type SidebarNavigationProps = ComponentProps & { fields?: SidebarNavigationFields };

function Layout(props: SidebarNavigationProps, extra = ''): JSX.Element {
  const { params, fields = defaultFields, rendering } = props;
  const ph = `sidebar-links-${params?.DynamicPlaceholderId ?? ''}`;
  return (
    <nav
      key={componentKey(props)}
      className={`bc-sidebar-nav component ${extra} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
      aria-label="Section"
    >
      <SitecoreLink field={fields.ParentLink} className="bc-sidebar-nav__parent">
        <Text tag="span" field={fields.Title} />
      </SitecoreLink>
      <ul className="bc-sidebar-nav__list">
        <Placeholder name={ph} rendering={rendering} />
      </ul>
    </nav>
  );
}

export const Default = (p: SidebarNavigationProps): JSX.Element => Layout(p);
export const Inversed = (p: SidebarNavigationProps): JSX.Element => Layout(p, 'component--inversed');
export const Animated = (p: SidebarNavigationProps): JSX.Element => Layout(p, 'component--animated');
export const InversedAnimated = (p: SidebarNavigationProps): JSX.Element =>
  Layout(p, 'component--inversed component--animated');
