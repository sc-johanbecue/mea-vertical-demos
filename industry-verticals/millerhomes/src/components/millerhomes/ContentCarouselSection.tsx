'use client';

import React, { type JSX, useRef, useState, useEffect, useCallback } from 'react';
import { TextField, Text, Placeholder, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { ArrowLeft, ArrowRight } from 'lucide-react';

/**
 * ContentCarouselSection Component
 * "Your place to be" carousel section with content cards
 *
 * Features:
 * - Section title with styled "place" word in light blue italic
 * - Custom CSS-based carousel with autoplay (in live mode)
 * - Desktop: Centered slides with arrows on edges, pagination dots
 * - Mobile/Tablet: Single card view with arrows below
 * - In editing mode: Manual navigation only
 * - Dynamic placeholder for ContentCard components
 */

interface Fields {
  TitlePart1: TextField;
  TitleHighlight: TextField;
  TitlePart2: TextField;
  PreviousLabel: TextField;
  NextLabel: TextField;
  GoToSlideLabel: TextField;
}

const defaultFields: Fields = {
  TitlePart1: { value: 'Your' },
  TitleHighlight: { value: 'place' },
  TitlePart2: { value: 'to be' },
  PreviousLabel: { value: 'Previous' },
  NextLabel: { value: 'Next' },
  GoToSlideLabel: { value: 'Go to slide' },
};

export type ContentCarouselSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: ContentCarouselSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = props.fields || defaultFields;

  const sitecore = useSitecore();
  const isEditing = sitecore?.page?.mode?.isEditing ?? false;

  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);

  const phCarouselCards = `carouselCards-${DynamicPlaceholderId}`;

  // Count slides from DOM
  useEffect(() => {
    if (!carouselRef.current) return;

    const countSlides = () => {
      const slides = carouselRef.current?.querySelectorAll(':scope > .content-card');
      const count = slides?.length || 0;
      setTotalSlides(count);
    };

    countSlides();
    // Re-count on mutations (for Sitecore editing)
    const observer = new MutationObserver(countSlides);
    observer.observe(carouselRef.current, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  // Autoplay (only in live mode)
  useEffect(() => {
    if (isEditing || totalSlides <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, [isEditing, totalSlides]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const handleGoTo = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  return (
    <section
      className={`component content-carousel-section bg-white py-12 lg:py-16 ${styles || ''}`}
      id={id}
    >
      {/* Section Title */}
      <h2 className="mb-8 px-4 text-center text-3xl text-[#003057] md:text-4xl lg:mb-12 lg:text-5xl">
        <span className="font-light text-[#0072CE] italic">
          <Text field={fields.TitlePart1} /> <Text field={fields.TitleHighlight} />
        </span>{' '}
        <span className="font-light">
          <Text field={fields.TitlePart2} />
        </span>
      </h2>

      {/* Carousel Container */}
      <div className="relative">
        {/* Navigation Arrows - Desktop */}
        <button
          onClick={handlePrev}
          className="absolute top-1/2 left-4 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#003057] text-white shadow-lg transition-colors hover:bg-[#002040] lg:flex xl:left-8"
          aria-label={fields.PreviousLabel?.value as string}
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
        </button>
        <button
          onClick={handleNext}
          className="absolute top-1/2 right-4 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#003057] text-white shadow-lg transition-colors hover:bg-[#002040] lg:flex xl:right-8"
          aria-label={fields.NextLabel?.value as string}
        >
          <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
        </button>

        {/* Carousel Track */}
        <div className="overflow-hidden">
          <div
            ref={carouselRef}
            className="carousel-track flex transition-transform duration-500 ease-out"
            style={
              {
                '--slide-index': activeIndex,
              } as React.CSSProperties
            }
          >
            <Placeholder name={phCarouselCards} rendering={props.rendering} />
          </div>
        </div>
        <style jsx>{`
          .carousel-track {
            transform: translateX(calc(-1 * var(--slide-index) * 100%));
          }
          @media (min-width: 1024px) {
            .carousel-track {
              /* Card is 65% width, center offset = (100% - 65%) / 2 = 17.5% */
              transform: translateX(calc(17.5% - var(--slide-index) * 65%));
            }
          }
        `}</style>

        {/* Mobile/Tablet Navigation Arrows */}
        <div className="mt-6 flex items-center justify-center gap-4 lg:hidden">
          <button
            onClick={handlePrev}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#003057] text-white shadow-lg transition-colors hover:bg-[#002040]"
            aria-label={fields.PreviousLabel?.value as string}
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
          </button>
          <button
            onClick={handleNext}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#003057] text-white shadow-lg transition-colors hover:bg-[#002040]"
            aria-label={fields.NextLabel?.value as string}
          >
            <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Dot Indicators - Desktop only */}
      {totalSlides > 1 && (
        <div className="mt-8 hidden items-center justify-center gap-3 lg:flex">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => handleGoTo(index)}
              className={`h-1 rounded-full transition-all ${
                index === activeIndex ? 'w-8 bg-[#003057]' : 'w-6 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};
