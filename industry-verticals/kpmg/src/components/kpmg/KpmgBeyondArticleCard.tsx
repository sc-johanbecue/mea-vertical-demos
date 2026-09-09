'use client';

import type { JSX } from 'react';
import { ImageField, LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { categoryMatches, useTopPickCategoryFilter } from './kpmg-beyond-top-picks-context';
import { KpmgBeyondArticleCardTile } from './KpmgBeyondArticleCardTile';

export interface KpmgBeyondArticleCardFields {
  CategoryLabel: TextField;
  DateLabel: TextField;
  ArticleTitle: TextField;
  Summary: TextField;
  Image: ImageField;
  Link: LinkField;
  /** When "1" or "true", shows play overlay and on-demand badge */
  IsOnDemandEvent: TextField;
  Discover?: TextField;
  Recommended?: TextField;
}

const defaultFields: KpmgBeyondArticleCardFields = {
  CategoryLabel: { value: 'CYBER SECURITY' },
  DateLabel: { value: '27th May, 2026' },
  ArticleTitle: { value: 'How to maximise your cyber budget' },
  Summary: {
    value:
      "After two decades of unbound spending, cyber budgets are starting to flatten. In many ways, that's normal; as enterprise disciplines mature, budgets generally start to moderate.",
  },
  Image: { value: { src: '', alt: '' } },
  Link: { value: { href: '#' } },
  IsOnDemandEvent: { value: '' },
};

export type KpmgBeyondArticleCardProps = ComponentProps & {
  fields: KpmgBeyondArticleCardFields;
};

export const Default = (props: KpmgBeyondArticleCardProps): JSX.Element | null => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;
  const activeCategory = useTopPickCategoryFilter();
  const cardCategory = fields.CategoryLabel?.value?.toString() ?? '';
  const componentKey = props.rendering?.uid ?? id ?? 'article-card';

  if (activeCategory && !categoryMatches(cardCategory, activeCategory)) {
    return null;
  }

  return (
    <KpmgBeyondArticleCardTile
      componentKey={componentKey}
      fields={fields}
      id={id}
      className={styles || ''}
    />
  );
};
