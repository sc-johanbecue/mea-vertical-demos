'use client';

import type { JSX } from 'react';
import { Text, RichText, Link, Placeholder } from '@sitecore-content-sdk/nextjs';
import type { TextField, RichTextField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, dynamicPlaceholderKey } from '@/lib/component-utils';

export interface RelationshipTierGridFields {
  Eyebrow?: TextField;
  Title?: TextField;
  Intro?: RichTextField;
  FooterLink?: LinkField;
}

const defaultFields: RelationshipTierGridFields = {
  Eyebrow: { value: 'Eyebrow' },
  Title: { value: 'Title' },
  Intro: { value: '<p>Intro</p>' },
  FooterLink: { value: { href: '#', text: 'FooterLink' } },
};

export type RelationshipTierGridProps = ComponentProps & { fields?: RelationshipTierGridFields };

export const Default = (props: RelationshipTierGridProps): JSX.Element => {
  const { params, fields = defaultFields, rendering } = props;
  const tierCardsPh = dynamicPlaceholderKey('tier-cards', params);

  return (
    <div
      key={componentKey(props)}
      className={`deb-relationship-tier-grid ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {fields.Eyebrow ? <Text tag="span" field={fields.Eyebrow} className="deb-relationship-tier-grid__eyebrow" /> : null}
      {fields.Title ? <Text tag="span" field={fields.Title} className="deb-relationship-tier-grid__title" /> : null}
      {fields.Intro ? <div className="deb-relationship-tier-grid__intro"><RichText field={fields.Intro} /></div> : null}
      {fields.FooterLink ? <Link field={fields.FooterLink} className="deb-relationship-tier-grid__footer-link" /> : null}
      <div className="deb-relationship-tier-grid__tier-cards">
        <Placeholder name={tierCardsPh} rendering={rendering} />
      </div>
    </div>
  );
};
