'use client';

import type { JSX } from 'react';
import { Placeholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';


export type BreadcrumbProps = ComponentProps;

function Layout(props: BreadcrumbProps, extra = ''): JSX.Element {
  const { params, rendering } = props;
  const ph = `breadcrumb-items-${params?.DynamicPlaceholderId ?? ''}`;
  return (
    <nav
      key={componentKey(props)}
      className={`bc-breadcrumb component ${extra} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
      aria-label="Breadcrumb"
    >
      <ol className="bc-breadcrumb__list">
        <Placeholder name={ph} rendering={rendering} />
      </ol>
    </nav>
  );
}

export const Default = (p: BreadcrumbProps): JSX.Element => Layout(p);
export const Inversed = (p: BreadcrumbProps): JSX.Element => Layout(p, 'component--inversed');
export const Animated = (p: BreadcrumbProps): JSX.Element => Layout(p, 'component--animated');
export const InversedAnimated = (p: BreadcrumbProps): JSX.Element =>
  Layout(p, 'component--inversed component--animated');
