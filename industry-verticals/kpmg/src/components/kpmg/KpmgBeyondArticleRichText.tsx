'use client';

import type { JSX } from 'react';
import { RichText } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { useEditingHydrationProps } from './kpmg-editing-hydration';
import { useKpmgBeyondArticlePageFields } from './kpmg-beyond-article-route-fields';

export type KpmgBeyondArticleRichTextProps = ComponentProps;

export const Default = (props: KpmgBeyondArticleRichTextProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = useKpmgBeyondArticlePageFields(props);
  const editingHydration = useEditingHydrationProps();

  return (
    <section
      key={id ?? props.rendering?.uid}
      {...editingHydration}
      id={id}
      data-cy="article-body"
      className={[
        'component kpmg-beyond-article-body mx-auto w-full max-w-[860px] px-5 py-8 xl:px-[60px]',
        styles || '',
      ].join(' ')}
    >
      <div className="kpmg-beyond-article-richtext text-base leading-7 text-white">
        <RichText field={fields.Body} />
      </div>
    </section>
  );
};
