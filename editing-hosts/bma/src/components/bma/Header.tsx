'use client';

import { useEffect, useState, type JSX } from 'react';
import { Link as SitecoreLink, Placeholder } from '@sitecore-content-sdk/nextjs';
import type { ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, dynamicPlaceholderKey, hasLink } from '@/lib/component-utils';
import { FieldImage } from '@/lib/field-image';

export interface HeaderFields {
  Logo: ImageField;
  LogoLink: LinkField;
  PrimaryLink?: LinkField;
  SecondaryLink?: LinkField;
  SearchAction?: LinkField;
}

const defaultFields: HeaderFields = {
  Logo: { value: { src: '', alt: 'Bermuda Monetary Authority' } },
  LogoLink: { value: { href: '/', text: 'Home' } },
  PrimaryLink: {
    value: { href: 'https://www.bma.bm/coin-catalogues/commemorative-coins', text: 'Commemorative Coins' },
  },
  SecondaryLink: {
    value: { href: 'https://www.bma.bm/regulated-entities', text: 'Regulated Entities' },
  },
  SearchAction: { value: { href: '/search', text: 'Search' } },
};

export type HeaderProps = ComponentProps & { fields?: HeaderFields };

function MenuGlyph({ open }: { open: boolean }): JSX.Element {
  if (open) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 64 64" aria-hidden="true">
        <path
          d="M4.59 59.41a2 2 0 0 0 2.83 0L32 34.83l24.59 24.58a2 2 0 0 0 2.83-2.83L34.83 32 59.41 7.41a2 2 0 0 0-2.83-2.83L32 29.17 7.41 4.59a2 2 0 0 0-2.82 2.82L29.17 32 4.59 56.59a2 2 0 0 0 0 2.82z"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="23" viewBox="0 0 36 23" fill="none" aria-hidden="true">
      <path
        d="M0 1.5C0 0.671573 0.671573 0 1.5 0H28.5C29.3284 0 30 0.671573 30 1.5V1.5C30 2.32843 29.3284 3 28.5 3H1.5C0.671573 3 0 2.32843 0 1.5V1.5Z"
        fill="currentColor"
      />
      <rect x="6" y="10" width="30" height="3" rx="1.5" fill="currentColor" />
      <path
        d="M0 21.5C0 20.6716 0.671573 20 1.5 20H28.5C29.3284 20 30 20.6716 30 21.5V21.5C30 22.3284 29.3284 23 28.5 23H1.5C0.671573 23 0 22.3284 0 21.5V21.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SearchGlyph(): JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M16.5 16.5 22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export const Default = (props: HeaderProps): JSX.Element => {
  const { params, fields = defaultFields, rendering } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const navPh = dynamicPlaceholderKey('header-navigation', params);
  const primary = fields.PrimaryLink ?? defaultFields.PrimaryLink!;
  const secondary = fields.SecondaryLink ?? defaultFields.SecondaryLink!;
  const search = fields.SearchAction ?? defaultFields.SearchAction!;
  const searchHref = search.value?.href?.toString() || '/search';

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  return (
    <header
      key={componentKey(props)}
      className={`bma-header ${mobileOpen ? 'bma-header--menu-open' : ''} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
      role="banner"
    >
      <div className="bma-header__bar">
        <div className="bma-header__brand">
          <button
            type="button"
            className="bma-header__menu-toggle"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="bma-header-nav"
            onClick={() => setMobileOpen((open) => !open)}
          >
            <MenuGlyph open={false} />
          </button>

          <SitecoreLink field={fields.LogoLink} className="bma-header__logo-link">
            <FieldImage field={fields.Logo} mode="contain" className="bma-header__logo" />
          </SitecoreLink>
        </div>

        <nav
          id="bma-header-nav"
          className={`bma-header__nav ${mobileOpen ? 'bma-header__nav--open' : ''}`.trim()}
          aria-label="Primary"
        >
          <div className="bma-header__drawer-head">
            <SitecoreLink field={fields.LogoLink} className="bma-header__logo-link">
              <FieldImage field={fields.Logo} mode="contain" className="bma-header__logo" />
            </SitecoreLink>
            <button
              type="button"
              className="bma-header__menu-close"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            >
              <MenuGlyph open />
            </button>
          </div>
          <div className="bma-header__nav-list">
            <Placeholder name={navPh} rendering={rendering} />
          </div>
        </nav>

        <div className="bma-header__actions">
          {hasLink(primary.value) ? <SitecoreLink field={primary} className="bma-header__action-btn" /> : null}
          {hasLink(secondary.value) ? <SitecoreLink field={secondary} className="bma-header__action-btn" /> : null}
          <a href={searchHref} className="bma-header__search-btn" title="Search" aria-label="Search">
            <SearchGlyph />
          </a>
        </div>
      </div>

      {mobileOpen ? (
        <button
          type="button"
          className="bma-header__overlay"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}
    </header>
  );
};
