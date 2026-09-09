import React, { type JSX } from 'react';
import { TextField, Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * StatCard Component
 * Individual stat item for the StatsSection (e.g., "90 Years", "95%", "5 Star", "100,000+")
 *
 * Features:
 * - Large stat number/value in dark blue
 * - Description text below in smaller gray text
 * - Centered alignment
 */

interface Fields {
  Value: TextField;
  Label: TextField;
}

const defaultFields: Fields = {
  Value: { value: '90 Years' },
  Label: { value: 'Building quality homes' },
};

export type StatCardProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: StatCardProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  return (
    <div className={`component stat-card shrink-0 text-center ${styles || ''}`} id={id}>
      {/* Stat Value - Light cyan/teal color */}
      <div className="mb-1 text-4xl font-light text-[#00B5E2] md:text-5xl lg:text-5xl">
        <Text field={fields.Value} />
      </div>

      {/* Stat Label - Dark blue */}
      <div className="mx-auto max-w-[200px] text-sm leading-snug text-[#003057]">
        <Text field={fields.Label} />
      </div>
    </div>
  );
};
