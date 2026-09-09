'use client';

import type { JSX } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TextField, Text, Placeholder, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ComponentProps } from '@/lib/component-props';
import { isLaysSite, LAYS_BRAND_YELLOW } from '@/lib/is-lays-site';

const BRAND_RED = '#e31e24';
const SECTION_BG_CREAM = '#f4efe4';
const DESKTOP_VISIBLE = 3;
const MOBILE_QUERY = '(max-width: 767px)';

const GRID_TRACK_CLASS = [
  'pepsico-product-list-section__track pepsico-product-list-section__track--grid',
  'flex w-full flex-col items-center gap-8',
  'md:flex-row md:flex-wrap md:justify-center md:gap-x-8 md:gap-y-12',
  '[&>*]:flex [&>*]:shrink-0 [&>*]:justify-center',
  '[&>*]:w-full [&>*]:max-w-[280px] md:[&>*]:w-[280px]',
].join(' ');

export interface PepsiCoProductListSectionFields {
  SectionTitle: TextField;
}

const defaultFields: PepsiCoProductListSectionFields = {
  SectionTitle: { value: 'PRODUCTS' },
};

export type PepsiCoProductListSectionProps = ComponentProps & {
  fields: PepsiCoProductListSectionFields;
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [isMobile]);

  return isMobile;
}

type ProductListSectionLayoutProps = PepsiCoProductListSectionProps & {
  layout: 'carousel' | 'grid';
};

function ProductListSectionLayout({
  layout,
  ...props
}: ProductListSectionLayoutProps): JSX.Element {
  const isGrid = layout === 'grid';
  const id = props.params.RenderingIdentifier ?? props.rendering?.uid;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = props.fields || defaultFields;
  const ph = `pepsico-product-list-cards-${DynamicPlaceholderId ?? '1'}`;
  const { page } = useSitecore();
  const isLays = isLaysSite(page);
  const sectionBackground = isLays ? LAYS_BRAND_YELLOW : SECTION_BG_CREAM;

  const isMobile = useIsMobile();
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardCount, setCardCount] = useState(0);

  const refreshCards = useCallback(() => {
    const root = trackRef.current;
    if (!root) return;
    setCardCount(root.querySelectorAll('[data-pepsico-product-list-card]').length);
  }, []);

  useEffect(() => {
    refreshCards();
    const root = trackRef.current;
    if (!root || typeof MutationObserver === 'undefined') return;
    const mo = new MutationObserver(() => refreshCards());
    mo.observe(root, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, [refreshCards, props.rendering?.uid]);

  const maxIndex = useMemo(() => {
    if (isGrid || cardCount < 1) return 0;
    if (isMobile) return Math.max(0, cardCount - 1);
    if (cardCount <= DESKTOP_VISIBLE) return 0;
    return cardCount - DESKTOP_VISIBLE;
  }, [cardCount, isGrid, isMobile]);

  useEffect(() => {
    setActiveIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const isCarousel = !isGrid && (isMobile ? cardCount > 1 : cardCount > DESKTOP_VISIBLE);
  const showArrows = isCarousel;
  const showDots = isCarousel;
  const dotCount = isMobile ? cardCount : Math.max(0, cardCount - DESKTOP_VISIBLE + 1);

  const goTo = useCallback(
    (index: number) => {
      if (cardCount < 1) return;
      setActiveIndex(Math.max(0, Math.min(index, maxIndex)));
    },
    [cardCount, maxIndex]
  );

  const slideOffsetPercent = useMemo(() => {
    if (!isCarousel) return 0;
    if (isMobile) return activeIndex * 100;
    return activeIndex * (100 / DESKTOP_VISIBLE);
  }, [activeIndex, isCarousel, isMobile]);

  const trackClass = useMemo(() => {
    if (isGrid) return GRID_TRACK_CLASS;

    const slot = '[&>*]';
    const slotCentered = [
      `${slot}:flex`,
      `${slot}:shrink-0`,
      `${slot}:justify-center`,
      `${slot}:w-[min(100%,280px)]`,
      `${slot}:max-w-[280px]`,
    ].join(' ');

    if (!isCarousel) {
      return [
        'pepsico-product-list-section__track pepsico-product-list-section__track--static',
        'flex w-full flex-wrap justify-center gap-8 transition-transform duration-500 ease-out md:flex-nowrap md:gap-12',
        slotCentered,
      ].join(' ');
    }

    const parts = [
      'pepsico-product-list-section__track pepsico-product-list-section__track--carousel',
      'flex w-full transition-transform duration-500 ease-out',
      `${slot}:flex`,
      `${slot}:shrink-0`,
      `${slot}:grow-0`,
      `${slot}:justify-center`,
    ];

    if (isMobile) {
      parts.push(`${slot}:min-w-full`, `${slot}:basis-full`);
    } else {
      parts.push(`${slot}:min-w-[33.333%]`, `${slot}:basis-[33.333%]`);
    }

    return parts.join(' ');
  }, [isCarousel, isGrid, isMobile]);

  return (
    <section
      className={[
        'component pepsico-product-list-section relative w-full px-4 py-10 sm:px-6 sm:py-12 md:py-14',
        isLays && 'pepsico-product-list-section--lays',
        isGrid && 'pepsico-product-list-section--no-carousel',
        styles || '',
      ].join(' ')}
      style={{ backgroundColor: sectionBackground }}
      id={id}
      aria-roledescription={isGrid ? undefined : 'carousel'}
      aria-label={String(fields.SectionTitle?.value ?? 'Products')}
    >
      <Text
        tag="h2"
        field={fields.SectionTitle}
        className="mb-8 text-center text-2xl font-extrabold tracking-[0.12em] uppercase antialiased sm:mb-10 sm:text-3xl md:mb-12"
        style={{ color: BRAND_RED }}
      />

      <div
        className={['relative mx-auto max-w-6xl', isGrid ? 'px-4 sm:px-6' : 'px-10 md:px-12'].join(
          ' '
        )}
      >
        <div className={isGrid ? undefined : 'overflow-hidden'}>
          <div
            ref={trackRef}
            className={trackClass}
            style={isCarousel ? { transform: `translateX(-${slideOffsetPercent}%)` } : undefined}
          >
            <Placeholder name={ph} rendering={props.rendering} />
          </div>
        </div>

        {showArrows ? (
          <>
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              disabled={activeIndex <= 0}
              aria-label="Previous products"
              className="absolute top-1/2 left-0 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center border-0 text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
              style={{ backgroundColor: BRAND_RED }}
            >
              <ChevronLeft className="h-6 w-6 stroke-[2.5]" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              disabled={activeIndex >= maxIndex}
              aria-label="Next products"
              className="absolute top-1/2 right-0 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center border-0 text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
              style={{ backgroundColor: BRAND_RED }}
            >
              <ChevronRight className="h-6 w-6 stroke-[2.5]" aria-hidden />
            </button>
          </>
        ) : null}
      </div>

      {showDots && dotCount > 1 ? (
        <div
          className="mt-8 flex items-center justify-center gap-2.5 md:mt-10"
          role="tablist"
          aria-label="Product carousel pagination"
        >
          {Array.from({ length: dotCount }, (_, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goTo(i)}
                className="flex h-4 w-4 items-center justify-center border-0 bg-transparent p-0"
              >
                <span
                  className={[
                    'block rounded-full transition',
                    isActive ? 'box-border h-3.5 w-3.5 border-2 bg-transparent' : 'h-2 w-2',
                  ].join(' ')}
                  style={{
                    borderColor: isActive ? BRAND_RED : undefined,
                    backgroundColor: isActive ? 'transparent' : BRAND_RED,
                  }}
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}

/** Carousel when more than three products on desktop (or multiple on mobile) */
export const Default = (props: PepsiCoProductListSectionProps): JSX.Element => (
  <ProductListSectionLayout layout="carousel" {...props} />
);

/** All cards visible — stacked on mobile, up to three per centered row on desktop */
export const NoCarousel = (props: PepsiCoProductListSectionProps): JSX.Element => (
  <ProductListSectionLayout layout="grid" {...props} />
);
