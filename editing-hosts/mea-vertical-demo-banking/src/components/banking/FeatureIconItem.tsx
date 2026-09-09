'use client';

import type { JSX } from 'react';
import { Text, RichText } from '@sitecore-content-sdk/nextjs';
import type { TextField, RichTextField } from '@sitecore-content-sdk/nextjs';
import { AirplaneTilt, Gift, ShieldCheck, Headset } from '@phosphor-icons/react';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface FeatureIconItemFields {
  Title?: TextField;
  Body?: RichTextField;
}

const defaultFields: FeatureIconItemFields = {
  Title: { value: 'Unlimited lounge access' },
  Body: { value: '<p>Relax before every flight with access worldwide.</p>' },
};

const ICONS = [AirplaneTilt, Gift, ShieldCheck, Headset];

export type FeatureIconItemProps = ComponentProps & { fields?: FeatureIconItemFields };

export const Default = (props: FeatureIconItemProps): JSX.Element => {
  const { params, fields = defaultFields, rendering } = props;
  const digits = String(rendering?.uid ?? '0').replace(/\D/g, '');
  const Icon = ICONS[Number(digits.slice(-1) || '0') % ICONS.length];

  return (
    <div key={componentKey(props)} className={`${params?.styles ?? ''}`.trim()} id={params?.RenderingIdentifier}>
      <Icon />
      {fields.Title ? <Text tag="strong" field={fields.Title} /> : null}
      {fields.Body ? (
        <div className="feature-icon-body">
          <RichText field={fields.Body} />
        </div>
      ) : null}
    </div>
  );
};
