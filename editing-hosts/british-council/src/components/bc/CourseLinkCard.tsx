'use client';

import type { JSX } from 'react';
import { Link as SitecoreLink, Text } from '@sitecore-content-sdk/nextjs';
import type { LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';


export interface CourseLinkCardFields {
  Title: TextField;
  Body: TextField;
  Link: LinkField;
  AccentColor: TextField;
}

const defaultFields: CourseLinkCardFields = {
  Title: { value: 'Course title' },
  Body: { value: '' },
  Link: { value: { href: '/', text: 'Find out more' } },
  AccentColor: { value: '#23085a' },
};

export type CourseLinkCardProps = ComponentProps & { fields?: CourseLinkCardFields };

function Layout(props: CourseLinkCardProps, extra = ''): JSX.Element {
  const { params, fields = defaultFields } = props;
  const accent = String(fields.AccentColor?.value || '#23085a');
  return (
    <article
      key={componentKey(props)}
      className={`bc-course-card component ${extra} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
      style={{ ['--bc-accent' as string]: accent }}
    >
      <div className="bc-course-card__content">
        <Text tag="h3" className="bc-course-card__title" field={fields.Title} />
        <Text tag="p" className="bc-course-card__body" field={fields.Body} />
        <SitecoreLink field={fields.Link} className="bc-course-card__link" />
      </div>
      <div className="bc-course-card__accent" aria-hidden="true" />
    </article>
  );
}

export const Default = (p: CourseLinkCardProps): JSX.Element => Layout(p);
export const Inversed = (p: CourseLinkCardProps): JSX.Element => Layout(p, 'component--inversed');
export const Animated = (p: CourseLinkCardProps): JSX.Element => Layout(p, 'component--animated');
export const InversedAnimated = (p: CourseLinkCardProps): JSX.Element =>
  Layout(p, 'component--inversed component--animated');
