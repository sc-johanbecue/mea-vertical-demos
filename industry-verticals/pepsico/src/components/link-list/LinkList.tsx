'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { Link as ContentSdkLink, Text, LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { ChevronDown, ExternalLink, Globe } from 'lucide-react';
import { ComponentProps } from 'lib/component-props';

export interface LinkListProps extends ComponentProps {
  fields: {
    /**
     * The Integrated graphQL query result. This illustrates the way to access the datasource children.
     */
    data: {
      datasource: {
        children: {
          results: Array<{
            field: {
              link: LinkField;
            };
          }>;
        };
        field: {
          title: TextField;
        };
      };
    };
  };
}

const LinkListItem = ({
  index,
  total,
  field,
  className,
}: {
  index: number;
  total: number;
  field: LinkField;
  className?: string;
}) => {
  const classNames = [
    `item${index}`,
    index % 2 === 0 ? 'odd' : 'even',
    index === 0 ? 'first' : '',
    index === total - 1 ? 'last' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <li className={classNames}>
      <div className={`field-link`}>
        <ContentSdkLink field={field} className={className} />
      </div>
    </li>
  );
};

function getLinkHref(field: LinkField): string {
  const href = field?.value?.href;
  return typeof href === 'string' ? href.trim() : '';
}

function getLinkText(field: LinkField): string {
  const text = field?.value?.text;
  if (typeof text === 'string' && text.trim()) return text.trim();
  return getLinkHref(field);
}

function isLikelyExternalLink(field: LinkField): boolean {
  const v = field?.value as Record<string, unknown> | undefined;
  const lt = typeof v?.linktype === 'string' ? v.linktype.toLowerCase() : '';
  if (lt === 'external') return true;
  const href = getLinkHref(field);
  return /^https?:\/\//i.test(href);
}

type HeaderUtilityRegionRow = Record<string, unknown>;

/** Raw GraphQL from {@link authoring/.../LinkListHeaderUtilityDatasource.yml ComponentQuery}. */
function normalizeRegionsFromDatasource(datasource: Record<string, unknown> | undefined) {
  if (!datasource) return [];

  const regionLists = datasource.regionLists as { results?: HeaderUtilityRegionRow[] } | undefined;
  const buckets = regionLists?.results ?? [];

  const getTitleField = (row: HeaderUtilityRegionRow): TextField | undefined => {
    const field = row.field as { title?: TextField } | undefined;
    return (
      (row.title as TextField | undefined) ??
      (row.regionTitle as TextField | undefined) ??
      field?.title
    );
  };

  const getLinks = (row: HeaderUtilityRegionRow): LinkField[] => {
    const children = (row.children ?? row.linkLists ?? row.links) as
      | { results?: HeaderUtilityRegionRow[] }
      | undefined;
    const rows = children?.results ?? [];
    const out: LinkField[] = [];
    for (const leaf of rows) {
      const field = leaf.field as { link?: LinkField } | undefined;
      const fromField = field?.link;
      const lone = leaf.link as LinkField | { jsonValue?: LinkField } | undefined;
      const candidate =
        fromField ??
        (lone && typeof lone === 'object' && 'jsonValue' in lone ? lone.jsonValue : undefined) ??
        (lone &&
        typeof lone === 'object' &&
        'value' in (lone as LinkField) &&
        (lone as LinkField).value
          ? (lone as LinkField)
          : undefined);
      if (candidate?.value) {
        out.push(candidate);
      }
    }
    return out;
  };

  return buckets.map((row, idx) => ({
    id: `${idx}`,
    title: getTitleField(row),
    links: getLinks(row),
  }));
}

function getDatasourceRootTitle(datasource: Record<string, unknown>): TextField | undefined {
  const field = datasource.field as { title?: TextField } | undefined;
  return (
    field?.title ??
    (datasource.title as TextField | undefined) ??
    (datasource.triggerTitle as TextField | undefined)
  );
}

/**
 * Corporate utility bar: selectable region dropdown (titles of child lists) plus that list’s links on the right.
 * Datasource layout: optional root Title (shown as closed trigger, e.g. “Services”), then child items with Title
 * (e.g. “Services in Poland”) each containing Grandchild Link items.
 * Serialized {@link authoring/.../LinkListHeaderUtilityDatasource.yml rendering} exposes nested GraphQL as `regionLists`.
 */
export const CorporateHeaderUtility = ({ params, fields }: LinkListProps) => {
  const styles =
    `component link-list link-list--corporate-header-utility relative ${params.styles || ''}`.trim();
  const id = params.RenderingIdentifier;
  const rawDs = fields?.data?.datasource as Record<string, unknown> | undefined;
  const regions = useMemo(
    () => normalizeRegionsFromDatasource(rawDs).filter((r) => r.links.length),
    [rawDs]
  );
  const fallbackTitle = regions[0]?.title ?? ({ value: 'Services' } as TextField);
  const triggerField = rawDs ? (getDatasourceRootTitle(rawDs) ?? fallbackTitle) : fallbackTitle;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedIndex >= regions.length && regions.length) {
      setSelectedIndex(0);
    }
  }, [regions.length, selectedIndex]);

  const selected = regions.length
    ? regions[Math.min(selectedIndex, regions.length - 1)]
    : undefined;

  const closePanel = useCallback(() => setPanelOpen(false), []);

  useEffect(() => {
    if (!panelOpen) {
      return;
    }
    const onDocMouseDown = (e: MouseEvent) => {
      const el = shellRef.current;
      if (el && !el.contains(e.target as Node)) {
        closePanel();
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closePanel();
      }
    };
    document.addEventListener('mousedown', onDocMouseDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [panelOpen, closePanel]);

  if (!rawDs || !regions.length) {
    return (
      <div className={styles} id={id}>
        <div className="component-content text-sm text-white/70">Header utility services</div>
      </div>
    );
  }

  const displayedTitle = panelOpen ? triggerField : (selected?.title ?? triggerField);
  const listId = id ? `${id}-regions` : 'header-utility-regions';

  return (
    <div className={styles} id={id} ref={shellRef}>
      <div className="component-content">
        <div className="flex flex-wrap items-center gap-y-3">
          <div className="relative z-140 flex min-w-0 items-start">
            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-2 border-0 bg-transparent px-2 py-1 text-[0.875rem] font-semibold whitespace-nowrap text-white no-underline outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-white/70"
              aria-expanded={panelOpen}
              aria-controls={panelOpen ? listId : undefined}
              onClick={() => setPanelOpen((o) => !o)}
            >
              <Globe className="size-5 shrink-0 stroke-[1.8] text-current" aria-hidden />
              <Text tag="span" field={displayedTitle ?? triggerField} className="text-left" />
              <ChevronDown
                aria-hidden
                className={`size-4 shrink-0 transition-transform ${panelOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {panelOpen ? (
              <div
                id={listId}
                role="menu"
                className="absolute top-full left-0 z-180 mt-1 min-w-[min(18rem,90vw)] rounded-sm border border-black/10 bg-white py-2 text-[#0a4f8a] shadow-lg"
              >
                <ul className="m-0 list-none p-0">
                  {regions.map((region, idx) => {
                    const active = idx === Math.min(selectedIndex, regions.length - 1);
                    return (
                      <li key={`${region.id}-${idx}`} className="m-0 p-0" role="none">
                        <button
                          role="menuitem"
                          type="button"
                          className={`flex w-full border-0 bg-transparent px-5 py-2.5 text-left text-[0.875rem] font-semibold whitespace-nowrap no-underline hover:bg-black/5 ${
                            active ? 'bg-black/4' : ''
                          }`}
                          onClick={() => {
                            setSelectedIndex(idx);
                            closePanel();
                          }}
                        >
                          <Text tag="span" field={region.title} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
          </div>

          <span
            className="mx-1 hidden h-5 w-px shrink-0 self-center bg-white/25 lg:inline-block"
            aria-hidden
          />

          <ul className="m-0 flex list-none flex-col gap-3 p-0 text-[0.875rem] font-semibold text-white lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-0 lg:gap-y-2">
            {(selected ?? regions[0]).links.map((lk, i) => (
              <li
                key={`${i}-${lk.value?.href ?? i}`}
                className={`m-0 flex items-center p-0 ${i ? 'border-white/25 lg:ml-6 lg:border-l lg:pl-6' : ''}`}
              >
                <span className="inline-flex items-center gap-1.5">
                  <ContentSdkLink
                    field={lk}
                    className="text-white no-underline hover:text-white hover:underline"
                  />
                  {isLikelyExternalLink(lk) ? (
                    <ExternalLink className="size-3.75 shrink-0 text-white/95" aria-hidden />
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export const Default = (props: LinkListProps) => {
  const { params, fields } = props;
  const rawStyles = params.styles || '';
  const datasource = fields?.data?.datasource;
  const styles = `component link-list ${rawStyles}`.trim();
  const id = params.RenderingIdentifier;

  const renderContent = () => {
    if (!datasource) {
      return <h3>Link List</h3>;
    }

    const links = datasource.children.results
      .filter((element) => element?.field?.link)
      .map((element, index) => (
        <LinkListItem
          key={`${index}-${element.field?.link}`}
          index={index}
          total={datasource.children.results.length}
          field={element.field.link}
        />
      ));

    return (
      <>
        <Text tag="h3" field={datasource.field?.title} />
        <ul>{links}</ul>
      </>
    );
  };

  return (
    <div className={styles} id={id}>
      <div className="component-content">{renderContent()}</div>
    </div>
  );
};

export const SecondaryNavigation = ({ params, fields }: LinkListProps) => {
  const datasource = fields?.data?.datasource;
  const styles = `component link-list ${params.styles || ''}`.trim();
  const id = params.RenderingIdentifier;

  const renderContent = () => {
    if (!datasource) {
      return <h3>Link List</h3>;
    }

    const links = datasource.children.results
      .filter((element) => element?.field?.link)
      .map((element, index) => (
        <LinkListItem
          key={`${index}-${element.field?.link}`}
          index={index}
          total={datasource.children.results.length}
          field={element.field.link}
          className="navigation-item"
        />
      ));

    return <ul className="flex gap-x-6 gap-y-4 text-xs in-[.drawer-content]:flex-col!">{links}</ul>;
  };

  return (
    <div className={styles} id={id}>
      <div className="component-content">{renderContent()}</div>
    </div>
  );
};

/**
 * Brand footer (Walkers / Lays): centered legal links, no title — use in {@link PepsiCoFooter} placeholder.
 */
export const BrandFooterLinks = ({ params, fields }: LinkListProps) => {
  const datasource = fields?.data?.datasource;
  const styles = `component link-list link-list--brand-footer-links ${params.styles || ''}`.trim();
  const id = params.RenderingIdentifier;

  if (!datasource) {
    return (
      <div className={styles} id={id}>
        <div className="component-content">
          <h3>Link List</h3>
        </div>
      </div>
    );
  }

  const results = datasource.children.results.filter((element) => element?.field?.link);
  const total = results.length;

  const links = results.map((element, index) => (
    <LinkListItem
      key={`${index}-${element.field?.link}`}
      index={index}
      total={total}
      field={element.field.link}
    />
  ));

  return (
    <div className={styles} id={id}>
      <div className="component-content">
        <Text tag="h3" field={datasource.field?.title} className="link-list__brand-footer-title" />
        <ul className="link-list__brand-footer-links" role="navigation" aria-label="Footer links">
          {links}
        </ul>
      </div>
    </div>
  );
};

/**
 * Footer utility row: horizontal links separated by pipes, no title (ignores datasource title).
 */
export const UtilityFooter = ({ params, fields }: LinkListProps) => {
  const datasource = fields?.data?.datasource;
  const styles = `component link-list link-list--utility-footer ${params.styles || ''}`.trim();
  const id = params.RenderingIdentifier;

  const renderContent = () => {
    if (!datasource) {
      return <h3>Link List</h3>;
    }

    const results = datasource.children.results.filter((element) => element?.field?.link);
    const total = results.length;

    const links = results.map((element, index) => {
      const classNames = [
        `item${index}`,
        index % 2 === 0 ? 'odd' : 'even',
        index === 0 ? 'first' : '',
        index === total - 1 ? 'last' : '',
      ]
        .filter(Boolean)
        .join(' ');
      const isLast = index === total - 1;
      return (
        <li key={`${index}-${element.field?.link}`} className={classNames}>
          <span className="link-list__utility-footer-pair">
            <div className="field-link">
              {getLinkHref(element.field.link) ? (
                <ContentSdkLink
                  field={element.field.link}
                  className="link-list__utility-footer-link"
                />
              ) : (
                <span className="link-list__utility-footer-text">
                  {getLinkText(element.field.link)}
                </span>
              )}
            </div>
            {!isLast ? (
              <span className="link-list__utility-footer-pipe" aria-hidden>
                |
              </span>
            ) : null}
          </span>
        </li>
      );
    });

    return (
      <ul className="link-list__utility-footer" role="navigation" aria-label="Site footer">
        {links}
      </ul>
    );
  };

  return (
    <div className={styles} id={id}>
      <div className="component-content">{renderContent()}</div>
    </div>
  );
};

/**
 * Bupa corporate footer columns: heading + vertical links at all breakpoints.
 * No accordion and no chevron (unlike {@link Footer} for consumer footer).
 */
export const CorporateFooter = ({ params, fields }: LinkListProps) => {
  const datasource = fields?.data?.datasource;
  const styles = `component link-list link-list--corporate-footer ${params.styles || ''}`.trim();
  const id = params.RenderingIdentifier;

  if (!datasource) {
    return (
      <div className={styles} id={id}>
        <div className="component-content">
          <h3>Link List</h3>
        </div>
      </div>
    );
  }

  const results = datasource.children.results.filter((element) => element?.field?.link);
  const total = results.length;

  const links = results.map((element, index) => (
    <LinkListItem
      key={`${index}-${element.field?.link}`}
      index={index}
      total={total}
      field={element.field.link}
    />
  ));

  return (
    <div className={styles} id={id}>
      <div className="component-content">
        <Text
          tag="h3"
          field={datasource.field?.title}
          className="link-list__corporate-footer-title"
        />
        <ul className="link-list__corporate-footer-links">{links}</ul>
      </div>
    </div>
  );
};

/**
 * Corporate footer bottom strip: same pipe-separated layout as {@link UtilityFooter},
 * with a BEM modifier for corporate-specific styling under `.bupa-corporate-footer`.
 */
export const CorporateUtilityFooter = ({ params, fields }: LinkListProps) => {
  const datasource = fields?.data?.datasource;
  const styles =
    `component link-list link-list--utility-footer link-list--corporate-utility-footer ${params.styles || ''}`.trim();
  const id = params.RenderingIdentifier;

  const renderContent = () => {
    if (!datasource) {
      return <h3>Link List</h3>;
    }

    const results = datasource.children.results.filter((element) => element?.field?.link);
    const total = results.length;

    const links = results.map((element, index) => {
      const classNames = [
        `item${index}`,
        index % 2 === 0 ? 'odd' : 'even',
        index === 0 ? 'first' : '',
        index === total - 1 ? 'last' : '',
      ]
        .filter(Boolean)
        .join(' ');
      const isLast = index === total - 1;
      return (
        <li key={`${index}-${element.field?.link}`} className={classNames}>
          <span className="link-list__utility-footer-pair">
            <div className="field-link">
              {getLinkHref(element.field.link) ? (
                <ContentSdkLink
                  field={element.field.link}
                  className="link-list__utility-footer-link"
                />
              ) : (
                <span className="link-list__utility-footer-text">
                  {getLinkText(element.field.link)}
                </span>
              )}
            </div>
            {!isLast ? (
              <span className="link-list__utility-footer-pipe" aria-hidden>
                |
              </span>
            ) : null}
          </span>
        </li>
      );
    });

    return (
      <ul
        className="link-list__utility-footer"
        role="navigation"
        aria-label="Corporate footer links"
      >
        {links}
      </ul>
    );
  };

  return (
    <div className={styles} id={id}>
      <div className="component-content">{renderContent()}</div>
    </div>
  );
};

function subscribeMd(callback: () => void) {
  if (typeof window === 'undefined') {
    return () => {};
  }
  const mq = window.matchMedia('(min-width: 768px)');
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}

function getMdSnapshot(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return window.matchMedia('(min-width: 768px)').matches;
}

function getMdServerSnapshot(): boolean {
  return false;
}

function useMdUp() {
  return useSyncExternalStore(subscribeMd, getMdSnapshot, getMdServerSnapshot);
}

/**
 * Bupa footer nav column: below the `md` breakpoint, native accordion (`details` / summary + “+”).
 * From `md` upward, a normal heading + list (no accordion) for the multi-column layout.
 */
export const Footer = ({ params, fields }: LinkListProps) => {
  const datasource = fields?.data?.datasource;
  const styles = `component link-list link-list--footer-link-list ${params.styles || ''}`.trim();
  const id = params.RenderingIdentifier;
  const isMdUp = useMdUp();

  if (!datasource) {
    return (
      <div className={styles} id={id}>
        <div className="component-content">
          <h3>Link List</h3>
        </div>
      </div>
    );
  }

  const results = datasource.children.results.filter((element) => element?.field?.link);
  const total = results.length;

  const links = results.map((element, index) => (
    <LinkListItem
      key={`${index}-${element.field?.link}`}
      index={index}
      total={total}
      field={element.field.link}
    />
  ));

  const list = <ul className="link-list__footer-link-list-links">{links}</ul>;

  return (
    <div className={styles} id={id}>
      <div className="component-content">
        {isMdUp ? (
          <>
            <Text
              tag="h3"
              field={datasource.field?.title}
              className="link-list__footer-link-list-title"
            />
            {list}
          </>
        ) : (
          <details className="link-list__footer-link-list-details">
            <summary className="link-list__footer-link-list-summary">
              <Text
                tag="span"
                field={datasource.field?.title}
                className="link-list__footer-link-list-summary-text"
              />
              <span className="link-list__footer-link-list-chevron" aria-hidden />
            </summary>
            {list}
          </details>
        )}
      </div>
    </div>
  );
};
