'use client';

import type { JSX } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ComponentProps } from '@/lib/component-props';
import { IconChevronLeft, IconChevronRight } from './kpmg-beyond-icons';
import { KpmgBeyondArticleListingCardTile } from './KpmgBeyondArticleListingCardTile';
import { useEditingHydrationProps } from './kpmg-editing-hydration';
import {
  type ArticleContentTypeFilter,
  type ArticleSortOption,
  type KpmgBeyondArticlesSectionFields,
  extractArticleTopics,
  filterArticleItems,
  getArticleItemsFromFields,
  resolveKpmgBeyondArticlesSectionFields,
} from './kpmg-beyond-articles-section-shared';

const SORT_OPTIONS: { value: ArticleSortOption; label: string }[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'title-az', label: 'Title A-Z' },
];

const CONTENT_TYPE_OPTIONS: { value: ArticleContentTypeFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'articles', label: 'Articles' },
  { value: 'on-demand', label: 'On demand' },
];

export type KpmgBeyondArticlesSectionProps = ComponentProps & {
  fields: KpmgBeyondArticlesSectionFields;
};

export const Default = (props: KpmgBeyondArticlesSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = resolveKpmgBeyondArticlesSectionFields(
    props.fields,
    props.rendering?.fields as KpmgBeyondArticlesSectionFields | undefined
  );
  const componentKey = id ?? props.rendering?.uid ?? 'articles-section';
  const editingHydration = useEditingHydrationProps();
  const topicsRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<ArticleSortOption>('newest');
  const [contentType, setContentType] = useState<ArticleContentTypeFilter>('all');
  const [canScrollTopicsLeft, setCanScrollTopicsLeft] = useState(false);
  const [canScrollTopicsRight, setCanScrollTopicsRight] = useState(false);

  const articleItems = useMemo(
    () =>
      getArticleItemsFromFields(
        fields,
        props.rendering?.fields as KpmgBeyondArticlesSectionFields | undefined
      ),
    [fields, props.rendering?.fields]
  );

  const topics = useMemo(() => extractArticleTopics(articleItems), [articleItems]);

  const visibleItems = useMemo(
    () =>
      filterArticleItems({
        items: articleItems,
        searchQuery,
        selectedTopic,
        contentType,
        sortBy,
      }),
    [articleItems, searchQuery, selectedTopic, contentType, sortBy]
  );

  const updateTopicScrollButtons = useCallback(() => {
    const element = topicsRef.current;
    if (!element) {
      return;
    }
    setCanScrollTopicsLeft(element.scrollLeft > 8);
    setCanScrollTopicsRight(element.scrollLeft < element.scrollWidth - element.clientWidth - 8);
  }, []);

  useEffect(() => {
    const element = topicsRef.current;
    if (!element) {
      return;
    }
    updateTopicScrollButtons();
    const observer = new ResizeObserver(updateTopicScrollButtons);
    observer.observe(element);
    return () => observer.disconnect();
  }, [topics, updateTopicScrollButtons]);

  const scrollTopics = useCallback(
    (direction: -1 | 1) => {
      const element = topicsRef.current;
      if (!element) {
        return;
      }
      element.scrollBy({ left: direction * 240, behavior: 'smooth' });
      window.setTimeout(updateTopicScrollButtons, 350);
    },
    [updateTopicScrollButtons]
  );

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTopic(null);
    setSortBy('newest');
    setContentType('all');
  };

  const allTopicsLabel = fields.AllTopicsLabel?.value?.toString() || 'All topics';

  return (
    <section
      key={componentKey}
      {...editingHydration}
      id={id}
      data-cy="articles-section"
      className={['component kpmg-beyond-articles w-full px-5 pt-8 xl:px-[60px]', styles || ''].join(' ')}
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <label className="relative mb-6 block w-full sm:ml-auto sm:max-w-sm">
          <span className="sr-only">{fields.SearchPlaceholder?.value?.toString() || 'Search'}</span>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={fields.SearchPlaceholder?.value?.toString() || 'Search articles...'}
            className="w-full border border-white/20 bg-transparent px-4 py-3 pl-10 text-base text-white outline-none focus:border-kpmg-purple"
          />
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/60" aria-hidden>
            ⌕
          </span>
        </label>

        <div className="mb-6 flex items-center gap-2">
          <button
            type="button"
            className="inline-flex shrink-0 cursor-pointer border-0 bg-transparent p-2 text-white disabled:opacity-30"
            aria-label="Previous topics"
            disabled={!canScrollTopicsLeft}
            onClick={() => scrollTopics(-1)}
          >
            <IconChevronLeft />
          </button>
          <div
            ref={topicsRef}
            className="flex flex-1 gap-2 overflow-x-auto scroll-smooth [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden"
            onScroll={updateTopicScrollButtons}
          >
            <button
              type="button"
              onClick={() => setSelectedTopic(null)}
              className={[
                'shrink-0 rounded-full border px-4 py-2 text-sm whitespace-nowrap transition-colors',
                selectedTopic === null
                  ? 'border-white bg-white/10 text-white'
                  : 'border-white/20 text-white/80 hover:border-white/40',
              ].join(' ')}
            >
              {allTopicsLabel}
            </button>
            {topics.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => setSelectedTopic(topic)}
                className={[
                  'shrink-0 rounded-full border px-4 py-2 text-sm whitespace-nowrap transition-colors',
                  selectedTopic === topic
                    ? 'border-white bg-white/10 text-white'
                    : 'border-white/20 text-white/80 hover:border-white/40',
                ].join(' ')}
              >
                {topic}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="inline-flex shrink-0 cursor-pointer border-0 bg-transparent p-2 text-white disabled:opacity-30"
            aria-label="Next topics"
            disabled={!canScrollTopicsRight}
            onClick={() => scrollTopics(1)}
          >
            <IconChevronRight />
          </button>
        </div>

        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <label className="flex flex-col gap-2 text-sm text-white/80">
              <span>{fields.SortByLabel?.value?.toString() || 'Sort by'}</span>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as ArticleSortOption)}
                className="min-w-[180px] rounded-full border border-white/20 bg-kpmg-card px-4 py-2 text-sm text-white outline-none focus:border-kpmg-purple"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value} className="bg-kpmg-card text-white">
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm text-white/80">
              <span>{fields.ContentTypesLabel?.value?.toString() || 'Content types'}</span>
              <select
                value={contentType}
                onChange={(event) => setContentType(event.target.value as ArticleContentTypeFilter)}
                className="min-w-[180px] rounded-full border border-white/20 bg-kpmg-card px-4 py-2 text-sm text-white outline-none focus:border-kpmg-purple"
              >
                {CONTENT_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value} className="bg-kpmg-card text-white">
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button
            type="button"
            onClick={clearFilters}
            className="self-start rounded-full border border-white/20 px-5 py-2 text-sm text-white transition-colors hover:border-white/40 lg:self-auto"
          >
            {fields.ClearFiltersLabel?.value?.toString() || 'Clear filters'}
          </button>
        </div>

        {visibleItems.length === 0 ? (
          <p className="text-sm text-white/70">
            {searchQuery.trim() || selectedTopic || contentType !== 'all'
              ? 'No articles match your filters.'
              : 'No articles to display.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleItems.map((item) => (
              <KpmgBeyondArticleListingCardTile
                key={item.id}
                item={item}
                componentKey={`${componentKey}-${item.id}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
