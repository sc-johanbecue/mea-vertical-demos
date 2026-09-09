'use client';

import React, { type JSX } from 'react';
import { TextField, Text, Placeholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * PepsiCoImageLinkBoxSection — “Supporting your health” band with PepsiCoImageLinkBoxCard renderings.
 * Layout: flex + wrap (`items-stretch` for row height). Responsive columns ↔ Tailwind breakpoints:
 * 1 column &lt; `md`, 2 per row at `md` (768–1023px), 3 per row from `lg` (≥1024px); widths in `styled-jsx` below.
 *
 * Placeholder: `image-link-box-cards-{DynamicPlaceholderId}`
 */

export interface ImageLinkBoxSectionFields {
  Title: TextField;
  Subtitle: TextField;
}

const defaultFields: ImageLinkBoxSectionFields = {
  Title: { value: 'Supporting your health' },
  Subtitle: {
    value:
      'Health cover, care and everything in-between so you spend less time waiting and more time living.',
  },
};

export type ImageLinkBoxSectionProps = ComponentProps & {
  fields: ImageLinkBoxSectionFields;
};

export const Default = (props: ImageLinkBoxSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = props.fields || defaultFields;

  const phCards = `image-link-box-cards-${DynamicPlaceholderId}`;

  return (
    <section
      key={id ?? props.rendering?.uid}
      className={`component image-link-box-section bg-[#f0f2f5] py-10 lg:py-14 ${styles || ''}`}
      id={id}
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <h2 className="mx-auto mb-8 max-w-4xl text-center text-2xl leading-tight font-bold tracking-tight text-[#1a1a1a] md:mb-10 md:text-3xl lg:mb-12 lg:text-4xl">
          <Text field={fields.Title} />
        </h2>

        <p className="mx-auto mb-10 max-w-3xl text-center text-base leading-relaxed text-[#5a5f66] md:text-lg lg:mb-12">
          <Text field={fields.Subtitle} />
        </p>

        <div className="image-link-box-grid flex min-h-0 w-full flex-wrap items-stretch gap-6 lg:gap-8">
          <Placeholder name={phCards} rendering={props.rendering} />
        </div>
      </div>

      <style jsx>{`
        .image-link-box-grid {
          width: 100%;
          min-width: 0;
        }

        .image-link-box-grid :global(> *:only-child:not(.image-link-box-card)) {
          display: flex;
          flex-wrap: wrap;
          align-items: stretch;
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
          gap: 1.5rem;
        }

        @media (min-width: 1024px) {
          .image-link-box-grid :global(> *:only-child:not(.image-link-box-card)) {
            gap: 2rem;
          }
        }

        .image-link-box-grid :global(.image-link-box-card) {
          box-sizing: border-box;
          flex-shrink: 0;
          min-width: 0;
          width: 100%;
        }

        @media (min-width: 768px) and (max-width: 1023.9px) {
          .image-link-box-grid :global(> .image-link-box-card),
          .image-link-box-grid
            :global(> *:only-child:not(.image-link-box-card) .image-link-box-card) {
            width: calc((100% - 1.5rem) / 2);
          }
        }

        @media (min-width: 1024px) {
          .image-link-box-grid :global(> .image-link-box-card),
          .image-link-box-grid
            :global(> *:only-child:not(.image-link-box-card) .image-link-box-card) {
            width: calc((100% - 4rem) / 3);
          }
        }

        @media (min-width: 768px) and (max-width: 1023.9px) {
          .image-link-box-grid :global(> *:not(.image-link-box-card):not(:only-child)) {
            flex: 0 0 calc((100% - 1.5rem) / 2);
            max-width: calc((100% - 1.5rem) / 2);
            min-width: 0;
            box-sizing: border-box;
          }
        }

        @media (min-width: 1024px) {
          .image-link-box-grid :global(> *:not(.image-link-box-card):not(:only-child)) {
            flex: 0 0 calc((100% - 4rem) / 3);
            max-width: calc((100% - 4rem) / 3);
            min-width: 0;
            box-sizing: border-box;
          }
        }
      `}</style>
    </section>
  );
};
