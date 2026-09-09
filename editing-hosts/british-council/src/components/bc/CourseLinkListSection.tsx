'use client';

import type { JSX } from 'react';
import { Placeholder, Text } from '@sitecore-content-sdk/nextjs';
import type { TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';


export interface CourseLinkListSectionFields {
  Title: TextField;
  AccentColor: TextField;
}

const defaultFields: CourseLinkListSectionFields = {
  Title: { value: 'Adults' },
  AccentColor: { value: '#23085a' },
};

export type CourseLinkListSectionProps = ComponentProps & { fields?: CourseLinkListSectionFields };

function Layout(props: CourseLinkListSectionProps, extra = ''): JSX.Element {
  const { params, fields = defaultFields, rendering } = props;
  const ph = `course-cards-${params?.DynamicPlaceholderId ?? ''}`;
  const accent = String(fields.AccentColor?.value || '#23085a');
  return (
    <section
      key={componentKey(props)}
      className={`bc-course-list component ${extra} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
      style={{ ['--bc-accent' as string]: accent }}
    >
      <Text tag="h3" className="bc-course-list__title" field={fields.Title} />
      <div className="bc-course-list__cards">
        <Placeholder name={ph} rendering={rendering} />
      </div>
    </section>
  );
}

export const Default = (p: CourseLinkListSectionProps): JSX.Element => Layout(p);
export const Inversed = (p: CourseLinkListSectionProps): JSX.Element => Layout(p, 'component--inversed');
export const Animated = (p: CourseLinkListSectionProps): JSX.Element => Layout(p, 'component--animated');
export const InversedAnimated = (p: CourseLinkListSectionProps): JSX.Element =>
  Layout(p, 'component--inversed component--animated');
