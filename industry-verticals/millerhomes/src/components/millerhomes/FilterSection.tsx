'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import { TextField, Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { ChevronDown, Grid3X3, List, MapPin, Search } from 'lucide-react';

/**
 * FilterSection Component
 * Filter bar for region/search pages with location, price, bedrooms, completion filters
 * Includes view toggles (Grid/List/Map)
 *
 * Fields:
 * - LocationLabel, PriceLabel, BedroomsLabel, CompletionLabel: Filter labels
 */

interface Fields {
  /** Dictionary key: Filter_Location */
  LocationLabel: TextField;
  /** Dictionary key: Filter_Price */
  PriceLabel: TextField;
  /** Dictionary key: Filter_Bedrooms */
  BedroomsLabel: TextField;
  /** Dictionary key: Filter_CompletionDate */
  CompletionLabel: TextField;
  /** Dictionary key: Filter_GridView */
  GridViewText: TextField;
  /** Dictionary key: Filter_ListView */
  ListViewText: TextField;
  /** Dictionary key: Filter_MapView */
  MapViewText: TextField;
  /** Dictionary key: Filter_SearchShowhome */
  SearchShowhomeText: TextField;
  /** Dictionary key: Filter_PriceAny */
  PriceAnyText: TextField;
  /** Dictionary key: Filter_PriceTo */
  PriceToText: TextField;
}

const defaultFields: Fields = {
  LocationLabel: { value: 'Location' },
  PriceLabel: { value: 'Price' },
  BedroomsLabel: { value: 'Bedrooms' },
  CompletionLabel: { value: 'Completion Date' },
  GridViewText: { value: 'Grid View' },
  ListViewText: { value: 'List View' },
  MapViewText: { value: 'Map View' },
  SearchShowhomeText: { value: 'Search for a showhome' },
  PriceAnyText: { value: 'Any' },
  PriceToText: { value: 'to' },
};

export type FilterSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: FilterSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;
  const [activeView, setActiveView] = useState<'grid' | 'list' | 'map'>('grid');

  return (
    <div
      className={`component filter-section border-b border-gray-200 bg-white py-4 md:py-6 ${styles || ''}`}
      id={id}
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Filter Row */}
        <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          {/* Location Filter */}
          <div>
            <label className="mb-1 block text-xs font-medium text-[#003057]">
              <Text field={fields.LocationLabel} />
            </label>
            <div className="relative">
              <select className="w-full appearance-none rounded border border-gray-300 bg-white px-3 py-2 pr-8 text-sm text-[#4a4a4a] focus:border-transparent focus:ring-2 focus:ring-[#0072CE] focus:outline-none">
                <option>East Midlands</option>
                <option>+ 70 Miles</option>
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Price Filter */}
          <div>
            <label className="mb-1 block text-xs font-medium text-[#003057]">
              <Text field={fields.PriceLabel} />
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <select className="w-full appearance-none rounded border border-gray-300 bg-white px-3 py-2 pr-6 text-sm text-[#4a4a4a] focus:ring-2 focus:ring-[#0072CE] focus:outline-none">
                  <option>Any</option>
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
              <span className="flex items-center text-sm text-gray-400">
                {fields.PriceToText?.value}
              </span>
              <div className="relative flex-1">
                <select className="w-full appearance-none rounded border border-gray-300 bg-white px-3 py-2 pr-6 text-sm text-[#4a4a4a] focus:ring-2 focus:ring-[#0072CE] focus:outline-none">
                  <option>Any</option>
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Bedrooms Filter */}
          <div>
            <label className="mb-1 block text-xs font-medium text-[#003057]">
              <Text field={fields.BedroomsLabel} />
            </label>
            <div className="relative">
              <select className="w-full appearance-none rounded border border-gray-300 bg-white px-3 py-2 pr-8 text-sm text-[#4a4a4a] focus:ring-2 focus:ring-[#0072CE] focus:outline-none">
                <option>1+</option>
                <option>2+</option>
                <option>3+</option>
                <option>4+</option>
                <option>5+</option>
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Completion Date Filter */}
          <div>
            <label className="mb-1 block text-xs font-medium text-[#003057]">
              <Text field={fields.CompletionLabel} />
            </label>
            <div className="relative">
              <select className="w-full appearance-none rounded border border-gray-300 bg-white px-3 py-2 pr-8 text-sm text-[#4a4a4a] focus:ring-2 focus:ring-[#0072CE] focus:outline-none">
                <option>Any</option>
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        {/* View Toggles & Search */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* View Toggles */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveView('grid')}
              className={`flex items-center gap-1 rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                activeView === 'grid'
                  ? 'bg-[#003057] text-white'
                  : 'text-[#003057] hover:bg-gray-100'
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
              {fields.GridViewText?.value}
            </button>
            <button
              onClick={() => setActiveView('list')}
              className={`flex items-center gap-1 rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                activeView === 'list'
                  ? 'bg-[#003057] text-white'
                  : 'text-[#003057] hover:bg-gray-100'
              }`}
            >
              <List className="h-4 w-4" />
              {fields.ListViewText?.value}
            </button>
            <button
              onClick={() => setActiveView('map')}
              className={`flex items-center gap-1 rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                activeView === 'map'
                  ? 'bg-[#003057] text-white'
                  : 'text-[#003057] hover:bg-gray-100'
              }`}
            >
              <MapPin className="h-4 w-4" />
              {fields.MapViewText?.value}
            </button>
          </div>

          {/* Showhome Search */}
          <button className="flex items-center gap-2 text-sm text-[#003057] transition-colors hover:text-[#0072CE]">
            <Search className="h-4 w-4" />
            {fields.SearchShowhomeText?.value}
          </button>
        </div>
      </div>
    </div>
  );
};
