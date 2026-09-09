'use client';

import type { JSX } from 'react';
import {
  TextField,
  ImageField,
  LinkField,
  RichTextField,
  Image as SitecoreImage,
  Link as SitecoreLink,
  RichText,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

export interface PepsiCoCorporateSustainabilityFields {
  Title: TextField;
  /** Word in Title rendered in accent colour on desktop (e.g. POSITIVE). */
  HighlightWord: TextField;
  Body: RichTextField;
  Cta: LinkField;
  PrimaryImage: ImageField;
}

const SUSTAINABILITY_GREEN = 'rgb(15, 68, 14)';
const TITLE_MUTED = '#C5E86C';
const TITLE_ACCENT = '#A3D400';

const defaultFields: PepsiCoCorporateSustainabilityFields = {
  Title: { value: 'GROWING POSITIVE CHANGE' },
  HighlightWord: { value: 'POSITIVE' },
  Body: {
    value:
      '<p>From the way our ingredients are grown to the foods and drinks we share, we aim to create a more resilient and sustainable business, capable of delivering reliable performance for many years to come.</p>',
  },
  Cta: { value: { href: '#', text: 'Discover PepsiCo Positive' } },
  PrimaryImage: { value: { src: '', alt: 'Person planting in a field' } },
};

export type PepsiCoCorporateSustainabilityProps = ComponentProps & {
  fields: PepsiCoCorporateSustainabilityFields;
};

function svgFragmentSafeId(raw: string | undefined): string {
  const base = raw && String(raw).trim().length > 0 ? String(raw) : 'default';
  return base.replace(/[^a-zA-Z0-9_-]/g, '') || 'default';
}

function findHighlightRange(
  title: string,
  highlight: string
): { start: number; end: number } | null {
  const word = highlight.trim();
  if (!word) return null;
  const idx = title.toUpperCase().indexOf(word.toUpperCase());
  if (idx < 0) return null;
  return { start: idx, end: idx + word.length };
}

function titleParts(title: string, highlight: string): { text: string; accent: boolean }[] {
  const t = title.trim();
  if (!t) return [];
  const range = findHighlightRange(t, highlight);
  if (!range) {
    return t.split(/\s+/).map((text) => ({ text, accent: false }));
  }
  const before = t.slice(0, range.start).trim();
  const mid = t.slice(range.start, range.end).trim();
  const after = t.slice(range.end).trim();
  const parts: { text: string; accent: boolean }[] = [];
  if (before) {
    before.split(/\s+/).forEach((text) => parts.push({ text, accent: false }));
  }
  if (mid) {
    parts.push({ text: mid, accent: true });
  }
  if (after) {
    after.split(/\s+/).forEach((text) => parts.push({ text, accent: false }));
  }
  return parts;
}

function SustainabilityTitle({
  title,
  highlight,
}: {
  title: string;
  highlight: string;
}): JSX.Element {
  const parts = titleParts(title, highlight);
  return (
    <h2 className="m-0 max-w-md text-[clamp(2.25rem,7vw,3.5rem)] leading-[0.95] font-black tracking-tight uppercase">
      {parts.map(({ text, accent }, index) => (
        <span
          key={`${text}-${index}`}
          className="block"
          style={{ color: accent ? TITLE_ACCENT : undefined }}
        >
          <span className={accent ? undefined : 'text-[#A3D400] lg:text-[#C5E86C]'}>{text}</span>
        </span>
      ))}
    </h2>
  );
}

export const Default = (props: PepsiCoCorporateSustainabilityProps): JSX.Element => {
  const id = props.params.RenderingIdentifier ?? props.rendering?.uid;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;
  const clipBase = `pepsico-sustainability-${svgFragmentSafeId(id)}`;
  const title = String(fields.Title?.value ?? '');
  const highlight = String(fields.HighlightWord?.value ?? 'POSITIVE');

  return (
    <section
      className={`component pepsico-corporate-sustainability overflow-x-hidden text-white lg:overflow-hidden ${styles || ''}`}
      id={id}
      style={{ backgroundColor: SUSTAINABILITY_GREEN }}
    >
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <clipPath id={`${clipBase}-desktop`} clipPathUnits="objectBoundingBox">
            <path d="M0,0 H0.84 C0.93,0.05 1,0.36 0.96,0.62 C0.91,0.86 0.8,1 0.7,1 H0 V0 Z" />
          </clipPath>
          <clipPath id={`${clipBase}-mobile`} clipPathUnits="objectBoundingBox">
            <path d="M0,0.11 C0.07,0.04 0.14,0.1 0.21,0.05 S0.35,0.11 0.42,0.06 S0.56,0.12 0.63,0.07 S0.77,0.13 0.84,0.08 S0.93,0.14 1,0.09 L1,1 L0,1 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="mx-auto grid max-w-[min(96rem,100vw)] lg:grid-cols-2 lg:items-center">
        <div className="flex flex-col justify-center px-6 py-10 sm:px-8 sm:py-12 lg:order-2 lg:px-12 lg:py-16 xl:px-16 xl:py-20">
          <SustainabilityTitle title={title} highlight={highlight} />
          <RichText
            field={fields.Body}
            className="mt-6 max-w-lg text-base leading-relaxed text-white md:mt-8 md:text-lg [&_p]:m-0 [&_p+p]:mt-4"
          />
          <SitecoreLink
            field={fields.Cta}
            className="mt-8 inline-flex min-h-12 w-fit items-center justify-center rounded-full px-8 py-3 text-base font-bold tracking-wide no-underline transition hover:brightness-95 md:mt-10"
            style={{
              backgroundColor: TITLE_MUTED,
              color: SUSTAINABILITY_GREEN,
            }}
          >
            {fields.Cta?.value?.text}
          </SitecoreLink>
        </div>

        <div className="relative max-lg:ml-[calc(50%-50vw)] max-lg:w-screen max-lg:max-w-none lg:order-1 lg:w-full lg:min-w-0">
          <div
            className={`relative w-full overflow-hidden max-lg:[clip-path:url(#${clipBase}-mobile)] lg:[clip-path:url(#${clipBase}-desktop)]`}
          >
            <SitecoreImage
              field={fields.PrimaryImage}
              className="block w-full [&_img]:block [&_img]:!h-auto [&_img]:max-h-none [&_img]:w-full [&_img]:max-w-full"
              alt={fields.PrimaryImage?.value?.alt ?? ''}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
