'use client';

import type { JSX } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Item, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { KpmgBeyondArticleCardTile } from './KpmgBeyondArticleCardTile';
import { useEditingHydrationProps } from './kpmg-editing-hydration';
import {
  mapItemToArticleCardFields,
  parseRelatedArticleIds,
  useKpmgBeyondArticlePageFields,
} from './kpmg-beyond-article-route-fields';
import type { KpmgBeyondArticleCardFields } from './KpmgBeyondArticleCard';

export type KpmgBeyondArticleRelatedContentProps = ComponentProps;

type RelatedCard = {
  id: string;
  fields: KpmgBeyondArticleCardFields;
};

function resolveRelatedFromRoute(raw: unknown): RelatedCard[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return (raw as Item[])
    .map((item) => {
      if (!item?.id) {
        return null;
      }
      return {
        id: item.id,
        fields: mapItemToArticleCardFields(item),
      };
    })
    .filter((entry): entry is RelatedCard => Boolean(entry));
}

function resolvePageLanguage(page: ReturnType<typeof useSitecore>['page']): string {
  const routeLanguage = page.layout?.sitecore?.route?.itemLanguage;
  if (routeLanguage) {
    return routeLanguage;
  }
  const context = page.layout?.sitecore?.context as { language?: string } | undefined;
  return context?.language ?? 'en';
}

export const Default = (props: KpmgBeyondArticleRelatedContentProps): JSX.Element | null => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const { page } = useSitecore();
  const fields = useKpmgBeyondArticlePageFields(props);
  const editingHydration = useEditingHydrationProps();
  const routeRelated = useMemo(
    () => resolveRelatedFromRoute(fields.RelatedArticles),
    [fields.RelatedArticles]
  );
  const relatedIds = useMemo(
    () => parseRelatedArticleIds(fields.RelatedArticles),
    [fields.RelatedArticles]
  );
  const [fetchedCards, setFetchedCards] = useState<RelatedCard[]>([]);
  const relatedCards = routeRelated.length ? routeRelated : fetchedCards;

  useEffect(() => {
    if (routeRelated.length || !relatedIds.length) {
      return;
    }

    const language = resolvePageLanguage(page);
    const params = new URLSearchParams({ ids: relatedIds.join(','), language });
    let cancelled = false;

    fetch(`/api/kpmg-beyond/related-articles?${params.toString()}`)
      .then((response) => response.json())
      .then((payload: { cards?: RelatedCard[] }) => {
        if (!cancelled) {
          setFetchedCards(payload.cards ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFetchedCards([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [page, relatedIds, routeRelated.length]);

  if (!relatedCards.length) {
    return null;
  }

  return (
    <section
      key={id ?? props.rendering?.uid}
      {...editingHydration}
      id={id}
      data-cy="article-related"
      className={[
        'component kpmg-beyond-article-related mx-auto w-full max-w-[860px] px-5 pb-16 pt-4 xl:px-[60px]',
        styles || '',
      ].join(' ')}
    >
      <h2 className="m-0 text-xl font-semibold text-white">Related</h2>
      <div className="mt-6">
        {relatedCards.map((card) => (
          <KpmgBeyondArticleCardTile
            key={card.id}
            componentKey={card.id}
            fields={card.fields}
            className={styles || ''}
          />
        ))}
      </div>
    </section>
  );
};
