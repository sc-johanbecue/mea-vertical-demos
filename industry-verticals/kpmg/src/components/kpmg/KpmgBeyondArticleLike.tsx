'use client';

import type { JSX } from 'react';
import { useCallback, useState } from 'react';
import { ComponentProps } from '@/lib/component-props';
import { useEditingHydrationProps } from './kpmg-editing-hydration';

export type KpmgBeyondArticleLikeProps = ComponentProps;

export const Default = (props: KpmgBeyondArticleLikeProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const editingHydration = useEditingHydrationProps();
  const [liked, setLiked] = useState(false);

  const toggleLike = useCallback(() => {
    setLiked((current) => !current);
  }, []);

  return (
    <section
      key={id ?? props.rendering?.uid}
      {...editingHydration}
      id={id}
      data-cy="article-like"
      className={[
        'component kpmg-beyond-article-like mx-auto w-full max-w-[860px] px-5 py-6 xl:px-[60px]',
        styles || '',
      ].join(' ')}
    >
      <button
        type="button"
        onClick={toggleLike}
        className="inline-flex items-center gap-2 border-0 bg-transparent p-0 text-sm text-white hover:opacity-80"
        aria-pressed={liked}
      >
        <span
          className={[
            'inline-flex size-8 items-center justify-center rounded-full border border-white/40',
            liked ? 'bg-kpmg-purple text-white' : 'text-white/80',
          ].join(' ')}
          aria-hidden
        >
          ★
        </span>
        <span>{liked ? '1' : '0'} Like this article</span>
      </button>
    </section>
  );
};
