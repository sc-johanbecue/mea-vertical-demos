'use client';

import type { JSX } from 'react';
import { useCallback, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import {
  TextField,
  ImageField,
  Image as SitecoreImage,
  Placeholder,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

/**
 * HouseTypeHeroSection Component
 * Hero image gallery for house type detail pages (Hampton style)
 * Uses Embla Carousel for smooth image navigation
 *
 * Features:
 * - Large main image with navigation arrows
 * - View Tour / View Plan overlay buttons
 * - Thumbnail strip below
 */

interface Fields {
  /** Main hero image (fallback if no placeholder images) */
  MainImage: ImageField;
  /** Virtual tour URL */
  VirtualTourUrl: TextField;
  /** Dictionary key: HouseTypeHero_ViewTour */
  ViewTourText: TextField;
  /** Dictionary key: HouseTypeHero_ViewPlan */
  ViewPlanText: TextField;
  /** Dictionary key: HouseTypeHero_PreviousImage */
  PreviousImageLabel: TextField;
  /** Dictionary key: HouseTypeHero_NextImage */
  NextImageLabel: TextField;
}

const defaultFields: Fields = {
  MainImage: { value: { src: '', alt: 'House Type' } },
  VirtualTourUrl: { value: '' },
  ViewTourText: { value: 'View Tour' },
  ViewPlanText: { value: 'View Plan' },
  PreviousImageLabel: { value: 'Previous image' },
  NextImageLabel: { value: 'Next image' },
};

export type HouseTypeHeroSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: HouseTypeHeroSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const { fields } = props || defaultFields;
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [thumbsRef] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  });

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
    setSelectedIndex(emblaApi?.selectedScrollSnap() || 0);
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
    setSelectedIndex(emblaApi?.selectedScrollSnap() || 0);
  }, [emblaApi]);

  const phGalleryImages = `galleryImages-${DynamicPlaceholderId}`;

  // Placeholder thumbnails for demo
  const thumbnails = [1, 2, 3, 4, 5, 6];

  return (
    <div className={`component house-type-hero-section bg-[#f5f5f5] ${styles || ''}`} id={id}>
      {/* Main Image Area */}
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {fields.MainImage ? (
              <div className="relative aspect-[4/3] min-w-0 flex-[0_0_100%] md:aspect-[16/9] lg:aspect-[2/1]">
                <SitecoreImage field={fields.MainImage} className="h-full w-full object-cover" />
              </div>
            ) : (
              <div className="relative aspect-[4/3] min-w-0 flex-[0_0_100%] bg-gray-300 md:aspect-[16/9] lg:aspect-[2/1]">
                <Placeholder name={phGalleryImages} rendering={props.rendering} />
              </div>
            )}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={scrollPrev}
          className="absolute top-1/2 left-4 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#003057] shadow-lg transition-colors hover:bg-[#002040]"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
        <button
          onClick={scrollNext}
          className="absolute top-1/2 right-4 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#003057] shadow-lg transition-colors hover:bg-[#002040]"
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>

        {/* View Tour / View Plan Buttons */}
        <div className="absolute right-6 bottom-6 z-10 flex flex-col gap-2">
          <button className="flex items-center gap-2 rounded bg-[#0072CE] px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-colors hover:bg-[#005ba3]">
            <Play className="h-4 w-4" />
            View Tour
          </button>
          <button className="flex items-center gap-2 rounded bg-[#0072CE] px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-colors hover:bg-[#005ba3]">
            <Play className="h-4 w-4" />
            View Plan
          </button>
        </div>
      </div>

      {/* Thumbnail Strip */}
      <div className="bg-white py-4">
        <div className="container mx-auto px-4">
          <div className="overflow-hidden" ref={thumbsRef}>
            <div className="flex justify-center gap-2">
              {thumbnails.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    emblaApi?.scrollTo(index);
                    setSelectedIndex(index);
                  }}
                  className={`h-14 w-20 flex-shrink-0 overflow-hidden rounded border-2 transition-colors md:h-16 md:w-24 ${
                    selectedIndex === index
                      ? 'border-[#0072CE]'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <div className="h-full w-full bg-gray-200" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
