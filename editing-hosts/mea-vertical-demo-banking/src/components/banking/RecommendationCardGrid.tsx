'use client';

import type { JSX } from 'react';
import { Text, Placeholder } from '@sitecore-content-sdk/nextjs';
import type { TextField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ArrowRight } from '@phosphor-icons/react';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, dynamicPlaceholderKey } from '@/lib/component-utils';
import { FieldLink } from '@/components/banking/FieldLink';

export interface RecommendationCardGridFields {
  Eyebrow?: TextField;
  Title?: TextField;
  ViewAllLink?: LinkField;
}

const defaultFields: RecommendationCardGridFields = {
  Eyebrow: { value: 'SELECTED FOR YOUR NEXT CHAPTER' },
  Title: { value: 'Recommended for you, Sarah' },
  ViewAllLink: { value: { href: '/Premium', text: 'View all offers' } },
};

export type RecommendationCardGridProps = ComponentProps & { fields?: RecommendationCardGridFields };

export const Default = (props: RecommendationCardGridProps): JSX.Element => {
  const { params, fields = defaultFields, rendering } = props;
  const cardsPh = dynamicPlaceholderKey('recommendation-cards', params);
  const styles = `${params?.styles ?? ''} ${(params as { Styles?: string })?.Styles ?? ''}`;
  const compact = styles.includes('three');

  return (
    <section
      key={componentKey(props)}
      className={`content-section recommendations ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <div className="section-title">
        <div>
          {fields.Eyebrow ? <Text tag="p" field={fields.Eyebrow} className="overline" /> : null}
          {fields.Title ? <Text tag="h2" field={fields.Title} /> : null}
        </div>
        <FieldLink field={fields.ViewAllLink}>
          <ArrowRight aria-hidden="true" />
        </FieldLink>
      </div>
      <div className={`offer-grid${compact ? ' three' : ''}`}>
        <Placeholder name={cardsPh} rendering={rendering} />
      </div>
    </section>
  );
};
