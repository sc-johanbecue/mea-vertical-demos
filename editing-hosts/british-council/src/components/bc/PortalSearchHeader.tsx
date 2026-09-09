'use client';

import type { JSX } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import type { TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface PortalSearchHeaderFields {
  Title?: TextField;
  SearchPlaceholder?: TextField;
}

const defaults: Required<PortalSearchHeaderFields> = {
  Title: { value: 'Discover' },
  SearchPlaceholder: { value: 'Search' },
};

export type PortalSearchHeaderProps = ComponentProps & { fields?: PortalSearchHeaderFields };

function Layout(props: PortalSearchHeaderProps, extra = ''): JSX.Element {
  const { params } = props;
  const fields = { ...defaults, ...props.fields } as typeof defaults;
  const placeholder = String(fields.SearchPlaceholder?.value ?? 'Search');
  return (
    <div
      key={componentKey(props)}
      className={`bc-portal-search component ${extra} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <div className="bc-portal-search__top">
        <Text tag="h1" className="bc-portal-search__title" field={fields.Title} />
      </div>
      <label className="bc-portal-search__bar">
        <span className="bc-portal-search__magnifier" aria-hidden="true" />
        <input type="search" placeholder={placeholder} readOnly aria-label={placeholder} />
      </label>
    </div>
  );
}

export const Default = (p: PortalSearchHeaderProps): JSX.Element => Layout(p);
export const Inversed = (p: PortalSearchHeaderProps): JSX.Element => Layout(p, 'component--inversed');
export const Animated = (p: PortalSearchHeaderProps): JSX.Element => Layout(p, 'component--animated');
export const InversedAnimated = (p: PortalSearchHeaderProps): JSX.Element =>
  Layout(p, 'component--inversed component--animated');
