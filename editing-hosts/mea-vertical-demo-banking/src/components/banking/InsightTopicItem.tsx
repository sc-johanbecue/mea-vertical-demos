'use client';

import type { JSX } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import type { TextField, LinkField } from '@sitecore-content-sdk/nextjs';
import { AirplaneTilt, House, Plant, ArrowRight } from '@phosphor-icons/react';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';
import { FieldLink } from '@/components/banking/FieldLink';

export interface InsightTopicItemFields {
  Category?: TextField;
  Title?: TextField;
  Link?: LinkField;
}

const defaultFields: InsightTopicItemFields = {
  Category: { value: 'TRAVEL' },
  Title: { value: 'Make your rewards work harder on every journey.' },
  Link: { value: { href: '#', text: 'Read' } },
};

const ICONS: Record<string, typeof AirplaneTilt> = {
  TRAVEL: AirplaneTilt,
  HOME: House,
  WEALTH: Plant,
};

export type InsightTopicItemProps = ComponentProps & { fields?: InsightTopicItemFields };

export const Default = (props: InsightTopicItemProps): JSX.Element => {
  const { params, fields = defaultFields } = props;
  const cat = String(fields.Category?.value ?? 'TRAVEL').toUpperCase();
  const Icon = ICONS[cat] || AirplaneTilt;

  return (
    <button
      type="button"
      key={componentKey(props)}
      className={`${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <Icon />
      <span>
        {fields.Category ? <Text tag="small" field={fields.Category} /> : null}
        {fields.Title ? <Text tag="strong" field={fields.Title} /> : null}
      </span>
      {fields.Link ? (
        <FieldLink field={fields.Link} aria-label="Read" showText={false}>
          <ArrowRight aria-hidden="true" />
        </FieldLink>
      ) : (
        <ArrowRight aria-hidden="true" />
      )}
    </button>
  );
};
