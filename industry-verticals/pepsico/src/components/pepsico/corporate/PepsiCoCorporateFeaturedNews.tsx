'use client';

import type { JSX } from 'react';
import { TextField, Text, Placeholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { PEPSICO_CORPORATE } from './pepsico-corporate-tokens';

export interface PepsiCoCorporateFeaturedNewsFields {
  SectionTitle: TextField;
}

const defaultFields: PepsiCoCorporateFeaturedNewsFields = {
  SectionTitle: { value: 'FEATURED NEWS' },
};

export type PepsiCoCorporateFeaturedNewsProps = ComponentProps & {
  fields: PepsiCoCorporateFeaturedNewsFields;
};

export const Default = (props: PepsiCoCorporateFeaturedNewsProps): JSX.Element => {
  const id = props.params.RenderingIdentifier ?? props.rendering?.uid;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = props.fields || defaultFields;
  const ph = `pepsico-corporate-featured-news-cards-${DynamicPlaceholderId ?? '1'}`;

  return (
    <section
      className={`component pepsico-corporate-featured-news bg-white px-4 py-10 md:px-8 md:py-14 ${styles || ''}`}
      id={id}
    >
      <div className="mx-auto max-w-[min(96rem,100vw)]">
        <Text
          tag="h2"
          field={fields.SectionTitle}
          className="m-0 text-xl font-black tracking-wide uppercase md:text-2xl"
          style={{ color: PEPSICO_CORPORATE.navy }}
        />
        <div className="mt-8 grid gap-6 md:mt-10 md:grid-cols-3 md:gap-8">
          <Placeholder name={ph} rendering={props.rendering} />
        </div>
      </div>
    </section>
  );
};
