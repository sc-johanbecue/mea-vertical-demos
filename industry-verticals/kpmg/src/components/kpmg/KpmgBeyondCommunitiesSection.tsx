'use client';

import type { JSX } from 'react';
import { Placeholder, Text, TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { useEditingHydrationProps } from './kpmg-editing-hydration';

export interface KpmgBeyondCommunitiesSectionFields {
  Title: TextField;
}

const defaultFields: KpmgBeyondCommunitiesSectionFields = {
  Title: { value: 'Your communities' },
};

export type KpmgBeyondCommunitiesSectionProps = ComponentProps & {
  fields: KpmgBeyondCommunitiesSectionFields;
};

export const Default = (props: KpmgBeyondCommunitiesSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = props.fields || defaultFields;
  const editingHydration = useEditingHydrationProps();
  const ph = `kpmg-beyond-communities-${DynamicPlaceholderId ?? '1'}`;

  return (
    <section
      key={id ?? props.rendering?.uid}
      {...editingHydration}
      id={id}
      data-cy="Communities"
      className={[
        'component kpmg-beyond-communities px-4 text-white xl:px-4',
        '[&_h2]:text-white [&_span]:text-white [&_a]:text-white',
        styles || '',
      ].join(' ')}
    >
      <Text
        tag="h2"
        field={fields.Title}
        className="m-0 text-xl font-semibold text-white! xl:text-[28px]"
      />
      <div
        className="mt-4 flex flex-wrap gap-4 text-white xl:gap-3 [&_a]:text-white [&_span]:text-white"
        data-cy="my-communities"
      >
        <Placeholder name={ph} rendering={props.rendering} />
      </div>
    </section>
  );
};
