'use client';

import type { JSX } from 'react';
import { Placeholder, Text } from '@sitecore-content-sdk/nextjs';
import type { ImageField, LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { X } from 'lucide-react';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';
import { usePortalNav } from './portal-nav-context';

export interface PortalLeftNavFields {
  Logo?: ImageField;
  LogoLink?: LinkField;
  PortalTitle?: TextField;
  MyLoftLogo?: ImageField;
}

const defaults: Required<PortalLeftNavFields> = {
  Logo: { value: { src: '', alt: 'British Council' } },
  LogoLink: { value: { href: '/', text: 'British Council' } },
  PortalTitle: { value: 'British Council Digital Library' },
  MyLoftLogo: { value: { src: '', alt: 'MyLOFT' } },
};

export type PortalLeftNavProps = ComponentProps & { fields?: PortalLeftNavFields };

function Layout(props: PortalLeftNavProps, extra = ''): JSX.Element {
  const { params, rendering } = props;
  const fields = { ...defaults, ...props.fields } as typeof defaults;
  const id = params?.DynamicPlaceholderId ?? '1';
  const { closeNav } = usePortalNav();

  return (
    <nav
      key={componentKey(props)}
      className={`bc-portal-nav component ${extra} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
      aria-label="Portal"
    >
      <div className="bc-portal-nav__brand">
        <div className="bc-portal-nav__brand-row">
          <button
            type="button"
            className="bc-portal-nav__close"
            aria-label="Close menu"
            onClick={closeNav}
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>
        <Text tag="p" className="bc-portal-nav__title" field={fields.PortalTitle} />
      </div>
      <ul className="bc-portal-nav__list">
        <Placeholder name={`portal-nav-items-${id}`} rendering={rendering} />
      </ul>
    </nav>
  );
}

export const Default = (p: PortalLeftNavProps): JSX.Element => Layout(p);
export const Inversed = (p: PortalLeftNavProps): JSX.Element => Layout(p, 'component--inversed');
export const Animated = (p: PortalLeftNavProps): JSX.Element => Layout(p, 'component--animated');
export const InversedAnimated = (p: PortalLeftNavProps): JSX.Element =>
  Layout(p, 'component--inversed component--animated');
