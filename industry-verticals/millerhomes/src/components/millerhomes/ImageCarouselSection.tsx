'use client';

import type { JSX } from 'react';
import { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import {
  TextField,
  RichTextField,
  Text,
  RichText,
  Placeholder,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * ImageCarouselSection Component
 * Carousel section for "Explore [Development Name]" image galleries
 * Uses Embla Carousel for smooth navigation
 *
 * Features:
 * - Title and description
 * - Image carousel with navigation arrows
 * - Dot indicators
 * - Dynamic placeholder for ImageCard components
 */

interface Fields {
  /** Section title */
  Title: TextField;
  /** Dictionary key: ImageCarousel_TitlePrefix */
  TitlePrefix: TextField;
  /** Section description */
  Description: RichTextField;
  /** Dictionary key: ImageCarousel_PreviousSlide */
  PreviousSlideLabel: TextField;
  /** Dictionary key: ImageCarousel_NextSlide */
  NextSlideLabel: TextField;
  /** Dictionary key: ImageCarousel_GoToSlide */
  GoToSlideLabel: TextField;
}

const defaultFields: Fields = {
  Title: { value: 'Bramcote Hills Rise' },
  TitlePrefix: { value: 'Explore' },
  Description: {
    value:
      '<p>Take a closer look at our beautiful development and discover what makes it special.</p>',
  },
  PreviousSlideLabel: { value: 'Previous slide' },
  NextSlideLabel: { value: 'Next slide' },
  GoToSlideLabel: { value: 'Go to slide' },
};

export type ImageCarouselSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: ImageCarouselSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const { fields } = props || defaultFields;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const phImages = `carouselImages-${DynamicPlaceholderId}`;

  return (
    <div className={`component image-carousel-section bg-white py-12 ${styles || ''}`} id={id}>
      <div className="container mx-auto px-4 md:px-6">
        {/* Title */}
        <h2 className="mb-4 text-center text-2xl font-light md:text-3xl">
          <span className="text-[#003057]">Explore </span>
          <span className="text-[#0072CE]">
            {fields.Title ? <Text field={fields.Title} /> : 'Bramcote Hills Rise'}
          </span>
        </h2>

        {/* Description */}
        {fields.Description && (
          <div className="text-foreground-light mx-auto mb-8 max-w-2xl text-center">
            <RichText field={fields.Description} />
          </div>
        )}

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={scrollPrev}
            className="absolute top-1/2 left-0 z-10 flex h-10 w-10 -translate-x-4 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg transition-colors hover:bg-gray-50"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6 text-[#003057]" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute top-1/2 right-0 z-10 flex h-10 w-10 translate-x-4 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg transition-colors hover:bg-gray-50"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6 text-[#003057]" />
          </button>

          {/* Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              <Placeholder name={phImages} rendering={props.rendering} />
            </div>
          </div>
        </div>

        {/* Dot Indicators */}
        <div className="mt-6 flex justify-center gap-2">
          {[0, 1, 2, 3, 4].map((index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === 0 ? 'bg-[#0072CE]' : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
