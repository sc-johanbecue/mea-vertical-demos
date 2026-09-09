'use client';

import type { JSX } from 'react';
import { Text, RichText, Placeholder } from '@sitecore-content-sdk/nextjs';
import type { TextField, RichTextField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ArrowRight } from '@phosphor-icons/react';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, dynamicPlaceholderKey } from '@/lib/component-utils';
import { FieldLink } from '@/components/banking/FieldLink';

export interface RelationshipTierGridFields {
  Eyebrow?: TextField;
  Title?: TextField;
  Intro?: RichTextField;
  FooterLink?: LinkField;
}

const defaultFields: RelationshipTierGridFields = {
  Eyebrow: { value: 'BANK YOUR WAY' },
  Title: { value: 'Choose a relationship that fits your world.' },
  Intro: { value: '<p>Compare the support and privileges available as your needs evolve.</p>' },
  FooterLink: { value: { href: '/Premium', text: 'Explore Premium banking' } },
};

export type RelationshipTierGridProps = ComponentProps & { fields?: RelationshipTierGridFields };

export const Default = (props: RelationshipTierGridProps): JSX.Element => {
  const { params, fields = defaultFields, rendering } = props;
  const tierCardsPh = dynamicPlaceholderKey('tier-cards', params);

  return (
    <section
      key={componentKey(props)}
      className={`tier-section ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <div className="content-section">
        <div className="section-intro centered">
          {fields.Eyebrow ? <Text tag="p" field={fields.Eyebrow} className="overline" /> : null}
          {fields.Title ? <Text tag="h2" field={fields.Title} /> : null}
          {fields.Intro ? <RichText field={fields.Intro} /> : null}
        </div>
        <div className="tier-grid">
          <Placeholder name={tierCardsPh} rendering={rendering} />
        </div>
        <FieldLink field={fields.FooterLink} className="tier-cta">
          <ArrowRight aria-hidden="true" />
        </FieldLink>
      </div>
    </section>
  );
};
