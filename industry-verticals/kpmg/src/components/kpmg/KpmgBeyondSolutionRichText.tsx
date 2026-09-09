'use client';

import type { JSX } from 'react';
import { RichText } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { useEditingHydrationProps } from './kpmg-editing-hydration';
import { useKpmgBeyondSolutionRouteFields } from './kpmg-beyond-solution-route-fields';

export type KpmgBeyondSolutionRichTextProps = ComponentProps;

export const Default = (props: KpmgBeyondSolutionRichTextProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = useKpmgBeyondSolutionRouteFields();
  const editingHydration = useEditingHydrationProps();

  return (
    <section
      key={id ?? props.rendering?.uid}
      {...editingHydration}
      id={id}
      data-cy="solution-body"
      className={[
        'component kpmg-beyond-solution-body mx-auto w-full max-w-[860px] px-5 py-8 xl:px-[60px]',
        styles || '',
      ].join(' ')}
    >
      <div className="kpmg-beyond-solution-richtext text-base leading-7 text-white/90 [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white [&_li]:mb-2 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6">
        <RichText field={fields.Body} />
      </div>
    </section>
  );
};
