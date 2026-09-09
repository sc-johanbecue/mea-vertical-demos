'use client';

import type { JSX } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { useEditingHydrationProps } from './kpmg-editing-hydration';
import { useKpmgBeyondSolutionRouteFields } from './kpmg-beyond-solution-route-fields';

export type KpmgBeyondSolutionTitleProps = ComponentProps;

export const Default = (props: KpmgBeyondSolutionTitleProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = useKpmgBeyondSolutionRouteFields();
  const editingHydration = useEditingHydrationProps();

  return (
    <header
      key={id ?? props.rendering?.uid}
      {...editingHydration}
      id={id}
      data-cy="solution-title"
      className={[
        'component kpmg-beyond-solution-title mx-auto w-full max-w-[860px] px-5 pt-3 xl:px-[60px]',
        styles || '',
      ].join(' ')}
    >
      <Text
        tag="h1"
        field={fields.Label}
        className="m-0 text-2xl font-semibold leading-tight text-white xl:text-[40px] xl:leading-[48px]"
      />
      <Text
        tag="p"
        field={fields.Title}
        className="mt-4 text-base font-semibold leading-7 text-white xl:text-lg"
      />
    </header>
  );
};
