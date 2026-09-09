'use client';

import type { JSX } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import type { TextField, LinkField } from '@sitecore-content-sdk/nextjs';
import { Eye } from '@phosphor-icons/react';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';
import { FieldLink } from '@/components/banking/FieldLink';

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
  Eyebrow: { value: 'PREMIUM CURRENT ACCOUNT' },
  AccountName: { value: 'Everyday Account' },
  AccountNumber: { value: '•••• 1234' },
  BalanceLabel: { value: 'Available balance' },
  Balance: { value: 'AED 125,750.00' },
  Action1Link: { value: { href: '#', text: 'View statements' } },
  Action2Link: { value: { href: '#', text: 'Transfer money' } },
  Action3Link: { value: { href: '#', text: 'Account details' } },
};

export type AccountSummaryCardProps = ComponentProps & { fields?: AccountSummaryCardFields };

export const Default = (props: AccountSummaryCardProps): JSX.Element => {
  const { params, fields = defaultFields } = props;
  return (
    <div
      key={componentKey(props)}
      className={`account-panel ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <div className="panel-head">
        <div>
          {fields.Eyebrow ? <Text tag="span" field={fields.Eyebrow} /> : null}
          <h2>
            {fields.AccountName ? <Text field={fields.AccountName} /> : null}{' '}
            {fields.AccountNumber ? <Text tag="small" field={fields.AccountNumber} /> : null}
          </h2>
        </div>
        <div className="balance">
          {fields.BalanceLabel ? <Text tag="span" field={fields.BalanceLabel} /> : null}
          <strong>
            {fields.Balance ? <Text field={fields.Balance} /> : null}{' '}
            <button type="button" aria-label="Toggle balance">
              <Eye />
            </button>
          </strong>
        </div>
      </div>
      <div className="account-nav">
        <FieldLink field={fields.Action1Link} />
        <FieldLink field={fields.Action2Link} />
        <FieldLink field={fields.Action3Link} />
      </div>
    </div>
  );
};
