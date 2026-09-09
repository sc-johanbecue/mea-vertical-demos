'use client';

import type { JSX } from 'react';
import { Text, Placeholder } from '@sitecore-content-sdk/nextjs';
import type { TextField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ArrowRight } from '@phosphor-icons/react';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, dynamicPlaceholderKey } from '@/lib/component-utils';
import { FieldLink } from '@/components/banking/FieldLink';

export interface RecentActivitySectionFields {
  Title?: TextField;
  ViewAllLink?: LinkField;
}

const defaultFields: RecentActivitySectionFields = {
  Title: { value: 'Recent activity' },
  ViewAllLink: { value: { href: '#', text: 'View all' } },
};

export type RecentActivitySectionProps = ComponentProps & { fields?: RecentActivitySectionFields };

export const Default = (props: RecentActivitySectionProps): JSX.Element => {
  const { params, fields = defaultFields, rendering } = props;
  const activityItemsPh = dynamicPlaceholderKey('activity-items', params);

  return (
    <div
      key={componentKey(props)}
      className={`activity ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <div className="section-title">
        {fields.Title ? <Text tag="h2" field={fields.Title} /> : null}
        <FieldLink field={fields.ViewAllLink}>
          <ArrowRight aria-hidden="true" />
        </FieldLink>
      </div>
      <Placeholder name={activityItemsPh} rendering={rendering} />
    </div>
  );
};
