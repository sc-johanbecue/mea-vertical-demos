'use client';

import type { JSX } from 'react';
import { Text, Link, Placeholder } from '@sitecore-content-sdk/nextjs';
import type { TextField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, dynamicPlaceholderKey } from '@/lib/component-utils';

export interface RecommendationCardGridFields {
  Eyebrow?: TextField;
  Title?: TextField;
  ViewAllLink?: LinkField;
}

const defaultFields: RecommendationCardGridFields = {
  Eyebrow: { value: 'Eyebrow' },
  Title: { value: 'Title' },
  ViewAllLink: { value: { href: '#', text: 'ViewAllLink' } },
};

export type RecommendationCardGridProps = ComponentProps & { fields?: RecommendationCardGridFields };

export const Default = (props: RecommendationCardGridProps): JSX.Element => {
  const { params, fields = defaultFields, rendering } = props;
  const recommendationCardsPh = dynamicPlaceholderKey('recommendation-cards', params);

  return (
    <div
      key={componentKey(props)}
      className={`deb-recommendation-card-grid ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {fields.Eyebrow ? <Text tag="span" field={fields.Eyebrow} className="deb-recommendation-card-grid__eyebrow" /> : null}
      {fields.Title ? <Text tag="span" field={fields.Title} className="deb-recommendation-card-grid__title" /> : null}
      {fields.ViewAllLink ? <Link field={fields.ViewAllLink} className="deb-recommendation-card-grid__view-all-link" /> : null}
      <div className="deb-recommendation-card-grid__recommendation-cards">
        <Placeholder name={recommendationCardsPh} rendering={rendering} />
      </div>
    </div>
  );
};
