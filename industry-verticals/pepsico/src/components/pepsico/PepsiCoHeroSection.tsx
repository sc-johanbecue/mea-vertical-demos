'use client';

import type { JSX } from 'react';
import {
  TextField,
  ImageField,
  Text,
  Placeholder,
  Image as SitecoreImage,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { PepsiCoHeroDesktopBgProvider } from '@/components/pepsico/pepsico-hero-desktop-bg-context';

export interface PepsiCoHeroSectionFields {
  Title: TextField;
  Subtitle: TextField;
  /** Full-bleed background from `lg` (1024px) upward */
  BackgroundImage: ImageField;
  /** In-component header image below `lg` (<1024px) only */
  HeaderImage: ImageField;
}

const defaultFields: PepsiCoHeroSectionFields = {
  Title: { value: 'Private healthcare' },
  Subtitle: {
    value: 'Your wellbeing, on your terms. This is health.',
  },
  BackgroundImage: { value: { src: '', alt: '' } },
  HeaderImage: { value: { src: '', alt: '' } },
};

export type PepsiCoHeroSectionProps = ComponentProps & {
  fields: PepsiCoHeroSectionFields;
};

export const Default = (props: PepsiCoHeroSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles: paramStyles, DynamicPlaceholderId } = props.params;
  const fields = props.fields || defaultFields;
  const ph = `pepsico-hero-cards-${DynamicPlaceholderId ?? '1'}`;

  const desktopSrc = fields.BackgroundImage?.value?.src?.trim();
  const headerSrc = fields.HeaderImage?.value?.src?.trim();
  const hasMobileHeader = Boolean(headerSrc);
  const hasDesktopBg = Boolean(desktopSrc);

  const shellGridAreas = hasMobileHeader
    ? "[grid-template-areas:'header'_'intro'_'cards']"
    : "[grid-template-areas:'intro'_'cards']";

  return (
    <section
      key={id ?? props.rendering?.uid}
      className={[
        'component pepsico-hero-section relative isolate z-0 box-border w-full bg-[#f2f2f2]',
        'px-4 pt-4 pb-6 sm:px-6 sm:pt-5 sm:pb-8 lg:px-0 lg:pt-8 lg:pb-10',
        hasDesktopBg ? 'lg:bg-transparent' : '',
        paramStyles || '',
      ]
        .filter(Boolean)
        .join(' ')}
      id={id}
    >
      <div
        className={[
          'pointer-events-none absolute inset-y-0 left-1/2 z-0 hidden w-screen max-w-[100vw] -translate-x-1/2',
          'bg-[#d8dee6] lg:block',
        ].join(' ')}
        style={
          desktopSrc
            ? {
                backgroundImage: `url("${desktopSrc.replace(/"/g, '\\"')}")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
                backgroundSize: 'auto 100%',
              }
            : undefined
        }
        aria-hidden
      />

      <div
        className={[
          'relative z-1 mx-auto box-border grid w-full max-w-7xl gap-0',
          hasDesktopBg ? 'lg:max-w-[min(96rem,calc(100vw-2.5rem))]' : '',
          'grid-cols-1',
          shellGridAreas,
          hasDesktopBg
            ? 'lg:mx-8 lg:min-h-144 lg:grid-cols-[minmax(0,1fr)_minmax(12rem,38%)] lg:grid-rows-[auto_1fr]'
            : 'lg:mx-8 lg:min-h-144 lg:grid-cols-[minmax(0,1fr)_minmax(12rem,42%)] lg:grid-rows-[auto_1fr]',
          "lg:[grid-template-areas:'intro_side'_'cards_side']",
          hasDesktopBg
            ? ''
            : 'lg:overflow-hidden lg:rounded-3xl lg:bg-transparent lg:shadow-[0_4px_32px_rgba(0,43,92,0.07)]',
          'xl:mx-8',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {hasMobileHeader ? (
          <div className="w-full min-w-0 overflow-hidden rounded-2xl bg-[#d8dee6] [grid-area:header] lg:hidden">
            <SitecoreImage
              field={fields.HeaderImage}
              className="block aspect-4/3 w-full object-cover"
            />
          </div>
        ) : null}

        <div
          className={[
            'z-10 mx-3 self-start [grid-area:intro] sm:mx-5',
            hasMobileHeader ? '-mt-11 sm:-mt-13' : 'mt-0',
            hasDesktopBg
              ? 'lg:mx-0 lg:mt-0 lg:mb-5 lg:px-8 lg:pt-8 lg:pb-0 xl:mb-6 xl:px-10 xl:pt-9'
              : 'lg:mx-0 lg:mt-0 lg:px-8 lg:pt-8 lg:pb-2 xl:px-10 xl:pt-9 xl:pb-4',
          ].join(' ')}
        >
          <div
            className={
              hasDesktopBg
                ? [
                    'relative rounded-2xl bg-white px-5 py-6 shadow-[0_4px_24px_rgba(0,43,92,0.08),0_2px_8px_rgba(0,0,0,0.06)]',
                    'before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-11 before:rounded-[inherit]',
                    "before:bg-linear-to-b before:from-white/98 before:to-transparent before:content-['']",
                    'sm:px-7 sm:py-8',
                    'lg:rounded-[1.875rem] lg:border lg:border-white/50 lg:bg-[rgba(244,245,249,0.92)] lg:px-8 lg:py-7 lg:shadow-[0_10px_36px_rgba(0,43,92,0.12),0_2px_8px_rgba(0,0,0,0.05)] lg:backdrop-blur-sm lg:before:hidden',
                    'xl:px-10 xl:py-8',
                  ].join(' ')
                : [
                    'relative rounded-2xl bg-white px-5 py-6 shadow-[0_4px_24px_rgba(0,43,92,0.08),0_2px_8px_rgba(0,0,0,0.06)]',
                    'before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-11 before:rounded-[inherit]',
                    "before:bg-linear-to-b before:from-white/98 before:to-transparent before:content-['']",
                    'lg:rounded-2xl lg:p-8 lg:shadow-none lg:before:hidden',
                    'sm:px-7 sm:py-8',
                    'lg:px-9 lg:py-8 xl:px-11 xl:py-9',
                  ].join(' ')
            }
          >
            <Text
              tag="h1"
              field={fields.Title}
              className={[
                'm-0 text-[1.625rem] leading-tight font-bold tracking-tight text-[#002b5c]',
                'sm:text-[2rem]',
                'lg:text-[2.375rem] lg:leading-[1.12]',
                'xl:text-[2.625rem]',
              ].join(' ')}
            />
            <Text
              tag="p"
              field={fields.Subtitle}
              className={[
                'mt-2.5 text-base leading-snug font-normal text-[#002b5c] sm:mt-3 sm:text-[1.0625rem]',
                'lg:mt-3.5 lg:max-w-md lg:text-lg lg:text-[#333]',
                'xl:mt-3.5',
              ].join(' ')}
            />
          </div>
        </div>

        <div
          className={[
            'min-w-0 px-1 pt-4 [grid-area:cards] sm:px-2 sm:pt-5',
            'lg:flex lg:min-h-0 lg:flex-col lg:self-stretch lg:px-7 lg:pb-7',
            hasDesktopBg ? 'lg:bg-transparent lg:pt-0' : 'lg:bg-[#f2f2f2] lg:pt-2',
            'xl:px-10 xl:pb-9',
          ].join(' ')}
        >
          <div
            className={[
              'flex min-h-0 flex-1 flex-col rounded-2xl px-4 py-5 sm:px-5 sm:py-6',
              hasDesktopBg
                ? [
                    'bg-white shadow-[0_2px_12px_rgba(0,43,92,0.05)]',
                    'lg:min-h-0 lg:flex-1 lg:rounded-[1.875rem] lg:bg-[#e8eaee] lg:p-6 lg:shadow-[0_4px_24px_rgba(0,43,92,0.08),0_1px_3px_rgba(0,0,0,0.04)] lg:ring-1 lg:ring-black/5',
                    'xl:p-8',
                  ].join(' ')
                : [
                    'bg-white shadow-[0_2px_12px_rgba(0,43,92,0.05)]',
                    'lg:min-h-0 lg:flex-1 lg:px-6 lg:py-7 lg:shadow-none',
                    'xl:px-8 xl:py-8',
                  ].join(' '),
            ].join(' ')}
          >
            <div
              className={[
                'flex flex-col gap-5 sm:gap-6',
                hasDesktopBg ? 'lg:gap-5 xl:gap-6' : 'lg:gap-6',
                '[&>*:only-child:not(.pepsico-hero-card)]:flex [&>*:only-child:not(.pepsico-hero-card)]:w-full [&>*:only-child:not(.pepsico-hero-card)]:min-w-0',
                '[&>*:only-child:not(.pepsico-hero-card)]:flex-col [&>*:only-child:not(.pepsico-hero-card)]:gap-5',
                hasDesktopBg
                  ? 'lg:[&>*:only-child:not(.pepsico-hero-card)]:gap-5 xl:[&>*:only-child:not(.pepsico-hero-card)]:gap-6'
                  : 'lg:[&>*:only-child:not(.pepsico-hero-card)]:gap-6',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <PepsiCoHeroDesktopBgProvider value={hasDesktopBg}>
                <Placeholder name={ph} rendering={props.rendering} />
              </PepsiCoHeroDesktopBgProvider>
            </div>
          </div>
        </div>

        <div
          className="pointer-events-none hidden min-h-full min-w-0 [grid-area:side] lg:row-span-full lg:block"
          aria-hidden
        />
      </div>
    </section>
  );
};
