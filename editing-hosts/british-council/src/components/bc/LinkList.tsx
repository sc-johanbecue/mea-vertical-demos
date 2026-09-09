'use client';

import { useId, useState, type JSX } from 'react';
import {
  Link as ContentSdkLink,
  Placeholder,
  Text,
  type LinkField,
  type TextField,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

type GraphqlLinkListFields = {
  data?: {
    datasource?: {
      children?: {
        results?: Array<{
          field?: {
            link?: LinkField;
          };
        }>;
      };
      field?: {
        title?: TextField;
      };
    };
  };
  Title?: TextField;
};

export type LinkListFields = GraphqlLinkListFields;

export type LinkListProps = ComponentProps & { fields?: LinkListFields };

const LinkListItem = ({
  index,
  total,
  field,
}: {
  index: number;
  total: number;
  field: LinkField;
}): JSX.Element => {
  const classNames = [
    'bc-link-list__item',
    `item${index}`,
    index % 2 === 0 ? 'odd' : 'even',
    index === 0 ? 'first' : '',
    index === total - 1 ? 'last' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <li className={classNames}>
      <ContentSdkLink field={field} className="bc-link-list__link" />
    </li>
  );
};

function Layout(props: LinkListProps, extra = ''): JSX.Element {
  const { params, fields, rendering } = props;
  const datasource = fields?.data?.datasource;
  const titleField = datasource?.field?.title ?? fields?.Title ?? { value: 'Link List' };
  const ph = `footer-links-${params?.DynamicPlaceholderId ?? ''}`;
  const panelId = useId();
  const [isOpen, setIsOpen] = useState(false);

  const graphqlLinks =
    datasource?.children?.results
      ?.filter((element) => element?.field?.link)
      .map((element, index, arr) => (
        <LinkListItem
          key={`${index}-${element.field?.link?.value?.href}-${element.field?.link?.value?.text}`}
          index={index}
          total={arr.length}
          field={element.field!.link!}
        />
      )) ?? null;

  return (
    <div
      key={componentKey(props)}
      className={`bc-link-list component ${isOpen ? 'is-open' : ''} ${extra} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <div className="bc-link-list__header">
        <Text tag="h3" className="bc-link-list__title" field={titleField} />
        <button
          type="button"
          className="bc-link-list__toggle"
          aria-expanded={isOpen}
          aria-controls={panelId}
          aria-label={isOpen ? 'Collapse section' : 'Expand section'}
          onClick={() => setIsOpen((v) => !v)}
        >
          <span className="bc-link-list__toggle-icon" aria-hidden="true">
            {isOpen ? '−' : '+'}
          </span>
        </button>
      </div>
      <div id={panelId} className="bc-link-list__panel">
        <ul className="bc-link-list__list">
          {graphqlLinks}
          {!graphqlLinks && rendering ? <Placeholder name={ph} rendering={rendering} /> : null}
        </ul>
      </div>
    </div>
  );
}

export const Default = (p: LinkListProps): JSX.Element => Layout(p);
export const Inversed = (p: LinkListProps): JSX.Element => Layout(p, 'component--inversed');
export const Animated = (p: LinkListProps): JSX.Element => Layout(p, 'component--animated');
export const InversedAnimated = (p: LinkListProps): JSX.Element =>
  Layout(p, 'component--inversed component--animated');
