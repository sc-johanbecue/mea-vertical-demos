'use client';

import type { JSX } from 'react';
import { TextField, LinkField, Text, Link as SitecoreLink } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * VirtualTourBannerSection Component
 * Blue banner promoting 3D virtual tour (Hampton style)
 *
 * Features:
 * - Full-width blue background
 * - Heading text
 * - CTA button for virtual tour
 */

interface Fields {
  /** Banner text (e.g., "Step inside the Hampton using our 3D virtual tour.") */
  Text: TextField;
  /** CTA link */
  CTALink: LinkField;
  /** CTA text */
  CTAText: TextField;
}

const defaultFields: Fields = {
  Text: { value: 'Step inside the Hampton using our 3D virtual tour.' },
  CTALink: { value: { href: '#virtual-tour' } },
  CTAText: { value: 'Have a look at this home' },
};

export type VirtualTourBannerSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: VirtualTourBannerSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  return (
    <div
      className={`component virtual-tour-banner-section bg-[#003057] py-8 md:py-12 ${styles || ''}`}
      id={id}
    >
      <div className="container mx-auto px-4 text-center md:px-6">
        {/* Text */}
        <p className="mb-6 text-lg text-white md:text-xl">
          <Text field={fields.Text} />
        </p>

        {/* CTA Button */}
        <SitecoreLink
          field={fields.CTALink}
          className="inline-flex items-center gap-2 rounded border-2 border-white bg-transparent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white hover:text-[#003057]"
        >
          <Text field={fields.CTAText} />
        </SitecoreLink>
      </div>
    </div>
  );
};
