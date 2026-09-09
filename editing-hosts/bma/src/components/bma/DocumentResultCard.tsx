'use client';

import type { JSX } from 'react';
import { Link as SitecoreLink, Text } from '@sitecore-content-sdk/nextjs';
import type { LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, hasLink } from '@/lib/component-utils';

export interface DocumentResultCardFields {
  Title: TextField;
  PublishedDate: TextField;
  ViewLink: LinkField;
  DownloadLink: LinkField;
  RelatedLink: LinkField;
}

const defaultFields: DocumentResultCardFields = {
  Title: { value: 'Document title' },
  PublishedDate: { value: '01 Jan 2026' },
  ViewLink: { value: { href: '#', text: 'View' } },
  DownloadLink: { value: { href: '#', text: 'Download' } },
  RelatedLink: { value: { href: '#', text: 'Related' } },
};

export type DocumentResultCardProps = ComponentProps & { fields?: DocumentResultCardFields };

export const Default = (props: DocumentResultCardProps): JSX.Element => {
  const { params, fields = defaultFields } = props;

  return (
    <article
      key={componentKey(props)}
      className={`bma-doc-card ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <div className="bma-doc-card__main">
        <Text tag="h3" className="bma-doc-card__title" field={fields.Title} />
        <Text tag="p" className="bma-doc-card__date" field={fields.PublishedDate} />
      </div>
      <div className="bma-doc-card__actions">
        {hasLink(fields.ViewLink?.value) ? (
          <SitecoreLink field={fields.ViewLink} className="bma-doc-card__action bma-doc-card__action--view" />
        ) : null}
        {hasLink(fields.DownloadLink?.value) ? (
          <SitecoreLink
            field={fields.DownloadLink}
            className="bma-doc-card__action bma-doc-card__action--download"
          />
        ) : null}
        {hasLink(fields.RelatedLink?.value) ? (
          <SitecoreLink
            field={fields.RelatedLink}
            className="bma-doc-card__action bma-doc-card__action--related"
          />
        ) : null}
      </div>
    </article>
  );
};
