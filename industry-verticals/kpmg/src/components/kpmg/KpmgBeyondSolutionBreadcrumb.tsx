'use client';

import type { JSX } from 'react';
import Link from 'next/link';
import { ComponentProps } from '@/lib/component-props';
import { useEditingHydrationProps } from './kpmg-editing-hydration';

export type KpmgBeyondSolutionBreadcrumbProps = ComponentProps;

export const Default = (props: KpmgBeyondSolutionBreadcrumbProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const editingHydration = useEditingHydrationProps();

  return (
    <nav
      key={id ?? props.rendering?.uid}
      {...editingHydration}
      id={id}
      aria-label="Breadcrumb"
      data-cy="solution-breadcrumb"
      className={[
        'component kpmg-beyond-solution-breadcrumb mx-auto w-full max-w-[860px] px-5 pt-6 xl:px-[60px]',
        styles || '',
      ].join(' ')}
    >
      <Link href="/solutions" className="text-sm text-kpmg-label no-underline hover:underline">
        Solutions
      </Link>
    </nav>
  );
};
