'use client';

import type { JSX } from 'react';
import {
  ImageField,
  LinkField,
  Image as SitecoreImage,
  Link as SitecoreLink,
  Text,
  TextField,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { useEditingHydrationProps } from './kpmg-editing-hydration';

export interface KpmgBeyondCuratedCollectionCardFields {
  Title: TextField;
  Image: ImageField;
  Link: LinkField;
}

const defaultFields: KpmgBeyondCuratedCollectionCardFields = {
  Title: { value: 'Collection title' },
  Image: { value: { src: '', alt: '' } },
  Link: { value: { href: '#' } },
};

export type KpmgBeyondCuratedCollectionCardProps = ComponentProps & {
  fields: KpmgBeyondCuratedCollectionCardFields;
};

export const Default = (props: KpmgBeyondCuratedCollectionCardProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;
  const editingHydration = useEditingHydrationProps();
  const componentKey = props.rendering?.uid ?? id ?? 'curated-collection-card';

  return (
    <SitecoreLink
      key={componentKey}
      {...editingHydration}
      field={fields.Link}
      className={[
        'component kpmg-beyond-curated-collection-card group block min-w-[260px] max-w-[320px] shrink-0 no-underline',
        styles || '',
      ].join(' ')}
      id={id}
      data-cy="curated-collection-card"
    >
      <article className="flex h-full flex-col overflow-hidden rounded-sm bg-kpmg-card">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-kpmg-elevated">
          <SitecoreImage
            field={fields.Image}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
        <div className="px-4 py-4">
          <Text
            tag="h3"
            field={fields.Title}
            className="m-0 line-clamp-2 text-base font-semibold leading-6 text-white group-hover:underline"
            data-cy="curated-collection-title"
          />
        </div>
      </article>
    </SitecoreLink>
  );
};
