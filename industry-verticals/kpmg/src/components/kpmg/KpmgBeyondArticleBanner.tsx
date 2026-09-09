'use client';

import type { JSX } from 'react';
import { ComponentProps } from '@/lib/component-props';
import { useEditingHydrationProps } from './kpmg-editing-hydration';
import { useKpmgBeyondArticlePageFields } from './kpmg-beyond-article-route-fields';

export type KpmgBeyondArticleBannerProps = ComponentProps;

export const Default = (props: KpmgBeyondArticleBannerProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = useKpmgBeyondArticlePageFields(props);
  const editingHydration = useEditingHydrationProps();
  const bannerSrc =
    fields.BannerImage?.value?.src?.trim() || fields.Image?.value?.src?.trim() || '';
  const bannerAlt =
    (typeof fields.BannerImage?.value?.alt === 'string' && fields.BannerImage.value.alt.trim()) ||
    (typeof fields.Image?.value?.alt === 'string' && fields.Image.value.alt.trim()) ||
    'Article banner';

  return (
    <section
      key={id ?? props.rendering?.uid}
      {...editingHydration}
      id={id}
      data-cy="article-banner"
      className={['component kpmg-beyond-article-banner relative w-full', styles || ''].join(' ')}
    >
      <div className="relative h-[150px] w-full xl:h-[250px]">
        {bannerSrc ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url("${bannerSrc.replace(/"/g, '\\"')}")` }}
            role="img"
            aria-label={bannerAlt}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, #1a0a3e 0%, #2d1b69 35%, #4832cb 70%, #6ce5e5 100%)',
            }}
            aria-hidden
          />
        )}
      </div>
    </section>
  );
};
