'use client';

import type { JSX } from 'react';
import { Text, RichText, Placeholder } from '@sitecore-content-sdk/nextjs';
import type { TextField, RichTextField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ArrowRight } from '@phosphor-icons/react';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, dynamicPlaceholderKey } from '@/lib/component-utils';
import { FieldLink } from '@/components/banking/FieldLink';

export interface PremiumValueSectionFields {
  Eyebrow?: TextField;
  Title?: TextField;
  Body?: RichTextField;
  Link?: LinkField;
}

const defaultFields: PremiumValueSectionFields = {
  Eyebrow: { value: 'PREMIUM BANKING, MADE PERSONAL' },
  Title: { value: 'More value in every chapter of your life.' },
  Body: {
    value:
      '<p>From airport lounges to expert guidance, Premium Banking brings together everyday privileges and long-term support.</p>',
  },
  Link: { value: { href: '/Premium', text: 'Discover all Premium benefits' } },
};

export type PremiumValueSectionProps = ComponentProps & { fields?: PremiumValueSectionFields };

export const Default = (props: PremiumValueSectionProps): JSX.Element => {
  const { params, fields = defaultFields, rendering } = props;
  const valueStatsPh = dynamicPlaceholderKey('value-stats', params);

  return (
    <section
      key={componentKey(props)}
      className={`content-section premium-story ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <div className="story-copy">
        {fields.Eyebrow ? <Text tag="p" field={fields.Eyebrow} className="overline" /> : null}
        {fields.Title ? <Text tag="h2" field={fields.Title} /> : null}
        {fields.Body ? <RichText field={fields.Body} /> : null}
        <FieldLink field={fields.Link} className="story-link">
          <ArrowRight aria-hidden="true" />
        </FieldLink>
      </div>
      <div className="value-grid">
        <Placeholder name={valueStatsPh} rendering={rendering} />
      </div>
    </section>
  );
};
