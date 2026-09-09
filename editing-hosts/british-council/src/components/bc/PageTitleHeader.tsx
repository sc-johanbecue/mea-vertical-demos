'use client';

import type { JSX } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import type { TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';


export interface PageTitleHeaderFields {
  Title: TextField;
}

const defaultFields: PageTitleHeaderFields = {
  Title: { value: 'Page title' },
};

export type PageTitleHeaderProps = ComponentProps & { fields?: PageTitleHeaderFields };

function Layout(props: PageTitleHeaderProps, extra = ''): JSX.Element {
  const { params, fields = defaultFields } = props;
  return (
    <header
      key={componentKey(props)}
      className={`bc-page-title component ${extra} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <Text tag="h1" className="bc-page-title__heading" field={fields.Title} />
      <span className="bc-page-title__underline" aria-hidden="true" />
    </header>
  );
}

export const Default = (p: PageTitleHeaderProps): JSX.Element => Layout(p);
export const Inversed = (p: PageTitleHeaderProps): JSX.Element => Layout(p, 'component--inversed');
export const Animated = (p: PageTitleHeaderProps): JSX.Element => Layout(p, 'component--animated');
export const InversedAnimated = (p: PageTitleHeaderProps): JSX.Element =>
  Layout(p, 'component--inversed component--animated');
