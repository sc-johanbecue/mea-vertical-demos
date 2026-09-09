'use client';

import type { JSX } from 'react';
import { Text, RichText, Image } from '@sitecore-content-sdk/nextjs';
import type { TextField, RichTextField, LinkField, ImageField } from '@sitecore-content-sdk/nextjs';
import { AirplaneTilt, Plant, House, User, ArrowRight } from '@phosphor-icons/react';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';
import { FieldLink } from '@/components/banking/FieldLink';

export interface RecommendationCardFields {
  Category?: TextField;
  Title?: TextField;
  Body?: RichTextField;
  Link?: LinkField;
  Icon?: ImageField;
}

const defaultFields: RecommendationCardFields = {
  Category: { value: 'TRAVEL' },
  Title: { value: 'Make every journey feel first class' },
  Body: { value: '<p>Unlimited lounge access and accelerated miles with your DEB Travel Card.</p>' },
  Link: { value: { href: '#', text: 'View benefits' } },
  Icon: { value: { src: '/assets/icon-travel.svg', alt: 'Travel' } },
};

const FALLBACK_ICONS: Record<string, typeof AirplaneTilt> = {
  TRAVEL: AirplaneTilt,
  WEALTH: Plant,
  HOME: House,
  ADVISOR: User,
};

const DEFAULT_ICON_SRC: Record<string, string> = {
  TRAVEL: '/assets/icon-travel.svg',
  WEALTH: '/assets/icon-wealth.svg',
  HOME: '/assets/icon-home.svg',
  ADVISOR: '/assets/icon-advisor.svg',
};

function hasImage(field?: ImageField): boolean {
  const v = field?.value;
  if (!v) return false;
  return Boolean(v.src || (v as { mediaid?: string }).mediaid || (v as { mediaId?: string }).mediaId);
}

function iconFieldFor(fields: RecommendationCardFields, category: string): ImageField {
  if (hasImage(fields.Icon) && fields.Icon) return fields.Icon;
  return {
    value: {
      src: DEFAULT_ICON_SRC[category] || DEFAULT_ICON_SRC.TRAVEL,
      alt: category,
    },
  };
}

export type RecommendationCardProps = ComponentProps & { fields?: RecommendationCardFields };

export const Default = (props: RecommendationCardProps): JSX.Element => {
  const { params, fields = defaultFields } = props;
  const category = String(fields.Category?.value ?? 'TRAVEL').toUpperCase();
  const isAdvisor = category.includes('ADVISOR') || Boolean(params?.styles?.includes('inversed'));
  const type = category.toLowerCase().includes('wealth')
    ? 'wealth'
    : category.toLowerCase().includes('home')
      ? 'home'
      : 'travel';
  const FallbackIcon = FALLBACK_ICONS[category] || FALLBACK_ICONS.TRAVEL;
  const iconField = iconFieldFor(fields, category);

  return (
    <article
      key={componentKey(props)}
      className={`${isAdvisor ? 'advisor' : `offer ${type}`} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <div className="offer-icon">
        {hasImage(iconField) ? <Image field={iconField} /> : <FallbackIcon />}
      </div>
      {fields.Category ? (
        <Text tag="span" field={fields.Category} className={isAdvisor ? undefined : 'tag'} />
      ) : null}
      {fields.Title ? <Text tag="h3" field={fields.Title} /> : null}
      {fields.Body ? <RichText field={fields.Body} /> : null}
      <FieldLink field={fields.Link}>
        <ArrowRight aria-hidden="true" />
      </FieldLink>
    </article>
  );
};

export const Inversed = (props: RecommendationCardProps): JSX.Element =>
  Default({
    ...props,
    params: { ...props.params, styles: `${props.params?.styles ?? ''} inversed`.trim() },
  });
