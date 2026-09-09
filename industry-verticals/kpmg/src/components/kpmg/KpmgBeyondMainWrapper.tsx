'use client';

import type { JSX, ReactNode } from 'react';
import { Placeholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { useEditingHydrationProps } from './kpmg-editing-hydration';

/**
 * Groups page sections in headless-main. Layout applies sidebar/header offsets via .kpmg-beyond-main-area.
 * Place in headless-main as the outermost rendering; put Hero, Communities, etc. in kpmg-beyond-main-{id}.
 */
export type KpmgBeyondMainWrapperProps = ComponentProps;

export const Default = (props: KpmgBeyondMainWrapperProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const ph = `kpmg-beyond-main-${DynamicPlaceholderId ?? '1'}`;
  const editingHydration = useEditingHydrationProps();

  return (
    <div
      key={id ?? props.rendering?.uid}
      {...editingHydration}
      id={id}
      className={['component kpmg-beyond-main w-full', styles || ''].join(' ')}
    >
      <div className="mx-auto w-full max-w-[1920px]">
        <Placeholder name={ph} rendering={props.rendering} />
      </div>
    </div>
  );
};

/** Used when composing children without Sitecore placeholder (internal) */
export function KpmgBeyondMainOffset({ children }: { children: ReactNode }): JSX.Element {
  return <div className="mx-auto w-full max-w-[1920px]">{children}</div>;
}
