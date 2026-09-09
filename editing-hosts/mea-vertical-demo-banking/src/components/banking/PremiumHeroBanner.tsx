'use client';

import type { JSX } from 'react';
import { Text, RichText, Image, Placeholder } from '@sitecore-content-sdk/nextjs';
import type { TextField, RichTextField, LinkField, ImageField } from '@sitecore-content-sdk/nextjs';
import { ArrowRight } from '@phosphor-icons/react';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, dynamicPlaceholderKey } from '@/lib/component-utils';
import { FieldLink } from '@/components/banking/FieldLink';

export interface PremiumHeroBannerFields {
  Eyebrow?: TextField;
  Title?: TextField;
  Body?: RichTextField;
  PrimaryLink?: LinkField;
  SecondaryLink?: LinkField;
  Image?: ImageField;
}

const defaultFields: PremiumHeroBannerFields = {
  Eyebrow: { value: 'Congratulations on your recent' },
  Title: { value: 'career milestone, Sarah' },
  Body: { value: '<p>Discover Premium Banking<br/>tailored to your next chapter.</p>' },
  PrimaryLink: { value: { href: '/Premium', text: 'Explore Premium Banking' } },
  SecondaryLink: { value: { href: '#', text: 'Not now' } },
  Image: {
    value: {
      src: '/assets/deb-hero.png',
      alt: 'Sarah overlooking the Dubai skyline at sunrise',
    },
  },
};

export type PremiumHeroBannerProps = ComponentProps & { fields?: PremiumHeroBannerFields };

function hasTextOrLink(field?: TextField | RichTextField | LinkField): boolean {
  if (!field?.value) return false;
  if (typeof field.value === 'string') return field.value.trim().length > 0;
  if (typeof field.value === 'object' && field.value !== null && 'href' in field.value) {
    return Boolean((field.value as { href?: string }).href);
  }
  return true;
}

function hasImage(field?: ImageField): boolean {
  const v = field?.value;
  if (!v) return false;
  return Boolean(v.src || (v as { mediaid?: string }).mediaid || (v as { mediaId?: string }).mediaId);
}

export const Default = (props: PremiumHeroBannerProps): JSX.Element => {
  const { params, fields = defaultFields, rendering } = props;
  const heroBenefitsPh = dynamicPlaceholderKey('hero-benefits', params);
  const styles = `${params?.styles ?? ''} ${(params as { Styles?: string })?.Styles ?? ''}`;
  const isPageHero = styles.includes('page-hero');

  return (
    <section
      className={`${isPageHero ? 'page-hero' : 'hero'} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
      data-component={componentKey(props)}
    >
      {hasImage(fields.Image) && fields.Image ? (
        <Image field={fields.Image} className="hero-media" />
      ) : null}
      <div className={isPageHero ? 'page-hero-copy' : 'hero-copy'}>
        {hasTextOrLink(fields.Eyebrow) ? (
          <p className="eyebrow">
            <i className="eyebrow-rule" aria-hidden="true" />
            <Text field={fields.Eyebrow} className="eyebrow-text" />
          </p>
        ) : null}

        {hasTextOrLink(fields.Title) ? (
          isPageHero ? (
            <Text tag="h1" field={fields.Title} />
          ) : (
            <h1>
              <em>
                <Text field={fields.Title} />
              </em>
            </h1>
          )
        ) : null}

        {hasTextOrLink(fields.Body) ? (
          <div className={isPageHero ? 'page-hero-body' : 'hero-lead'}>
            <RichText field={fields.Body} />
          </div>
        ) : null}

        <div className={isPageHero ? 'page-hero-actions' : 'hero-actions'}>
          <FieldLink field={fields.PrimaryLink} className="primary" />
          {!isPageHero ? (
            <FieldLink field={fields.SecondaryLink} className="text-btn">
              <ArrowRight aria-hidden="true" />
            </FieldLink>
          ) : null}
        </div>
      </div>

      {!isPageHero ? (
        <div className="benefit-strip">
          <Placeholder name={heroBenefitsPh} rendering={rendering} />
        </div>
      ) : null}
    </section>
  );
};
