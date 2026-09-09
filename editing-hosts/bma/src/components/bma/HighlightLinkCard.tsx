'use client';

import {
  Children,
  isValidElement,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type JSX,
  type ReactNode,
} from 'react';
import { Link as SitecoreLink, Placeholder, Text } from '@sitecore-content-sdk/nextjs';
import type { LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, dynamicPlaceholderKey, hasLink } from '@/lib/component-utils';

export interface HighlightLinkCardFields {
  Title: TextField;
  Subtitle: TextField;
  Link: LinkField;
  AccentColor: TextField;
}

const defaultFields: HighlightLinkCardFields = {
  Title: { value: 'Category' },
  Subtitle: { value: '' },
  Link: { value: { href: '#', text: 'View all' } },
  AccentColor: { value: '#00af9f' },
};

type AccentTheme = {
  bg: string;
  corner: string;
  hover: string;
};

const ACCENT_PRESETS: Record<string, AccentTheme> = {
  navy: { bg: '#002d57', corner: '#181145', hover: '#4fabff' },
  consultation: { bg: '#002d57', corner: '#181145', hover: '#4fabff' },
  yellow: { bg: '#fdb813', corner: '#efa01f', hover: '#965d03' },
  amber: { bg: '#fdb813', corner: '#efa01f', hover: '#965d03' },
  international: { bg: '#fdb813', corner: '#efa01f', hover: '#965d03' },
  teal: { bg: '#00af9f', corner: '#009a92', hover: '#002d57' },
  notice: { bg: '#00af9f', corner: '#009a92', hover: '#002d57' },
  maroon: { bg: '#b32017', corner: '#971a1e', hover: '#420300' },
  red: { bg: '#b32017', corner: '#971a1e', hover: '#420300' },
  market: { bg: '#b32017', corner: '#971a1e', hover: '#420300' },
};

function resolveAccent(raw: string | undefined): { theme: AccentTheme; key: string } {
  const value = (raw ?? '').trim();
  if (!value) return { theme: ACCENT_PRESETS.teal, key: 'teal' };

  const key = value.toLowerCase();
  const preset = ACCENT_PRESETS[key];
  if (preset) return { theme: preset, key };

  if (value.startsWith('#') || value.startsWith('rgb')) {
    return { theme: { bg: value, corner: value, hover: '#ffffff' }, key: 'custom' };
  }

  return { theme: ACCENT_PRESETS.teal, key: 'teal' };
}

function flattenItems(nodes: ReactNode): ReactNode[] {
  return Children.toArray(nodes).flatMap((child) => {
    if (!isValidElement(child)) return child ? [child] : [];
    const kids = (child.props as { children?: ReactNode } | null)?.children;
    if (kids && Children.count(kids) > 1 && typeof child.type !== 'function') {
      return flattenItems(kids);
    }
    return [child];
  });
}

function HighlightItemsCarousel({
  components,
}: {
  components: ReactNode;
}): JSX.Element | null {
  const items = useMemo(() => flattenItems(components), [components]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % items.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [items.length]);

  useEffect(() => {
    if (index >= items.length && items.length > 0) setIndex(0);
  }, [index, items.length]);

  if (items.length === 0) return null;

  return (
    <div className="bma-highlight-card__carousel">
      <div className="bma-highlight-card__slides">
        {items.map((item, i) => (
          <div
            key={i}
            className={`bma-highlight-card__slide ${i === index ? 'is-active' : ''}`.trim()}
            aria-hidden={i !== index}
          >
            {item}
          </div>
        ))}
      </div>
      {items.length > 1 ? (
        <div className="bma-highlight-card__dots" role="tablist" aria-label="Highlights">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`bma-highlight-card__dot ${i === index ? 'is-active' : ''}`.trim()}
              aria-label={`Show item ${i + 1}`}
              aria-selected={i === index}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export type HighlightLinkCardProps = ComponentProps & { fields?: HighlightLinkCardFields };

export const Default = (props: HighlightLinkCardProps): JSX.Element => {
  const { params, fields = defaultFields, rendering } = props;
  const itemsPh = dynamicPlaceholderKey('highlight-items', params);
  const { theme: accent, key: accentKey } = resolveAccent(fields.AccentColor?.value?.toString());
  const style = {
    '--bma-accent': accent.bg,
    '--bma-accent-corner': accent.corner,
    '--bma-accent-hover': accent.hover,
  } as CSSProperties;

  return (
    <article
      key={componentKey(props)}
      className={`bma-highlight-card bma-highlight-card--${accentKey} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
      style={style}
    >
      <header className="bma-highlight-card__header">
        {hasLink(fields.Link?.value) ? (
          <SitecoreLink field={fields.Link} className="bma-highlight-card__title-link">
            <Text tag="h2" className="bma-highlight-card__title" field={fields.Title} />
          </SitecoreLink>
        ) : (
          <Text tag="h2" className="bma-highlight-card__title" field={fields.Title} />
        )}
        {fields.Subtitle?.value ? (
          <Text tag="p" className="bma-highlight-card__subtitle" field={fields.Subtitle} />
        ) : null}
      </header>
      <div className="bma-highlight-card__items">
        <Placeholder
          name={itemsPh}
          rendering={rendering}
          render={(components) => <HighlightItemsCarousel components={components} />}
        />
      </div>
    </article>
  );
};
