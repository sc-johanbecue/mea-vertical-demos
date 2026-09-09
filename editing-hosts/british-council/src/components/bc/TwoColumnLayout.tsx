'use client';

import type { JSX } from 'react';
import { Placeholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';


export type TwoColumnLayoutProps = ComponentProps;

function Layout(props: TwoColumnLayoutProps, extra = ''): JSX.Element {
  const { params, rendering } = props;
  const mainPh = `main-${params?.DynamicPlaceholderId ?? ''}`;
  const sidebarPh = `sidebar-${params?.DynamicPlaceholderId ?? ''}`;
  return (
    <div
      key={componentKey(props)}
      className={`bc-two-col component ${extra} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <div className="bc-container bc-two-col__inner">
        <div className="bc-two-col__main">
          <Placeholder name={mainPh} rendering={rendering} />
        </div>
        <aside className="bc-two-col__sidebar">
          <Placeholder name={sidebarPh} rendering={rendering} />
        </aside>
      </div>
    </div>
  );
}

export const Default = (p: TwoColumnLayoutProps): JSX.Element => Layout(p);
export const Inversed = (p: TwoColumnLayoutProps): JSX.Element => Layout(p, 'component--inversed');
export const Animated = (p: TwoColumnLayoutProps): JSX.Element => Layout(p, 'component--animated');
export const InversedAnimated = (p: TwoColumnLayoutProps): JSX.Element =>
  Layout(p, 'component--inversed component--animated');
