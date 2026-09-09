'use client';

import type { JSX } from 'react';
import { Placeholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import {
  PEPSICO_DEMO_WORD_STRIP,
  renderingPlaceholderHasContent,
} from '@/components/pepsico/corporate/pepsico-corporate-marketing-fallbacks';
import { PEPSICO_WORD_COLORS } from './pepsico-corporate-tokens';

export type PepsiCoCorporateWordGridProps = ComponentProps & {
  fields?: Record<string, unknown>;
};

export const Default = (props: PepsiCoCorporateWordGridProps): JSX.Element => {
  const id = props.params.RenderingIdentifier ?? props.rendering?.uid;
  const { styles, DynamicPlaceholderId } = props.params;
  const ph = `pepsico-corporate-word-tiles-${DynamicPlaceholderId ?? '1'}`;
  const hasTiles = renderingPlaceholderHasContent(props.rendering, ph);

  return (
    <section
      className={`component pepsico-corporate-word-grid bg-white px-4 py-10 md:px-8 md:py-14 lg:py-16 ${styles || ''}`}
      id={id}
    >
      <div className="mx-auto max-w-[min(96rem,100vw)]">
        <div
          className={[
            'pepsico-corporate-word-grid__track flex flex-wrap items-center justify-center gap-x-2 gap-y-3 md:gap-x-3 md:gap-y-4',
            '[&_[data-pepsico-word-tile]]:mx-0.5',
            'md:[&>code.scpm]:contents',
            'md:*:only:contents',
          ].join(' ')}
        >
          {hasTiles ? (
            <Placeholder name={ph} rendering={props.rendering} />
          ) : (
            <>
              {PEPSICO_DEMO_WORD_STRIP.map((entry, i) =>
                entry.kind === 'word' ? (
                  <span
                    key={`${entry.text}-${i}`}
                    data-pepsico-word-tile
                    className="component pepsico-corporate-word-tile inline-block align-middle leading-[0.9] font-black tracking-tight uppercase"
                    style={{ color: PEPSICO_WORD_COLORS[entry.color] }}
                  >
                    <span className="text-[clamp(2rem,9vw,4.25rem)] md:text-[clamp(2.5rem,5.5vw,5rem)]">
                      {entry.text}
                    </span>
                  </span>
                ) : (
                  <span
                    key={entry.src}
                    data-pepsico-word-tile
                    className="component pepsico-corporate-word-tile inline-block overflow-hidden rounded-md align-middle"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- demo stock; Sitecore media uses SitecoreImage in authored tiles */}
                    <img
                      src={entry.src}
                      alt={entry.alt}
                      className="aspect-square h-[clamp(2.5rem,8vw,4.5rem)] w-[clamp(2.5rem,8vw,4.5rem)] object-cover md:h-[clamp(3rem,6vw,5.5rem)] md:w-[clamp(3rem,6vw,5.5rem)]"
                    />
                  </span>
                )
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};
