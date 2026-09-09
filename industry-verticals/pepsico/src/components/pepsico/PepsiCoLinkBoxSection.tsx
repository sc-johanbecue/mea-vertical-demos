'use client';

import React, { type JSX } from 'react';
import { TextField, Text, Placeholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * LinkBoxSection — “What can we help you with today?” block with centered header
 * and a responsive grid of LinkBoxCard renderings (via placeholder).
 *
 * Placeholder:
 * - link-box-cards-{DynamicPlaceholderId}: drop LinkBoxCard components here
 */

interface Fields {
  Title: TextField;
  Subtitle: TextField;
}

const defaultFields: Fields = {
  Title: { value: 'What can we help you with today?' },
  Subtitle: {
    value:
      'Health cover, care and everything in-between so you spend less time waiting and more time living.',
  },
};

export type LinkBoxSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: LinkBoxSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = props.fields || defaultFields;

  const phLinkBoxCards = `link-box-cards-${DynamicPlaceholderId}`;

  return (
    <section
      key={id ?? props.rendering?.uid}
      className={`component link-box-section bg-white py-10 lg:py-14 ${styles || ''}`}
      id={id}
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <h2 className="mx-auto mb-4 max-w-4xl text-center text-2xl leading-tight font-bold tracking-tight text-[#003359] md:text-3xl lg:mb-5 lg:text-4xl">
          <Text field={fields.Title} />
        </h2>

        <p className="mx-auto mb-10 max-w-3xl text-center text-base leading-relaxed text-[#5a5f66] md:text-lg lg:mb-12">
          <Text field={fields.Subtitle} />
        </p>

        <div className="link-box-grid flex flex-wrap gap-6 lg:gap-8">
          <Placeholder name={phLinkBoxCards} rendering={props.rendering} />
        </div>
      </div>

      <style jsx>{`
        .link-box-grid :global(> .link-box-card) {
          width: 100%;
        }
        /* Two cards per row (768px–1023px; matches gap-6 until lg) */
        @media (min-width: 768px) and (max-width: 1023px) {
          .link-box-grid :global(> .link-box-card) {
            width: calc((100% - 1.5rem) / 2);
          }
        }
        @media (min-width: 1023.01px) {
          .link-box-grid :global(> .link-box-card) {
            width: calc((100% - 4rem) / 3);
          }
        }
      `}</style>
    </section>
  );
};
