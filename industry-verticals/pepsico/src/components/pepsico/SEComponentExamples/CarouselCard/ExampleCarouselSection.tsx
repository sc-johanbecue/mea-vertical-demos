'use client';

import React, { type JSX, useState, useEffect, useRef, useCallback } from 'react';
import { TextField, Text, Placeholder, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * TestimonialCarouselSection Component
 * "MEET OUR CLIENTS" section with client testimonial quote carousel
 *
 * Layout:
 * - Dark navy background (#1A1A2E)
 * - "MEET OUR CLIENTS" label
 * - Carousel of TestimonialCard components (via placeholder)
 * - Dot indicators
 * - CTA buttons via a second placeholder (CtaLinkCard components)
 *
 * Placeholders:
 * - testimonialCards-{DynamicPlaceholderId}: drop TestimonialCard components here
 * - testimonialCtas-{DynamicPlaceholderId}: drop CtaLinkCard components here
 *
 * Uses the same MutationObserver + translateX + --slide-index carousel
 * pattern as NearbyDevelopmentsSection.
 */

interface Fields {
  /** Section label shown above the carousel, e.g. "MEET OUR CLIENTS" */
  Label: TextField;
}

const defaultFields: Fields = {
  Label: { value: 'MEET OUR CLIENTS' },
};

export type TestimonialCarouselSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: TestimonialCarouselSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = props.fields || defaultFields;

  const sitecore = useSitecore();
  const isEditing = sitecore?.page?.mode?.isEditing ?? false;

  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);

  const phTestimonialCards = `testimonialCards-${DynamicPlaceholderId}`;
  const phTestimonialCtas = `testimonialCtas-${DynamicPlaceholderId}`;

  const handleGoTo = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev === 0) return totalSlides - 1;
      return prev - 1;
    });
  }, [totalSlides]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev === totalSlides - 1) return 0;
      return prev + 1;
    });
  }, [totalSlides]);

  // Count slides from DOM via MutationObserver (same pattern as NearbyDevelopmentsSection)
  useEffect(() => {
    if (!carouselRef.current) return;

    const countSlides = () => {
      const slides = carouselRef.current?.querySelectorAll(':scope > .testimonial-card');
      const count = slides?.length || 0;
      setTotalSlides(count);
    };

    countSlides();
    const observer = new MutationObserver(countSlides);
    observer.observe(carouselRef.current, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  // Autoplay (disabled in editing mode or when only 1 card)
  useEffect(() => {
    if (isEditing || totalSlides < 2) return;

    const interval = setInterval(() => {
      handleNext();
    }, 6000);

    return () => clearInterval(interval);
  }, [isEditing, totalSlides, handleNext]);

  return (
    <section
      key={id ?? props.rendering?.uid}
      className={`component testimonial-carousel-section bg-[#F5F5F5] py-12 lg:py-16 ${styles || ''}`}
      id={id}
    >
      <div className="mx-auto max-w-5xl px-4">
        {/* Label */}
        <p className="mb-8 text-center text-xs font-bold tracking-widest text-[#1A1A2E] uppercase">
          <Text field={fields.Label} />
        </p>

        {/* Quote Carousel with arrows */}
        <div className="relative">
          {/* Prev Arrow - show when 2+ cards */}
          {totalSlides >= 2 && (
            <button
              onClick={handlePrev}
              className="absolute top-1/2 left-0 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#D0271D] text-white transition-colors hover:bg-[#b8221a] lg:-left-16"
              aria-label="Previous testimonial"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {/* Carousel track */}
          <div className="overflow-hidden px-4 lg:px-16">
            <div
              ref={carouselRef}
              className={`testimonial-carousel-track flex transition-transform duration-500 ease-out ${totalSlides === 1 ? 'justify-center' : ''}`}
              style={
                totalSlides >= 2
                  ? ({
                      '--slide-index': activeIndex,
                    } as React.CSSProperties)
                  : undefined
              }
            >
              <Placeholder name={phTestimonialCards} rendering={props.rendering} />
            </div>
          </div>

          {/* Next Arrow - show when 2+ cards */}
          {totalSlides >= 2 && (
            <button
              onClick={handleNext}
              className="absolute top-1/2 right-0 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#D0271D] text-white transition-colors hover:bg-[#b8221a] lg:-right-16"
              aria-label="Next testimonial"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>
        <style jsx>{`
          /* Mobile/Tablet: show 1 card at a time, full width */
          .testimonial-carousel-track {
            ${totalSlides >= 2
              ? 'transform: translateX(calc(-1 * var(--slide-index) * 100%));'
              : ''}
          }
          .testimonial-carousel-track :global(.testimonial-card) {
            width: 100%;
            padding: 1.5rem;
            ${totalSlides < 2
              ? 'background: white; opacity: 1; border-radius: 0.5rem; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);'
              : ''}
          }

          /* Desktop layouts - single card centered for 1-2 cards */
          @media (min-width: 1024px) {
            ${totalSlides === 1
              ? `
            /* 1 card: centered, no carousel */
            .testimonial-carousel-track :global(.testimonial-card) {
              max-width: 600px;
              padding: 2.5rem 2rem;
              background: white;
              opacity: 1;
              border-radius: 0.5rem;
              box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
            }
            `
              : totalSlides === 2
                ? `
            /* 2 cards: one centered at a time, carousel active */
            .testimonial-carousel-track {
              transform: translateX(calc(-1 * var(--slide-index) * 100%));
            }
            .testimonial-carousel-track :global(.testimonial-card) {
              max-width: 600px;
              padding: 2.5rem 2rem;
              background: white;
              opacity: 1;
              border-radius: 0.5rem;
              box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
            }
            `
                : ''}
          }

          /* XL+ Desktop: show 3 cards simultaneously for 3+ cards only at 1280px+ */
          @media (min-width: 1280px) {
            ${totalSlides >= 3
              ? `
            /* 3+ cards: show 3 simultaneously - center ~50% viewport, sides faded */
            .testimonial-carousel-track {
              /* Shift by activeIndex to center the active card */
              transform: translateX(calc(50% - var(--slide-index) * 60% - 30%));
              gap: 2rem;
            }
            .testimonial-carousel-track :global(.testimonial-card) {
              /* Cards are 60% of container, but visually center appears ~50% viewport */
              width: 60%;
              flex-shrink: 0;
              padding: 2.5rem 2rem;
              transition: all 0.4s ease;
              border-radius: 0.75rem;
            }
            /* Side cards: very faded, blend into background, smaller */
            .testimonial-carousel-track :global(.testimonial-card:not(:nth-child(${activeIndex + 1}))) {
              background: rgba(255, 255, 255, 0.4);
              transform: scale(0.75);
              opacity: 0.3;
              box-shadow: none;
            }
            /* Active center card: white background, prominent, clear shadow */
            .testimonial-carousel-track :global(.testimonial-card:nth-child(${activeIndex + 1})) {
              background: white;
              transform: scale(1);
              opacity: 1;
              box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
            }
            `
              : ''}
          }
        `}</style>

        {/* Dot Indicators - show when 2+ cards */}
        {totalSlides >= 2 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                onClick={() => handleGoTo(i)}
                className={`h-3 w-3 rounded-full border-2 transition-all ${
                  i === activeIndex
                    ? 'border-[#D0271D] bg-[#D0271D]'
                    : 'border-[#D0271D] bg-transparent'
                }`}
                aria-label={`Go to quote ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* CTA Buttons (via placeholder) */}
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Placeholder name={phTestimonialCtas} rendering={props.rendering} />
        </div>
      </div>
    </section>
  );
};
