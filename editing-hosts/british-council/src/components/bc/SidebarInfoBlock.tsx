'use client';

import type { JSX } from 'react';
import { Image, Link as SitecoreLink, Text } from '@sitecore-content-sdk/nextjs';
import type { ImageField, LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';


export interface SidebarInfoBlockFields {
  Title: TextField;
  Body: TextField;
  Link: LinkField;
  Icon: ImageField;
}

const defaultFields: SidebarInfoBlockFields = {
  Title: { value: 'Mobile apps' },
  Body: { value: '' },
  Link: { value: { href: '/', text: 'Find out more' } },
  Icon: { value: { src: '', alt: '' } },
};

export type SidebarInfoBlockProps = ComponentProps & { fields?: SidebarInfoBlockFields };

function Layout(props: SidebarInfoBlockProps, extra = ''): JSX.Element {
  const { params, fields = defaultFields } = props;
  return (
    <aside
      key={componentKey(props)}
      className={`bc-sidebar-info component ${extra} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {fields.Icon?.value?.src ? (
        <Image field={fields.Icon} className="bc-sidebar-info__icon" />
      ) : null}
      <Text tag="h2" className="bc-sidebar-info__title" field={fields.Title} />
      <Text tag="p" className="bc-sidebar-info__body" field={fields.Body} />
      <SitecoreLink field={fields.Link} className="bc-sidebar-info__link" />
    </aside>
  );
}

export const Default = (p: SidebarInfoBlockProps): JSX.Element => Layout(p);
export const Inversed = (p: SidebarInfoBlockProps): JSX.Element => Layout(p, 'component--inversed');
export const Animated = (p: SidebarInfoBlockProps): JSX.Element => Layout(p, 'component--animated');
export const InversedAnimated = (p: SidebarInfoBlockProps): JSX.Element =>
  Layout(p, 'component--inversed component--animated');
