'use client';

import React, { type JSX } from 'react';
import {
  TextField,
  Text,
  Placeholder,
  RichText,
  RichTextField,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * servicesSection Component
 * "The services of choosing ADP" section with a grid of serviceCards
 *
 * Layout:
 * - Desktop: Title + 3x2 grid of serviceCard components (via placeholder)
 * - Tablet: 3-column grid
 * - Mobile: Single column stacked cards
 * - White/light background
 */

interface Fields {
  Title: TextField;
  Description: RichTextField;
}

const defaultFields: Fields = {
  Title: { value: 'The services of choosing ADP' },
  Description: {
    value: '<p>ADP provides a comprehensive suite of services to support your business needs.</p>',
  },
};

export type servicesSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: servicesSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = props.fields || defaultFields;

  const phserviceCards = `service-cards-${DynamicPlaceholderId}`;

  return (
    <section
      key={id ?? props.rendering?.uid}
      className={`component services-section bg-white py-12 lg:py-16 ${styles || ''}`}
      id={id}
    >
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-10 text-center text-2xl font-bold text-[#1A1A2E] lg:mb-14 lg:text-3xl">
          <Text field={fields.Title} />
        </h2>

        <div className="services-description mb-10 text-center text-base text-[#555] lg:text-lg">
          <RichText field={fields.Description} />
        </div>

        {/* Flex grid of serviceCards -- centered, max 3 per row on md+ */}
        <div className="services-grid flex flex-wrap justify-center gap-6">
          <Placeholder name={phserviceCards} rendering={props.rendering} />
        </div>
      </div>

      <style jsx>{`
        .services-description :global(a) {
          color: #d0271d;
          text-decoration: none;
        }
        .services-description :global(a:hover) {
          text-decoration: underline;
        }
        .services-grid :global(> .service-card) {
          width: 100%;
        }
        @media (min-width: 768px) {
          .services-grid :global(> .service-card) {
            width: calc(33.333% - 1rem);
          }
        }
      `}</style>
    </section>
  );
};
