'use client';

import type { JSX } from 'react';
import {
  TextField,
  ImageField,
  LinkField,
  RichTextField,
  Text,
  Image as SitecoreImage,
  Link as SitecoreLink,
  RichText,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * PepsiCoImageLinkBoxCard — image, title, subtitle, rich body, bottom CTA link (Supporting your health band).
 * Responsive slice widths (`md`: 2-up, `lg+`: 3-up) are styled from `PepsiCoImageLinkBoxSection` (`styled-jsx`); root stays `w-full`.
 */

export interface ImageLinkBoxCardFields {
  Image: ImageField;
  Title: TextField;
  Subtitle: TextField;
  Body: RichTextField;
  Cta: LinkField;
}

export const defaultValue: ImageLinkBoxCardFields[] = [
  {
    Image: { value: { src: '', alt: '' } },
    Title: { value: 'PepsiCo in partnership with Prostate Cancer UK' },
    Subtitle: { value: 'Know your risk with prostate cancer screenings' },
    Body: {
      value:
        "<p>We're giving £100,000 to Prostate Cancer UK. This donation will help to raise awareness of prostate cancer, support men and their families, and fund research that could save lives.</p>",
    },
    Cta: { value: { href: '#', text: 'Book a cancer screening' } },
  },
  {
    Image: { value: { src: '', alt: '' } },
    Title: { value: 'Age is just a number in our care homes' },
    Subtitle: { value: "Whether you're 65 or 105, you're still you." },
    Body: {
      value:
        '<p>Still up for new things or enjoying your old favourites. You or a loved one can join us for a few weeks or as long as needed. Start your search for a PepsiCo care home today.</p>',
    },
    Cta: { value: { href: '#', text: 'More on care homes' } },
  },
  {
    Image: { value: { src: '', alt: '' } },
    Title: { value: 'Your routine for a healthier, happier smile' },
    Subtitle: { value: 'Start your dental payment plan today' },
    Body: {
      value:
        '<p>Keep on top of your dental health with a monthly payment plan for year-round routine care. Spread the cost of check-ups and hygiene appointments and save on additional treatments and services.</p>',
    },
    Cta: { value: { href: '#', text: 'More on PepsiCo Smile Plan' } },
  },
  {
    Image: { value: { src: '', alt: '' } },
    Title: { value: 'Athletes. Medallists. People first.' },
    Subtitle: { value: 'The podium is a moment. Health is every day' },
    Body: {
      value:
        '<p>Discover what health means to them. Real stories from athletes and medallists about body, mind, and what keeps them going.</p>',
    },
    Cta: { value: { href: '#', text: 'More on ParalympicsGB' } },
  },
  {
    Image: { value: { src: '', alt: '' } },
    Title: { value: 'Get 20% off small business health insurance' },
    Subtitle: { value: 'Health cover that attracts hard workers and fits your budget' },
    Body: {
      value:
        '<p>Buy directly from PepsiCo and get 20% off your quote price. Discount does not apply to Insurance Premium Tax (IPT). New customers only. Offer ends 29 May 2026. T&amp;Cs apply.</p>',
    },
    Cta: { value: { href: '#', text: 'Get a quote' } },
  },
];

const defaultFields: ImageLinkBoxCardFields = defaultValue[0];

export type ImageLinkBoxCardProps = ComponentProps & {
  fields: ImageLinkBoxCardFields;
};

export const Default = (props: ImageLinkBoxCardProps): JSX.Element | null => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  const linkClass =
    'mt-auto inline-flex items-center gap-1 pt-5 text-left text-base font-semibold text-[#0079c1] no-underline hover:text-[#005a94] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0079c1]';

  return (
    <div
      key={id ?? props.rendering?.uid}
      className={`component image-link-box-card flex h-full min-h-0 w-full min-w-0 shrink-0 flex-col md:w-[calc((100%-4rem)/3)] ${styles || ''}`}
      id={id}
    >
      <article className="flex h-full min-h-0 flex-col overflow-hidden rounded-sm bg-white shadow-sm ring-1 ring-black/5">
        <div className="relative aspect-12/5 w-full shrink-0 overflow-hidden bg-[#e8ecf0]">
          <SitecoreImage field={fields.Image} className="h-full w-full object-cover" />
        </div>
        <div className="flex min-h-0 flex-1 flex-col px-5 py-6 text-left sm:px-6 sm:py-7">
          <Text
            tag="h3"
            field={fields.Title}
            className="text-lg leading-snug font-bold tracking-tight text-[#1a1a1a] sm:text-xl"
          />
          <Text
            tag="p"
            field={fields.Subtitle}
            className="mt-2 text-sm leading-snug font-semibold text-[#333333] sm:text-[0.9375rem]"
          />
          <div className="mt-3 min-h-0 flex-1 text-sm leading-relaxed text-[#555555] sm:text-[0.9375rem] [&_a]:font-medium [&_a]:text-[#0079c1] [&_a]:underline [&_a]:underline-offset-2 [&_p]:mb-2 [&_p:last-child]:mb-0">
            <RichText field={fields.Body} />
          </div>
          {fields.Cta?.value?.href ? (
            <SitecoreLink field={fields.Cta} className={linkClass}>
              <span>{fields.Cta?.value?.text}</span>
              <svg
                className="h-4 w-4 shrink-0 translate-y-px"
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
          ) : null}
        </div>
      </article>
    </div>
  );
};
