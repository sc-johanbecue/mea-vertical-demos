'use client';

import type { JSX } from 'react';
import { Link as SitecoreLink, Text } from '@sitecore-content-sdk/nextjs';
import type { LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';


export interface ColorLinkCardFields {
  Title: TextField;
  Link: LinkField;
  BackgroundColor: TextField;
}

const defaultFields: ColorLinkCardFields = {
  Title: { value: 'Learn English' },
  Link: { value: { href: '/', text: 'Learn English' } },
  BackgroundColor: { value: '#2c681b' },
};

export type ColorLinkCardProps = ComponentProps & { fields?: ColorLinkCardFields };

function Layout(props: ColorLinkCardProps, extra = ''): JSX.Element {
  const { params, fields = defaultFields } = props;
  const bg = String(fields.BackgroundColor?.value || '#23085a');
  return (
    <li
      key={componentKey(props)}
      className={`bc-color-card component ${extra} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
      style={{ backgroundColor: bg }}
    >
      <SitecoreLink field={fields.Link} className="bc-color-card__link">
        <Text tag="h3" field={fields.Title} />
      </SitecoreLink>
    </li>
  );
}

export const Default = (p: ColorLinkCardProps): JSX.Element => Layout(p);
export const Inversed = (p: ColorLinkCardProps): JSX.Element => Layout(p, 'component--inversed');
export const Animated = (p: ColorLinkCardProps): JSX.Element => Layout(p, 'component--animated');
export const InversedAnimated = (p: ColorLinkCardProps): JSX.Element =>
  Layout(p, 'component--inversed component--animated');
