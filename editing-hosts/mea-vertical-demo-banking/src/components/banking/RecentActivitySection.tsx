'use client';

import type { JSX } from 'react';
import { Text, Link, Placeholder } from '@sitecore-content-sdk/nextjs';
import type { TextField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, dynamicPlaceholderKey } from '@/lib/component-utils';

export interface RecentActivitySectionFields {
  Title?: TextField;
  ViewAllLink?: LinkField;
}

const defaultFields: RecentActivitySectionFields = {
  Title: { value: 'Title' },
  ViewAllLink: { value: { href: '#', text: 'ViewAllLink' } },
};

export type RecentActivitySectionProps = ComponentProps & { fields?: RecentActivitySectionFields };

export const Default = (props: RecentActivitySectionProps): JSX.Element => {
  const { params, fields = defaultFields, rendering } = props;
  const activityItemsPh = dynamicPlaceholderKey('activity-items', params);

  return (
    <div
      key={componentKey(props)}
      className={`deb-recent-activity-section ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {fields.Title ? <Text tag="span" field={fields.Title} className="deb-recent-activity-section__title" /> : null}
      {fields.ViewAllLink ? <Link field={fields.ViewAllLink} className="deb-recent-activity-section__view-all-link" /> : null}
      <div className="deb-recent-activity-section__activity-items">
        <Placeholder name={activityItemsPh} rendering={rendering} />
      </div>
    </div>
  );
};
