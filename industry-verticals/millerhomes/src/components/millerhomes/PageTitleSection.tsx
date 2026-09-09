'use client';

import type { JSX } from 'react';
import { TextField, RichTextField, Text, RichText } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * PageTitleSection Component
 * Displays a page title with optional subtitle/description
 * Used on region pages like "New homes in East Midlands"
 *
 * Fields:
 * - Title: Main page heading (e.g., "New homes in East Midlands")
 * - Subtitle: Subheading text
 * - Description: Rich text description
 */

interface Fields {
  /** Main page title */
  Title: TextField;
  /** Subtitle text */
  Subtitle: TextField;
  /** Rich text description with links */
  Description: RichTextField;
}

const defaultFields: Fields = {
  Title: { value: 'New homes in East Midlands' },
  Subtitle: { value: 'Find your perfect new home' },
  Description: {
    value:
      '<p>Discover our range of new build homes in the East Midlands region. From modern apartments to spacious family homes, we have something for everyone.</p>',
  },
};

export type PageTitleSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: PageTitleSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  return (
    <div className={`component page-title-section bg-white py-8 md:py-12 ${styles || ''}`} id={id}>
      <div className="container mx-auto px-4 md:px-6">
        {/* Title */}
        {fields.Title && (
          <h1 className="mb-4 text-3xl font-light text-[#0072CE] md:text-4xl lg:text-5xl">
            <Text field={fields.Title} />
          </h1>
        )}

        {/* Subtitle */}
        {fields.Subtitle && (
          <h2 className="mb-4 text-lg font-semibold text-[#003057] md:text-xl">
            <Text field={fields.Subtitle} />
          </h2>
        )}

        {/* Description */}
        {fields.Description && (
          <div className="prose prose-sm md:prose-base max-w-none text-[#4a4a4a] [&_a]:text-[#0072CE] [&_a]:underline">
            <RichText field={fields.Description} />
          </div>
        )}
      </div>
    </div>
  );
};
