'use client';

import type { JSX } from 'react';
import { Text, Image } from '@sitecore-content-sdk/nextjs';
import type { TextField, ImageField } from '@sitecore-content-sdk/nextjs';
import { AirplaneTilt, ShieldCheck, User, Headset } from '@phosphor-icons/react';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface HeroBenefitItemFields {
  Icon?: ImageField;
  Title?: TextField;
  Subtitle?: TextField;
}

const defaultFields: HeroBenefitItemFields = {
  Title: { value: 'Airport lounge access' },
  Subtitle: { value: 'Unlimited visits' },
  Icon: { value: { src: '/assets/icon-lounge.svg', alt: 'Airport lounge access' } },
};

const FALLBACK_ICONS = [AirplaneTilt, ShieldCheck, User, Headset];

const TITLE_ICON_SRC: Record<string, string> = {
  lounge: '/assets/icon-lounge.svg',
  insurance: '/assets/icon-insurance.svg',
  manager: '/assets/icon-manager.svg',
  support: '/assets/icon-support.svg',
};

function hasImage(field?: ImageField): boolean {
  const v = field?.value;
  if (!v) return false;
  return Boolean(v.src || (v as { mediaid?: string }).mediaid || (v as { mediaId?: string }).mediaId);
}

function iconFromTitle(title?: string): string | undefined {
  const key = String(title ?? '')
    .trim()
    .toLowerCase();
  return TITLE_ICON_SRC[key];
}

export type HeroBenefitItemProps = ComponentProps & { fields?: HeroBenefitItemFields };

export const Default = (props: HeroBenefitItemProps): JSX.Element => {
  const { params, fields = defaultFields, rendering } = props;
  const digits = String(rendering?.uid ?? '0').replace(/\D/g, '');
  const idx = Number(digits.slice(-1) || '0') % FALLBACK_ICONS.length;
  const FallbackIcon = FALLBACK_ICONS[idx];

  const titleValue = String(fields.Title?.value ?? '');
  const iconField: ImageField | undefined = hasImage(fields.Icon)
    ? fields.Icon
    : iconFromTitle(titleValue)
      ? { value: { src: iconFromTitle(titleValue), alt: titleValue } }
      : defaultFields.Icon;

  return (
    <div key={componentKey(props)} className={`${params?.styles ?? ''}`.trim()} id={params?.RenderingIdentifier}>
      {hasImage(iconField) && iconField ? <Image field={iconField} /> : <FallbackIcon />}
      <span>
        {fields.Title ? <Text field={fields.Title} /> : null}
        {fields.Subtitle ? (
          <small>
            <Text field={fields.Subtitle} />
          </small>
        ) : null}
      </span>
    </div>
  );
};
