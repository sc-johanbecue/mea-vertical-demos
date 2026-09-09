'use client';

import type { JSX } from 'react';
import {
  TextField,
  LinkField,
  ImageField,
  Text,
  Link as SitecoreLink,
  Image as SitecoreImage,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * LinkBoxCard — single “help” tile for use inside LinkBoxSection (placeholder).
 * Layout: icon image, title, description, underlined text links, solid CTA with chevron.
 */

export interface LinkBoxCardFields {
  /** Line-art / pictogram shown at the top of the card (authors pick media in Sitecore). */
  Icon: ImageField;
  Title: TextField;
  Description: TextField;
  Link1: LinkField;
  Link2: LinkField;
  /** Primary CTA (href + link text shown on the button; chevron is added in markup). */
  Cta: LinkField;
}

/** All screenshot cards; the first entry is the datasource default. */
export const defaultValue: LinkBoxCardFields[] = [
  {
    Icon: { value: { src: '', alt: 'Health insurance' } },
    Title: { value: 'Health Insurance' },
    Description: {
      value:
        'Feel confident building health insurance around your budget. Get flexible insurance to cover you, your partner and family members.',
    },
    Link1: { value: { href: '#', text: 'What is health insurance?' } },
    Link2: { value: { href: '#', text: 'What does health insurance cost?' } },
    Cta: { value: { href: '#', text: 'Get an insurance quote' } },
  },
  {
    Icon: { value: { src: '', alt: 'Health subscriptions' } },
    Title: { value: 'Health subscriptions' },
    Description: {
      value:
        'Fast, affordable healthcare. Choose from two subscriptions and access remote GPs, mental health support, physios and more.',
    },
    Link1: { value: { href: '#', text: 'PepsiCo Well+ Bronze' } },
    Link2: { value: { href: '#', text: 'PepsiCo Well+ Silver' } },
    Cta: { value: { href: '#', text: 'Health subscriptions' } },
  },
  {
    Icon: { value: { src: '', alt: 'Pay as you go healthcare' } },
    Title: { value: 'Pay as you go healthcare' },
    Description: {
      value:
        'No insurance, no problem. Get quick and easy access to our range of healthcare services. Just pay for what you need.',
    },
    Link1: { value: { href: '#', text: 'Book a health assessment' } },
    Link2: { value: { href: '#', text: 'Book a private GP appointment' } },
    Cta: { value: { href: '#', text: 'Pay as you go services' } },
  },
  {
    Icon: { value: { src: '', alt: 'Dental services' } },
    Title: { value: 'Dental services' },
    Description: {
      value:
        'Looking after your teeth and gums makes for a healthy body and mind. Find a dentist, book online, explore payment options, get business dental insurance or make a claim.',
    },
    Link1: { value: { href: '#', text: 'Book a dental appointment' } },
    Link2: { value: { href: '#', text: 'Dental insurance' } },
    Cta: { value: { href: '#', text: 'More on PepsiCo dental' } },
  },
  {
    Icon: { value: { src: '', alt: 'Care homes' } },
    Title: { value: 'Care homes' },
    Description: {
      value:
        "It's more than choosing a care home... it's emotional support, having your needs met, and a good quality of life.",
    },
    Link1: { value: { href: '#', text: 'What type of care do I need?' } },
    Link2: { value: { href: '#', text: 'Care home costs' } },
    Cta: { value: { href: '#', text: 'More on PepsiCo care services' } },
  },
  {
    Icon: { value: { src: '', alt: 'Free health information' } },
    Title: { value: 'Free health information' },
    Description: {
      value:
        'The more you know, the more you can do. Explore our library of conditions, treatment and healthy living.',
    },
    Link1: { value: { href: '#', text: 'A-Z of conditions and treatments' } },
    Link2: { value: { href: '#', text: 'Visit our health blog' } },
    Cta: { value: { href: '#', text: 'Find information on health' } },
  },
];

const defaultFields: LinkBoxCardFields = defaultValue[0];

export type LinkBoxCardProps = ComponentProps & {
  fields: LinkBoxCardFields;
};

export const Default = (props: LinkBoxCardProps): JSX.Element | null => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  const linkClass =
    'text-left text-sm font-normal text-[#0057B8] underline decoration-[#0057B8] underline-offset-2 hover:text-[#003359]';

  return (
    <div
      key={id ?? props.rendering?.uid}
      className={`component link-box-card w-full ${styles || ''}`}
      id={id}
    >
      <div className="flex h-full min-h-[280px] flex-col gap-4 bg-[#f4f7f9] p-6 text-left lg:min-h-[300px] lg:p-8">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center">
          <SitecoreImage field={fields.Icon} className="h-12 w-12 object-contain" />
        </div>

        <Text
          tag="h3"
          field={fields.Title}
          className="text-xl font-bold tracking-tight text-[#003359] lg:text-[1.35rem]"
        />

        <Text
          tag="p"
          field={fields.Description}
          className="text-sm leading-relaxed text-[#4a4f55] lg:text-[0.9375rem]"
        />

        <div className="flex flex-col gap-2">
          {fields.Link1?.value?.href ? (
            <SitecoreLink field={fields.Link1} className={linkClass} />
          ) : null}
          {fields.Link2?.value?.href ? (
            <SitecoreLink field={fields.Link2} className={linkClass} />
          ) : null}
        </div>

        <div className="mt-auto pt-2">
          <SitecoreLink
            field={fields.Cta}
            className="flex w-full items-center justify-between gap-3 rounded-sm bg-[#0079C8] px-4 py-3.5 text-left text-base font-medium text-white transition-colors hover:bg-[#006ba8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0079C8]"
          >
            {fields.Cta?.value?.text}
            <svg
              className="h-5 w-5 shrink-0 text-white"
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
    </div>
  );
};
