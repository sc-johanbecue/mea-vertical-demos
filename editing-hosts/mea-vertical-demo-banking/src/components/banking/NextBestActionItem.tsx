'use client';

import type { JSX } from 'react';
import { Text, RichText } from '@sitecore-content-sdk/nextjs';
import type { TextField, RichTextField, LinkField } from '@sitecore-content-sdk/nextjs';
import { House, User, ArrowRight } from '@phosphor-icons/react';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';
import { FieldLink } from '@/components/banking/FieldLink';

export interface NextBestActionItemFields {
  Title?: TextField;
  Body?: RichTextField;
  Link?: LinkField;
}

const defaultFields: NextBestActionItemFields = {
  Title: { value: 'You could be mortgage-ready sooner' },
  Body: { value: '<p>Explore a personalised readiness check based on your goal.</p>' },
  Link: { value: { href: '#', text: 'Explore' } },
};

export type NextBestActionItemProps = ComponentProps & { fields?: NextBestActionItemFields };

export const Default = (props: NextBestActionItemProps): JSX.Element => {
  const { params, fields = defaultFields, rendering } = props;
  const digits = String(rendering?.uid ?? '0').replace(/\D/g, '');
  const Icon = Number(digits.slice(-1) || '0') % 2 === 0 ? House : User;

  return (
    <div key={componentKey(props)} className={`next-card ${params?.styles ?? ''}`.trim()} id={params?.RenderingIdentifier}>
      <Icon />
      <span>
        {fields.Title ? (
          <strong>
            <Text field={fields.Title} />
          </strong>
        ) : null}
        {fields.Body ? <RichText field={fields.Body} /> : null}
      </span>
      {fields.Link ? (
        <FieldLink field={fields.Link} aria-label="Open" showText={false}>
          <ArrowRight aria-hidden="true" />
        </FieldLink>
      ) : (
        <ArrowRight aria-hidden="true" />
      )}
    </div>
  );
};
