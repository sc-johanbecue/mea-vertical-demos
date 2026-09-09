'use client';

import React, { type JSX, useCallback, useEffect, useState } from 'react';
import {
  TextField,
  Text,
  ImageField,
  RichTextField,
  RichText,
  Image as SitecoreImage,
  LinkField,
  Link as SitecoreLink,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * HeroCarouselSection Component
 * Full-width hero carousel with background image, overlay text, and navigation arrows
 *
 * Features:
 * - Auto-play carousel with Embla
 * - Left/Right arrow navigation
 * - Text overlay with title, description, and CTA
 * - Responsive text sizing
 */

interface HeroSlide {
  fields: {
    BackgroundImage: ImageField;
    Title: TextField;
    SubTitle: TextField;
    Description: RichTextField;
    CTAText: TextField;
    CTALink: LinkField;
  };
}

interface Fields {
  Slides: HeroSlide[];
  AutoplayInterval: { value: number };
  /** Dictionary key: HeroCarousel_PreviousSlide */
  PreviousSlideLabel: TextField;
  /** Dictionary key: HeroCarousel_NextSlide */
  NextSlideLabel: TextField;
}

const defaultFields: Fields = {
  Slides: [
    {
      fields: {
        BackgroundImage: { value: { src: '', alt: 'Hero' } },
        Title: { value: 'Be the first to know when we release new homes for sale' },
        SubTitle: { value: '' },
        Description: {
          value:
            'We have a dedicated email alert and promotion service just for you. Sign up today to receive exclusive offers and more.',
        },
        CTAText: { value: 'Learn more' },
        CTALink: { value: { href: '#' } },
      },
    },
  ],
  AutoplayInterval: { value: 5000 },
  PreviousSlideLabel: { value: 'Previous slide' },
  NextSlideLabel: { value: 'Next slide' },
};

export type HeroCarouselSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: HeroCarouselSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Update selected index
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  // Autoplay
  useEffect(() => {
    if (!emblaApi) return;

    const interval = fields.AutoplayInterval?.value || 5000;
    const timer = setInterval(() => {
      emblaApi.scrollNext();
    }, interval);

    return () => clearInterval(timer);
  }, [emblaApi, fields.AutoplayInterval?.value]);

  const slides = fields.Slides;

  return (
    <section className={`component hero-carousel-section relative ${styles || ''}`} id={id}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div key={index} className="relative min-w-0 flex-[0_0_100%]">
              {/* Background Image */}
              <div className="relative h-100 bg-[#003057] md:h-125 lg:h-137.5">
                <SitecoreImage
                  field={slide.fields.BackgroundImage}
                  className="absolute inset-0 h-full w-full object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30" />

                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                  <div className="contaisner mx-auto px-4">
                    <div className="max-w-xl text-white">
                      <Text
                        tag="h1"
                        className="mb-4 text-2xl leading-tight font-light text-white md:text-2xl lg:text-3xl"
                        field={slide.fields.Title}
                      />
                      <Text
                        tag="h2"
                        className="text-1xl md:text-1xl mb-4 leading-tight font-light text-white lg:text-2xl"
                        field={slide.fields.SubTitle}
                      />
                      <RichText
                        className="mb-6 max-w-md text-sm text-white/90 md:text-base"
                        field={slide.fields.Description}
                      />
                      {slide.fields.CTALink?.value?.href ? (
                        <SitecoreLink
                          field={slide.fields.CTALink}
                          className="inline-block rounded bg-[#004b91] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#004b91]"
                        >
                          <Text field={slide.fields.CTAText} classname="font-extrabold" />
                        </SitecoreLink>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={scrollPrev}
        className="absolute top-1/2 left-4 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#003057] shadow-lg transition-colors hover:bg-white md:h-12 md:w-12"
        aria-label={fields.PreviousSlideLabel?.value as string}
      >
        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute top-1/2 right-4 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#003057] shadow-lg transition-colors hover:bg-white md:h-12 md:w-12"
        aria-label={fields.NextSlideLabel?.value as string}
      >
        <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
      </button>
    </section>
  );
};
