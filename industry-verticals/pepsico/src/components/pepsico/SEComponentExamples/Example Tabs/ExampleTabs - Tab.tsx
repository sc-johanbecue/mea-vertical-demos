'use client';

import type { JSX } from 'react';
import { TextField, Text, Placeholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * PricingTab Component
 * Droppable card for the PricingSection placeholder.
 *
 * Renders two distinct parts, both controlled by the parent PricingSection:
 *   1. `.pricing-tab-trigger` -- the accordion label (mobile/tablet only)
 *   2. `.pricing-tab-content` -- the pricing cards grid
 *
 * Desktop: The parent reads `data-tab-label` and renders a horizontal tab bar.
 *          The trigger is hidden via CSS. Content visibility is controlled
 *          by the parent setting max-height / opacity on `.pricing-tab-content`.
 *
 * Mobile/Tablet: Each card acts as an accordion item. The parent toggles
 *          `data-tab-active`, styles the trigger, and animates the content.
 *
 * PricingCard components are dropped into the `pricing-cards-{id}` placeholder.
 */

interface Fields {
  TabLabel: TextField;
}

const defaultFields: Fields = {
  TabLabel: { value: 'For teams' },
};

export type PricingTabProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: PricingTabProps): JSX.Element => {
  const id = props.params?.RenderingIdentifier;
  const styles = props.params?.styles || '';
  const { DynamicPlaceholderId } = props.params || {};
  const fields = props.fields || defaultFields;

  const phPricingCards = `pricing-cards-${DynamicPlaceholderId || '1'}`;

  return (
    <div
      key={id ?? props.rendering?.uid}
      className={`pricing-tab-card ${styles || ''}`}
      id={id}
      data-tab-label={(fields.TabLabel?.value as string) || 'Tab'}
      data-tab-active="false"
    >
      {/* ===== TRIGGER (mobile/tablet accordion label) ===== */}
      <button
        type="button"
        className="pricing-tab-trigger flex w-full items-center justify-between"
        aria-expanded="false"
      >
        <span>
          <Text field={fields.TabLabel} />
        </span>
        <svg
          className="pricing-tab-chevron h-5 w-5 shrink-0 transition-transform duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* ===== CONTENT (pricing cards grid) ===== */}
      <div
        className="pricing-tab-content"
        style={{ maxHeight: '0px', opacity: '0', overflow: 'hidden' }}
      >
        <div className="pricing-cards-grid flex flex-wrap justify-center gap-6 pt-8 lg:gap-8 lg:pt-12">
          <Placeholder name={phPricingCards} rendering={props.rendering} />
        </div>

        {/* Scoped styles: 1 col mobile, 2 col tablet, 3 col desktop */}
        <style jsx>{`
          .pricing-cards-grid :global(> *) {
            flex: 0 0 100%;
            max-width: 100%;
          }
          @media (min-width: 640px) {
            .pricing-cards-grid :global(> *) {
              flex: 0 0 calc(50% - 0.75rem);
              max-width: calc(50% - 0.75rem);
            }
          }
          @media (min-width: 1280px) {
            .pricing-cards-grid :global(> *) {
              flex: 0 0 calc(33.333% - 1.334rem);
              max-width: calc(33.333% - 1.334rem);
            }
          }
        `}</style>
      </div>
    </div>
  );
};
