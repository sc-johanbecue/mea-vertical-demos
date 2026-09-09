import React, { type JSX } from 'react';
import {
  TextField,
  Text,
  RichTextField,
  RichText,
  LinkField,
  Link as SitecoreLink,
  Placeholder,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * StatsSection Component
 * "Every home is a new adventure" section with stats (90 Years, 95%, 5 Star, 100,000+)
 *
 * Features:
 * - Section title with styled "new adventure" in light font
 * - Description text
 * - CTA button
 * - 4 stat items in a row (responsive grid)
 * - Dynamic placeholder for StatCard components
 */

interface Fields {
  TitlePart1: TextField;
  TitleHighlight: TextField;
  Description: RichTextField;
  CTAText: TextField;
  CTALink: LinkField;
}

const defaultFields: Fields = {
  TitlePart1: { value: 'Every home is a' },
  TitleHighlight: { value: 'new adventure' },
  Description: {
    value:
      "<p>Buying a new home is an exciting adventure and we're here to offer you all the support you need from our very first meeting through to moving day and beyond.</p><p>Let us guide you on a journey through the exciting experience of buying a brand-new Miller home.</p>",
  },
  CTAText: { value: 'Take me there' },
  CTALink: { value: { href: '/buying-journey' } },
};

export type StatsSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: StatsSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = props.fields || defaultFields;

  const phStatsCards = `statsCards-${DynamicPlaceholderId}`;

  return (
    <section className={`component stats-section ${styles || ''}`} id={id}>
      {/* Content Area - White background */}
      <div className="bg-white py-8 lg:py-12">
        <div className="container mx-auto px-4">
          {/* Section Title */}
          <h2 className="mb-6 text-center text-3xl text-[#003057] md:text-4xl lg:text-5xl">
            <span className="font-light">
              <Text field={fields.TitlePart1} />
            </span>{' '}
            <span className="font-light text-[#0072CE]">
              <Text field={fields.TitleHighlight} />
            </span>
          </h2>

          {/* Description */}
          <div className="mx-auto mb-8 max-w-3xl text-center text-sm leading-relaxed text-[#003057] md:text-base">
            <RichText field={fields.Description} />
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <SitecoreLink
              field={fields.CTALink}
              className="inline-block bg-[#003057] px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-[#002040]"
            >
              <Text field={fields.CTAText} />
            </SitecoreLink>
          </div>
        </div>
      </div>

      {/* Stats Bar - Light gray background */}
      <div className="bg-[#e8eef2] py-8 lg:py-10">
        <div className="container mx-auto px-4">
          <div className="stats-grid mx-auto flex max-w-5xl flex-col items-center justify-center gap-8 lg:flex-row lg:gap-12 xl:gap-16">
            <Placeholder name={phStatsCards} rendering={props.rendering} />
          </div>
        </div>
      </div>
      <style jsx>{`
        .stats-grid :global(> *) {
          flex-shrink: 0;
          flex-grow: 0;
          flex-basis: auto;
        }
        .stats-grid :global(> .stat-card),
        .stats-grid :global(> * > .stat-card),
        .stats-grid :global(> * > * > .stat-card) {
          width: auto;
        }
      `}</style>
    </section>
  );
};
