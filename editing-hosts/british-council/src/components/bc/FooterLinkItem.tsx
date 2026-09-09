'use client';

import type { JSX } from 'react';
import { Link as SitecoreLink } from '@sitecore-content-sdk/nextjs';
import type { LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';


export interface FooterLinkItemFields {
  Link: LinkField;
}

const defaultFields: FooterLinkItemFields = {
  Link: { value: { href: '/', text: 'Footer link' } },
};

export type FooterLinkItemProps = ComponentProps & { fields?: FooterLinkItemFields };

function Layout(props: FooterLinkItemProps, extra = ''): JSX.Element {
  const { params, fields = defaultFields } = props;
  return (
    <li
      key={componentKey(props)}
      className={`bc-footer-link component ${extra} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <SitecoreLink field={fields.Link} />
    </li>
  );
}

export const Default = (p: FooterLinkItemProps): JSX.Element => Layout(p);
export const Inversed = (p: FooterLinkItemProps): JSX.Element => Layout(p, 'component--inversed');
export const Animated = (p: FooterLinkItemProps): JSX.Element => Layout(p, 'component--animated');
export const InversedAnimated = (p: FooterLinkItemProps): JSX.Element =>
  Layout(p, 'component--inversed component--animated');
