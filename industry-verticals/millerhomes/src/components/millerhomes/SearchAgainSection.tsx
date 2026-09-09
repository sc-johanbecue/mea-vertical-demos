'use client';

import type { JSX } from 'react';
import { TextField, Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { Search, MapPin } from 'lucide-react';

/**
 * SearchAgainSection Component
 * "Not found what you were looking for? Search again" section
 *
 * Features:
 * - Headline text
 * - Search input with location icon
 * - Search button
 * - Advanced search link
 */

interface Fields {
  /** Section title */
  Title: TextField;
  /** Dictionary key: SearchAgain_Placeholder */
  Placeholder: TextField;
  /** Dictionary key: SearchAgain_SearchButton */
  SearchButtonText: TextField;
  /** Dictionary key: SearchAgain_AdvancedSearch */
  AdvancedSearchText: TextField;
}

const defaultFields: Fields = {
  Title: { value: 'Not found what you were looking for? Search again' },
  Placeholder: { value: 'Search using a postcode' },
  SearchButtonText: { value: 'Search' },
  AdvancedSearchText: { value: 'Advanced Search' },
};

export type SearchAgainSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: SearchAgainSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const { fields } = props || defaultFields;

  return (
    <div
      className={`component search-again-section bg-[#003057] py-12 md:py-16 ${styles || ''}`}
      id={id}
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Title */}
        <h2 className="mb-8 text-center text-2xl font-light text-white md:text-3xl lg:text-4xl">
          {fields.Title ? (
            <Text field={fields.Title} />
          ) : (
            'Not found what you were looking for? Search again'
          )}
        </h2>

        {/* Search Bar */}
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col gap-3 md:flex-row">
            {/* Search Input */}
            <div className="relative flex-1">
              <MapPin className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={fields.Placeholder?.value as string}
                className="w-full rounded border border-[#2a5a80] bg-[#1a4a70] py-3 pr-4 pl-12 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#0072CE] focus:outline-none"
              />
            </div>

            {/* Search Button */}
            <button className="flex items-center justify-center gap-2 rounded bg-[#0072CE] px-6 py-3 font-medium text-white transition-colors hover:bg-[#005ba3]">
              <Search className="h-5 w-5" />
              {fields.SearchButtonText ? <Text field={fields.SearchButtonText} /> : 'Search'}
            </button>

            {/* Advanced Search */}
            <button className="flex items-center justify-center gap-2 rounded border border-[#2a5a80] bg-[#1a4a70] px-6 py-3 font-medium text-white transition-colors hover:bg-[#2a5a80]">
              {fields.AdvancedSearchText ? (
                <Text field={fields.AdvancedSearchText} />
              ) : (
                'Advanced Search'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
