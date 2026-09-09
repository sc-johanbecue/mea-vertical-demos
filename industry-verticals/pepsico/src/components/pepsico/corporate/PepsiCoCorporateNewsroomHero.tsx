'use client';

import type { JSX } from 'react';
import {
  TextField,
  LinkField,
  Text,
  Placeholder,
  Link as SitecoreLink,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { PEPSICO_CORPORATE } from './pepsico-corporate-tokens';

export interface PepsiCoCorporateNewsroomHeroFields {
  Headline: TextField;
  Subtitle: TextField;
  FeaturedStripLink: LinkField;
}

const defaultFields: PepsiCoCorporateNewsroomHeroFields = {
  Headline: { value: 'PEPSICO NEWS' },
  Subtitle: {
    value: 'An inside look at our people, brands and the stories that move us.',
  },
  FeaturedStripLink: { value: { href: '#', text: 'PepsiCo reports second quarter 2024 results' } },
};

export type PepsiCoCorporateNewsroomHeroProps = ComponentProps & {
  fields: PepsiCoCorporateNewsroomHeroFields;
};

export const Default = (props: PepsiCoCorporateNewsroomHeroProps): JSX.Element => {
  const id = props.params.RenderingIdentifier ?? props.rendering?.uid;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = props.fields || defaultFields;
  const ph = `pepsico-corporate-news-spotlights-${DynamicPlaceholderId ?? '1'}`;

  return (
    <section
      className={`component pepsico-corporate-newsroom-hero bg-white px-4 pt-6 pb-10 md:px-8 md:pt-10 md:pb-14 ${styles || ''}`}
      id={id}
    >
      <div className="mx-auto max-w-[min(96rem,100vw)] text-center">
        <Text
          tag="h1"
          field={fields.Headline}
          className="m-0 text-[clamp(2rem,6vw,3.75rem)] leading-none font-black tracking-tight uppercase"
          style={{ color: PEPSICO_CORPORATE.navy }}
        />
        <Text
          tag="p"
          field={fields.Subtitle}
          className="mx-auto mt-4 max-w-3xl text-base text-slate-600 md:mt-6 md:text-lg"
        />
        <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-3 md:gap-6">
          <Placeholder name={ph} rendering={props.rendering} />
        </div>
        <div className="mt-6 md:mt-8">
          <SitecoreLink
            field={fields.FeaturedStripLink}
            className="text-sm font-semibold underline-offset-4 hover:underline md:text-base"
            style={{ color: PEPSICO_CORPORATE.blue }}
          />
        </div>
      </div>
    </section>
  );
};
