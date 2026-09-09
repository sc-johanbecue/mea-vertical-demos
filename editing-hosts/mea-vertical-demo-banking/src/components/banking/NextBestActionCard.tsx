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
  StatusLabel: { value: 'StatusLabel' },
  UpdatedLabel: { value: 'UpdatedLabel' },
  Eyebrow: { value: 'Eyebrow' },
  Title: { value: 'Title' },
  ProgressValue: { value: 'ProgressValue' },
  ProgressLabel: { value: 'ProgressLabel' },
};

export type NextBestActionCardProps = ComponentProps & { fields?: NextBestActionCardFields };

export const Default = (props: NextBestActionCardProps): JSX.Element => {
  const { params, fields = defaultFields, rendering } = props;
  const nextBestActionsPh = dynamicPlaceholderKey('next-best-actions', params);

  return (
    <div
      key={componentKey(props)}
      className={`deb-next-best-action-card ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {fields.StatusLabel ? <Text tag="span" field={fields.StatusLabel} className="deb-next-best-action-card__status-label" /> : null}
      {fields.UpdatedLabel ? <Text tag="span" field={fields.UpdatedLabel} className="deb-next-best-action-card__updated-label" /> : null}
      {fields.Eyebrow ? <Text tag="span" field={fields.Eyebrow} className="deb-next-best-action-card__eyebrow" /> : null}
      {fields.Title ? <Text tag="span" field={fields.Title} className="deb-next-best-action-card__title" /> : null}
      {fields.ProgressValue ? <Text tag="span" field={fields.ProgressValue} className="deb-next-best-action-card__progress-value" /> : null}
      {fields.ProgressLabel ? <Text tag="span" field={fields.ProgressLabel} className="deb-next-best-action-card__progress-label" /> : null}
      <div className="deb-next-best-action-card__next-best-actions">
        <Placeholder name={nextBestActionsPh} rendering={rendering} />
      </div>
    </div>
  );
};
