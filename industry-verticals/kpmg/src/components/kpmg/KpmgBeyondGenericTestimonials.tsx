'use client';

import type { JSX } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import type { TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { useEditingHydrationProps } from './kpmg-editing-hydration';

export interface KpmgBeyondGenericTestimonialsFields {
  Title: TextField;
  Quote1Text: TextField;
  Quote1Attribution: TextField;
  Quote2Text: TextField;
  Quote2Attribution: TextField;
}

const defaultFields: KpmgBeyondGenericTestimonialsFields = {
  Title: { value: 'What our clients say' },
  Quote1Text: {
    value:
      "The articles are great. I've referred a friend already because I think it's so fantastic. I feel like it has been made for me!",
  },
  Quote1Attribution: { value: 'Community Member' },
  Quote2Text: {
    value:
      "I have certainly found Beyond very enlightening and it's particularly helpful to get it on catch-up when schedules collide.",
  },
  Quote2Attribution: { value: 'Member of the Beyond Lounge' },
};

function QuoteCard({
  quote,
  attribution,
}: {
  quote: TextField;
  attribution: TextField;
}): JSX.Element {
  return (
    <blockquote className="m-0 rounded-2xl border border-white/10 bg-kpmg-elevated p-6 xl:p-8">
      <span className="text-4xl leading-none text-kpmg-label" aria-hidden>
        “
      </span>
      <Text tag="p" field={quote} className="mt-4 text-base leading-7 text-white xl:text-lg" />
      <Text
        tag="footer"
        field={attribution}
        className="mt-6 block text-sm text-white/70 before:content-['-']"
      />
    </blockquote>
  );
}

export type KpmgBeyondGenericTestimonialsProps = ComponentProps & {
  fields: KpmgBeyondGenericTestimonialsFields;
};

export const Default = (props: KpmgBeyondGenericTestimonialsProps): JSX.Element => {
  const fields = props.fields || defaultFields;
  const editingHydration = useEditingHydrationProps();

  return (
    <section
      {...editingHydration}
      data-cy="generic-testimonials"
      className="component kpmg-beyond-generic-testimonials px-5 py-16 xl:px-8 xl:py-24"
    >
      <div className="mx-auto max-w-[1200px]">
        <Text
          tag="h2"
          field={fields.Title}
          className="m-0 text-center text-[28px] font-semibold text-white xl:text-[40px]"
        />
        <div className="mt-10 grid grid-cols-1 gap-6 xl:mt-14 xl:grid-cols-2 xl:gap-8">
          <QuoteCard quote={fields.Quote1Text} attribution={fields.Quote1Attribution} />
          <QuoteCard quote={fields.Quote2Text} attribution={fields.Quote2Attribution} />
        </div>
      </div>
    </section>
  );
};
