'use client';

import type { JSX } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import type { TextField } from '@sitecore-content-sdk/nextjs';
import { TrendUp } from '@phosphor-icons/react';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface SavingsGoalCardFields {
  Eyebrow?: TextField;
  ProgressLabel?: TextField;
  ProgressValue?: TextField;
  CurrentAmount?: TextField;
  GoalAmount?: TextField;
}

const defaultFields: SavingsGoalCardFields = {
  Eyebrow: { value: 'HOME SAVINGS GOAL' },
  ProgressLabel: { value: '72% complete' },
  ProgressValue: { value: '72' },
  CurrentAmount: { value: 'AED 180,000' },
  GoalAmount: { value: 'AED 250,000' },
};

export type SavingsGoalCardProps = ComponentProps & { fields?: SavingsGoalCardFields };

export const Default = (props: SavingsGoalCardProps): JSX.Element => {
  const { params, fields = defaultFields } = props;
  const width = Math.min(100, Number(fields.ProgressValue?.value ?? 72));

  return (
    <aside
      key={componentKey(props)}
      className={`goal-card ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <TrendUp />
      {fields.Eyebrow ? <Text tag="span" field={fields.Eyebrow} /> : null}
      {fields.ProgressLabel ? <Text tag="strong" field={fields.ProgressLabel} /> : null}
      <div className="progress">
        <i style={{ width: `${width}%` }} />
      </div>
      <small>
        {fields.CurrentAmount ? <Text field={fields.CurrentAmount} /> : null}
        {' of '}
        {fields.GoalAmount ? <Text field={fields.GoalAmount} /> : null}
      </small>
    </aside>
  );
};
