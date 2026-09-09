'use client';

import type { JSX } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { useEditingHydrationProps } from './kpmg-editing-hydration';
import { useKpmgBeyondEventPageFields } from './kpmg-beyond-event-route-fields';

export type KpmgBeyondEventTitleProps = ComponentProps;

export const Default = (props: KpmgBeyondEventTitleProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = useKpmgBeyondEventPageFields(props);
  const editingHydration = useEditingHydrationProps();

  return (
    <header
      key={id ?? props.rendering?.uid}
      {...editingHydration}
      id={id}
      data-cy="event-title"
      className={[
        'component kpmg-beyond-event-title mx-auto w-full max-w-[1059px] px-5 pt-4 xl:px-[60px]',
        styles || '',
      ].join(' ')}
    >
      <Text
        tag="p"
        field={fields.CategoryLabel}
        className="m-0 text-xs font-normal uppercase tracking-wide text-kpmg-label xl:text-sm"
      />
      <Text
        tag="h1"
        field={fields.EventTitle}
        className="m-0 mt-3 text-2xl font-semibold leading-tight text-white xl:text-[40px] xl:leading-[48px]"
      />
    </header>
  );
};
