'use client';

import type { JSX } from 'react';
import { TextField, RichTextField, LinkField, Text, RichText } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { Bed, Bath, Car, Trees, MapPin, Calendar, Heart, Navigation, Video } from 'lucide-react';

/**
 * HouseTypeInfoSection Component
 * Main info section for house type detail pages (Hampton style)
 *
 * Features:
 * - House name with development subtitle
 * - Address with directions link
 * - Specs row (beds, baths, parking, garden)
 * - Description and key features
 * - Price sidebar with CTAs
 */

interface Fields {
  /** House type name (e.g., "Hampton") */
  Name: TextField;
  /** Development name (e.g., "at Bramcote Hills Rise") */
  DevelopmentName: TextField;
  /** Full address */
  Address: TextField;
  /** Price */
  Price: TextField;
  /** Price prefix (e.g., "Prices range from") */
  PricePrefix: TextField;
  /** Number of bedrooms */
  Bedrooms: TextField;
  /** Number of bathrooms */
  Bathrooms: TextField;
  /** Parking info */
  ParkingSpaces: TextField;
  /** Garden info */
  Garden: TextField;
  /** Description */
  Description: RichTextField;
  /** Key Features (rich text with bullet list) */
  KeyFeatures: RichTextField;
  /** Development link */
  DevelopmentLink: LinkField;
  /** Dictionary key: HouseTypeInfo_Beds */
  BedsLabel: TextField;
  /** Dictionary key: HouseTypeInfo_Baths */
  BathsLabel: TextField;
  /** Dictionary key: HouseTypeInfo_GetDirections */
  GetDirectionsText: TextField;
  /** Dictionary key: HouseTypeInfo_KeyFeatures */
  KeyFeaturesHeading: TextField;
  /** Dictionary key: HouseTypeInfo_RegisterUpdates */
  RegisterUpdatesText: TextField;
  /** Dictionary key: HouseTypeInfo_BookAppointment */
  BookAppointmentText: TextField;
  /** Dictionary key: HouseTypeInfo_AddFavourites */
  AddFavouritesText: TextField;
  /** Dictionary key: HouseTypeInfo_ViewVirtualTour */
  ViewVirtualTourText: TextField;
}

const defaultFields: Fields = {
  Name: { value: 'Hampton' },
  DevelopmentName: { value: 'at Bramcote Hills Rise' },
  Address: { value: 'Coventry Lane, Bramcote, Nottingham, Nottinghamshire, NG9 3GJ' },
  Price: { value: 'TBA' },
  PricePrefix: { value: 'Prices range from' },
  Bedrooms: { value: '3' },
  Bathrooms: { value: '3' },
  ParkingSpaces: { value: 'Parking Spaces' },
  Garden: { value: 'Garden' },
  Description: {
    value:
      '<p>The superb Hampton, with its dining area opening to the garden, and the light, elegant lounge that is a flexible favourite in our range. The family bathroom makes life run smoothly complementing an ensuite and the en-suite principal bedroom. Bedroom 2 could make an excellent home office with built in cupboards adding extra storage options.</p>',
  },
  KeyFeatures: {
    value:
      '<ul><li>Principal bedroom with French doors to the garden</li><li>Downstairs WC</li><li>Driveway parking</li><li>Principal bedroom with dressing room</li><li>Sunny private garden</li></ul>',
  },
  DevelopmentLink: {
    value: { href: '/developments/bramcote-hills-rise', text: 'View Development' },
  },
  BedsLabel: { value: 'Beds' },
  BathsLabel: { value: 'Baths' },
  GetDirectionsText: { value: 'Get Directions' },
  KeyFeaturesHeading: { value: 'Key Features' },
  RegisterUpdatesText: { value: 'Register for updates' },
  BookAppointmentText: { value: 'Book an appointment' },
  AddFavouritesText: { value: 'Add to favourites' },
  ViewVirtualTourText: { value: 'View Virtual Tour' },
};

export type HouseTypeInfoSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: HouseTypeInfoSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const { fields } = props || defaultFields;

  return (
    <div
      className={`component house-type-info-section bg-white py-8 md:py-12 ${styles || ''}`}
      id={id}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          {/* Left Column - Main Info */}
          <div className="flex-1">
            {/* Title */}
            <h1 className="mb-1 text-3xl font-light text-[#0072CE] md:text-4xl lg:text-5xl">
              {fields.Name ? <Text field={fields.Name} /> : 'Hampton'}
            </h1>
            <h2 className="mb-4 text-xl font-light text-[#003057] md:text-2xl">
              {fields.DevelopmentName ? (
                <Text field={fields.DevelopmentName} />
              ) : (
                'at Bramcote Hills Rise'
              )}
            </h2>

            {/* Address */}
            <div className="mb-6 flex items-center gap-2 text-sm text-[#4a4a4a]">
              <MapPin className="h-4 w-4 text-[#0072CE]" />
              <span>
                {fields.Address ? (
                  <Text field={fields.Address} />
                ) : (
                  'Coventry Lane, Bramcote, Nottingham, Nottinghamshire, NG9 3GJ'
                )}
              </span>
              <button className="ml-2 font-medium text-[#0072CE] hover:underline">
                Get Directions
              </button>
            </div>

            {/* Specs Row */}
            <div className="mb-6 flex flex-wrap gap-6 border-y border-gray-200 py-4 md:gap-8">
              <div className="flex items-center gap-2">
                <Bed className="h-5 w-5 text-[#0072CE]" />
                <span className="font-medium text-[#003057]">
                  {fields.Bedrooms ? <Text field={fields.Bedrooms} /> : '3'} Beds
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="h-5 w-5 text-[#0072CE]" />
                <span className="font-medium text-[#003057]">
                  {fields.Bathrooms ? <Text field={fields.Bathrooms} /> : '3'} Baths
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="h-5 w-5 text-[#0072CE]" />
                <span className="font-medium text-[#003057]">
                  {fields.ParkingSpaces ? <Text field={fields.ParkingSpaces} /> : 'Parking Spaces'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Trees className="h-5 w-5 text-[#0072CE]" />
                <span className="font-medium text-[#003057]">
                  {fields.Garden ? <Text field={fields.Garden} /> : 'Garden'}
                </span>
              </div>
            </div>

            {/* Description */}
            {fields.Description ? (
              <div className="prose prose-sm mb-6 max-w-none leading-relaxed text-[#4a4a4a]">
                <RichText field={fields.Description} />
              </div>
            ) : (
              <p className="mb-6 leading-relaxed text-[#4a4a4a]">
                The superb Hampton, with its dining area opening to the garden, and the light,
                elegant lounge that is a flexible favourite in our range. The family bathroom makes
                life run smoothly complementing an ensuite and the en-suite principal bedroom.
                Bedroom 2 could make an excellent home office with built in cupboards adding extra
                storage options.
              </p>
            )}

            {/* Key Features */}
            <div className="mb-6">
              <h3 className="mb-3 text-lg font-semibold text-[#003057]">Key Features</h3>
              {fields.KeyFeatures ? (
                <div className="prose prose-sm text-[#4a4a4a]">
                  <RichText field={fields.KeyFeatures} />
                </div>
              ) : (
                <ul className="space-y-2 text-sm text-[#4a4a4a]">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-[#0072CE]">•</span>
                    <span>Principal bedroom with French doors to the garden</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-[#0072CE]">•</span>
                    <span>Downstairs WC</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-[#0072CE]">•</span>
                    <span>Driveway parking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-[#0072CE]">•</span>
                    <span>Principal bedroom with dressing room</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-[#0072CE]">•</span>
                    <span>Sunny private garden</span>
                  </li>
                </ul>
              )}
            </div>
          </div>

          {/* Right Column - Price & CTAs */}
          <div className="flex-shrink-0 lg:w-[300px]">
            <div className="sticky top-4 overflow-hidden rounded-lg border border-gray-200 bg-white">
              {/* Price Header */}
              <div className="border-b border-gray-200 bg-gray-50 p-4">
                <p className="mb-1 text-sm text-[#4a4a4a]">
                  {fields.PricePrefix ? <Text field={fields.PricePrefix} /> : 'Prices range from'}
                </p>
                <p className="text-2xl font-bold text-[#003057] md:text-3xl">
                  {fields.Price ? <Text field={fields.Price} /> : 'TBA'}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3 p-4">
                <button className="flex w-full items-center justify-center gap-2 rounded bg-[#0072CE] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#005ba3]">
                  <Calendar className="h-4 w-4" />
                  Register for updates
                </button>

                <button className="flex w-full items-center justify-center gap-2 rounded border border-[#003057] bg-transparent px-4 py-3 text-sm font-medium text-[#003057] transition-colors hover:bg-[#003057] hover:text-white">
                  <Calendar className="h-4 w-4" />
                  Book an appointment
                </button>

                <button className="flex w-full items-center justify-center gap-2 rounded border border-[#003057] bg-transparent px-4 py-3 text-sm font-medium text-[#003057] transition-colors hover:bg-[#003057] hover:text-white">
                  <Heart className="h-4 w-4" />
                  Add to favourites
                </button>

                <button className="flex w-full items-center justify-center gap-2 rounded border border-[#003057] bg-transparent px-4 py-3 text-sm font-medium text-[#003057] transition-colors hover:bg-[#003057] hover:text-white">
                  <Navigation className="h-4 w-4" />
                  Get Directions
                </button>

                <button className="flex w-full items-center justify-center gap-2 rounded border border-[#003057] bg-transparent px-4 py-3 text-sm font-medium text-[#003057] transition-colors hover:bg-[#003057] hover:text-white">
                  <Video className="h-4 w-4" />
                  View Virtual Tour
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
