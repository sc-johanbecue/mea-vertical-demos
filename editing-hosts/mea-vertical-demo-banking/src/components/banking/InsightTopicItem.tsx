'use client';

import type { JSX } from 'react';
import { Text, Image, Link } from '@sitecore-content-sdk/nextjs';
import type { TextField, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface InsightTopicItemFields {
  Icon?: ImageField;
  Category?: TextField;
  Title?: TextField;
  Link?: LinkField;
}

const defaultFields: InsightTopicItemFields = {
  Icon: { value: { src: '', alt: 'Icon' } },
  Category: { value: 'Category' },
  Title: { value: 'Title' },
  Link: { value: { href: '#', text: 'Link' } },
};

export type InsightTopicItemProps = ComponentProps & { fields?: InsightTopicItemFields };

export const Default = (props: InsightTopicItemProps): JSX.Element => {
  const { params, fields = defaultFields } = props;


  return (
    <div
      key={componentKey(props)}
      className={`deb-insight-topic-item ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {fields.Icon?.value?.src ? <Image field={fields.Icon} className="deb-insight-topic-item__icon" /> : null}
      {fields.Category ? <Text tag="span" field={fields.Category} className="deb-insight-topic-item__category" /> : null}
      {fields.Title ? <Text tag="span" field={fields.Title} className="deb-insight-topic-item__title" /> : null}
      {fields.Link ? <Link field={fields.Link} className="deb-insight-topic-item__link" /> : null}

    </div>
  );
};
