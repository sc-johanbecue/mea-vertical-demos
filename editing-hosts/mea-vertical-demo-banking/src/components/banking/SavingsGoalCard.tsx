'use client';

import type { JSX } from 'react';
import { Text, Image } from '@sitecore-content-sdk/nextjs';
import type { TextField, ImageField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface SavingsGoalCardFields {
  Icon?: ImageField;
  Eyebrow?: TextField;
  ProgressLabel?: TextField;
  ProgressValue?: TextField;
  CurrentAmount?: TextField;
  GoalAmount?: TextField;
}

const defaultFields: SavingsGoalCardFields = {
  Icon: { value: { src: '', alt: 'Icon' } },
  Eyebrow: { value: 'Eyebrow' },
  ProgressLabel: { value: 'ProgressLabel' },
  ProgressValue: { value: 'ProgressValue' },
  CurrentAmount: { value: 'CurrentAmount' },
  GoalAmount: { value: 'GoalAmount' },
};

export type SavingsGoalCardProps = ComponentProps & { fields?: SavingsGoalCardFields };

export const Default = (props: SavingsGoalCardProps): JSX.Element => {
  const { params, fields = defaultFields } = props;


  return (
    <div
      key={componentKey(props)}
      className={`deb-savings-goal-card ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {fields.Icon?.value?.src ? <Image field={fields.Icon} className="deb-savings-goal-card__icon" /> : null}
      {fields.Eyebrow ? <Text tag="span" field={fields.Eyebrow} className="deb-savings-goal-card__eyebrow" /> : null}
      {fields.ProgressLabel ? <Text tag="span" field={fields.ProgressLabel} className="deb-savings-goal-card__progress-label" /> : null}
      {fields.ProgressValue ? <Text tag="span" field={fields.ProgressValue} className="deb-savings-goal-card__progress-value" /> : null}
      {fields.CurrentAmount ? <Text tag="span" field={fields.CurrentAmount} className="deb-savings-goal-card__current-amount" /> : null}
      {fields.GoalAmount ? <Text tag="span" field={fields.GoalAmount} className="deb-savings-goal-card__goal-amount" /> : null}

    </div>
  );
};
