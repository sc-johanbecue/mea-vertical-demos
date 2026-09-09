'use client';

import type { JSX } from 'react';
import Link from 'next/link';
import { Image, Text } from '@sitecore-content-sdk/nextjs';
import type { ImageField, LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import {
  fieldText,
  genericCtaClassName,
  imageAlt,
  imageSrc,
  joinHref,
  linkText,
} from './kpmg-beyond-generic-shared';
import { useEditingHydrationProps } from './kpmg-editing-hydration';

export interface KpmgBeyondGenericFeatureSectionFields {
  Heading: TextField;
  Body: TextField;
  JoinLink: LinkField;
  FeatureImage: ImageField;
  ImagePosition: TextField;
}

const defaultFields: KpmgBeyondGenericFeatureSectionFields = {
  Heading: { value: 'Experience exclusive upcoming and on demand events' },
  Body: {
    value:
      'Hear from influential leaders and speakers as they explore some of the biggest challenges facing the modern business world.',
  },
  JoinLink: { value: { href: '/join', text: 'Join Beyond' } },
  FeatureImage: { value: { src: '', alt: 'Feature illustration' } },
  ImagePosition: { value: 'right' },
};

export type KpmgBeyondGenericFeatureSectionProps = ComponentProps & {
  fields: KpmgBeyondGenericFeatureSectionFields;
};

export const Default = (props: KpmgBeyondGenericFeatureSectionProps): JSX.Element => {
  const fields = props.fields || defaultFields;
  const editingHydration = useEditingHydrationProps();
  const imageOnLeft = fieldText(fields.ImagePosition, 'right').toLowerCase() === 'left';
  const featureSrc = imageSrc(fields.FeatureImage);

  const textBlock = (
    <div className="flex flex-col justify-center">
      <Text
        tag="h2"
        field={fields.Heading}
        className="m-0 text-[28px] font-semibold leading-tight text-white xl:text-[40px]"
      />
      <Text
        tag="p"
        field={fields.Body}
        className="mt-4 text-base leading-7 text-white/80 xl:text-lg"
      />
      <Link
        href={joinHref(fields.JoinLink)}
        className={genericCtaClassName('outline', 'mt-8 w-fit')}
        data-cy="generic-feature-join"
      >
        {linkText(fields.JoinLink, 'Join Beyond')}
      </Link>
    </div>
  );

  const imageBlock = (
    <div className="flex items-center justify-center">
      {featureSrc ? (
        <Image
          field={fields.FeatureImage}
          className="h-auto w-full max-w-[520px]"
          alt={imageAlt(fields.FeatureImage, 'Feature illustration')}
        />
      ) : (
        <div className="flex h-[260px] w-full max-w-[520px] items-center justify-center rounded-2xl border border-white/10 bg-kpmg-elevated xl:h-[340px]">
          <span className="text-sm text-white/50">Feature image</span>
        </div>
      )}
    </div>
  );

  return (
    <section
      {...editingHydration}
      data-cy="generic-feature-section"
      className="component kpmg-beyond-generic-feature px-5 py-16 xl:px-8 xl:py-24"
    >
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-10 xl:grid-cols-2 xl:gap-16">
        {imageOnLeft ? (
          <>
            {imageBlock}
            {textBlock}
          </>
        ) : (
          <>
            {textBlock}
            {imageBlock}
          </>
        )}
      </div>
    </section>
  );
};
