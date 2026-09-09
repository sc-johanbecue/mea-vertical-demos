'use client';

import type { JSX } from 'react';
import { Text, RichText } from '@sitecore-content-sdk/nextjs';
import type { TextField, RichTextField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ArrowRight } from '@phosphor-icons/react';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';
import { FieldLink } from '@/components/banking/FieldLink';

export interface InsightArticleCardFields {
  Meta?: TextField;
  Title?: TextField;
  Body?: RichTextField;
  Link?: LinkField;
}

const defaultFields: InsightArticleCardFields = {
  Meta: { value: 'LIFE & MONEY · 6 MIN READ' },
  Title: { value: 'Five smart financial moves after a promotion.' },
  Body: { value: '<p>Turn a higher income into more choice—today and in the years ahead.</p>' },
  Link: { value: { href: '#', text: 'Read the guide' } },
};

export type InsightArticleCardProps = ComponentProps & { fields?: InsightArticleCardFields };

export const Default = (props: InsightArticleCardProps): JSX.Element => {
  const { params, fields = defaultFields } = props;
  return (
    <article
      key={componentKey(props)}
      className={`feature-article ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {fields.Meta ? <Text tag="span" field={fields.Meta} /> : null}
      {fields.Title ? <Text tag="h3" field={fields.Title} /> : null}
      {fields.Body ? <RichText field={fields.Body} /> : null}
      <FieldLink field={fields.Link}>
        <ArrowRight aria-hidden="true" />
      </FieldLink>
    </article>
  );
};
