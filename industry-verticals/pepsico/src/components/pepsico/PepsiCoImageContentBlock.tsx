'use client';

import type { JSX } from 'react';
import {
  TextField,
  RichTextField,
  ImageField,
  LinkField,
  Text,
  RichText,
  Image as SitecoreImage,
  Link as SitecoreLink,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * PepsiCoImageContentBlock — split band: headline, rich-text body, outline CTA, hero image/composite graphic.
 * Below `md`: image above copy. `md+`: text column left, visual right, vertically centred.
 */

export interface ImageContentBlockFields {
  Heading: TextField;
  Description: RichTextField;
  Image: ImageField;
  Cta: LinkField;
}

const defaultFields: ImageContentBlockFields = {
  Heading: { value: 'Keep it simple with a digital account' },
  Description: {
    value:
      "<p>Get easy access to our apps and online services with a single, secure account. It's all your healthcare and benefits with just one set of sign in details.</p>",
  },
  Image: { value: { src: '', alt: '' } },
  Cta: { value: { href: '#', text: 'More about your digital account' } },
};

export type ImageContentBlockProps = ComponentProps & {
  fields: ImageContentBlockFields;
};

export const Default = (props: ImageContentBlockProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  const ctaClass =
    'mt-8 inline-flex items-center gap-2 rounded-md border-2 border-[#001424] bg-white px-6 py-2.5 text-base font-semibold text-[#001424] transition-colors duration-200 hover:bg-[#001424] hover:border-[#001424] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#001424] md:mt-10';

  return (
    <section
      key={id ?? props.rendering?.uid}
      className={`component image-content-block bg-[#f3f5f7] py-10 lg:py-16 ${styles || ''}`}
      id={id}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-10 lg:gap-12 xl:gap-16">
          <div className="order-2 w-full md:order-1 md:min-h-0 md:flex-1">
            <Text
              tag="h2"
              field={fields.Heading}
              className="text-2xl font-bold tracking-tight text-[#003359] md:text-3xl xl:text-[2rem] xl:leading-snug"
            />
            <div className="mt-4 max-w-xl text-base leading-relaxed text-[#5a5f66] md:mt-6 md:text-lg [&_a]:font-medium [&_a]:text-[#0079c1] [&_a]:underline [&_p]:mb-3 [&_p:last-child]:mb-0">
              {fields.Description?.value ? <RichText field={fields.Description} /> : null}
            </div>
            {fields.Cta?.value?.href ? (
              <SitecoreLink field={fields.Cta} className={ctaClass}>
                <span>{fields.Cta?.value?.text}</span>
                <svg
                  className="h-4 w-4 shrink-0 translate-y-px"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </SitecoreLink>
            ) : null}
          </div>

          <div className="order-1 w-full shrink-0 md:order-2 md:flex md:min-h-0 md:flex-1 md:justify-center">
            <div className="relative w-full overflow-hidden rounded-lg bg-transparent shadow-none md:max-w-md lg:max-w-xl xl:max-w-none">
              <SitecoreImage
                field={fields.Image}
                className="h-auto w-full object-contain md:mx-auto md:max-h-96 lg:max-h-112"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
