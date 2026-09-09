'use client';

import type { JSX } from 'react';
import { TextField, Text, Placeholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { ChevronDown } from 'lucide-react';

/**
 * PlotAvailabilitySection Component
 * Shows available plots for a house type
 *
 * Features:
 * - Section title
 * - Filter/sort options
 * - Dynamic placeholder for PlotCard components
 */

interface Fields {
  /** Section title */
  Title: TextField;
  /** Subtitle */
  Subtitle: TextField;
  /** Dictionary key: PlotAvailability_SortByLabel */
  SortByLabel: TextField;
  /** Dictionary key: PlotAvailability_PriceLowToHigh */
  PriceLowToHighText: TextField;
  /** Dictionary key: PlotAvailability_PriceHighToLow */
  PriceHighToLowText: TextField;
  /** Dictionary key: PlotAvailability_PlotNumber */
  PlotNumberText: TextField;
  /** Dictionary key: PlotAvailability_Availability */
  AvailabilityText: TextField;
}

const defaultFields: Fields = {
  Title: { value: 'Available Plots' },
  Subtitle: { value: 'Browse our available plots and find your perfect home.' },
  SortByLabel: { value: 'Sort by:' },
  PriceLowToHighText: { value: 'Price (Low to High)' },
  PriceHighToLowText: { value: 'Price (High to Low)' },
  PlotNumberText: { value: 'Plot Number' },
  AvailabilityText: { value: 'Availability' },
};

export type PlotAvailabilitySectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: PlotAvailabilitySectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = props.fields || defaultFields;

  const phPlots = `plots-${DynamicPlaceholderId}`;

  return (
    <div className={`component plot-availability-section bg-gray-50 py-12 ${styles || ''}`} id={id}>
      <div className="container mx-auto px-4 md:px-6">
        {/* Title */}
        <h2 className="mb-3 text-center text-2xl font-light md:text-3xl">
          <span className="text-[#003057]">
            <Text field={fields.Title} />
          </span>
        </h2>

        {/* Subtitle */}
        <p className="mx-auto mb-8 max-w-2xl text-center text-[#4a4a4a]">
          <Text field={fields.Subtitle} />
        </p>

        {/* Sort Options */}
        <div className="mb-6 flex justify-end">
          <div className="relative">
            <select className="appearance-none rounded border border-gray-300 bg-white px-4 py-2 pr-10 text-sm focus:ring-2 focus:ring-[#0072CE] focus:outline-none">
              <option>
                {fields.SortByLabel?.value} {fields.PriceLowToHighText?.value}
              </option>
              <option>
                {fields.SortByLabel?.value} {fields.PriceHighToLowText?.value}
              </option>
              <option>
                {fields.SortByLabel?.value} {fields.PlotNumberText?.value}
              </option>
              <option>
                {fields.SortByLabel?.value} {fields.AvailabilityText?.value}
              </option>
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Plots Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Placeholder name={phPlots} rendering={props.rendering} />
        </div>
      </div>
    </div>
  );
};
