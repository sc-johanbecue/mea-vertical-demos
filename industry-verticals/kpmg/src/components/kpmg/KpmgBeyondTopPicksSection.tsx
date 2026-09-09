'use client';

import type { JSX } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import type { FolderCardItem, TopPickListTab } from '@/lib/kpmg-beyond/fetch-folder-cards';
import { parseDroplinkItemId } from '@/lib/kpmg-beyond/parse-droplink';
import {
  categoryMatches,
  TopPickCategoryFilterContext,
} from './kpmg-beyond-top-picks-context';
import { KpmgBeyondArticleCardTile } from './KpmgBeyondArticleCardTile';
import { useEditingHydrationProps } from './kpmg-editing-hydration';
import {
  extractTopPickCategoryLabels,
  filterTopPickItemsByTab,
  folderCardsToTopPickSectionItems,
  getTopPickItemsFromFields,
  KpmgBeyondTopPicksSectionFields,
  resolveKpmgBeyondTopPicksSectionFields,
  type KpmgBeyondTopPickSectionItem,
} from './kpmg-beyond-top-picks-section-shared';

export type KpmgBeyondTopPicksSectionProps = ComponentProps & {
  fields: KpmgBeyondTopPicksSectionFields;
};

const BUILT_IN_TABS: TopPickListTab[] = ['recommended', 'discover'];
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

function tabLabel(fields: KpmgBeyondTopPicksSectionFields, tab: TopPickListTab): string {
  if (tab === 'recommended') {
    return fields.TabRecommended?.value?.toString().trim() || 'Recommended';
  }
  return fields.TabDiscover?.value?.toString().trim() || 'Discover';
}

function viewMoreLabel(fields: KpmgBeyondTopPicksSectionFields): string {
  const text = fields.ViewMoreLink?.value?.text?.toString().trim();
  return text || 'View more';
}

export const Default = (props: KpmgBeyondTopPicksSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const renderingFields = props.rendering?.fields as KpmgBeyondTopPicksSectionFields | undefined;
  const fields = resolveKpmgBeyondTopPicksSectionFields(props.fields, renderingFields);
  const { page } = useSitecore();
  const componentKey = id ?? props.rendering?.uid ?? 'top-picks-section';
  const editingHydration = useEditingHydrationProps();
  const isEditing = Boolean(page.mode?.isEditing);
  const language = page.locale || 'en';
  const dataSourceId = props.rendering?.dataSource?.replace(/[{}]/g, '').toLowerCase();
  const folderId = parseDroplinkItemId(fields.CardsFolder);

  const [activeTab, setActiveTab] = useState<TopPickListTab>('recommended');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(CARDS_PAGE_SIZE);
  const [remoteItems, setRemoteItems] = useState<KpmgBeyondTopPickSectionItem[]>([]);
  const [remoteLoaded, setRemoteLoaded] = useState(false);

  const serverItems = useMemo(
    () => getTopPickItemsFromFields(fields, renderingFields),
    [fields, renderingFields]
  );

  useEffect(() => {
    if (isEditing && serverItems.length > 0) {
      return;
    }
    if (serverItems.length > 0) {
      return;
    }
    if (!folderId && !dataSourceId) {
      setRemoteLoaded(true);
      return;
    }

    let cancelled = false;
    setRemoteLoaded(false);
    const params = new URLSearchParams({ language });
    if (folderId) {
      params.set('folderId', folderId);
    }
    if (dataSourceId) {
      params.set('dataSourceId', dataSourceId);
    }

    fetch(`/api/kpmg-beyond/folder-cards?${params.toString()}`)
      .then(async (response) => {
        const data = (await response.json()) as { cards?: FolderCardItem[] };
        if (!cancelled) {
          setRemoteItems(folderCardsToTopPickSectionItems(data.cards ?? []));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRemoteItems([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setRemoteLoaded(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [dataSourceId, folderId, isEditing, language, serverItems.length]);

  const topPickItems = isEditing
    ? serverItems
    : serverItems.length > 0
      ? serverItems
      : remoteItems;
  const showEmptyState =
    topPickItems.length === 0 && serverItems.length === 0 && remoteLoaded;

  const selectTab = (tab: TopPickListTab) => {
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
    () => filterTopPickItemsByTab(topPickItems, activeTab),
    [topPickItems, activeTab]
  );
  const categories = useMemo(
    () => extractTopPickCategoryLabels(tabFilteredItems),
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
        data-cy="topPicks"
        className={['component kpmg-beyond-top-picks w-full px-5 pt-8 xl:px-4', styles || ''].join(' ')}
      >
        <Text
          tag="h2"
          field={fields.Title}
          className="m-0 mb-4 text-[22px] font-semibold text-white xl:mb-10 xl:text-[28px]"
          data-cy="topPicks-title"
        />

        <div className="w-full" data-cy="tabs">
          <div className="flex border-b border-white/25" role="tablist" aria-label="Content tabs">
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
          className="component kpmg-beyond-top-pick-tab pt-5 xl:pt-[30px]"
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
            {showEmptyState ? (
              <p className="px-5 text-sm text-white/70">No cards to display.</p>
            ) : null}
            {topPickItems.length > 0 && tabFilteredItems.length === 0 ? (
              <p className="px-5 text-sm text-white/70">
                No {tabLabel(fields, activeTab).toLowerCase()} cards found.
              </p>
            ) : null}
            {tabFilteredItems.length > 0 && visibleItems.length === 0 ? (
              <p className="px-5 text-sm text-white/70">No cards match the selected category.</p>
            ) : null}
            {displayedItems.map((item) => (
              <KpmgBeyondArticleCardTile key={item.id} componentKey={item.id} fields={item.fields} />
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
