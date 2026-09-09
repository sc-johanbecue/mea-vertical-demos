'use client';

import type { JSX } from 'react';
import { TextField, LinkField, Text, Link as SitecoreLink } from '@sitecore-content-sdk/nextjs';
import { ChevronDown } from 'lucide-react';
import { ComponentProps } from '@/lib/component-props';
import { PEPSICO_CORPORATE } from './pepsico-corporate-tokens';

export interface PepsiCoCorporateNewsroomCtaFields {
  Headline: TextField;
  PrimaryAction: LinkField;
  SecondaryAction: LinkField;
}

const defaultFields: PepsiCoCorporateNewsroomCtaFields = {
  Headline: { value: 'LEARN MORE REASONS TO SMILE.' },
  PrimaryAction: { value: { href: '#', text: 'PRESS RELEASES' } },
  SecondaryAction: { value: { href: '#', text: 'MEDIA ASSETS' } },
};

export type PepsiCoCorporateNewsroomCtaProps = ComponentProps & {
  fields: PepsiCoCorporateNewsroomCtaFields;
};

export const Default = (props: PepsiCoCorporateNewsroomCtaProps): JSX.Element => {
  const id = props.params.RenderingIdentifier ?? props.rendering?.uid;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  return (
    <section
      className={`component pepsico-corporate-newsroom-cta px-4 py-12 md:px-8 md:py-16 ${styles || ''}`}
      id={id}
      style={{ backgroundColor: PEPSICO_CORPORATE.navy }}
    >
      <div className="mx-auto flex max-w-[min(96rem,100vw)] flex-col gap-8 md:flex-row md:items-center md:justify-between md:gap-12">
        <Text
          tag="h2"
          field={fields.Headline}
          className="m-0 max-w-xl text-2xl leading-tight font-black tracking-tight text-white uppercase md:text-3xl lg:text-4xl"
        />
        <div className="flex w-full flex-col gap-4 md:max-w-md">
          <div className="relative">
            <SitecoreLink
              field={fields.PrimaryAction}
              className="flex w-full items-center justify-between rounded-full border-0 bg-white/15 px-6 py-4 pr-12 text-left text-sm font-bold tracking-wide text-white uppercase no-underline backdrop-blur-sm transition hover:bg-white/25 md:text-base"
            />
            <ChevronDown
              className="pointer-events-none absolute top-1/2 right-5 h-5 w-5 -translate-y-1/2 text-white opacity-90"
              aria-hidden
            />
          </div>
          <div className="relative">
            <SitecoreLink
              field={fields.SecondaryAction}
              className="flex w-full items-center justify-between rounded-full border-0 bg-white/15 px-6 py-4 pr-12 text-left text-sm font-bold tracking-wide text-white uppercase no-underline backdrop-blur-sm transition hover:bg-white/25 md:text-base"
            />
            <ChevronDown
              className="pointer-events-none absolute top-1/2 right-5 h-5 w-5 -translate-y-1/2 text-white opacity-90"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </section>
  );
};
