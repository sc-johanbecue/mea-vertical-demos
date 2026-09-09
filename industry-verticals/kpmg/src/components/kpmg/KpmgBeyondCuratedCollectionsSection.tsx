import type { JSX } from 'react';
import {
  LinkField,
  Link as SitecoreLink,
  Placeholder,
  Text,
  TextField,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { useEditingHydrationProps } from './kpmg-editing-hydration';

export interface KpmgBeyondCuratedCollectionsSectionFields {
  Title: TextField;
  ViewAllLink: LinkField;
}

const defaultFields: KpmgBeyondCuratedCollectionsSectionFields = {
  Title: { value: 'Curated Collections' },
  ViewAllLink: { value: { href: '/curated-collections', text: 'View all' } },
};

export type KpmgBeyondCuratedCollectionsSectionProps = ComponentProps & {
  fields: KpmgBeyondCuratedCollectionsSectionFields;
};

export const Default = (props: KpmgBeyondCuratedCollectionsSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = { ...defaultFields, ...props.rendering?.fields, ...props.fields };
  const editingHydration = useEditingHydrationProps();
  const ph = `kpmg-beyond-curated-collections-${DynamicPlaceholderId ?? '1'}`;

  return (
    <section
      key={id ?? props.rendering?.uid}
      {...editingHydration}
      id={id}
      data-cy="curated-collections-section"
      className={[
        'component kpmg-beyond-curated-collections w-full bg-kpmg-elevated px-5 py-10 xl:px-[60px]',
        styles || '',
      ].join(' ')}
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Text
            tag="h2"
            field={fields.Title}
            className="m-0 text-[22px] font-semibold text-white xl:text-[28px]"
            data-cy="curated-collections-title"
          />
          <SitecoreLink
            field={fields.ViewAllLink}
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-2 text-sm font-medium text-white no-underline transition-colors hover:border-white/40"
            data-cy="curated-collections-view-all"
          />
        </div>
        <div
          className="flex gap-4 overflow-x-auto pb-2 scroll-smooth [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden"
          data-cy="curated-collections-cards"
        >
          <Placeholder name={ph} rendering={props.rendering} />
        </div>
      </div>
    </section>
  );
};
