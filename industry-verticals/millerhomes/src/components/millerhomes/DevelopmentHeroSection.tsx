'use client';

import type { JSX } from 'react';
import {
  TextField,
  LinkField,
  ImageField,
  Text,
  Link as SitecoreLink,
  Image as SitecoreImage,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * DevelopmentHeroSection Component
 * Hero section for development detail pages with virtual tour overlay
 *
 * Features:
 * - Large hero image with carousel navigation
 * - "View our homes from anywhere" virtual tour overlay
 * - Map toggle button
 */

interface Fields {
  /** Hero image */
  Image: ImageField;
  /** Virtual tour heading */
  VirtualTourHeading: TextField;
  /** Virtual tour subheading */
  VirtualTourSubheading: TextField;
  /** Virtual tour CTA */
  VirtualTourLink: LinkField;
  /** Dictionary key: DevelopmentHero_MapButton */
  MapButtonText: TextField;
  /** Dictionary key: DevelopmentHero_PlayVideo */
  PlayVideoText: TextField;
  /** Dictionary key: DevelopmentHero_PreviousSlide */
  PreviousSlideLabel: TextField;
  /** Dictionary key: DevelopmentHero_NextSlide */
  NextSlideLabel: TextField;
}

const defaultFields: Fields = {
  Image: { value: { src: '', alt: 'Development Hero' } },
  VirtualTourHeading: { value: 'View our homes from anywhere' },
  VirtualTourSubheading: { value: 'Explore our homes with a virtual tour' },
  VirtualTourLink: { value: { href: '#virtual-tour', text: 'Play video' } },
  MapButtonText: { value: 'Map' },
  PlayVideoText: { value: 'Play video' },
  PreviousSlideLabel: { value: 'Previous slide' },
  NextSlideLabel: { value: 'Next slide' },
};

export type DevelopmentHeroSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: DevelopmentHeroSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const { fields } = props || defaultFields;

  return (
    <div className={`component development-hero-section relative ${styles || ''}`} id={id}>
      {/* Hero Image */}
      <div className="relative h-75 overflow-hidden md:h-100 lg:h-125">
        {fields.Image && (
          <SitecoreImage field={fields.Image} className="h-full w-full object-cover" />
        )}

        {/* Navigation Arrows */}
        <button className="absolute top-1/2 left-4 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg transition-colors hover:bg-white">
          <ChevronLeft className="h-6 w-6 text-[#003057]" />
        </button>
        <button className="absolute top-1/2 right-4 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg transition-colors hover:bg-white">
          <ChevronRight className="h-6 w-6 text-[#003057]" />
        </button>

        {/* Virtual Tour Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-[#003057]/70">
          <div className="px-4 text-center text-white">
            <h2 className="mb-2 text-2xl font-light md:text-3xl lg:text-4xl">
              {fields.VirtualTourHeading ? (
                <Text field={fields.VirtualTourHeading} />
              ) : (
                'View our homes from anywhere'
              )}
            </h2>
            <p className="mx-auto mb-6 max-w-md text-sm text-white/80 md:text-base">
              {fields.VirtualTourSubheading ? (
                <Text field={fields.VirtualTourSubheading} />
              ) : (
                'Explore our homes with a virtual tour'
              )}
            </p>
            {fields.VirtualTourLink ? (
              <SitecoreLink
                field={fields.VirtualTourLink}
                className="inline-flex items-center gap-2 rounded bg-[#0072CE] px-6 py-3 font-medium text-white transition-colors hover:bg-[#005ba3]"
              />
            ) : (
              <button className="inline-flex items-center gap-2 rounded bg-[#0072CE] px-6 py-3 font-medium text-white transition-colors hover:bg-[#005ba3]">
                <Play className="h-5 w-5" />
                Play video
              </button>
            )}
          </div>
        </div>

        {/* Map Toggle */}
        <button className="absolute right-4 bottom-4 z-10 rounded bg-white px-4 py-2 text-sm font-medium text-[#003057] shadow-lg transition-colors hover:bg-gray-50">
          {fields.MapButtonText ? <Text field={fields.MapButtonText} /> : 'Map'}
        </button>
      </div>
    </div>
  );
};
