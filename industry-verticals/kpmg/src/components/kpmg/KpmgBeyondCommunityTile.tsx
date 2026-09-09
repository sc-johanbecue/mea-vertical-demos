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

export interface KpmgBeyondCommunityTileFields {
  Label: TextField;
  Link: LinkField;
  AvatarImage: ImageField;
}

const defaultFields: KpmgBeyondCommunityTileFields = {
  Label: { value: 'Explore Communities' },
  Link: { value: { href: '/communities/explore' } },
  AvatarImage: { value: { src: '', alt: 'Explore Communities' } },
};

export type KpmgBeyondCommunityTileProps = ComponentProps & {
  fields: KpmgBeyondCommunityTileFields;
};

export const Default = (props: KpmgBeyondCommunityTileProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;
  const editingHydration = useEditingHydrationProps();
  const componentKey = props.rendering?.uid ?? id ?? 'community-tile';

  return (
    <SitecoreLink
      key={componentKey}
      {...editingHydration}
      field={fields.Link}
      className={[
        'component kpmg-beyond-community-tile flex shrink-0 flex-col items-center no-underline',
        'text-white hover:text-white focus:text-white visited:text-white',
        '[&_span]:text-white',
        styles || '',
      ].join(' ')}
      id={id}
      data-cy="communities-avatar"
    >
      <span className="relative inline-flex">
        <span className="flex h-[70px] w-[70px] items-center justify-center overflow-hidden rounded-full border border-white/30 bg-linear-to-br from-kpmg-purple to-kpmg-accent">
          {fields.AvatarImage?.value?.src ? (
            <SitecoreImage field={fields.AvatarImage} className="h-full w-full object-cover" />
          ) : (
            <span className="text-3xl font-light text-white">+</span>
          )}
        </span>
      </span>
      <Text
        tag="span"
        field={fields.Label}
        className="mt-2 line-clamp-2 max-w-[100px] text-center text-sm text-white!"
      />
    </SitecoreLink>
  );
};
