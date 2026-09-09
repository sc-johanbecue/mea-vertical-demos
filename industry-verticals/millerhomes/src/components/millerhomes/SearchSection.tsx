'use client';

import React, { type JSX, useState } from 'react';
import { TextField, Text, LinkField, Link as SitecoreLink } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { Search, MapPin, Home } from 'lucide-react';

/**
 * SearchSection Component
 * Dark blue search bar section with location input and quick links
 *
 * Features:
 * - "Find your new home today" title
 * - Search input with autocomplete placeholder
 * - Search and "Personalise your search" buttons
 * - Quick links: Select by location, Showhomes near me
 */

interface Fields {
  Title: TextField;
  /** Dictionary key: Search_Placeholder */
  SearchPlaceholder: TextField;
  /** Dictionary key: Search_ButtonText */
  SearchButtonText: TextField;
  PersonaliseButtonText: TextField;
  PersonaliseButtonLink: LinkField;
  SelectByLocationText: TextField;
  SelectByLocationLink: LinkField;
  ShowhomesText: TextField;
  ShowhomesLink: LinkField;
}

const defaultFields: Fields = {
  Title: { value: 'Find your new home today' },
  SearchPlaceholder: { value: 'Search using a postcode, town, development name or region' },
  SearchButtonText: { value: 'Search' },
  PersonaliseButtonText: { value: 'Personalise your search' },
  PersonaliseButtonLink: { value: { href: '/personalise-search' } },
  SelectByLocationText: { value: 'Select by location' },
  SelectByLocationLink: { value: { href: '/locations' } },
  ShowhomesText: { value: 'Showhomes near me' },
  ShowhomesLink: { value: { href: '/showhomes' } },
};

export type SearchSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: SearchSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <section
      className={`component search-section bg-[#003057] py-6 lg:py-8 ${styles || ''}`}
      id={id}
    >
      <div className="container mx-auto px-4 lg:px-8">
        {/* Title */}
        <h2 className="mb-4 text-lg font-semibold text-white lg:text-xl">
          <Text field={fields.Title} />
        </h2>

        {/* Search Bar - Desktop: inline, Mobile/Tablet: stacked */}
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Search Input with integrated button on desktop */}
          <div className="flex flex-1 flex-col gap-3 lg:flex-row">
            <div className="relative flex flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={fields.SearchPlaceholder?.value as string}
                className="w-full rounded border-0 bg-[#0a2540] px-4 py-3.5 text-white placeholder:text-white/70 focus:ring-2 focus:ring-[#d4a853] focus:outline-none lg:rounded-l lg:rounded-r-none"
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 -translate-y-1/2 text-white/70 transition-colors hover:text-white"
                aria-label="Use my location"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
                </svg>
              </button>
            </div>
            {/* Search Button */}
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded bg-[#d4a853] px-8 py-3.5 font-medium text-white transition-colors hover:bg-[#c49743] lg:rounded-l-none lg:rounded-r"
            >
              <Search className="h-4 w-4" />
              <Text field={fields.SearchButtonText} />
            </button>
          </div>

          {/* Personalise Button */}
          {fields.PersonaliseButtonLink && (
            <SitecoreLink
              field={fields.PersonaliseButtonLink}
              className="rounded border border-white px-6 py-3.5 text-center font-medium text-white transition-colors hover:bg-white/10"
            >
              <Text field={fields.PersonaliseButtonText} />
            </SitecoreLink>
          )}
        </div>

        {/* Quick Links - Desktop: inline, Mobile/Tablet: stacked */}
        <div className="flex flex-col gap-3 text-sm lg:flex-row lg:items-center lg:gap-6">
          <SitecoreLink
            field={fields.SelectByLocationLink}
            className="flex items-center gap-2 text-white transition-colors hover:text-white/80"
          >
            <MapPin className="h-4 w-4" />
            <Text field={fields.SelectByLocationText} />
          </SitecoreLink>
          <SitecoreLink
            field={fields.ShowhomesLink}
            className="flex items-center gap-2 text-white transition-colors hover:text-white/80"
          >
            <Home className="h-4 w-4" />
            <Text field={fields.ShowhomesText} />
          </SitecoreLink>
        </div>
      </div>
    </section>
  );
};
