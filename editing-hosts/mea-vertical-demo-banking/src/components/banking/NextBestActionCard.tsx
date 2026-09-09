'use client';

import type { JSX } from 'react';
import { Text, Placeholder } from '@sitecore-content-sdk/nextjs';
import type { TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, dynamicPlaceholderKey } from '@/lib/component-utils';

export interface NextBestActionCardFields {
  StatusLabel?: TextField;
  UpdatedLabel?: TextField;
  Eyebrow?: TextField;
  Title?: TextField;
  ProgressValue?: TextField;
  ProgressLabel?: TextField;
}

const defaultFields: NextBestActionCardFields = {
  StatusLabel: { value: 'DEB INTELLIGENCE' },
  UpdatedLabel: { value: 'Updated today' },
  Eyebrow: { value: 'YOUR NEXT BEST ACTION' },
  Title: { value: 'Your home goal is gaining momentum.' },
  ProgressValue: { value: '72%' },
  ProgressLabel: { value: 'of goal reached' },
};

export type NextBestActionCardProps = ComponentProps & { fields?: NextBestActionCardFields };

export const Default = (props: NextBestActionCardProps): JSX.Element => {
  const { params, fields = defaultFields, rendering } = props;
  const nextBestActionsPh = dynamicPlaceholderKey('next-best-actions', params);

  return (
    <div
      key={componentKey(props)}
      className={`next-best ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <div className="next-head">
        <span>
          <i /> {fields.StatusLabel ? <Text field={fields.StatusLabel} /> : null}
        </span>
        {fields.UpdatedLabel ? <Text tag="small" field={fields.UpdatedLabel} /> : null}
      </div>
      {fields.Eyebrow ? <Text tag="p" field={fields.Eyebrow} /> : null}
      {fields.Title ? <Text tag="h3" field={fields.Title} /> : null}
      <div className="goal-visual">
        <div>
          {fields.ProgressValue ? <Text tag="strong" field={fields.ProgressValue} /> : null}
          {fields.ProgressLabel ? <Text tag="span" field={fields.ProgressLabel} /> : null}
        </div>
        <i>
          <b />
        </i>
      </div>
      <Placeholder name={nextBestActionsPh} rendering={rendering} />
    </div>
  );
};
