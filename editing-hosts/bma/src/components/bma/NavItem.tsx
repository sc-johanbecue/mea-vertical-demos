'use client';

import { useState, type JSX } from 'react';
import { Link as SitecoreLink, Placeholder, Text } from '@sitecore-content-sdk/nextjs';
import type { LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, dynamicPlaceholderKey, hasLink, placeholderHasItems } from '@/lib/component-utils';

export interface NavItemFields {
  Link: LinkField;
  Title: TextField;
}

const defaultFields: NavItemFields = {
  Link: { value: { href: '#', text: 'Nav item' } },
  Title: { value: 'Nav item' },
};

export type NavItemProps = ComponentProps & { fields?: NavItemFields };

export const Default = (props: NavItemProps): JSX.Element => {
  const { params, fields = defaultFields, rendering } = props;
  const [open, setOpen] = useState(false);
  const childrenPh = dynamicPlaceholderKey('nav-children', params);
  const title = fields.Title?.value?.toString().trim() || fields.Link?.value?.text?.toString().trim() || 'Item';
  const hasChildren = placeholderHasItems(rendering, childrenPh);

  return (
    <div
      key={componentKey(props)}
      className={`bma-nav-item ${open && hasChildren ? 'bma-nav-item--open' : ''} ${!hasChildren ? 'bma-nav-item--leaf' : ''} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <div className="bma-nav-item__row">
        {hasLink(fields.Link?.value) ? (
          <SitecoreLink field={fields.Link} className="bma-nav-item__link">
            {fields.Title?.value ? <Text field={fields.Title} /> : fields.Link.value.text || title}
          </SitecoreLink>
        ) : (
          fields.Title?.value ? (
            <Text tag="span" className="bma-nav-item__title" field={fields.Title} />
          ) : (
            <span className="bma-nav-item__title">{title}</span>
          )
        )}
        {hasChildren ? (
          <button
            type="button"
            className="bma-nav-item__toggle"
            aria-expanded={open}
            aria-label={`${open ? 'Collapse' : 'Expand'} ${title}`}
            onClick={() => setOpen((value) => !value)}
          >
            <span aria-hidden="true" />
          </button>
        ) : null}
      </div>
      {hasChildren ? (
        // Desktop mega-menu CSS forces these visible even when [hidden]; mobile uses accordion.
        <div className="bma-nav-item__children" hidden={!open}>
          <Placeholder name={childrenPh} rendering={rendering} />
        </div>
      ) : null}
    </div>
  );
};
