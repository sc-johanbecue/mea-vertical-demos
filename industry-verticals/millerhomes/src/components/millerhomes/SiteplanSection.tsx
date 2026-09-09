'use client';

import type { JSX } from 'react';
import {
  TextField,
  RichTextField,
  ImageField,
  Text,
  RichText,
  Image as SitecoreImage,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * SiteplanSection Component
 * Interactive siteplan/map section for development pages
 *
 * Features:
 * - Section title and description
 * - Interactive map placeholder (actual map would be custom integration)
 * - "Open 3D walkthrough" button
 */

interface Fields {
  /** Section title */
  Title: TextField;
  /** Dictionary key: Siteplan_TitleSuffix */
  TitleSuffix: TextField;
  /** Section description */
  Description: RichTextField;
  /** Siteplan image (fallback) */
  SiteplanImage: ImageField;
  /** Dictionary key: Siteplan_WalkthroughButton */
  WalkthroughButtonText: TextField;
  /** Dictionary key: Siteplan_MapPlaceholder */
  MapPlaceholderText: TextField;
  /** Dictionary key: Siteplan_MapIntegrationRequired */
  MapIntegrationText: TextField;
}

const defaultFields: Fields = {
  Title: { value: 'Bramcote Hills Rise' },
  TitleSuffix: { value: 'Siteplan' },
  Description: {
    value:
      '<p>Explore our interactive siteplan to find your perfect plot. Click on any plot to view availability and pricing.</p>',
  },
  SiteplanImage: { value: { src: '', alt: 'Siteplan' } },
  WalkthroughButtonText: { value: 'Open 3D walkthrough' },
  MapPlaceholderText: { value: 'Interactive Siteplan' },
  MapIntegrationText: { value: 'Map integration required' },
};

export type SiteplanSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: SiteplanSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const { fields } = props || defaultFields;

  return (
    <div className={`component siteplan-section bg-white py-12 ${styles || ''}`} id={id}>
      <div className="container mx-auto px-4 md:px-6">
        {/* Title */}
        <h2 className="mb-4 text-center text-2xl font-light md:text-3xl">
          <span className="text-[#003057]">
            {fields.Title ? <Text field={fields.Title} /> : 'Bramcote Hills Rise'}{' '}
          </span>
          <span className="text-[#0072CE]">Siteplan</span>
        </h2>

        {/* Description */}
        {fields.Description && (
          <div className="text-foreground-light mx-auto mb-8 max-w-2xl text-center">
            <RichText field={fields.Description} />
          </div>
        )}

        {/* Siteplan Container */}
        <div className="relative flex min-h-100 items-center justify-center overflow-hidden rounded-lg bg-gray-100 md:min-h-125">
          {/* Siteplan Image */}
          {fields.SiteplanImage ? (
            <SitecoreImage field={fields.SiteplanImage} className="h-full w-full object-contain" />
          ) : (
            <div className="text-foreground-light text-center">
              <p className="text-lg">Interactive Siteplan</p>
              <p className="text-sm">Map integration required</p>
            </div>
          )}
        </div>

        {/* 3D Walkthrough Button */}
        <div className="mt-6 text-center">
          <button className="inline-flex items-center gap-2 rounded bg-[#003057] px-6 py-3 font-medium text-white transition-colors hover:bg-[#002040]">
            {fields.WalkthroughButtonText ? (
              <Text field={fields.WalkthroughButtonText} />
            ) : (
              'Open 3D walkthrough'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
