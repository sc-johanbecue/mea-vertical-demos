'use client';

import type { JSX } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TextField, Text, Placeholder } from '@sitecore-content-sdk/nextjs';
import { Search } from 'lucide-react';
import { ComponentProps } from '@/lib/component-props';
import { parsePipeList } from './pepsico-corporate-utils';
import { PEPSICO_CORPORATE } from './pepsico-corporate-tokens';

export interface PepsiCoCorporateNewsFeedFields {
  SectionTitle: TextField;
  /** Pipe-separated filters, e.g. All|Our Stories|News|Sustainability */
  FilterLabels: TextField;
  SearchPlaceholder: TextField;
}

const defaultFields: PepsiCoCorporateNewsFeedFields = {
  SectionTitle: { value: 'THE LATEST FROM PEPSICO' },
  FilterLabels: {
    value:
      'All|Our Stories|News|Sustainability|Diversity, Equity & Inclusion|Innovation|Brands & Products|History',
  },
  SearchPlaceholder: { value: 'Search' },
};

const PAGE_SIZE = 6;

export type PepsiCoCorporateNewsFeedProps = ComponentProps & {
  fields: PepsiCoCorporateNewsFeedFields;
};

export const Default = (props: PepsiCoCorporateNewsFeedProps): JSX.Element => {
  const id = props.params.RenderingIdentifier ?? props.rendering?.uid;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = props.fields || defaultFields;
  const ph = `pepsico-corporate-news-feed-cards-${DynamicPlaceholderId ?? '1'}`;
  const tabs = useMemo(() => parsePipeList(fields.FilterLabels), [fields.FilterLabels]);
  const [active, setActive] = useState(0);
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const gridRef = useRef<HTMLDivElement>(null);

  const activeLabel = tabs[active] ?? 'All';

  const applyFilters = useCallback(() => {
    const root = gridRef.current;
    if (!root) return;
    const q = query.trim().toLowerCase();
    const cards = [...root.querySelectorAll('[data-pepsico-news-article-card]')] as HTMLElement[];
    cards.forEach((el, index) => {
      const cat = (el.getAttribute('data-news-category') ?? '').trim();
      const text = el.textContent?.toLowerCase() ?? '';
      const matchTab =
        activeLabel.toLowerCase() === 'all' ||
        cat.toLowerCase() === activeLabel.toLowerCase() ||
        cat.toLowerCase().includes(activeLabel.toLowerCase());
      const matchSearch = !q || text.includes(q);
      const matchLimit = index < visibleCount;
      el.style.display = matchTab && matchSearch && matchLimit ? '' : 'none';
    });
  }, [activeLabel, query, visibleCount]);

  useEffect(() => {
    applyFilters();
    const root = gridRef.current;
    if (!root || typeof MutationObserver === 'undefined') return;
    const mo = new MutationObserver(applyFilters);
    mo.observe(root, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, [applyFilters]);

  return (
    <section
      className={`component pepsico-corporate-news-feed bg-slate-50 px-4 py-10 md:px-8 md:py-14 ${styles || ''}`}
      id={id}
    >
      <div className="mx-auto max-w-[min(96rem,100vw)]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Text
            tag="h2"
            field={fields.SectionTitle}
            className="m-0 text-xl font-black tracking-wide uppercase md:text-2xl"
            style={{ color: PEPSICO_CORPORATE.navy }}
          />
          <label className="flex max-w-md items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm md:min-w-[16rem]">
            <Search className="h-5 w-5 shrink-0 text-slate-400" aria-hidden />
            <input
              type="search"
              className="min-w-0 flex-1 border-0 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              placeholder={String(fields.SearchPlaceholder?.value ?? 'Search')}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              aria-label="Search news"
            />
          </label>
        </div>

        {tabs.length > 0 ? (
          <div
            className="mt-6 flex flex-wrap gap-2 md:mt-8 md:gap-3"
            role="tablist"
            aria-label="News categories"
          >
            {tabs.map((label, i) => (
              <button
                key={label}
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => {
                  setActive(i);
                  setVisibleCount(PAGE_SIZE);
                }}
                className={[
                  'rounded-full border px-4 py-2 text-xs font-semibold tracking-wide uppercase transition md:text-sm',
                  i === active
                    ? 'border-transparent text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300',
                ].join(' ')}
                style={
                  i === active
                    ? { backgroundColor: PEPSICO_CORPORATE.navy }
                    : { backgroundColor: 'white' }
                }
              >
                {label}
              </button>
            ))}
          </div>
        ) : null}

        <div
          ref={gridRef}
          className="mt-8 columns-1 gap-6 *:only:contents md:mt-10 md:columns-2 lg:columns-3 [&_[data-pepsico-news-article-card]]:mb-6 [&_[data-pepsico-news-article-card]]:break-inside-avoid [&>code.scpm]:contents"
        >
          <Placeholder name={ph} rendering={props.rendering} />
        </div>

        <div className="mt-10 flex justify-center md:mt-12">
          <button
            type="button"
            className="rounded-full px-10 py-3 text-sm font-bold tracking-wide text-white uppercase transition hover:opacity-90"
            style={{ backgroundColor: PEPSICO_CORPORATE.navy }}
            onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
          >
            Load more
          </button>
        </div>
      </div>
    </section>
  );
};
