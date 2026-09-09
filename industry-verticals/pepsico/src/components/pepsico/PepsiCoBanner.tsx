'use client';

import type { JSX } from 'react';
import {
  TextField,
  ImageField,
  RichTextField,
  Text,
  RichText,
  Image as SitecoreImage,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * PepsiCoBanner — full-width image band with a copy card: stacked below `lg`, overlaid top-left from `lg` up.
 */

export interface PepsiCoBannerFields {
  Title: TextField;
  BackgroundImage: ImageField;
  /** Price line, booking copy (incl. phone link), hours, disclaimer — single rich text */
  Description: RichTextField;
}

const defaultFields: PepsiCoBannerFields = {
  Title: { value: 'Physiotherapy' },
  BackgroundImage: { value: { src: '', alt: '' } },
  Description: {
    value: `<p><strong>Initial appointments from £72</strong></p>
<p>Currently unavailable to book online. Please call us on <a href="tel:03702187532">0370 218 7532</a>.</p>
<p>Lines open Monday to Friday 8am to 8pm, and Saturday 8am to 4pm.</p>
<p>We may record or monitor our phone calls.</p>`,
  },
};

export type PepsiCoBannerProps = ComponentProps & {
  fields: PepsiCoBannerFields;
};

export const Default = (props: PepsiCoBannerProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  const hasImage = Boolean(fields.BackgroundImage?.value?.src?.trim());

  return (
    <section
      key={id ?? props.rendering?.uid}
      className={[
        'component pepsico-banner relative isolate w-full overflow-hidden bg-[#e8eaee]',
        'flex flex-col lg:block lg:min-h-[min(28rem,70vh)]',
        styles || '',
      ]
        .filter(Boolean)
        .join(' ')}
      id={id}
    >
      <div
        className={[
          'relative w-full shrink-0 overflow-hidden',
          'aspect-5/3 max-h-[min(22rem,55vh)] sm:aspect-video sm:max-h-[min(26rem,50vh)]',
          'lg:absolute lg:inset-0 lg:aspect-auto lg:max-h-none lg:min-h-[min(28rem,70vh)]',
        ].join(' ')}
      >
        {hasImage ? (
          <SitecoreImage
            field={fields.BackgroundImage}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[#d8dee6]" aria-hidden />
        )}
      </div>

      <div
        className={[
          'relative z-10 w-full bg-white px-5 py-6 sm:px-6 sm:py-7',
          'lg:absolute lg:top-1/2 lg:left-6 lg:w-[min(100%,26rem)] lg:-translate-y-1/2 lg:rounded-2xl lg:border lg:border-white/60',
          'lg:bg-[rgba(255,255,255,0.92)] lg:px-8 lg:py-7 lg:shadow-[0_10px_40px_rgba(0,43,92,0.14),0_2px_8px_rgba(0,0,0,0.06)] lg:backdrop-blur-sm',
          'xl:left-10 xl:w-[min(100%,28rem)] xl:px-9 xl:py-8',
        ].join(' ')}
      >
        <Text
          tag="h2"
          field={fields.Title}
          className="m-0 text-[1.75rem] leading-tight font-bold tracking-tight text-[#0079c1] sm:text-[2rem] lg:text-[2.125rem]"
        />
        {fields.Description?.value ? (
          <div
            className={[
              'mt-3 max-w-none text-base leading-relaxed text-[#333] sm:text-[1.0625rem]',
              '[&_p]:mb-3 [&_p:last-child]:mb-0',
              '[&_strong]:font-semibold [&_strong]:text-[#333]',
              '[&_a]:font-medium [&_a]:text-[#0079c1] [&_a]:underline [&_a]:decoration-[#0079c1] [&_a]:underline-offset-2',
              '[&_a]:transition-colors hover:[&_a]:text-[#005a93] hover:[&_a]:decoration-[#005a93]',
              '[&_a]:focus-visible:outline-2 [&_a]:focus-visible:outline-offset-2 [&_a]:focus-visible:outline-[#0079c1]',
              '[&_p:last-child]:text-sm [&_p:last-child]:leading-snug [&_p:last-child]:text-[#5a5f66]',
            ].join(' ')}
          >
            <RichText field={fields.Description} />
          </div>
        ) : null}
      </div>
    </section>
  );
};
