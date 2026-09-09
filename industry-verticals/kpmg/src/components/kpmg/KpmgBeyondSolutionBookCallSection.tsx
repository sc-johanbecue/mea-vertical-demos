'use client';

import type { JSX } from 'react';
import {
  Image as SitecoreImage,
  Link as SitecoreLink,
  Text,
  type ImageField,
  type LinkField,
  type TextField,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { useEditingHydrationProps } from './kpmg-editing-hydration';

export interface KpmgBeyondSolutionBookCallSectionFields {
  Title: TextField;
  Text: TextField;
  Link: LinkField;
  Image: ImageField;
}

const defaultFields: KpmgBeyondSolutionBookCallSectionFields = {
  Title: { value: 'Book a call with us' },
  Text: {
    value:
      'How can we help? Our experts are on hand to help you and your business. Get in touch to discuss how we can support you.',
  },
  Link: { value: { href: '/contact', text: 'Get in touch' } },
  Image: { value: { src: '', alt: '' } },
};

export type KpmgBeyondSolutionBookCallSectionProps = ComponentProps & {
  fields: KpmgBeyondSolutionBookCallSectionFields;
};

function resolveFields(
  props: KpmgBeyondSolutionBookCallSectionProps
): KpmgBeyondSolutionBookCallSectionFields {
  const fromProps = props.fields;
  const fromRendering = props.rendering?.fields as
    | KpmgBeyondSolutionBookCallSectionFields
    | undefined;
  return { ...defaultFields, ...fromRendering, ...fromProps };
}

export const Default = (props: KpmgBeyondSolutionBookCallSectionProps): JSX.Element | null => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = resolveFields(props);
  const editingHydration = useEditingHydrationProps();
  const title = fields.Title?.value?.toString().trim();
  const text = fields.Text?.value?.toString().trim();
  const href = fields.Link?.value?.href?.trim();
  const hasImage = Boolean(fields.Image?.value?.src?.trim());

  if (!title && !text && !href && !hasImage) {
    return null;
  }

  return (
    <section
      key={id ?? props.rendering?.uid}
      {...editingHydration}
      id={id}
      data-cy="solution-book-call"
      className={[
        'component kpmg-beyond-solution-book-call mx-auto w-full max-w-[1059px] px-5 pb-16 pt-8 xl:px-[60px]',
        styles || '',
      ].join(' ')}
    >
      <div className="flex flex-col gap-8 border border-white/20 bg-kpmg-bgCard p-6 lg:flex-row lg:items-center">
        <div className="min-w-0 flex-1">
          <Text tag="h2" field={fields.Title} className="m-0 text-2xl font-semibold text-white" />
          <Text
            tag="p"
            field={fields.Text}
            className="mt-4 text-base leading-7 text-white/80"
          />
          {href ? (
            <SitecoreLink
              field={fields.Link}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-kpmg-purple px-8 py-3 text-sm font-semibold text-white no-underline hover:opacity-90"
            />
          ) : null}
        </div>
        {hasImage ? (
          <div className="relative h-48 w-full shrink-0 overflow-hidden lg:h-56 lg:w-72">
            <SitecoreImage field={fields.Image} className="h-full w-full object-cover" />
          </div>
        ) : null}
      </div>
    </section>
  );
};
