'use client';

import React, { type JSX, useState, useEffect, useRef, useCallback } from 'react';
import { TextField, Text, Placeholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * PricingSection Component
 * "Select your license" section with tabbed pricing.
 *
 * Uses the same DOM-query pattern as the proven TabsSection example:
 * - Discovers child `.pricing-tab-card` elements via MutationObserver
 * - Reads `data-tab-label` for the desktop tab bar labels
 * - Controls `.pricing-tab-trigger` visibility and `.pricing-tab-content`
 *   open/close via data attributes and inline styles
 *
 * Desktop: horizontal centered tab row, active tab content shown below
 * Mobile/Tablet: accordion - each tab is a collapsible item
 */

/** Helper: reads the data-tab-label from the nth .pricing-tab-card */
function DesktopTabLabel({
  containerRef,
  index,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  index: number;
}) {
  const [label, setLabel] = useState('');

  useEffect(() => {
    const read = () => {
      if (!containerRef.current) return;
      const cards = containerRef.current.querySelectorAll<HTMLElement>(':scope .pricing-tab-card');
      const card = cards[index];
      if (card) setLabel(card.getAttribute('data-tab-label') || `Tab ${index + 1}`);
    };
    read();
    if (!containerRef.current) return;
    const obs = new MutationObserver(read);
    obs.observe(containerRef.current, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-tab-label'],
    });
    return () => obs.disconnect();
  }, [containerRef, index]);

  return <>{label}</>;
}

interface Fields {
  Heading: TextField;
  Subheading: TextField;
}

const defaultFields: Fields = {
  Heading: { value: 'Select your license' },
  Subheading: {
    value:
      'Get a discount on your first year with a new Business, Premium, or Corporate license purchase.',
  },
};

export type PricingSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: PricingSectionProps): JSX.Element => {
  const id = props.params?.RenderingIdentifier;
  const styles = props.params?.styles || '';
  const { DynamicPlaceholderId } = props.params || {};
  const fields = props.fields || defaultFields;

  const phPricingTabs = `pricing-tabs-${DynamicPlaceholderId || '1'}`;

  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardCount, setCardCount] = useState(0);

  /** Sync all card DOM states to match activeIndex */
  const syncCards = useCallback(() => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll<HTMLElement>(':scope .pricing-tab-card');
    setCardCount(cards.length);

    cards.forEach((card, i) => {
      const isActive = i === activeIndex;
      card.setAttribute('data-tab-active', String(isActive));

      const trigger = card.querySelector<HTMLElement>('.pricing-tab-trigger');
      if (trigger) trigger.setAttribute('aria-expanded', String(isActive));

      const chevron = card.querySelector<HTMLElement>('.pricing-tab-chevron');
      if (chevron) chevron.style.transform = isActive ? 'rotate(180deg)' : 'rotate(0deg)';

      const content = card.querySelector<HTMLElement>('.pricing-tab-content');
      if (content) {
        if (isActive) {
          content.style.maxHeight = `${content.scrollHeight + 2000}px`;
          content.style.opacity = '1';
        } else {
          content.style.maxHeight = '0px';
          content.style.opacity = '0';
        }
      }
    });
  }, [activeIndex]);

  useEffect(() => {
    if (!containerRef.current) return;
    syncCards();
    const observer = new MutationObserver(syncCards);
    observer.observe(containerRef.current, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [syncCards]);

  useEffect(() => {
    syncCards();
  }, [activeIndex, syncCards]);

  /** Handle mobile accordion trigger clicks via event delegation */
  const handleTriggerClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const trigger = (e.target as HTMLElement).closest('.pricing-tab-trigger');
    if (!trigger) return;
    const card = trigger.closest('.pricing-tab-card');
    if (!card || !containerRef.current) return;
    const cards = Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(':scope .pricing-tab-card')
    );
    const clickedIndex = cards.indexOf(card as HTMLElement);
    if (clickedIndex === -1) return;
    setActiveIndex((prev) => (prev === clickedIndex ? -1 : clickedIndex));
  }, []);

  return (
    <section
      key={id ?? props.rendering?.uid}
      className={`component pricing-section bg-white py-12 lg:py-20 ${styles || ''}`}
      id={id}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <h1
          className="mb-3 text-center text-3xl font-extrabold lg:text-5xl"
          style={{ color: '#0d1b3e' }}
        >
          <Text field={fields.Heading} />
        </h1>

        {/* Subheading */}
        <p className="mx-auto mb-10 max-w-xl text-center text-sm text-gray-500 lg:mb-14 lg:text-base">
          <Text field={fields.Subheading} />
        </p>

        {/* ===== DESKTOP: Horizontal tab bar ===== */}
        <div className="pricing-desktop-bar hidden justify-center lg:flex">
          <nav className="inline-flex items-center" role="tablist" aria-label="Pricing tabs">
            {Array.from({ length: cardCount }).map((_, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveIndex(i)}
                  style={{
                    padding: '14px 32px',
                    fontWeight: '600',
                    fontSize: '15px',
                    cursor: 'pointer',
                    backgroundColor: isActive ? '#0d1b3e' : '#ffffff',
                    color: isActive ? '#ffffff' : '#333333',
                    border: '1px solid #e0e0e0',
                    borderBottom: isActive ? '3px solid #0d1b3e' : '1px solid #e0e0e0',
                    marginBottom: '-3px',
                    borderRadius: '4px 4px 0 0',
                    transition: 'background-color 0.2s ease, color 0.2s ease',
                  }}
                >
                  <DesktopTabLabel containerRef={containerRef} index={i} />
                </button>
              );
            })}
          </nav>
        </div>

        {/* ===== Shared content container (desktop panel + mobile accordion) ===== */}
        <div
          ref={containerRef}
          className="pricing-tabs-container"
          onClick={handleTriggerClick}
          onKeyDown={undefined}
        >
          <Placeholder name={phPricingTabs} rendering={props.rendering} />
        </div>
      </div>

      {/* ===== Scoped styles ===== */}
      <style jsx>{`
        /* ---- DESKTOP (lg+) ---- */
        @media (min-width: 1024px) {
          .pricing-desktop-bar {
            border-bottom: 3px solid #0d1b3e;
            margin-bottom: 2rem;
          }
          /* Hide mobile accordion triggers on desktop */
          .pricing-tabs-container :global(.pricing-tab-card .pricing-tab-trigger) {
            display: none;
          }
          .pricing-tabs-container :global(.pricing-tab-card .pricing-tab-content) {
            overflow: hidden;
            transition:
              max-height 0.35s ease,
              opacity 0.25s ease;
          }
        }

        /* ---- MOBILE / TABLET ---- */
        @media (max-width: 1023px) {
          .pricing-desktop-bar {
            display: none;
          }
          :global(.pricing-tab-card) {
            margin-bottom: 0;
            overflow: hidden;
          }
          :global(.pricing-tab-card .pricing-tab-trigger) {
            display: flex;
            width: 100%;
            padding: 14px 24px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            border: none;
            text-align: left;
            background-color: transparent;
            color: #333333;
            border-bottom: 1px solid #e0e0e0;
          }
          :global(.pricing-tab-card[data-tab-active='true'] .pricing-tab-trigger) {
            background-color: #0d1b3e;
            color: #ffffff;
            border-bottom: none;
          }
          :global(.pricing-tab-card .pricing-tab-content) {
            overflow: hidden;
            transition:
              max-height 0.35s ease,
              opacity 0.25s ease;
          }
        }
      `}</style>
    </section>
  );
};
