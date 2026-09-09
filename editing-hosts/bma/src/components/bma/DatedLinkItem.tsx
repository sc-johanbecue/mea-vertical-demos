'use client';

import type { JSX } from 'react';
import { Link as SitecoreLink, Text } from '@sitecore-content-sdk/nextjs';
import type { LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface DatedLinkItemFields {
  DateLabel: TextField;
  Link: LinkField;
}

const defaultFields: DatedLinkItemFields = {
  DateLabel: { value: '01 Jan 2026' },
  Link: { value: { href: '#', text: 'Document title' } },
};

export type DatedLinkItemProps = ComponentProps & { fields?: DatedLinkItemFields };

export const Default = (props: DatedLinkItemProps): JSX.Element => {
  const { params, fields = defaultFields } = props;
  const linkText = fields.Link?.value?.text?.toString() || fields.Link?.value?.href?.toString() || '';
  const truncated =
    linkText.length > 48 ? `${linkText.slice(0, 45).trimEnd()}...` : linkText;

  return (
    <div
      key={componentKey(props)}
      className={`bma-dated-link ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <Text tag="span" className="bma-dated-link__date" field={fields.DateLabel} />
      <SitecoreLink
        field={fields.Link}
        className="bma-dated-link__link"
        title={linkText}
      >
        {truncated}
      </SitecoreLink>
    </div>
  );
};
