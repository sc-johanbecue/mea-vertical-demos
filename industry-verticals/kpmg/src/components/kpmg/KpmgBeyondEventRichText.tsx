'use client';

import type { JSX } from 'react';
import { RichText } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { useEditingHydrationProps } from './kpmg-editing-hydration';
import { useKpmgBeyondEventPageFields } from './kpmg-beyond-event-route-fields';

export type KpmgBeyondEventRichTextProps = ComponentProps;

export const Default = (props: KpmgBeyondEventRichTextProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = useKpmgBeyondEventPageFields(props);
  const editingHydration = useEditingHydrationProps();

  return (
    <section
      key={id ?? props.rendering?.uid}
      {...editingHydration}
      id={id}
      data-cy="event-body"
      className={[
        'component kpmg-beyond-event-body mx-auto w-full max-w-[1059px] px-5 py-8 xl:px-[60px]',
        styles || '',
      ].join(' ')}
    >
      <h2 className="m-0 mb-6 text-xl font-semibold text-white xl:text-2xl">About</h2>
      <div className="kpmg-beyond-event-richtext text-base leading-7 text-white/90 [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white [&_li]:mb-2 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6">
        <RichText field={fields.Body} />
      </div>
    </section>
  );
};
