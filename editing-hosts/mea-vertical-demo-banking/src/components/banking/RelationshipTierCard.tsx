'use client';

import type { JSX } from 'react';
import { Text, RichText, Link } from '@sitecore-content-sdk/nextjs';
import type { TextField, RichTextField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface RelationshipTierCardFields {
  Eyebrow?: TextField;
  Title?: TextField;
  Body?: RichTextField;
  Features?: RichTextField;
  Link?: LinkField;
}

const defaultFields: RelationshipTierCardFields = {
  Eyebrow: { value: 'Eyebrow' },
  Title: { value: 'Title' },
  Body: { value: '<p>Body</p>' },
  Features: { value: '<p>Features</p>' },
  Link: { value: { href: '#', text: 'Link' } },
};

export type RelationshipTierCardProps = ComponentProps & { fields?: RelationshipTierCardFields };

export const Default = (props: RelationshipTierCardProps): JSX.Element => {
  const { params, fields = defaultFields } = props;


  return (
    <div
      key={componentKey(props)}
      className={`deb-relationship-tier-card ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {fields.Eyebrow ? <Text tag="span" field={fields.Eyebrow} className="deb-relationship-tier-card__eyebrow" /> : null}
      {fields.Title ? <Text tag="span" field={fields.Title} className="deb-relationship-tier-card__title" /> : null}
      {fields.Body ? <div className="deb-relationship-tier-card__body"><RichText field={fields.Body} /></div> : null}
      {fields.Features ? <div className="deb-relationship-tier-card__features"><RichText field={fields.Features} /></div> : null}
      {fields.Link ? <Link field={fields.Link} className="deb-relationship-tier-card__link" /> : null}

    </div>
  );
};
