'use client';

import type { JSX } from 'react';
import { Text, Link } from '@sitecore-content-sdk/nextjs';
import type { TextField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface AccountSummaryCardFields {
  Eyebrow?: TextField;
  AccountName?: TextField;
  AccountNumber?: TextField;
  BalanceLabel?: TextField;
  Balance?: TextField;
  Action1Link?: LinkField;
  Action2Link?: LinkField;
  Action3Link?: LinkField;
}

const defaultFields: AccountSummaryCardFields = {
  Eyebrow: { value: 'Eyebrow' },
  AccountName: { value: 'AccountName' },
  AccountNumber: { value: 'AccountNumber' },
  BalanceLabel: { value: 'BalanceLabel' },
  Balance: { value: 'Balance' },
  Action1Link: { value: { href: '#', text: 'Action1Link' } },
  Action2Link: { value: { href: '#', text: 'Action2Link' } },
  Action3Link: { value: { href: '#', text: 'Action3Link' } },
};

export type AccountSummaryCardProps = ComponentProps & { fields?: AccountSummaryCardFields };

export const Default = (props: AccountSummaryCardProps): JSX.Element => {
  const { params, fields = defaultFields } = props;


  return (
    <div
      key={componentKey(props)}
      className={`deb-account-summary-card ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {fields.Eyebrow ? <Text tag="span" field={fields.Eyebrow} className="deb-account-summary-card__eyebrow" /> : null}
      {fields.AccountName ? <Text tag="span" field={fields.AccountName} className="deb-account-summary-card__account-name" /> : null}
      {fields.AccountNumber ? <Text tag="span" field={fields.AccountNumber} className="deb-account-summary-card__account-number" /> : null}
      {fields.BalanceLabel ? <Text tag="span" field={fields.BalanceLabel} className="deb-account-summary-card__balance-label" /> : null}
      {fields.Balance ? <Text tag="span" field={fields.Balance} className="deb-account-summary-card__balance" /> : null}
      {fields.Action1Link ? <Link field={fields.Action1Link} className="deb-account-summary-card__action1-link" /> : null}
      {fields.Action2Link ? <Link field={fields.Action2Link} className="deb-account-summary-card__action2-link" /> : null}
      {fields.Action3Link ? <Link field={fields.Action3Link} className="deb-account-summary-card__action3-link" /> : null}

    </div>
  );
};
