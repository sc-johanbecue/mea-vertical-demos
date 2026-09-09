'use client';

import type { JSX } from 'react';
import { TextField, Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { PEPSICO_CORPORATE } from './pepsico-corporate-tokens';

export interface PepsiCoCorporateMarqueeFields {
  Text: TextField;
}

const defaultFields: PepsiCoCorporateMarqueeFields = {
  Text: { value: 'FOOD. DRINKS. SMILES.' },
};

export type PepsiCoCorporateMarqueeProps = ComponentProps & {
  fields: PepsiCoCorporateMarqueeFields;
};

export const Default = (props: PepsiCoCorporateMarqueeProps): JSX.Element => {
  const id = props.params.RenderingIdentifier ?? props.rendering?.uid;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;
  const label = String(fields.Text?.value ?? 'FOOD. DRINKS. SMILES.').trim();
  const repeated = `${label} \u00a0\u00a0 ${label} \u00a0\u00a0 ${label} \u00a0\u00a0 ${label} \u00a0\u00a0 `;

  return (
    <section
      className={`component pepsico-corporate-marquee overflow-hidden py-4 md:py-5 ${styles || ''}`}
      id={id}
      style={{ backgroundColor: PEPSICO_CORPORATE.blueMid }}
      aria-label={label}
    >
      <div className="pepsico-corporate-marquee__track flex w-max animate-[pepsico-marquee_28s_linear_infinite] whitespace-nowrap">
        <span className="px-4 text-[clamp(1.25rem,4vw,2rem)] font-black tracking-[0.12em] text-white uppercase">
          {repeated}
        </span>
        <span
          className="px-4 text-[clamp(1.25rem,4vw,2rem)] font-black tracking-[0.12em] text-white uppercase"
          aria-hidden
        >
          {repeated}
        </span>
      </div>
      <p className="sr-only">
        <Text field={fields.Text} />
      </p>
      <style jsx>{`
        @keyframes pepsico-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
};
