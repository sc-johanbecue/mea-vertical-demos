'use client';

import type { JSX } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TextField, Text, Placeholder } from '@sitecore-content-sdk/nextjs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ComponentProps } from '@/lib/component-props';
import { parsePipeList } from './pepsico-corporate-utils';
import { PEPSICO_CORPORATE } from './pepsico-corporate-tokens';

export interface PepsiCoCorporateNewsSectionFields {
  Eyebrow: TextField;
  /** Pipe-separated tab labels, e.g. Stories|Press Releases */
  TabLabels: TextField;
}

const defaultFields: PepsiCoCorporateNewsSectionFields = {
  Eyebrow: { value: "What's new" },
  TabLabels: { value: 'Stories|Press Releases' },
};

export type PepsiCoCorporateNewsSectionProps = ComponentProps & {
  fields: PepsiCoCorporateNewsSectionFields;
};

function getSlideStep(track: HTMLElement): number {
  const cards = [...track.querySelectorAll('[data-pepsico-story-card]')] as HTMLElement[];
  if (cards.length >= 2) return cards[1].offsetLeft - cards[0].offsetLeft;
  if (cards.length === 1) return cards[0].offsetWidth;
  return track.clientWidth;
}

export const Default = (props: PepsiCoCorporateNewsSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier ?? props.rendering?.uid;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = props.fields || defaultFields;
  const tabs = useMemo(() => parsePipeList(fields.TabLabels), [fields.TabLabels]);
  const [activeTab, setActiveTab] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideCount, setSlideCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const ph = `pepsico-corporate-story-cards-${DynamicPlaceholderId ?? '1'}`;

  const refreshSlides = useCallback(() => {
    const root = scrollRef.current;
    if (!root) return;
    setSlideCount(root.querySelectorAll('[data-pepsico-story-card]').length);
  }, []);

  useEffect(() => {
    refreshSlides();
    const root = scrollRef.current;
    if (!root || typeof MutationObserver === 'undefined') return;
    const mo = new MutationObserver(refreshSlides);
    mo.observe(root, { childList: true, subtree: true });
    const ro = new ResizeObserver(refreshSlides);
    ro.observe(root);
    return () => {
      mo.disconnect();
      ro.disconnect();
    };
  }, [refreshSlides]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const n = el.querySelectorAll('[data-pepsico-story-card]').length;
      const step = getSlideStep(el) || 1;
      const idx = n <= 1 ? 0 : Math.min(n - 1, Math.max(0, Math.round(el.scrollLeft / step)));
      setActiveIndex(idx);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener('scroll', onScroll);
  }, [slideCount]);

  const scrollToIndex = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const step = getSlideStep(el);
    el.scrollTo({ left: index * step, behavior: 'smooth' });
    setActiveIndex(index);
  }, []);

  return (
    <section
      className={`component pepsico-corporate-news-section px-4 py-12 text-white md:px-8 md:py-16 lg:py-20 ${styles || ''}`}
      id={id}
      style={{ backgroundColor: PEPSICO_CORPORATE.blue }}
    >
      <div className="mx-auto max-w-[min(96rem,100vw)]">
        <header className="mb-8 md:mb-10">
          <Text
            tag="p"
            field={fields.Eyebrow}
            className="m-0 text-sm font-semibold tracking-wide text-white/80 md:text-base"
          />
          {tabs.length > 0 ? (
            <div className="mt-4 flex flex-wrap items-end gap-6 md:gap-10" role="tablist">
              {tabs.map((label, i) => (
                <button
                  key={label}
                  type="button"
                  role="tab"
                  aria-selected={i === activeTab}
                  onClick={() => setActiveTab(i)}
                  className={[
                    'border-0 bg-transparent p-0 text-[clamp(2rem,7vw,3.5rem)] leading-none font-black tracking-tight uppercase transition',
                    i === activeTab
                      ? 'border-b-4 border-white text-white'
                      : 'text-white/55 hover:text-white/80',
                  ].join(' ')}
                >
                  {label}
                </button>
              ))}
            </div>
          ) : null}
        </header>

        <div className="relative">
          <div
            ref={scrollRef}
            className={[
              'flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2',
              '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
              'md:gap-6 lg:gap-8',
              '[&>code.scpm]:contents',
              '*:only:contents',
            ].join(' ')}
            data-active-tab={activeTab}
          >
            <Placeholder name={ph} rendering={props.rendering} />
          </div>

          {slideCount > 1 ? (
            <div className="mt-6 flex items-center justify-end gap-3">
              <div className="flex gap-2 md:hidden">
                {Array.from({ length: slideCount }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Story ${i + 1}`}
                    onClick={() => scrollToIndex(i)}
                    className={[
                      'h-2 w-2 rounded-full border-0 p-0',
                      i === activeIndex ? 'bg-white' : 'bg-white/40',
                    ].join(' ')}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => scrollToIndex(activeIndex <= 0 ? slideCount - 1 : activeIndex - 1)}
                aria-label="Previous story"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#002D62] text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollToIndex(activeIndex >= slideCount - 1 ? 0 : activeIndex + 1)}
                aria-label="Next story"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#002D62] text-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};
