'use client';

import type { JSX } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { useEditingHydrationProps } from './kpmg-editing-hydration';
import { useKpmgBeyondArticlePageFields } from './kpmg-beyond-article-route-fields';

export type KpmgBeyondArticleTitleProps = ComponentProps;

export const Default = (props: KpmgBeyondArticleTitleProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = useKpmgBeyondArticlePageFields(props);
  const editingHydration = useEditingHydrationProps();

  return (
    <header
      key={id ?? props.rendering?.uid}
      {...editingHydration}
      id={id}
      data-cy="article-title"
      className={[
        'component kpmg-beyond-article-title mx-auto w-full max-w-[860px] px-5 pt-3 xl:px-[60px]',
        styles || '',
      ].join(' ')}
    >
      <Text
        tag="h1"
        field={fields.ArticleTitle}
        className="m-0 text-2xl font-semibold leading-tight text-white xl:text-[40px] xl:leading-[48px]"
      />
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-white/70">
        <Text tag="span" field={fields.DateLabel} />
        <span aria-hidden="true">|</span>
        <Text tag="span" field={fields.ReadingTime} />
      </div>
    </header>
  );
};
