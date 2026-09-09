'use client';

import type { JSX } from 'react';
import { Text, RichText } from '@sitecore-content-sdk/nextjs';
import type { TextField, RichTextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface GoalPlannerSectionFields {
  Eyebrow?: TextField;
  Title?: TextField;
  Body?: RichTextField;
  Disclaimer?: RichTextField;
  ContributionLabel?: TextField;
  MinAmount?: TextField;
  MaxAmount?: TextField;
  DefaultAmount?: TextField;
  GoalAmount?: TextField;
  StartingBalance?: TextField;
  ResultPrefix?: TextField;
  ResultSuffix?: TextField;
}

const defaultFields: GoalPlannerSectionFields = {
  Eyebrow: { value: 'Eyebrow' },
  Title: { value: 'Title' },
  Body: { value: '<p>Body</p>' },
  Disclaimer: { value: '<p>Disclaimer</p>' },
  ContributionLabel: { value: 'ContributionLabel' },
  MinAmount: { value: 'MinAmount' },
  MaxAmount: { value: 'MaxAmount' },
  DefaultAmount: { value: 'DefaultAmount' },
  GoalAmount: { value: 'GoalAmount' },
  StartingBalance: { value: 'StartingBalance' },
  ResultPrefix: { value: 'ResultPrefix' },
  ResultSuffix: { value: 'ResultSuffix' },
};

export type GoalPlannerSectionProps = ComponentProps & { fields?: GoalPlannerSectionFields };

export const Default = (props: GoalPlannerSectionProps): JSX.Element => {
  const { params, fields = defaultFields } = props;


  return (
    <div
      key={componentKey(props)}
      className={`deb-goal-planner-section ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {fields.Eyebrow ? <Text tag="span" field={fields.Eyebrow} className="deb-goal-planner-section__eyebrow" /> : null}
      {fields.Title ? <Text tag="span" field={fields.Title} className="deb-goal-planner-section__title" /> : null}
      {fields.Body ? <div className="deb-goal-planner-section__body"><RichText field={fields.Body} /></div> : null}
      {fields.Disclaimer ? <div className="deb-goal-planner-section__disclaimer"><RichText field={fields.Disclaimer} /></div> : null}
      {fields.ContributionLabel ? <Text tag="span" field={fields.ContributionLabel} className="deb-goal-planner-section__contribution-label" /> : null}
      {fields.MinAmount ? <Text tag="span" field={fields.MinAmount} className="deb-goal-planner-section__min-amount" /> : null}
      {fields.MaxAmount ? <Text tag="span" field={fields.MaxAmount} className="deb-goal-planner-section__max-amount" /> : null}
      {fields.DefaultAmount ? <Text tag="span" field={fields.DefaultAmount} className="deb-goal-planner-section__default-amount" /> : null}
      {fields.GoalAmount ? <Text tag="span" field={fields.GoalAmount} className="deb-goal-planner-section__goal-amount" /> : null}
      {fields.StartingBalance ? <Text tag="span" field={fields.StartingBalance} className="deb-goal-planner-section__starting-balance" /> : null}
      {fields.ResultPrefix ? <Text tag="span" field={fields.ResultPrefix} className="deb-goal-planner-section__result-prefix" /> : null}
      {fields.ResultSuffix ? <Text tag="span" field={fields.ResultSuffix} className="deb-goal-planner-section__result-suffix" /> : null}

    </div>
  );
};
