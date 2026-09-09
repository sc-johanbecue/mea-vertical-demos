'use client';

import type { JSX } from 'react';
import {
  TextField,
  RichTextField,
  LinkField,
  ImageField,
  Text,
  RichText,
  Link as SitecoreLink,
  Image as SitecoreImage,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { MapPin, Heart, ChevronRight } from 'lucide-react';

/**
 * DevelopmentCard Component
 * Card for displaying a development in search results/grid
 *
 * Features:
 * - Hero image with carousel indicators
 * - Match count badge (e.g., "31 Homes Matching Your Requirements")
 * - Development name and description
 * - Location, price range
 * - Region badge
 * - CTA button
 * - Save/favorite functionality
 * - Optional promotional banner
 */

interface Fields {
  /** Main development image */
  Image: ImageField;
  /** Number of matching homes text */
  MatchCount: TextField;
  /** Development name */
  Name: TextField;
  /** Development description */
  Description: RichTextField;
  /** Location/address */
  Location: TextField;
  /** Price range text */
  PriceRange: TextField;
  /** Region text (e.g., "Within region") */
  Region: TextField;
  /** Promotional banner text (optional) */

  PromoBanner: TextField;
  /** Event/release info (optional) */
  EventInfo: TextField;
  /** CTA link */
  CTALink: LinkField;
  /** Dictionary key: DevelopmentCard_SaveLabel */
  SaveLabel: TextField;
  /** Dictionary key: DevelopmentCard_NextImage */
  NextImageLabel: TextField;
}

const defaultFields: Fields = {
  Image: { value: { src: '', alt: 'Development' } },
  MatchCount: { value: '31 Homes Matching Your Requirements' },
  Name: { value: 'Bramcote Hills Rise' },
  Description: {
    value:
      '<p>A stunning collection of new homes in a desirable location, offering contemporary living in the heart of Nottinghamshire.</p>',
  },
  Location: { value: 'Coventry Lane, Bramcote, Nottingham, NG9 3GJ' },
  PriceRange: { value: '£299,995 - £549,995' },
  Region: { value: 'Within region' },
  PromoBanner: { value: '' },
  EventInfo: { value: '' },
  CTALink: { value: { href: '/developments/bramcote-hills-rise', text: 'View Development' } },
  SaveLabel: { value: 'Save' },
  NextImageLabel: { value: 'Next image' },
};

export type DevelopmentCardProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: DevelopmentCardProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const { fields } = props || defaultFields;

  const hasPromoBanner = fields.PromoBanner?.value;
  const hasEventInfo = fields.EventInfo?.value;

  return (
    <div
      className={`component development-card overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg ${styles || ''}`}
      id={id}
    >
      {/* Image Container */}
      <div className="relative">
        {/* Promo Banner */}
        {hasPromoBanner && (
          <div className="absolute top-0 right-0 left-0 z-10 bg-[#D4A84B] px-3 py-1.5 text-xs font-medium text-white">
            <Text field={fields.PromoBanner} />
          </div>
        )}

        {/* Image */}
        <div className="relative aspect-4/3 overflow-hidden">
          {fields.Image && (
            <SitecoreImage field={fields.Image} className="h-full w-full object-cover" />
          )}

          {/* Image Navigation Arrow */}
          <button className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md transition-colors hover:bg-white">
            <ChevronRight className="h-5 w-5 text-[#003057]" />
          </button>

          {/* Carousel Dots */}
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
            <span className="h-2 w-2 rounded-full bg-white" />
            <span className="h-2 w-2 rounded-full bg-white/50" />
            <span className="h-2 w-2 rounded-full bg-white/50" />
          </div>
        </div>

        {/* Save Button */}
        <button className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md transition-colors hover:bg-white">
          <Heart className="h-4 w-4 text-[#003057]" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Match Count */}
        {fields.MatchCount && (
          <p className="mb-2 flex items-center gap-1 text-xs font-medium text-[#0072CE]">
            <Text field={fields.MatchCount} />
            <Heart className="h-3 w-3" />
          </p>
        )}

        {/* Name */}
        {fields.Name && (
          <h3 className="mb-2 text-lg font-bold text-[#003057]">
            <Text field={fields.Name} />
          </h3>
        )}

        {/* Description */}
        {fields.Description && (
          <div className="text-foreground-light mb-3 line-clamp-3 text-sm">
            <RichText field={fields.Description} />
          </div>
        )}

        {/* Location */}
        {fields.Location && (
          <div className="text-foreground-light mb-2 flex items-start gap-2 text-sm">
            <MapPin className="shsrink-0 mt-0.5 h-4 w-4 text-[#0072CE]" />
            <Text field={fields.Location} />
          </div>
        )}

        {/* Price Range */}
        {fields.PriceRange && (
          <div className="mb-2 flex items-center gap-2 text-sm">
            <span className="text-[#0072CE]">£</span>
            <span className="font-medium text-[#003057]">
              <Text field={fields.PriceRange} />
            </span>
          </div>
        )}

        {/* Region */}
        {fields.Region && (
          <div className="text-foreground-light mb-3 flex items-center gap-2 text-sm">
            <span className="flex h-4 w-4 items-center justify-center rounded-full border border-gray-300 text-[10px]">
              ⊙
            </span>
            <Text field={fields.Region} />
          </div>
        )}

        {/* Event Info */}
        {hasEventInfo && (
          <div className="text-foreground-light mb-3 rounded bg-gray-50 p-3 text-sm">
            <Text field={fields.EventInfo} />
          </div>
        )}

        {/* CTA Button */}
        {fields.CTALink && (
          <SitecoreLink
            field={fields.CTALink}
            className="block w-full rounded bg-[#003057] px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-[#002040]"
          />
        )}
      </div>
    </div>
  );
};
