'use client';

import type { JSX } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  TextField,
  LinkField,
  Text,
  Link as SitecoreLink,
  Placeholder,
} from '@sitecore-content-sdk/nextjs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ComponentProps } from '@/lib/component-props';
import { parsePipeList, normalizeTabKey } from './pepsico-corporate-utils';
import { PEPSICO_CORPORATE } from './pepsico-corporate-tokens';
import {
  PEPSICO_DEMO_BRAND_SLIDES,
  renderingPlaceholderHasContent,
} from '@/components/pepsico/corporate/pepsico-corporate-marketing-fallbacks';

export interface PepsiCoCorporateFindYourFavesFields {
  Title: TextField;
  Subtitle: TextField;
  /** Pipe-separated tab labels, e.g. Food|Drink|Nutrition */
  TabLabels: TextField;
  Cta: LinkField;
}

const defaultFields: PepsiCoCorporateFindYourFavesFields = {
  Title: { value: 'FIND YOUR FAVES' },
  Subtitle: {
    value: 'Discover more about our food, drinks, nutrition, and world-class brands',
  },
  TabLabels: { value: 'Food|Drink|Nutrition' },
  Cta: { value: { href: '#', text: 'Explore our brands' } },
};

export type PepsiCoCorporateFindYourFavesProps = ComponentProps & {
  fields: PepsiCoCorporateFindYourFavesFields;
};

export const Default = (props: PepsiCoCorporateFindYourFavesProps): JSX.Element => {
  const id = props.params.RenderingIdentifier ?? props.rendering?.uid;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = props.fields || defaultFields;
  const tabs = useMemo(() => parsePipeList(fields.TabLabels), [fields.TabLabels]);
  const tabKeys = useMemo(() => tabs.map((t) => normalizeTabKey(t)), [tabs]);

  const [activeTab, setActiveTab] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [slideCount, setSlideCount] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const ph = `pepsico-corporate-brand-slides-${DynamicPlaceholderId ?? '1'}`;
  const activeCategory = tabKeys[activeTab] ?? tabKeys[0] ?? 'food';
  const hasBrandSlides = renderingPlaceholderHasContent(props.rendering, ph);

  const refreshSlides = useCallback(() => {
    const root = trackRef.current;
    if (!root) return;
    const slides = root.querySelectorAll('[data-pepsico-brand-slide]');
    setSlideCount(slides.length);
    slides.forEach((el, i) => {
      const slide = el as HTMLElement;
      const cat = slide.dataset.category ?? '';
      const visible = !activeCategory || cat === activeCategory || cat === 'all';
      slide.style.display = visible ? '' : 'none';
      slide.dataset.active = i === activeSlide ? 'true' : 'false';
    });
  }, [activeCategory, activeSlide]);

  useEffect(() => {
    refreshSlides();
    const root = trackRef.current;
    if (!root || typeof MutationObserver === 'undefined') return;
    const mo = new MutationObserver(() => refreshSlides());
    mo.observe(root, { childList: true, subtree: true, attributes: true });
    const ro = new ResizeObserver(() => refreshSlides());
    ro.observe(root);
    return () => {
      mo.disconnect();
      ro.disconnect();
    };
  }, [refreshSlides]);

  useEffect(() => {
    setActiveSlide(0);
    const el = trackRef.current;
    if (el) el.scrollLeft = 0;
  }, [activeTab]);

  const scrollToIndex = useCallback((index: number) => {
    const el = trackRef.current;
    if (!el) return;
    const visible = [...el.querySelectorAll('[data-pepsico-brand-slide]')].filter(
      (node) => (node as HTMLElement).style.display !== 'none'
    ) as HTMLElement[];
    const target = visible[index];
    if (!target) return;
    el.scrollTo({ left: target.offsetLeft - el.offsetLeft, behavior: 'smooth' });
    setActiveSlide(index);
  }, []);

  const handlePrev = () => {
    const next = activeSlide <= 0 ? Math.max(slideCount - 1, 0) : activeSlide - 1;
    scrollToIndex(next);
  };

  const handleNext = () => {
    const next = activeSlide >= slideCount - 1 ? 0 : activeSlide + 1;
    scrollToIndex(next);
  };

  return (
    <section
      className={`component pepsico-corporate-find-your-faves bg-white px-4 py-12 text-center md:px-8 md:py-16 lg:py-20 ${styles || ''}`}
      id={id}
      style={{ color: PEPSICO_CORPORATE.green }}
    >
      <div className="mx-auto max-w-[min(96rem,100vw)]">
        <Text
          tag="h2"
          field={fields.Title}
          className="m-0 text-[clamp(1.75rem,6vw,2.75rem)] font-black tracking-tight uppercase"
        />
        <Text
          tag="p"
          field={fields.Subtitle}
          className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-[#4A4A4A] md:text-lg"
        />

        {tabs.length > 0 ? (
          <div
            className="mt-8 inline-flex flex-wrap items-center justify-center gap-2 rounded-full bg-[#f0f4ea] p-1"
            role="tablist"
            aria-label="Product categories"
          >
            {tabs.map((label, i) => (
              <button
                key={label}
                type="button"
                role="tab"
                aria-selected={i === activeTab}
                onClick={() => setActiveTab(i)}
                className={[
                  'rounded-full px-5 py-2 text-sm font-bold tracking-wide uppercase transition md:px-6 md:py-2.5 md:text-base',
                  i === activeTab
                    ? 'bg-[#C5E86C] text-[#004C3F] shadow-sm'
                    : 'bg-transparent text-[#004C3F]/80 hover:text-[#004C3F]',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </div>
        ) : null}

        <div className="relative mt-10 md:mt-12">
          {slideCount > 1 ? (
            <>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous brand"
                className="absolute top-1/2 left-0 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-white md:flex lg:-left-2"
                style={{ backgroundColor: PEPSICO_CORPORATE.green }}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next brand"
                className="absolute top-1/2 right-0 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-white md:flex lg:-right-2"
                style={{ backgroundColor: PEPSICO_CORPORATE.green }}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          ) : null}

          <div
            ref={trackRef}
            className={[
              'flex snap-x snap-mandatory items-end justify-start gap-2 overflow-x-auto pb-4',
              '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
              'md:justify-center md:gap-0 md:overflow-hidden',
              '[&>code.scpm]:contents',
              '*:only:contents',
            ].join(' ')}
          >
            {hasBrandSlides ? (
              <Placeholder name={ph} rendering={props.rendering} />
            ) : (
              <>
                {PEPSICO_DEMO_BRAND_SLIDES.map((slide, idx) => (
                  <a
                    key={slide.productSrc}
                    href={slide.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-inherit no-underline"
                  >
                    <article
                      data-pepsico-brand-slide
                      data-category={slide.category}
                      className={[
                        'component pepsico-corporate-brand-slide flex shrink-0 flex-col items-center justify-end px-4 transition-opacity duration-300 md:px-8',
                        'opacity-40 [&[data-active=true]]:opacity-100',
                      ].join(' ')}
                      data-active={idx === 0 ? 'true' : 'false'}
                    >
                      <div className="relative flex w-[min(72vw,14rem)] flex-col items-center md:w-[min(22rem,20vw)]">
                        <p className="mb-4 h-8 text-center text-xs font-bold tracking-wide text-[#004C3F]/70 uppercase md:h-10 md:text-sm">
                          {slide.brandLabel}
                        </p>
                        <img
                          src={slide.productSrc}
                          alt={slide.brandLabel}
                          className="h-auto w-full max-w-[min(72vw,14rem)] rounded-lg object-cover shadow-lg md:max-w-[18rem]"
                        />
                      </div>
                    </article>
                  </a>
                ))}
              </>
            )}
          </div>

          {slideCount > 1 ? (
            <div className="mt-4 flex items-center justify-center gap-3 md:hidden">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous brand"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: PEPSICO_CORPORATE.green }}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex gap-2">
                {Array.from({ length: slideCount }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Brand ${i + 1}`}
                    onClick={() => scrollToIndex(i)}
                    className={[
                      'h-2 w-2 rounded-full border-0 p-0',
                      i === activeSlide ? 'bg-[#004C3F]' : 'bg-[#004C3F]/30',
                    ].join(' ')}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next brand"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: PEPSICO_CORPORATE.green }}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          ) : null}
        </div>

        <SitecoreLink
          field={fields.Cta}
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full px-10 py-3 text-base font-bold tracking-wide text-white no-underline transition hover:brightness-110 md:mt-10"
          style={{ backgroundColor: PEPSICO_CORPORATE.green }}
        >
          {fields.Cta?.value?.text}
        </SitecoreLink>
      </div>
    </section>
  );
};
