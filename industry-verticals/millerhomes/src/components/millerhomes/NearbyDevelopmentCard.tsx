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
import { Building2, Home } from 'lucide-react';

/**
 * NearbyDevelopmentCard Component
 * Card for displaying a nearby development in the NearbyDevelopmentsSection carousel
 *
 * Features:
 * - Image with promotional banner overlay at bottom (teal background)
 * - Development name (bold, dark blue)
 * - Description text (desktop only)
 * - Location with building icon
 * - Price range with home icon (prices in teal)
 * - Dark blue CTA button
 *
 * Mobile: More compact, no description
 * Desktop: Full content with description
 */

interface Fields {
  /** Main development image */
  Image: ImageField;
  /** Promotional banner text (shown on image) */
  PromoBanner: TextField;
  /** Development name */
  Name: TextField;
  /** Development description (desktop only) */
  Description: RichTextField;
  /** Location/address */
  Location: TextField;
  /** Price "from" label */
  PriceFromLabel: TextField;
  /** Minimum price */
  PriceMin: TextField;
  /** Price "to" label */
  PriceToLabel: TextField;
  /** Maximum price */
  PriceMax: TextField;
  /** CTA button text */
  CTAText: TextField;
  /** CTA link */
  CTALink: LinkField;
}

const defaultFields: Fields = {
  Image: { value: { src: '', alt: 'Development' } },
  PromoBanner: { value: 'Fantastic offers available for first time buyers and families alike.' },
  Name: { value: 'Holmebank Gardens' },
  Description: {
    value:
      '<p>In beautiful Yorkshire countryside, amidst the magnificent Pennine Hills, the picturesque village of Honley is a welcoming, traditional community where excellent independent local shops and services are complemented by good transport connections.</p>',
  },
  Location: { value: 'Honley, HD9 6PR' },
  PriceFromLabel: { value: 'Prices from' },
  PriceMin: { value: '£354,995' },
  PriceToLabel: { value: 'to' },
  PriceMax: { value: '£549,995' },
  CTAText: { value: 'Discover Holmebank Gardens' },
  CTALink: { value: { href: '/developments/holmebank-gardens' } },
};

export type NearbyDevelopmentCardProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: NearbyDevelopmentCardProps): JSX.Element | null => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  // Don't render empty cards
  const hasContent = fields.Name?.value || fields.Image?.value?.src;
  if (!hasContent) {
    return null;
  }

  const hasPromoBanner = fields.PromoBanner?.value;
  const hasPriceRange = fields.PriceMin?.value && fields.PriceMax?.value;

  return (
    <div
      className={`component nearby-development-card w-full flex-shrink-0 px-2 lg:w-[calc(33.333%-1rem)] ${styles || ''}`}
      id={id}
    >
      <div className="flex h-full flex-col bg-white">
        {/* Image Container */}
        <div className="relative">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            {fields.Image?.value?.src && (
              <SitecoreImage field={fields.Image} className="h-full w-full object-cover" />
            )}
          </div>

          {/* Promo Banner - positioned at bottom of image */}
          {hasPromoBanner && (
            <div className="absolute right-0 bottom-0 left-0 bg-[#0072CE]/90 px-4 py-2 text-center text-xs font-medium text-white">
              <Text field={fields.PromoBanner} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-grow flex-col bg-[#f8f8f8] p-4 lg:p-5">
          {/* Name */}
          <h3 className="mb-3 text-xl font-bold text-[#003057] lg:text-2xl">
            <Text field={fields.Name} />
          </h3>

          {/* Description - Desktop only */}
          {fields.Description?.value && (
            <div className="mb-4 line-clamp-4 hidden text-sm leading-relaxed text-[#4a4a4a] lg:block">
              <RichText field={fields.Description} />
            </div>
          )}

          {/* Location */}
          {fields.Location?.value && (
            <div className="mb-2 flex items-center gap-2 text-sm text-[#4a4a4a]">
              <Building2 className="h-4 w-4 flex-shrink-0 text-[#0072CE]" />
              <Text field={fields.Location} />
            </div>
          )}

          {/* Price Range */}
          {hasPriceRange && (
            <div className="mb-4 flex items-center gap-2 text-sm">
              <Home className="h-4 w-4 flex-shrink-0 text-[#0072CE]" />
              <span className="text-[#4a4a4a]">
                <Text field={fields.PriceFromLabel} />
              </span>
              <span className="font-semibold text-[#0072CE]">
                <Text field={fields.PriceMin} />
              </span>
              <span className="text-[#4a4a4a]">
                <Text field={fields.PriceToLabel} />
              </span>
              <span className="font-semibold text-[#0072CE]">
                <Text field={fields.PriceMax} />
              </span>
            </div>
          )}

          {/* Spacer to push CTA to bottom */}
          <div className="flex-grow" />

          {/* CTA Button */}
          {fields.CTALink?.value?.href && (
            <SitecoreLink
              field={fields.CTALink}
              className="block w-full bg-[#003057] px-4 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-[#002040]"
            >
              <Text field={fields.CTAText} />
            </SitecoreLink>
          )}
        </div>
      </div>
    </div>
  );
};
