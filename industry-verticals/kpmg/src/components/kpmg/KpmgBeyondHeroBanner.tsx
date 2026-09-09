'use client';

import type { JSX } from 'react';
import { ImageField, Text, TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { useEditingHydrationProps } from './kpmg-editing-hydration';

export interface KpmgBeyondHeroBannerFields {
  Heading: TextField;
  Subheading: TextField;
  BackgroundImage: ImageField;
}

const defaultFields: KpmgBeyondHeroBannerFields = {
  Heading: { value: 'This is Beyond' },
  Subheading: { value: 'Where leaders belong' },
  BackgroundImage: { value: { src: '', alt: 'Beyond hero banner' } },
};

export type KpmgBeyondHeroBannerProps = ComponentProps & {
  fields: KpmgBeyondHeroBannerFields;
};

export const Default = (props: KpmgBeyondHeroBannerProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;
  const editingHydration = useEditingHydrationProps();
  const bgSrc = fields.BackgroundImage?.value?.src?.trim();
  const bgAlt = fields.BackgroundImage?.value?.alt;
  const bannerAlt = typeof bgAlt === 'string' && bgAlt.trim() ? bgAlt.trim() : 'Banner';

  return (
    <section
      key={id ?? props.rendering?.uid}
      {...editingHydration}
      id={id}
      data-cy="page-banner"
      className={['component kpmg-beyond-hero relative w-full', styles || ''].join(' ')}
    >
      <div className="relative h-[150px] w-full xl:h-[250px]">
        <div className="absolute inset-0 overflow-hidden">
          {bgSrc ? (
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url("${bgSrc.replace(/"/g, '\\"')}")` }}
              role="img"
              aria-label={bannerAlt}
            />
          ) : (
            <div
              className="h-full w-full"
              style={{
                background:
                  'linear-gradient(135deg, #1a0a3e 0%, #2d1b69 35%, #4832cb 70%, #6ce5e5 100%)',
              }}
              aria-hidden
            />
          )}
        </div>
        <div className="relative mx-auto flex h-full max-w-[1920px] flex-col justify-center px-5 py-10 xl:px-[60px] xl:py-[68px]">
          <Text
            tag="p"
            field={fields.Heading}
            className="m-0 text-[30px] leading-[44px] text-white xl:text-[48px] xl:leading-[70px]"
            data-cy="banner-heading"
          />
          <Text
            tag="p"
            field={fields.Subheading}
            className="m-0 mt-2 text-base leading-[22px] text-white xl:text-[28px] xl:leading-[42px]"
            data-cy="banner-subheading"
          />
        </div>
      </div>
    </section>
  );
};
