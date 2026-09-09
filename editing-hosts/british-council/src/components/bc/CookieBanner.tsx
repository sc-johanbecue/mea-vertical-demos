'use client';

import type { JSX } from 'react';
import { Link as SitecoreLink, Text } from '@sitecore-content-sdk/nextjs';
import type { LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';


export interface CookieBannerFields {
  Body: TextField;
  SettingsLink: LinkField;
  AcceptLink: LinkField;
}

const defaultFields: CookieBannerFields = {
  Body: { value: 'We use cookies on this site to enhance your user experience.' },
  SettingsLink: { value: { href: '#', text: 'Cookie Settings' } },
  AcceptLink: { value: { href: '#', text: 'Accept All Cookies' } },
};

export type CookieBannerProps = ComponentProps & { fields?: CookieBannerFields };

function Layout(props: CookieBannerProps, extra = ''): JSX.Element {
  const { params, fields = defaultFields } = props;
  return (
    <div
      key={componentKey(props)}
      className={`bc-cookie component ${extra} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
      role="dialog"
      aria-label="Cookie consent"
    >
      <Text tag="p" className="bc-cookie__body" field={fields.Body} />
      <div className="bc-cookie__actions">
        <SitecoreLink field={fields.SettingsLink} className="bc-btn bc-btn--secondary" />
        <SitecoreLink field={fields.AcceptLink} className="bc-btn bc-btn--primary" />
      </div>
    </div>
  );
}

export const Default = (p: CookieBannerProps): JSX.Element => Layout(p);
export const Inversed = (p: CookieBannerProps): JSX.Element => Layout(p, 'component--inversed');
export const Animated = (p: CookieBannerProps): JSX.Element => Layout(p, 'component--animated');
export const InversedAnimated = (p: CookieBannerProps): JSX.Element =>
  Layout(p, 'component--inversed component--animated');
