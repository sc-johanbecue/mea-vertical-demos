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
import { Bed, Ruler, Home, Car, Heart, ChevronRight } from 'lucide-react';

/**
 * HouseTypeCard Component
 * Card for displaying a house type in the development page grid
 *
 * Features:
 * - Hero image
 * - House name and status (Coming Soon, Available, etc.)
 * - Description
 * - Specifications (beds, sqft, type, parking)
 * - Price
 * - CTA button
 */

interface Fields {
  /** House image */
  Image: ImageField;
  /** House name */
  Name: TextField;
  /** Status (Coming Soon, Available Now, etc.) */
  Status: TextField;
  /** Description */
  Description: TextField;
  /** Number of bedrooms */
  Bedrooms: TextField;
  /** House type (Detached, Semi, etc.) */
  HouseType: TextField;
  /** Garden type */
  Garden: TextField;
  /** Parking spaces */
  Parking: TextField;
  /** Price text */
  Price: TextField;
  /** CTA link */
  CTALink: LinkField;
  /** Dictionary key: HouseTypeCard_BedroomsLabel */
  BedroomsLabel: TextField;
  /** Dictionary key: HouseTypeCard_ParkingLabel */
  ParkingLabel: TextField;
  /** Dictionary key: HouseTypeCard_PricesFrom */
  PricesFromLabel: TextField;
  /** Dictionary key: HouseTypeCard_FindOutMore */
  FindOutMoreText: TextField;
  /** Dictionary key: HouseTypeCard_SaveLabel */
  SaveLabel: TextField;
}

const defaultFields: Fields = {
  Image: { value: { src: '', alt: 'House Type' } },
  Name: { value: 'Hampton' },
  Status: { value: 'Coming Soon' },
  Description: {
    value: 'A beautiful 3 bedroom detached home with spacious living areas and a private garden.',
  },
  Bedrooms: { value: '3' },
  HouseType: { value: 'Detached' },
  Garden: { value: 'Private Garden' },
  Parking: { value: '2' },
  Price: { value: '£TBA' },
  CTALink: { value: { href: '/house-types/hampton', text: 'Find out more' } },
  BedroomsLabel: { value: 'Bedrooms' },
  ParkingLabel: { value: 'Parking' },
  PricesFromLabel: { value: 'Prices from' },
  FindOutMoreText: { value: 'Find out more' },
  SaveLabel: { value: 'Save' },
};

export type HouseTypeCardProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: HouseTypeCardProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const { fields } = props || defaultFields;

  const isComingSoon = (fields.Status?.value as string).toLowerCase().includes('coming soon');

  return (
    <div
      className={`component nearby-development-card w-full flex-shrink-0 px-2 lg:w-[calc(33.333%-1rem)] ${styles || ''}`}
      id={id}
    >
      {/* Image */}
      <div className="relative">
        {fields.Image && (
          <div className="aspect-[4/3] overflow-hidden">
            <SitecoreImage field={fields.Image} className="h-full w-full object-cover" />
          </div>
        )}

        {/* Save Button */}
        <button className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md transition-colors hover:bg-white">
          <Heart className="h-4 w-4 text-[#003057]" />
        </button>

        {/* Arrow */}
        <button className="absolute top-1/2 right-3 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md transition-colors hover:bg-white">
          <ChevronRight className="h-5 w-5 text-[#003057]" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name */}
        {fields.Name && (
          <h3 className="mb-1 text-lg font-bold text-[#0072CE]">
            <Text field={fields.Name} />
          </h3>
        )}

        {/* Status */}
        {fields.Status && (
          <p
            className={`mb-2 text-sm font-medium ${isComingSoon ? 'text-[#D4A84B]' : 'text-green-600'}`}
          >
            <Text field={fields.Status} />
          </p>
        )}

        {/* Description */}
        {fields.Description && (
          <p className="mb-3 line-clamp-2 text-sm text-[#4a4a4a]">
            <Text field={fields.Description} />
          </p>
        )}

        {/* Specifications */}
        <div className="mb-4 grid grid-cols-2 gap-2 text-xs text-[#4a4a4a]">
          {fields.Bedrooms && (
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4 text-[#0072CE]" />
              <Text field={fields.Bedrooms} /> Bedrooms
            </div>
          )}
          {fields.HouseType && (
            <div className="flex items-center gap-1">
              <Home className="h-4 w-4 text-[#0072CE]" />
              <Text field={fields.HouseType} />
            </div>
          )}
          {fields.Garden && (
            <div className="flex items-center gap-1">
              <Ruler className="h-4 w-4 text-[#0072CE]" />
              <Text field={fields.Garden} />
            </div>
          )}
          {fields.Parking && (
            <div className="flex items-center gap-1">
              <Car className="h-4 w-4 text-[#0072CE]" />
              <Text field={fields.Parking} /> Parking
            </div>
          )}
        </div>

        {/* Price */}
        <div className="mb-4">
          <span className="text-xs text-[#4a4a4a]">Prices from</span>
          <p className="text-xl font-bold text-[#003057]">
            {fields.Price ? <Text field={fields.Price} /> : '£TBA'}
          </p>
        </div>

        {/* CTA */}
        {fields.CTALink ? (
          <SitecoreLink
            field={fields.CTALink}
            className="block w-full rounded bg-[#003057] px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-[#002040]"
          />
        ) : (
          <button className="w-full rounded bg-[#003057] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#002040]">
            Find out more
          </button>
        )}
      </div>
    </div>
  );
};
