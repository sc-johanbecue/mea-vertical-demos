'use client';

import type { JSX } from 'react';
import { Text, RichText } from '@sitecore-content-sdk/nextjs';
import type { TextField, RichTextField } from '@sitecore-content-sdk/nextjs';
import { DeviceMobile, Sparkle, LockKey } from '@phosphor-icons/react';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface DigitalFeatureItemFields {
  Title?: TextField;
  Body?: RichTextField;
}

const defaultFields: DigitalFeatureItemFields = {
  Title: { value: 'One connected experience' },
  Body: { value: '<p>Move smoothly between mobile and web.</p>' },
};

const ICONS = [DeviceMobile, Sparkle, LockKey];

export type DigitalFeatureItemProps = ComponentProps & { fields?: DigitalFeatureItemFields };

export const Default = (props: DigitalFeatureItemProps): JSX.Element => {
  const { params, fields = defaultFields, rendering } = props;
  const digits = String(rendering?.uid ?? '0').replace(/\D/g, '');
  const Icon = ICONS[Number(digits.slice(-1) || '0') % ICONS.length];

  return (
    <div key={componentKey(props)} className={`${params?.styles ?? ''}`.trim()} id={params?.RenderingIdentifier}>
      <Icon />
      <span>
        {fields.Title ? (
          <strong>
            <Text field={fields.Title} />
          </strong>
        ) : null}
        {fields.Body ? <RichText field={fields.Body} /> : null}
      </span>
    </div>
  );
};
