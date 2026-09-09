'use client';

import type { JSX } from 'react';
import { Text, RichText, Link } from '@sitecore-content-sdk/nextjs';
import type { TextField, RichTextField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface InsightArticleCardFields {
  Meta?: TextField;
  Title?: TextField;
  Body?: RichTextField;
  Link?: LinkField;
}

const defaultFields: InsightArticleCardFields = {
  Meta: { value: 'Meta' },
  Title: { value: 'Title' },
  Body: { value: '<p>Body</p>' },
  Link: { value: { href: '#', text: 'Link' } },
};

export type InsightArticleCardProps = ComponentProps & { fields?: InsightArticleCardFields };

export const Default = (props: InsightArticleCardProps): JSX.Element => {
  const { params, fields = defaultFields } = props;


  return (
    <div
      key={componentKey(props)}
      className={`deb-insight-article-card ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {fields.Meta ? <Text tag="span" field={fields.Meta} className="deb-insight-article-card__meta" /> : null}
      {fields.Title ? <Text tag="span" field={fields.Title} className="deb-insight-article-card__title" /> : null}
      {fields.Body ? <div className="deb-insight-article-card__body"><RichText field={fields.Body} /></div> : null}
      {fields.Link ? <Link field={fields.Link} className="deb-insight-article-card__link" /> : null}

    </div>
  );
};
