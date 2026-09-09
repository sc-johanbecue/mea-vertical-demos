'use client';

import type { JSX } from 'react';
import { TextField, Text, Placeholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * AvailableHomesSection Component
 * Section displaying available plots for a house type (Hampton style)
 *
 * Features:
 * - Section title "Available Homes"
 * - Dynamic placeholder for PlotCard components
 * - "View full listings" CTA
 */

interface Fields {
  /** Section title */
  Title: TextField;
  /** Dictionary key: AvailableHomes_TitlePart1 */
  TitlePart1: TextField;
  /** Dictionary key: AvailableHomes_TitlePart2 */
  TitlePart2: TextField;
  /** CTA text */
  CTAText: TextField;
}

const defaultFields: Fields = {
  Title: { value: 'Available Homes' },
  TitlePart1: { value: 'Available' },
  TitlePart2: { value: 'Homes' },
  CTAText: { value: 'View full listings' },
};

export type AvailableHomesSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: AvailableHomesSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = props.fields || defaultFields;

  const phPlots = `availablePlots-${DynamicPlaceholderId}`;

  return (
    <div className={`component available-homes-section bg-white py-12 ${styles || ''}`} id={id}>
      <div className="container mx-auto px-4 md:px-6">
        {/* Title */}
        <h2 className="mb-8 text-center text-2xl font-light md:text-3xl">
          <span className="text-[#003057]">
            <Text field={fields.TitlePart1} />
          </span>
          <span className="text-[#0072CE]">
            {' '}
            <Text field={fields.TitlePart2} />
          </span>
        </h2>

        {/* Plots Grid via Placeholder */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Placeholder name={phPlots} rendering={props.rendering} />
        </div>

        {/* View All CTA */}
        <div className="text-center">
          <button className="inline-flex items-center gap-2 rounded bg-[#0072CE] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#005ba3]">
            <Text field={fields.CTAText} />
          </button>
        </div>
      </div>
    </div>
  );
};
