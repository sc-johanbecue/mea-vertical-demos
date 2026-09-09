'use client';

import type { JSX } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Item, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { KpmgBeyondEventListingCardTile } from './KpmgBeyondEventListingCardTile';
import { useEditingHydrationProps } from './kpmg-editing-hydration';
import {
  mapItemToEventCardFields,
  parseRelatedEventIds,
  useKpmgBeyondEventPageFields,
} from './kpmg-beyond-event-route-fields';
import type { KpmgBeyondEventPageFields } from './kpmg-beyond-event-route-fields';

export type KpmgBeyondEventRelatedSectionProps = ComponentProps;

type RelatedEventCard = {
  id: string;
  fields: KpmgBeyondEventPageFields;
};

function resolveRelatedFromRoute(raw: unknown): RelatedEventCard[] {
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
        fields: mapItemToEventCardFields(item),
      };
    })
    .filter((entry): entry is RelatedEventCard => Boolean(entry));
}

function resolvePageLanguage(page: ReturnType<typeof useSitecore>['page']): string {
  const routeLanguage = page.layout?.sitecore?.route?.itemLanguage;
  if (routeLanguage) {
    return routeLanguage;
  }
  const context = page.layout?.sitecore?.context as { language?: string } | undefined;
  return context?.language ?? 'en';
}

export const Default = (props: KpmgBeyondEventRelatedSectionProps): JSX.Element | null => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const { page } = useSitecore();
  const fields = useKpmgBeyondEventPageFields(props);
  const editingHydration = useEditingHydrationProps();
  const routeRelated = useMemo(
    () => resolveRelatedFromRoute(fields.RelatedEvents),
    [fields.RelatedEvents]
  );
  const relatedIds = useMemo(
    () => parseRelatedEventIds(fields.RelatedEvents),
    [fields.RelatedEvents]
  );
  const [fetchedCards, setFetchedCards] = useState<RelatedEventCard[]>([]);
  const relatedCards = routeRelated.length ? routeRelated : fetchedCards;

  useEffect(() => {
    if (routeRelated.length || !relatedIds.length) {
      return;
    }

    const language = resolvePageLanguage(page);
    const params = new URLSearchParams({ ids: relatedIds.join(','), language });
    let cancelled = false;

    fetch(`/api/kpmg-beyond/related-events?${params.toString()}`)
      .then((response) => response.json())
      .then((payload: { cards?: RelatedEventCard[] }) => {
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
      data-cy="event-related"
      className={[
        'component kpmg-beyond-event-related mx-auto w-full max-w-[1059px] px-5 py-8 xl:px-[60px]',
        styles || '',
      ].join(' ')}
    >
      <h2 className="m-0 mb-8 text-xl font-semibold text-white xl:text-2xl">
        Other events you may like
      </h2>
      <div className="flex flex-col gap-0">
        {relatedCards.map((card) => (
          <KpmgBeyondEventListingCardTile
            key={card.id}
            componentKey={card.id}
            fields={card.fields}
          />
        ))}
      </div>
    </section>
  );
};
