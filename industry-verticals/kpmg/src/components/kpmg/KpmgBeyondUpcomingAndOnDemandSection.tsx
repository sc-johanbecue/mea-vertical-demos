'use client';

import type { JSX } from 'react';
import { useMemo, useState } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import {
  categoryMatches,
  TopPickCategoryFilterContext,
} from './kpmg-beyond-top-picks-context';
import { KpmgBeyondEventListingCardTile } from './KpmgBeyondEventListingCardTile';
import { useEditingHydrationProps } from './kpmg-editing-hydration';
import {
  extractEventCategoryLabels,
  filterEventItemsByTab,
  getEventItemsFromFields,
  resolveUpcomingOnDemandSectionFields,
  type KpmgBeyondUpcomingOnDemandSectionFields,
} from './kpmg-beyond-events-section-shared';
import type { EventsListTab } from '@/lib/kpmg-beyond/fetch-folder-cards';

export type KpmgBeyondUpcomingAndOnDemandSectionProps = ComponentProps & {
  fields: KpmgBeyondUpcomingOnDemandSectionFields;
};

const BUILT_IN_TABS: EventsListTab[] = ['upcoming', 'on-demand'];
const CARDS_PAGE_SIZE = 3;

function filterByCategory<T extends { fields: { CategoryLabel?: { value?: unknown } } }>(
  items: T[],
  category: string | null
): T[] {
  if (!category) {
    return items;
  }
  return items.filter((item) =>
    categoryMatches(item.fields.CategoryLabel?.value?.toString() ?? '', category)
  );
}

function tabLabel(fields: KpmgBeyondUpcomingOnDemandSectionFields, tab: EventsListTab): string {
  if (tab === 'upcoming') {
    return fields.TabUpcoming?.value?.toString().trim() || 'Upcoming';
  }
  return fields.TabOnDemand?.value?.toString().trim() || 'On demand';
}

function viewMoreLabel(fields: KpmgBeyondUpcomingOnDemandSectionFields): string {
  const text = fields.ViewMoreLink?.value?.text?.toString().trim();
  return text || 'View more';
}

export const Default = (props: KpmgBeyondUpcomingAndOnDemandSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const renderingFields = props.rendering?.fields as
    | KpmgBeyondUpcomingOnDemandSectionFields
    | undefined;
  const fields = resolveUpcomingOnDemandSectionFields(props.fields, renderingFields);
  const componentKey = id ?? props.rendering?.uid ?? 'upcoming-on-demand-section';
  const editingHydration = useEditingHydrationProps();

  const [activeTab, setActiveTab] = useState<EventsListTab>('upcoming');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(CARDS_PAGE_SIZE);

  const eventItems = useMemo(
    () => getEventItemsFromFields(fields, renderingFields),
    [fields, renderingFields]
  );

  const selectTab = (tab: EventsListTab) => {
    setActiveTab(tab);
    setSelectedCategory(null);
    setVisibleCount(CARDS_PAGE_SIZE);
  };

  const toggleCategory = (topic: string) => {
    setSelectedCategory((current) =>
      current !== null && categoryMatches(topic, current) ? null : topic
    );
    setVisibleCount(CARDS_PAGE_SIZE);
  };

  const tabFilteredItems = useMemo(
    () => filterEventItemsByTab(eventItems, activeTab),
    [eventItems, activeTab]
  );
  const categories = useMemo(
    () => extractEventCategoryLabels(tabFilteredItems),
    [tabFilteredItems]
  );
  const visibleItems = filterByCategory(tabFilteredItems, selectedCategory);
  const displayedItems = visibleItems.slice(0, visibleCount);
  const showViewMore = visibleItems.length > visibleCount;

  return (
    <TopPickCategoryFilterContext.Provider value={selectedCategory}>
      <section
        key={componentKey}
        {...editingHydration}
        id={id}
        data-cy="upcomingOnDemand"
        className={[
          'component kpmg-beyond-upcoming-on-demand w-full px-5 pt-8 xl:px-4',
          styles || '',
        ].join(' ')}
      >
        <Text
          tag="h2"
          field={fields.Title}
          className="m-0 mb-4 text-[22px] font-semibold text-white xl:mb-10 xl:text-[28px]"
          data-cy="upcomingOnDemand-title"
        />

        <div className="w-full" data-cy="tabs">
          <div className="flex border-b border-white/25" role="tablist" aria-label="Event tabs">
            {BUILT_IN_TABS.map((tab) => {
              const label = tabLabel(fields, tab);
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  data-cy={`${label}-tab`}
                  className={[
                    'flex-1 border-0 py-3 text-base font-semibold transition-colors',
                    isActive ? 'bg-transparent text-white' : 'bg-kpmg-tab-active text-white/65',
                  ].join(' ')}
                  onClick={() => selectTab(tab)}
                >
                  {label}
                  {isActive ? <span className="mt-2 block h-0.5 w-full bg-kpmg-purple" /> : null}
                </button>
              );
            })}
          </div>
        </div>

        <div
          className="component kpmg-beyond-upcoming-on-demand-tab pt-5 xl:pt-[30px]"
          role="tabpanel"
          data-cy={tabLabel(fields, activeTab)}
        >
          {categories.length > 0 ? (
            <div
              className="flex gap-2.5 overflow-x-auto pb-2 [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden"
              data-cy="topics-tabs"
              role="tablist"
              aria-label="Topic filters"
            >
              {categories.map((topic, index) => (
                <button
                  key={topic}
                  type="button"
                  role="tab"
                  aria-selected={
                    selectedCategory !== null && categoryMatches(topic, selectedCategory)
                  }
                  data-cy="topic-list-item"
                  className={[
                    'shrink-0 rounded-full border-[1.5px] px-[15px] py-2 text-sm font-bold whitespace-nowrap',
                    index === 0 ? 'ml-5 xl:ml-0' : '',
                    selectedCategory !== null && categoryMatches(topic, selectedCategory)
                      ? 'border-white bg-kpmg-bg text-white'
                      : 'border-kpmg-chip-active bg-kpmg-chip-active text-white',
                  ].join(' ')}
                  onClick={() => toggleCategory(topic)}
                >
                  {topic}
                </button>
              ))}
            </div>
          ) : null}

          <div className="px-0 pt-2.5 xl:pt-[30px]" data-cy="content-tiles">
            {eventItems.length === 0 ? (
              <p className="px-5 text-sm text-white/70">No events to display.</p>
            ) : null}
            {eventItems.length > 0 && tabFilteredItems.length === 0 ? (
              <p className="px-5 text-sm text-white/70">
                No {tabLabel(fields, activeTab).toLowerCase()} events found.
              </p>
            ) : null}
            {tabFilteredItems.length > 0 && visibleItems.length === 0 ? (
              <p className="px-5 text-sm text-white/70">No events match the selected category.</p>
            ) : null}
            {displayedItems.map((item) => (
              <KpmgBeyondEventListingCardTile
                key={item.id}
                componentKey={item.id}
                fields={item.fields}
              />
            ))}
          </div>

          {showViewMore ? (
            <div className="mt-6 flex justify-center pb-4">
              <button
                type="button"
                {...editingHydration}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white bg-transparent px-10 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
                data-cy="events-viewMore"
                onClick={() => setVisibleCount((count) => count + CARDS_PAGE_SIZE)}
              >
                {viewMoreLabel(fields)}
              </button>
            </div>
          ) : null}
        </div>
      </section>
    </TopPickCategoryFilterContext.Provider>
  );
};
