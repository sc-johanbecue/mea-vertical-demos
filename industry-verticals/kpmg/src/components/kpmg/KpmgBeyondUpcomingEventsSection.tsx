'use client';

import type { JSX } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Placeholder, Text, TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { IconChevronLeft, IconChevronRight } from './kpmg-beyond-icons';
import { useEditingHydrationProps } from './kpmg-editing-hydration';

export interface KpmgBeyondUpcomingEventsSectionFields {
  Title: TextField;
}

const defaultFields: KpmgBeyondUpcomingEventsSectionFields = {
  Title: { value: 'Upcoming events' },
};

export type KpmgBeyondUpcomingEventsSectionProps = ComponentProps & {
  fields: KpmgBeyondUpcomingEventsSectionFields;
};

export const Default = (props: KpmgBeyondUpcomingEventsSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = props.fields || defaultFields;
  const editingHydration = useEditingHydrationProps();
  const ph = `kpmg-beyond-events-${DynamicPlaceholderId ?? '1'}`;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollButtons();
    const observer = new ResizeObserver(updateScrollButtons);
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateScrollButtons]);

  /** Advance one viewport (= two cards); last page may show a single card if count is odd. */
  const scrollByPage = useCallback(
    (direction: -1 | 1) => {
      const el = scrollRef.current;
      if (!el) return;
      el.scrollBy({ left: direction * el.clientWidth, behavior: 'smooth' });
      window.setTimeout(updateScrollButtons, 350);
    },
    [updateScrollButtons]
  );

  return (
    <section
      key={id ?? props.rendering?.uid}
      {...editingHydration}
      id={id}
      className={[
        'component kpmg-beyond-upcoming-events bg-kpmg-elevated px-4 pt-4 md:bg-transparent md:px-4 xl:px-0 xl:pt-5',
        styles || '',
      ].join(' ')}
    >
      <div className="w-full pb-6 xl:pb-8">
        <div className="mb-4 flex items-center justify-between">
          <Text
            tag="h2"
            field={fields.Title}
            className="m-0 text-xl font-semibold text-white xl:text-[28px]"
          />
          <div className="hidden gap-1 md:flex">
            <button
              type="button"
              className="inline-flex cursor-pointer border-0 bg-transparent p-2 text-white disabled:opacity-30"
              aria-label="Previous events"
              data-cy="move-my-events-left-button"
              disabled={!canScrollLeft}
              onClick={() => scrollByPage(-1)}
            >
              <IconChevronLeft />
            </button>
            <button
              type="button"
              className="inline-flex cursor-pointer border-0 bg-transparent p-2 text-white disabled:opacity-30"
              aria-label="Next events"
              data-cy="move-my-events-right-button"
              disabled={!canScrollRight}
              onClick={() => scrollByPage(1)}
            >
              <IconChevronRight />
            </button>
          </div>
        </div>

        {/* Mobile: stacked vertical cards */}
        <div className="md:hidden [&_.kpmg-beyond-event-card]:mb-6 [&_.kpmg-beyond-event-card:last-child]:mb-0">
          <Placeholder name={ph} rendering={props.rendering} />
        </div>

        {/*
          Desktop: two cards per row (each ~50% of main column minus gap).
          @container + cqw sizes cards to the scroll viewport, not the full track.
          Scroll step = one viewport width (next pair; odd last page shows one card).
        */}
        <div
          ref={scrollRef}
          className={[
            '@container hidden overflow-x-auto pb-2 md:block',
            '[-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden',
          ].join(' ')}
          onScroll={updateScrollButtons}
        >
          <div
            className={[
              'flex w-max min-w-full gap-4',
              '[&_.kpmg-beyond-event-card]:mb-0',
              '[&_.kpmg-beyond-event-card]:w-[calc(50cqw-0.5rem)]',
              '[&_.kpmg-beyond-event-card]:max-w-none',
              '[&_.kpmg-beyond-event-card]:shrink-0',
            ].join(' ')}
          >
            <Placeholder name={ph} rendering={props.rendering} />
          </div>
        </div>
      </div>
    </section>
  );
};
