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
 * PepsiCoAlert — full-width advisory strip: icon (in blue circle), eyebrow, title, description, ghost CTA.
 * Fields: Icon, ImportantUpdate, Title, Description, Button (link), ButtonText (label; falls back to link text).
 */

export interface PepsiCoAlertFields {
  Icon: ImageField;
  ImportantUpdate: TextField;
  Title: TextField;
  Description: TextField;
  Button: LinkField;
  ButtonText: TextField;
}

const defaultFields: PepsiCoAlertFields = {
  Icon: { value: { src: '', alt: '' } },
  ImportantUpdate: { value: 'Important update' },
  Title: { value: 'Middle East regional advisory' },
  Description: {
    value:
      'Get the latest guidance on how recent regional developments may impact your clients and their healthcare cover.',
  },
  Button: { value: { href: '#', text: 'Read advisory' } },
  ButtonText: { value: 'Read advisory' },
};

export type PepsiCoAlertProps = ComponentProps & {
  fields: PepsiCoAlertFields;
};

function MegaphoneIcon(): JSX.Element {
  return (
    <svg
      className="h-6 w-6 text-white"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 11v2a2 2 0 0 0 2 2h2l4 3V6L7 9H5a2 2 0 0 0-2 2z" />
      <path d="M16 8.5a4 4 0 0 1 0 7" />
      <path d="M19 6a7 7 0 0 1 0 12" />
    </svg>
  );
}

export const Default = (props: PepsiCoAlertProps): JSX.Element | null => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  const hasIcon = Boolean(fields.Icon?.value?.src?.trim());
  const buttonHref = fields.Button?.value?.href?.trim();
  const buttonLabel =
    (fields.ButtonText?.value && String(fields.ButtonText.value).trim()) ||
    fields.Button?.value?.text ||
    'Read more';

  return (
    <section
      key={id ?? props.rendering?.uid}
      className={['component pepsico-alert w-full bg-[#e8f1fa]', styles || '']
        .filter(Boolean)
        .join(' ')}
      id={id}
      role="region"
      aria-labelledby={id ? `${id}-title` : undefined}
    >
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
        <div className="flex flex-col gap-4 rounded-lg border border-[#d0e3f4] bg-[#f2f7fc] px-4 py-4 shadow-sm sm:px-5 sm:py-5 lg:flex-row lg:items-center lg:gap-6 lg:px-6 lg:py-4">
          <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0079c1] shadow-sm sm:h-14 sm:w-14">
              {hasIcon ? (
                <SitecoreImage
                  field={fields.Icon}
                  className="h-7 w-7 object-contain brightness-0 invert sm:h-8 sm:w-8"
                />
              ) : (
                <MegaphoneIcon />
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-1.5 sm:space-y-2">
              <Text
                tag="p"
                field={fields.ImportantUpdate}
                className="m-0 text-xs font-bold tracking-wide text-[#0079c1] sm:text-sm"
              />
              <Text
                tag="h2"
                field={fields.Title}
                id={id ? `${id}-title` : undefined}
                className="m-0 text-lg leading-snug font-bold tracking-tight text-[#0d1846] sm:text-xl"
              />
              <Text
                tag="p"
                field={fields.Description}
                className="m-0 text-sm leading-relaxed text-[#333] sm:text-[0.9375rem]"
              />
            </div>
          </div>

          {buttonHref ? (
            <div className="shrink-0 lg:ml-auto lg:flex lg:justify-end">
              <SitecoreLink
                field={fields.Button}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-[#c5d9ec] bg-white px-4 py-2.5 text-center text-sm font-semibold text-[#0d1846] shadow-sm transition-colors hover:border-[#0079c1] hover:bg-[#fafcfe] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0079c1] sm:py-3 lg:w-auto lg:min-w-42"
              >
                <span>{buttonLabel}</span>
                <svg
                  className="h-4 w-4 shrink-0 text-[#0079c1]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </SitecoreLink>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};
