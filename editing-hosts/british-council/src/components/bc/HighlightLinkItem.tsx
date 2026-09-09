'use client';

import type { JSX } from 'react';
import { Link as SitecoreLink, Text } from '@sitecore-content-sdk/nextjs';
import type { LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';


export interface HighlightLinkItemFields {
  Title: TextField;
  Body: TextField;
  Link: LinkField;
}

const defaultFields: HighlightLinkItemFields = {
  Title: { value: 'Highlight title' },
  Body: { value: '' },
  Link: { value: { href: '/', text: 'Read more' } },
};

export type HighlightLinkItemProps = ComponentProps & { fields?: HighlightLinkItemFields };

function Layout(props: HighlightLinkItemProps, extra = ''): JSX.Element {
  const { params, fields = defaultFields } = props;
  return (
    <article
      key={componentKey(props)}
      className={`bc-highlight-item component ${extra} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <SitecoreLink field={fields.Link} className="bc-highlight-item__link">
        <Text tag="h3" className="bc-highlight-item__title" field={fields.Title} />
      </SitecoreLink>
      <Text tag="p" className="bc-highlight-item__body" field={fields.Body} />
    </article>
  );
}

export const Default = (p: HighlightLinkItemProps): JSX.Element => Layout(p);
export const Inversed = (p: HighlightLinkItemProps): JSX.Element => Layout(p, 'component--inversed');
export const Animated = (p: HighlightLinkItemProps): JSX.Element => Layout(p, 'component--animated');
export const InversedAnimated = (p: HighlightLinkItemProps): JSX.Element =>
  Layout(p, 'component--inversed component--animated');
