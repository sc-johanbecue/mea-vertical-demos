'use client';

import type { JSX } from 'react';
import { TextField, ImageField, Text, Image as SitecoreImage } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * PepsiCoBoxCard — image tile + title + description (Blua / digital health grid).
 * Layout: 1 card per row below the lg breakpoint (1024px); 3 per row from 1024px up (matches PepsiCoBoxSection lg:gap-8).
 */

export interface BoxCardFields {
  Image: ImageField;
  Title: TextField;
  Description: TextField;
  PromoHeading: TextField;
  PromoText: TextField;
}

export const defaultValue: BoxCardFields[] = [
  {
    Image: { value: { src: '', alt: 'Remote appointments' } },
    Title: { value: 'Remote appointments' },
    Description: { value: 'Fast access to a GP when it suits you.' },
    PromoHeading: { value: 'Remote appointments' },
    PromoText: { value: 'Fast access to a GP when it suits you.' },
  },
  {
    Image: { value: { src: '', alt: 'Physiotherapy' } },
    Title: { value: 'Physiotherapy' },
    Description: { value: 'Online sessions for added flexibility' },
    PromoHeading: { value: 'Remote appointments' },
    PromoText: { value: 'Fast access to a GP when it suits you.' },
  },
  {
    Image: { value: { src: '', alt: 'Fitness' } },
    Title: { value: 'Fitness' },
    Description: { value: 'On-demand exercise at your fingertips' },
    PromoHeading: { value: 'Remote appointments' },
    PromoText: { value: 'Fast access to a GP when it suits you.' },
  },
];

const defaultFields: BoxCardFields = defaultValue[0];

export type BoxCardProps = ComponentProps & {
  fields: BoxCardFields;
};

export const Default = (props: BoxCardProps): JSX.Element | null => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  return (
    <div
      key={id ?? props.rendering?.uid}
      className={`component box-card h-full min-h-0 w-full min-w-0 shrink-0 md:w-[calc((100%-4rem)/3)] ${styles || ''}`}
      id={id}
    >
      <article className="flex h-full min-h-0 flex-col overflow-hidden rounded-md bg-white shadow-sm">
        <div className="relative aspect-video w-full shrink-0 bg-[#e8ecf0]">
          <SitecoreImage field={fields.Image} className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-1 flex-col items-center px-6 py-8 text-center md:px-8">
          <Text
            tag="h3"
            field={fields.Title}
            className="text-lg font-bold tracking-tight text-[#222222] md:text-xl"
          />
          <Text
            tag="p"
            field={fields.Description}
            className="mt-3 max-w-sm text-sm leading-relaxed text-[#555555] md:text-[0.9375rem]"
          />
        </div>
      </article>
    </div>
  );
};
