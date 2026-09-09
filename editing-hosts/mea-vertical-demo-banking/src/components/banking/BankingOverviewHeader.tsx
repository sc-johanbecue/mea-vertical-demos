'use client';

import type { JSX } from 'react';
import { Text, Link } from '@sitecore-content-sdk/nextjs';
import type { TextField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface BankingOverviewHeaderFields {
  Greeting?: TextField;
  Title?: TextField;
  PrimaryLink?: LinkField;
}

const defaultFields: BankingOverviewHeaderFields = {
  Greeting: { value: 'Greeting' },
  Title: { value: 'Title' },
  PrimaryLink: { value: { href: '#', text: 'PrimaryLink' } },
};

export type BankingOverviewHeaderProps = ComponentProps & { fields?: BankingOverviewHeaderFields };

export const Default = (props: BankingOverviewHeaderProps): JSX.Element => {
  const { params, fields = defaultFields } = props;


  return (
    <div
      key={componentKey(props)}
      className={`deb-banking-overview-header ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {fields.Greeting ? <Text tag="span" field={fields.Greeting} className="deb-banking-overview-header__greeting" /> : null}
      {fields.Title ? <Text tag="span" field={fields.Title} className="deb-banking-overview-header__title" /> : null}
      {fields.PrimaryLink ? <Link field={fields.PrimaryLink} className="deb-banking-overview-header__primary-link" /> : null}

    </div>
  );
};
