'use client';

import type { JSX, ReactNode } from 'react';
import {
  Text,
  Image as SitecoreImage,
  RichText,
  RichTextField,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import {
  defaultPepsiCoProductFields,
  PEPSICO_BRAND_RED,
  type PepsiCoProductFields,
} from '@/lib/pepsico-product-fields';

export type { PepsiCoProductFields as PepsiCoProductDetailFields };

export type PepsiCoProductDetailProps = ComponentProps & {
  fields: PepsiCoProductFields;
};

function withoutGridColumnStyles(styles?: string) {
  return (styles ?? '')
    .split(/\s+/)
    .filter((cls) => cls && !/^col(-[a-z]+-\d+|-\d+)?$/i.test(cls))
    .join(' ');
}

function DetailBlock({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="pepsico-product-detail__block text-center">
      <h2 className="m-0 mb-3 text-base font-extrabold tracking-wide text-[#2d2a26] uppercase min-[1025px]:text-lg">
        {heading}
      </h2>
      {children}
    </section>
  );
}

function RichTextBlock({ field, className }: { field: RichTextField; className?: string }) {
  return (
    <RichText
      field={field}
      className={[
        'pepsico-product-detail__richtext m-0 text-sm leading-relaxed text-[#2d2a26] min-[1025px]:text-[0.9375rem]',
        className ?? '',
      ].join(' ')}
    />
  );
}

function NutritionTable({ field }: { field: RichTextField }) {
  return (
    <div className="pepsico-product-detail__table">
      <RichText field={field} className="pepsico-product-detail__table-richtext" />
    </div>
  );
}

export const Default = (props: PepsiCoProductDetailProps): JSX.Element => {
  const id = props.params.RenderingIdentifier ?? props.rendering?.uid;
  const { styles } = props.params;
  const fields = props.fields || defaultPepsiCoProductFields;

  return (
    <article
      data-pepsico-product-detail
      className={[
        'component pepsico-product-detail col-auto w-full bg-[#f4efe4] px-4 py-10 min-[1025px]:py-14 sm:px-6 sm:py-12',
        withoutGridColumnStyles(styles),
      ].join(' ')}
      id={id}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 min-[1025px]:grid min-[1025px]:grid-cols-3 min-[1025px]:items-start min-[1025px]:gap-x-10 min-[1025px]:gap-y-10">
        {/* Product image */}
        <div className="flex justify-center min-[1025px]:col-span-1 min-[1025px]:justify-start">
          <SitecoreImage
            field={fields.Image}
            className="h-auto w-full max-w-[min(100%,280px)] object-contain drop-shadow-md min-[1025px]:max-w-[300px]"
            alt={fields.Image?.value?.alt ?? ''}
          />
        </div>

        {/* Title + copy */}
        <div className="flex flex-col gap-8 text-center min-[1025px]:col-span-1">
          <header>
            <Text
              tag="p"
              field={fields.Category}
              className="m-0 text-xl font-extrabold tracking-wide uppercase min-[1025px]:text-2xl"
              style={{ color: PEPSICO_BRAND_RED }}
            />
            <Text
              tag="h1"
              field={fields.Title}
              className="m-0 mt-1 text-2xl font-extrabold tracking-wide uppercase min-[1025px]:text-[2rem] min-[1025px]:leading-tight"
              style={{ color: PEPSICO_BRAND_RED }}
            />
          </header>

          <DetailBlock heading="Ingredients">
            <RichTextBlock field={fields.Ingredients} />
          </DetailBlock>

          <DetailBlock heading="Allergy Advice">
            <RichTextBlock field={fields.AllergyAdvice} />
          </DetailBlock>

          <DetailBlock heading="Additional Info">
            <RichTextBlock
              field={fields.AdditionalInfo}
              className="[&_ul]:mx-auto [&_ul]:w-fit [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-left"
            />
          </DetailBlock>
        </div>

        {/* Nutrition tables */}
        <div className="flex flex-col gap-6 min-[1025px]:col-span-1">
          <NutritionTable field={fields.Table1} />
          <NutritionTable field={fields.Table2} />
        </div>
      </div>
    </article>
  );
};
