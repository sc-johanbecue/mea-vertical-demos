'use client';

import type { JSX } from 'react';
import { Text, RichText } from '@sitecore-content-sdk/nextjs';
import type { TextField, RichTextField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ArrowRight } from '@phosphor-icons/react';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';
import { FieldLink } from '@/components/banking/FieldLink';

export interface RelationshipTierCardFields {
  Eyebrow?: TextField;
  Title?: TextField;
  Body?: RichTextField;
  Features?: RichTextField;
  Link?: LinkField;
}

const defaultFields: RelationshipTierCardFields = {
  Eyebrow: { value: 'DEB EVERYDAY' },
  Title: { value: 'Everyday' },
  Body: { value: '<p>For simple, flexible daily banking.</p>' },
  Features: { value: '<p>Digital support</p><p>Everyday rewards</p>' },
  Link: { value: { href: '#', text: 'Compare this tier' } },
};

export type RelationshipTierCardProps = ComponentProps & { fields?: RelationshipTierCardFields };

export const Default = (props: RelationshipTierCardProps): JSX.Element => {
  const { params, fields = defaultFields } = props;
  const title = String(fields.Title?.value ?? '');
  const selected = /premium/i.test(title) ? 'selected' : '';

  return (
    <button
      type="button"
      key={componentKey(props)}
      className={`${selected} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {fields.Eyebrow ? <Text tag="span" field={fields.Eyebrow} /> : null}
      {fields.Title ? <Text tag="h3" field={fields.Title} /> : null}
      {fields.Body ? <RichText field={fields.Body} /> : null}
      {fields.Features ? (
        <ul className="tier-features">
          <RichText field={fields.Features} />
        </ul>
      ) : null}
      <em>
        {selected ? (
          <>
            Selected <ArrowRight aria-hidden="true" />
          </>
        ) : (
          <FieldLink field={fields.Link}>
            <ArrowRight aria-hidden="true" />
          </FieldLink>
        )}
      </em>
    </button>
  );
};
