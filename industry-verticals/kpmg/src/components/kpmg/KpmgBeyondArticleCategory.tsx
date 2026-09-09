'use client';

import type { JSX } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { useEditingHydrationProps } from './kpmg-editing-hydration';
import { useKpmgBeyondArticlePageFields } from './kpmg-beyond-article-route-fields';

export type KpmgBeyondArticleCategoryProps = ComponentProps;

export const Default = (props: KpmgBeyondArticleCategoryProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = useKpmgBeyondArticlePageFields(props);
  const editingHydration = useEditingHydrationProps();

  return (
    <div
      key={id ?? props.rendering?.uid}
      {...editingHydration}
      id={id}
      data-cy="article-category"
      className={[
        'component kpmg-beyond-article-category mx-auto w-full max-w-[860px] px-5 pt-4 xl:px-[60px]',
        styles || '',
      ].join(' ')}
    >
      <Text
        tag="p"
        field={fields.CategoryLabel}
        className="m-0 text-xs uppercase tracking-wide text-kpmg-label xl:text-sm"
      />
    </div>
  );
};
