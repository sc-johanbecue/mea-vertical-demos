'use client';

import type { JSX } from 'react';
import Link from 'next/link';
import { Text } from '@sitecore-content-sdk/nextjs';
import type { ImageField, LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import {
  genericCtaClassName,
  imageAlt,
  imageSrc,
  joinHref,
  linkText,
} from './kpmg-beyond-generic-shared';
import { useEditingHydrationProps } from './kpmg-editing-hydration';

export interface KpmgBeyondGenericCtaFields {
  Title: TextField;
  Description: TextField;
  PrimaryJoinLink: LinkField;
  BackgroundImage: ImageField;
}

const defaultFields: KpmgBeyondGenericCtaFields = {
  Title: { value: 'Beyond' },
  Description: {
    value:
      '24/7 access to free expertise, solutions, networking and personal growth at your fingertips. Welcome to Beyond, where leaders belong.',
  },
  PrimaryJoinLink: { value: { href: '/join', text: 'Join Beyond' } },
  BackgroundImage: { value: { src: '', alt: '' } },
};

export type KpmgBeyondGenericCtaProps = ComponentProps & {
  fields: KpmgBeyondGenericCtaFields;
};

export const Default = (props: KpmgBeyondGenericCtaProps): JSX.Element => {
  const fields = props.fields || defaultFields;
  const editingHydration = useEditingHydrationProps();
  const backgroundSrc = imageSrc(fields.BackgroundImage);
  const backgroundAlt = imageAlt(fields.BackgroundImage, '');

  return (
    <section
      {...editingHydration}
      data-cy="generic-cta"
      className="component kpmg-beyond-generic-cta relative overflow-hidden bg-kpmg-bg px-5 pb-8 pt-10 xl:px-8 xl:pb-10 xl:pt-16"
    >
      {backgroundSrc ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${backgroundSrc.replace(/"/g, '\\"')}")` }}
          role={backgroundAlt ? 'img' : undefined}
          aria-label={backgroundAlt || undefined}
          aria-hidden={backgroundAlt ? undefined : true}
        />
      ) : null}
      <div className="absolute inset-0 bg-kpmg-bg/70" aria-hidden />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-60"
        style={{
          background:
            'radial-gradient(circle at 50% 0%, rgba(108,229,229,0.18) 0%, rgba(72,50,203,0.12) 35%, transparent 70%)',
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-[1200px] text-center">
        <Text
          tag="h1"
          field={fields.Title}
          className="m-0 text-[40px] font-bold leading-tight text-white xl:text-[64px]"
        />
        <Text
          tag="p"
          field={fields.Description}
          className="mx-auto mt-6 max-w-[760px] text-base leading-7 text-white/85 xl:text-xl xl:leading-8"
        />
        <div className="mt-8 flex justify-center">
          <Link
            href={joinHref(fields.PrimaryJoinLink)}
            className={genericCtaClassName('solid', 'min-w-[200px]')}
            data-cy="generic-cta-primary-join"
          >
            {linkText(fields.PrimaryJoinLink, 'Join Beyond')}
          </Link>
        </div>
      </div>
    </section>
  );
};
