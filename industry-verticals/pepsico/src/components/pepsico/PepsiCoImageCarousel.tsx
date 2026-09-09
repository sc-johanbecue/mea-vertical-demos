'use client';

import type { JSX } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Placeholder, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/** Walkers / Lays brand carousel accent (edge controls). */
const CAROUSEL_CONTROL_BG = 'rgba(227, 30, 36, 0.88)';

export type PepsiCoImageCarouselProps = ComponentProps;

export const Default = (props: PepsiCoImageCarouselProps): JSX.Element => {
  const id = props.params.RenderingIdentifier ?? props.rendering?.uid;
  const { styles, DynamicPlaceholderId } = props.params;
  const ph = `pepsico-image-carousel-slides-${DynamicPlaceholderId ?? '1'}`;

  const sitecore = useSitecore();
  const isEditing = sitecore?.page?.mode?.isEditing ?? false;

  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideCount, setSlideCount] = useState(0);

  const refreshSlides = useCallback(() => {
    const root = trackRef.current;
    if (!root) return;
    const slides = root.querySelectorAll('[data-pepsico-carousel-slide]');
    setSlideCount(slides.length);
  }, []);

  useEffect(() => {
    refreshSlides();
    const root = trackRef.current;
    if (!root || typeof MutationObserver === 'undefined') return;
    const mo = new MutationObserver(() => refreshSlides());
    mo.observe(root, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, [refreshSlides, props.rendering?.uid]);

  useEffect(() => {
    if (slideCount < 2) {
      setActiveIndex(0);
      return;
    }
    setActiveIndex((prev) => (prev >= slideCount ? 0 : prev));
  }, [slideCount]);

  useEffect(() => {
    if (isEditing || slideCount < 2) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slideCount);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [isEditing, slideCount]);

  const goTo = useCallback(
    (index: number) => {
      if (slideCount < 1) return;
      setActiveIndex(((index % slideCount) + slideCount) % slideCount);
    },
    [slideCount]
  );

  const handlePrev = useCallback(() => {
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  const handleNext = useCallback(() => {
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  const showControls = slideCount > 1;

  return (
    <section
      className={`component pepsico-image-carousel relative isolate w-full overflow-hidden bg-black ${styles || ''}`}
      id={id}
      aria-roledescription="carousel"
      aria-label="Promotional image carousel"
    >
      <div className="pepsico-image-carousel__viewport relative w-full overflow-hidden">
        <div
          ref={trackRef}
          className="pepsico-image-carousel__track flex w-full flex-nowrap transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          <Placeholder name={ph} rendering={props.rendering} />
        </div>
      </div>

      {showControls ? (
        <>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous slide"
            className="absolute top-1/2 left-2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center border-0 p-0 text-white transition hover:brightness-110 md:flex lg:left-3 lg:h-9 lg:w-9"
            style={{ backgroundColor: CAROUSEL_CONTROL_BG }}
          >
            <ChevronLeft
              className="h-4 w-4 stroke-[2.5] lg:h-[1.125rem] lg:w-[1.125rem]"
              aria-hidden
            />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next slide"
            className="absolute top-1/2 right-2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center border-0 p-0 text-white transition hover:brightness-110 md:flex lg:right-3 lg:h-9 lg:w-9"
            style={{ backgroundColor: CAROUSEL_CONTROL_BG }}
          >
            <ChevronRight
              className="h-4 w-4 stroke-[2.5] lg:h-[1.125rem] lg:w-[1.125rem]"
              aria-hidden
            />
          </button>
        </>
      ) : null}
    </section>
  );
};
