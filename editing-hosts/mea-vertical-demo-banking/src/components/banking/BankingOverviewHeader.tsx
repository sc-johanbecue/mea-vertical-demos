'use client';

import type { JSX } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import type { TextField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ArrowRight } from '@phosphor-icons/react';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';
import { FieldLink } from '@/components/banking/FieldLink';

export interface BankingOverviewHeaderFields {
  Greeting?: TextField;
  Title?: TextField;
  PrimaryLink?: LinkField;
}

const defaultFields: BankingOverviewHeaderFields = {
  Greeting: { value: 'Good morning, Sarah' },
  Title: { value: "Here's your financial overview." },
  PrimaryLink: { value: { href: '#', text: 'Transfer money' } },
};

export type BankingOverviewHeaderProps = ComponentProps & { fields?: BankingOverviewHeaderFields };

export const Default = (props: BankingOverviewHeaderProps): JSX.Element => {
  const { params, fields = defaultFields } = props;
  return (
    <section
      key={componentKey(props)}
      className={`bank-welcome ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <div>
        {fields.Greeting ? <Text tag="p" field={fields.Greeting} /> : null}
        {fields.Title ? <Text tag="h1" field={fields.Title} /> : null}
      </div>
      <FieldLink field={fields.PrimaryLink} className="primary">
        <ArrowRight aria-hidden="true" />
      </FieldLink>
    </section>
  );
};
