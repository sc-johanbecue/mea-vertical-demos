'use client';

import type { JSX } from 'react';
import {
  TextField,
  ImageField,
  LinkField,
  Text,
  Image as SitecoreImage,
  Link as SitecoreLink,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { PEPSICO_CORPORATE } from './pepsico-corporate-tokens';

/** Soft sky-blue pill from pepsico.com corporate hero. */
const HERO_CTA_BG = '#9FD4F0';

export interface PepsiCoCorporateHeroFields {
  Headline: TextField;
  BackgroundImage: ImageField;
  Cta: LinkField;
}

const defaultFields: PepsiCoCorporateHeroFields = {
  Headline: { value: 'FOOD. DRINKS. SMILES.' },
  BackgroundImage: { value: { src: '', alt: 'People sharing PepsiCo snacks' } },
  Cta: { value: { href: '#', text: 'Discover who we are' } },
};

export type PepsiCoCorporateHeroProps = ComponentProps & {
  fields: PepsiCoCorporateHeroFields;
};

function svgFragmentSafeId(raw: string | undefined): string {
  const base = raw && String(raw).trim().length > 0 ? String(raw) : 'default';
  return base.replace(/[^a-zA-Z0-9_-]/g, '') || 'default';
}

/** Arc geometry: long path with padding at ends so centered textPath does not clip first/last glyphs. */
function getArcHeadlineConfig(headline: string, variant: 'mobile' | 'desktop') {
  const len = headline.length;
  if (variant === 'mobile') {
    return {
      // Extended endpoints (x=-70 … x=430); deeper smile at centre
      pathD: 'M -70 28 Q 180 112 430 28',
      viewBox: '-90 0 540 120',
      fontSize: len > 28 ? 16 : len > 24 ? 18 : 20,
      letterSpacing: len > 24 ? '0.03em' : '0.05em',
      maxWidthClass: 'max-w-[22rem]',
    };
  }
  return {
    pathD: 'M -100 34 Q 320 148 740 34',
    viewBox: '-120 0 880 158',
    fontSize: len > 28 ? 28 : len > 24 ? 31 : 34,
    letterSpacing: len > 24 ? '0.03em' : '0.05em',
    maxWidthClass: 'max-w-4xl',
  };
}

/**
 * Smile arc (∪): ends sit higher, centre dips — matches pepsico.com hero headline. 2
 */
function ArcHeadline({
  arcId,
  headline,
  variant,
}: {
  arcId: string;
  headline: string;
  variant: 'mobile' | 'desktop';
}): JSX.Element {
  const isMobile = variant === 'mobile';
  const pathId = `${arcId}-${variant}`;
  const { pathD, viewBox, fontSize, letterSpacing, maxWidthClass } = getArcHeadlineConfig(
    headline,
    variant
  );

  return (
    <svg
      className={
        isMobile ? `w-full ${maxWidthClass} md:hidden` : `hidden w-full ${maxWidthClass} md:block`
      }
      viewBox={viewBox}
      overflow="visible"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-hidden
    >
      <defs>
        <path id={pathId} d={pathD} fill="none" />
      </defs>
      <text
        fill={PEPSICO_CORPORATE.white}
        fontSize={fontSize}
        fontWeight="800"
        fontFamily="Arial Black, Arial, Helvetica Neue, Helvetica, sans-serif"
        letterSpacing={letterSpacing}
      >
        <textPath href={`#${pathId}`} startOffset="50%" textAnchor="middle">
          {headline}
        </textPath>
      </text>
    </svg>
  );
}

export const Default = (props: PepsiCoCorporateHeroProps): JSX.Element => {
  const id = props.params.RenderingIdentifier ?? props.rendering?.uid;
  const arcId = `pepsico-hero-arc-${svgFragmentSafeId(id)}`;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  const ctaText = fields.Cta?.value?.text?.trim();
  const hasCta = Boolean(ctaText);
  const headlineText = String(fields.Headline?.value ?? 'FOOD. DRINKS. SMILES.').toUpperCase();

  return (
    <section
      className={`component pepsico-corporate-hero relative isolate w-full overflow-hidden bg-[#1a1a1a] ${styles || ''}`}
      id={id}
    >
      <div className="relative min-h-[min(100vw,36rem)] w-full sm:min-h-[min(85vw,40rem)] lg:min-h-[min(56vw,44rem)] xl:min-h-[min(50vw,48rem)]">
        <SitecoreImage
          field={fields.BackgroundImage}
          className="absolute inset-0 h-full w-full object-cover object-center"
          alt={fields.BackgroundImage?.value?.alt || ''}
        />

        <div className="relative z-10 flex min-h-[inherit] w-full flex-col items-center justify-center overflow-visible px-5 py-20 text-center sm:px-8 sm:py-24 lg:py-28">
          <div className="w-full max-w-4xl overflow-visible px-2 sm:px-4">
            <ArcHeadline arcId={arcId} headline={headlineText} variant="mobile" />
            <ArcHeadline arcId={arcId} headline={headlineText} variant="desktop" />
          </div>

          <p className="sr-only">
            <Text field={fields.Headline} />
          </p>

          {hasCta ? (
            <SitecoreLink
              field={fields.Cta}
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full px-7 py-2.5 text-sm font-bold tracking-wide no-underline transition hover:brightness-95 sm:mt-6 md:mt-8 md:min-h-12 md:px-9 md:text-base"
              style={{
                backgroundColor: HERO_CTA_BG,
                color: PEPSICO_CORPORATE.navy,
              }}
            >
              {ctaText}
            </SitecoreLink>
          ) : null}
        </div>
      </div>
    </section>
  );
};
