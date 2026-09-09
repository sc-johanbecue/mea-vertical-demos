'use client';

import { type JSX } from 'react';
import {
  TextField,
  LinkField,
  Link as SitecoreLink,
  Placeholder,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * PepsiCoBoxSection — dark hero band with headline (accent word), card grid, footer CTA.
 * Placeholder: `box-cards-{DynamicPlaceholderId}` → drop PepsiCoBoxCard renderings here.
 */

export interface BoxSectionFields {
  /** Full headline, e.g. "Blua. This is digital health" */
  Headline: TextField;
  /** Substring in Headline to render in accent colour (default "digital"). */
  AccentWord: TextField;
  Cta: LinkField;
}

const defaultFields: BoxSectionFields = {
  Headline: { value: 'Blua. This is digital health' },
  AccentWord: { value: 'digital' },
  Cta: { value: { href: '#', text: 'Explore digital health' } },
};

export type BoxSectionProps = ComponentProps & {
  fields: BoxSectionFields;
};

function renderHeadline(headline: string, accent: string): JSX.Element {
  const word = accent?.trim() || 'digital';
  if (!headline) {
    return <span className="text-white" />;
  }
  const idx = headline.indexOf(word);
  if (idx < 0) {
    return <span className="text-white">{headline}</span>;
  }
  const before = headline.slice(0, idx);
  const mid = headline.slice(idx, idx + word.length);
  const after = headline.slice(idx + word.length);
  return (
    <>
      {before ? <span className="text-white">{before}</span> : null}
      <span className="text-[#0074bf]">{mid}</span>
      {after ? <span className="text-white">{after}</span> : null}
    </>
  );
}

export const Default = (props: BoxSectionProps): JSX.Element | null => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = props.fields || defaultFields;

  const phBoxCards = `box-cards-${DynamicPlaceholderId}`;
  const headline = fields.Headline?.value ?? '';
  const accent = fields.AccentWord?.value ?? 'digital';

  return (
    <section
      key={id ?? props.rendering?.uid}
      className={`component box-section bg-[#0d1846] py-12 text-center lg:py-16 ${styles || ''}`}
      id={id}
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <h2 className="mx-auto mb-10 max-w-4xl text-2xl leading-tight font-bold tracking-tight md:mb-12 md:text-3xl lg:mb-14 lg:text-4xl">
          {renderHeadline(String(headline), String(accent))}
        </h2>

        <div className="box-card-grid flex flex-wrap gap-6 lg:gap-8">
          <Placeholder name={phBoxCards} rendering={props.rendering} />
        </div>

        <div className="mt-10 flex justify-center md:mt-12 lg:mt-14">
          <SitecoreLink
            field={fields.Cta}
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-base font-medium text-[#0079c1] shadow-sm transition-colors hover:bg-[#f0f4f8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {fields.Cta?.value?.text}
            <svg
              className="h-4 w-4 shrink-0 text-[#0079c1]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </SitecoreLink>
        </div>
      </div>
    </section>
  );
};
