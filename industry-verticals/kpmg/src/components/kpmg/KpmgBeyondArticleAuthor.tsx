'use client';

import type { JSX } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { useEditingHydrationProps } from './kpmg-editing-hydration';
import { useKpmgBeyondArticlePageFields } from './kpmg-beyond-article-route-fields';

export type KpmgBeyondArticleAuthorProps = ComponentProps;

export const Default = (props: KpmgBeyondArticleAuthorProps): JSX.Element | null => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = useKpmgBeyondArticlePageFields(props);
  const editingHydration = useEditingHydrationProps();
  const authorName = fields.AuthorName?.value?.toString().trim();
  const authorTitle = fields.AuthorTitle?.value?.toString().trim();
  const authorImageSrc = fields.AuthorImage?.value?.src?.trim();

  if (!authorName && !authorTitle) {
    return null;
  }

  const authorAlt =
    (typeof fields.AuthorImage?.value?.alt === 'string' && fields.AuthorImage.value.alt.trim()) ||
    authorName ||
    'Author';

  return (
    <section
      key={id ?? props.rendering?.uid}
      {...editingHydration}
      id={id}
      data-cy="article-author"
      className={[
        'component kpmg-beyond-article-author mx-auto w-full max-w-[860px] px-5 py-8 xl:px-[60px]',
        styles || '',
      ].join(' ')}
    >
      <p className="m-0 text-xs uppercase tracking-wide text-white/70">Author</p>
      <div className="mt-4 flex items-start gap-4">
        <div className="size-16 shrink-0 overflow-hidden bg-kpmg-elevated">
          {authorImageSrc ? (
            <img src={authorImageSrc} alt={authorAlt} className="size-full object-cover" />
          ) : (
            <div className="size-full" aria-hidden />
          )}
        </div>
        <div>
          <Text tag="p" field={fields.AuthorName} className="m-0 text-lg font-semibold text-white" />
          <Text tag="p" field={fields.AuthorTitle} className="m-0 mt-1 text-sm text-white/70" />
        </div>
      </div>
    </section>
  );
};
