'use client';

import React, { type JSX, useState, useEffect, useRef, useCallback } from 'react';
import { TextField, Text, Placeholder, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { ArrowLeft, ArrowRight } from 'lucide-react';

/**
 * NearbyDevelopmentsSection Component
 * "Other Developments Nearby" section with development cards carousel
 *
 * Features:
 * - Section title with styled "Developments" in blue
 * - Horizontal carousel of NearbyDevelopmentCard components
 * - Desktop: Shows 3 cards, Mobile: Shows 1 card
 * - Navigation arrows and dot indicators
 * - Autoplay (disabled in editing mode)
 */

interface Fields {
  TitlePart1: TextField;
  TitleHighlight: TextField;
  TitlePart2: TextField;
  /** Dictionary key: NearbyDevelopments_Previous */
  PreviousLabel: TextField;
  /** Dictionary key: NearbyDevelopments_Next */
  NextLabel: TextField;
}

const defaultFields: Fields = {
  TitlePart1: { value: 'Other' },
  TitleHighlight: { value: 'Developments' },
  TitlePart2: { value: 'Nearby' },
  PreviousLabel: { value: 'Previous' },
  NextLabel: { value: 'Next' },
};

export type NearbyDevelopmentsSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: NearbyDevelopmentsSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = props.fields || defaultFields;

  const sitecore = useSitecore();
  const isEditing = sitecore?.page?.mode?.isEditing ?? false;

  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);

  const phDevelopmentCards = `developmentCards-${DynamicPlaceholderId}`;

  // Count slides from DOM
  useEffect(() => {
    if (!carouselRef.current) return;

    const countSlides = () => {
      const slides = carouselRef.current?.querySelectorAll(':scope > .nearby-development-card');
      const count = slides?.length || 0;
      setTotalSlides(count);
    };

    countSlides();
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
      className={`component nearby-developments-section bg-[#f5f5f5] py-12 lg:py-16 ${styles || ''}`}
      id={id}
    >
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2 className="mb-8 text-center text-3xl text-[#003057] md:text-4xl lg:mb-12 lg:text-5xl">
          <span className="font-light">
            <Text field={fields.TitlePart1} />
          </span>{' '}
          <span className="font-light text-[#0072CE] italic">
            <Text field={fields.TitleHighlight} />
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
            className="absolute top-1/2 -left-4 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#003057] text-white shadow-lg transition-colors hover:bg-[#002040] lg:flex xl:-left-8"
            aria-label={fields.PreviousLabel?.value as string}
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
          </button>
          <button
            onClick={handleNext}
            className="absolute top-1/2 -right-4 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#003057] text-white shadow-lg transition-colors hover:bg-[#002040] lg:flex xl:-right-8"
            aria-label={fields.NextLabel?.value as string}
          >
            <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
          </button>

          {/* Carousel Track */}
          <div className="overflow-hidden">
            <div
              ref={carouselRef}
              className="nearby-carousel-track flex transition-transform duration-500 ease-out"
              style={
                {
                  '--slide-index': activeIndex,
                } as React.CSSProperties
              }
            >
              <Placeholder name={phDevelopmentCards} rendering={props.rendering} />
            </div>
          </div>
          <style jsx>{`
            .nearby-carousel-track {
              transform: translateX(calc(-1 * var(--slide-index) * 100%));
            }
            @media (min-width: 1024px) {
              .nearby-carousel-track {
                /* On desktop, show 3 cards. Each card is ~33.333% width */
                transform: translateX(calc(-1 * var(--slide-index) * 33.333%));
              }
            }
          `}</style>

          {/* Mobile Navigation Arrows */}
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

        {/* Dot Indicators */}
        {totalSlides > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3">
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
      </div>
    </section>
  );
};
