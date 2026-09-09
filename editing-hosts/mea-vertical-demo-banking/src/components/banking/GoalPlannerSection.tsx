'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import { Text, RichText } from '@sitecore-content-sdk/nextjs';
import type { TextField, RichTextField } from '@sitecore-content-sdk/nextjs';
import { Calculator } from '@phosphor-icons/react';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface GoalPlannerSectionFields {
  Eyebrow?: TextField;
  Title?: TextField;
  Body?: RichTextField;
  Disclaimer?: TextField;
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
  Eyebrow: { value: 'PLAN WITH CLARITY' },
  Title: { value: 'See what one regular step could add up to.' },
  Body: {
    value:
      '<p>Adjust your monthly contribution to explore a simple path toward a AED 250,000 home deposit goal.</p>',
  },
  Disclaimer: { value: 'Illustrative estimate only.' },
  ContributionLabel: { value: 'Monthly contribution' },
  MinAmount: { value: 'AED 1,000' },
  MaxAmount: { value: 'AED 12,000' },
  DefaultAmount: { value: 'AED 5,000' },
  GoalAmount: { value: 'AED 250,000' },
  StartingBalance: { value: 'AED 80,000' },
  ResultPrefix: { value: 'At this pace, you could reach your goal in' },
  ResultSuffix: { value: 'Starting from AED 80,000 already saved' },
};

export type GoalPlannerSectionProps = ComponentProps & { fields?: GoalPlannerSectionFields };

function formatAmount(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export const Default = (props: GoalPlannerSectionProps): JSX.Element => {
  const { params, fields = defaultFields } = props;
  const parseAmt = (v?: TextField) => Number(String(v?.value ?? '').replace(/[^\d]/g, '')) || 0;
  const [monthly, setMonthly] = useState(parseAmt(fields.DefaultAmount) || 5000);
  const target = parseAmt(fields.GoalAmount) || 250000;
  const current = parseAmt(fields.StartingBalance) || 80000;
  const months = Math.max(1, Math.ceil((target - current) / Math.max(monthly, 1)));

  return (
    <section
      key={componentKey(props)}
      className={`planner-section ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <div className="planner-copy">
        {fields.Eyebrow ? <Text tag="p" field={fields.Eyebrow} className="overline" /> : null}
        {fields.Title ? <Text tag="h2" field={fields.Title} /> : null}
        {fields.Body ? <RichText field={fields.Body} /> : null}
        {fields.Disclaimer ? <Text tag="small" field={fields.Disclaimer} /> : null}
      </div>
      <div className="planner-card">
        <div className="planner-label">
          {fields.ContributionLabel ? <Text tag="span" field={fields.ContributionLabel} /> : null}
          <strong>AED {formatAmount(monthly)}</strong>
        </div>
        <input
          type="range"
          min={1000}
          max={12000}
          step={500}
          value={monthly}
          onChange={(e) => setMonthly(Number(e.target.value))}
          aria-label="Monthly savings contribution"
        />
        <div className="range-ends">
          {fields.MinAmount ? <Text tag="span" field={fields.MinAmount} /> : null}
          {fields.MaxAmount ? <Text tag="span" field={fields.MaxAmount} /> : null}
        </div>
        <div className="planner-result">
          <Calculator />
          <div>
            {fields.ResultPrefix ? <Text tag="span" field={fields.ResultPrefix} /> : null}
            <strong>
              {Math.floor(months / 12)} years {months % 12} months
            </strong>
            {fields.ResultSuffix ? <Text tag="small" field={fields.ResultSuffix} /> : null}
          </div>
        </div>
      </div>
    </section>
  );
};
