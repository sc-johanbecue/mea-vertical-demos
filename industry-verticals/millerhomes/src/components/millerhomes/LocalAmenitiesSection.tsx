'use client';

import type { JSX } from 'react';
import { TextField, Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import {
  School,
  ShoppingBag,
  Utensils,
  TreePine,
  Train,
  Heart,
  Church,
  Coffee,
} from 'lucide-react';

/**
 * LocalAmenitiesSection Component
 * Map section showing local amenities around a development
 *
 * Features:
 * - Section title
 * - Interactive map placeholder
 * - Amenity category filters
 */

interface Fields {
  /** Section title */
  Title: TextField;
  /** Subtitle/description */
  Subtitle: TextField;
  /** Dictionary key: LocalAmenities_TitlePart1 */
  TitlePart1: TextField;
  /** Dictionary key: LocalAmenities_TitlePart2 */
  TitlePart2: TextField;
  /** Dictionary key: LocalAmenities_MapButton */
  MapButtonText: TextField;
  /** Dictionary key: LocalAmenities_SatelliteButton */
  SatelliteButtonText: TextField;
  /** Dictionary key: LocalAmenities_ExplorePrefix */
  ExplorePrefixText: TextField;
  /** Dictionary key: LocalAmenities_InteractiveMap */
  InteractiveMapText: TextField;
  /** Dictionary key: LocalAmenities_MapIntegrationRequired */
  MapIntegrationText: TextField;
}

const defaultFields: Fields = {
  Title: { value: 'Bramcote Hills Rise' },
  Subtitle: { value: 'Discover the local amenities and services near the development.' },
  TitlePart1: { value: 'Local' },
  TitlePart2: { value: 'Amenities' },
  MapButtonText: { value: 'Map' },
  SatelliteButtonText: { value: 'Satellite' },
  ExplorePrefixText: { value: 'Explore the local area around' },
  InteractiveMapText: { value: 'Interactive Map' },
  MapIntegrationText: { value: 'Map integration required' },
};

const amenityCategories = [
  { icon: School, label: 'Schools & Nurseries', key: 'schools' },
  { icon: ShoppingBag, label: 'Shopping', key: 'shopping' },
  { icon: Utensils, label: 'Bar & Restaurant', key: 'food' },
  { icon: TreePine, label: 'Leisure & Arts', key: 'leisure' },
  { icon: Train, label: 'Transport', key: 'transport' },
  { icon: Heart, label: 'Doctors', key: 'doctors' },
  { icon: Church, label: 'Church', key: 'church' },
  { icon: Coffee, label: 'Other Services', key: 'other' },
];

export type LocalAmenitiesSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: LocalAmenitiesSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  return (
    <div className={`component local-amenities-section bg-white py-12 ${styles || ''}`} id={id}>
      <div className="container mx-auto px-4 md:px-6">
        {/* Title */}
        <h2 className="mb-4 text-center text-2xl font-light md:text-3xl">
          <span className="text-[#003057]">
            <Text field={fields.TitlePart1} />{' '}
          </span>
          <span className="text-[#0072CE]">
            <Text field={fields.TitlePart2} />
          </span>
        </h2>

        {/* Subtitle */}
        <p className="mx-auto mb-6 max-w-2xl text-center text-[#4a4a4a]">
          <Text field={fields.Subtitle} />
        </p>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Map Toggle */}
          <div className="flex-shrink-0 lg:w-48">
            <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-x-visible lg:pb-0">
              <button className="flex-shrink-0 rounded bg-[#003057] px-4 py-2 text-sm font-medium text-white">
                <Text field={fields.MapButtonText} />
              </button>
              <button className="flex-shrink-0 rounded bg-gray-100 px-4 py-2 text-sm font-medium text-[#003057] transition-colors hover:bg-gray-200">
                <Text field={fields.SatelliteButtonText} />
              </button>
            </div>
          </div>

          {/* Map Container */}
          <div className="flex-1">
            <div className="flex h-[300px] items-center justify-center overflow-hidden rounded-lg bg-gray-100 md:h-[400px]">
              <div className="text-center text-[#4a4a4a]">
                <p className="text-lg">
                  <Text field={fields.InteractiveMapText} />
                </p>
                <p className="text-sm">
                  <Text field={fields.MapIntegrationText} />
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Amenity Categories */}
        <div className="mt-6">
          <p className="mb-4 text-sm text-[#4a4a4a]">
            <Text field={fields.ExplorePrefixText} /> <Text field={fields.Title} />:
          </p>
          <div className="flex flex-wrap gap-3">
            {amenityCategories.map((category) => (
              <button
                key={category.key}
                className="flex items-center gap-2 rounded border border-gray-200 px-3 py-2 text-sm transition-colors hover:border-[#0072CE] hover:text-[#0072CE]"
              >
                <category.icon className="h-4 w-4" />
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
