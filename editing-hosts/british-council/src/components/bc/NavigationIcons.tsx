'use client';

import { type FormEvent, type JSX } from 'react';
import { Search, X } from 'lucide-react';
import type { LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { useHeaderNav } from '@/components/bc/header-nav-context';

export type NavigationIconsProps = Partial<ComponentProps> & {
  fields?: {
    SearchPage?: LinkField;
  };
  params?: { [key: string]: string };
  /** When false, only the toggle is rendered (avoids duplicate panels). */
  showSearchPanel?: boolean;
};

function getSearchHref(field?: LinkField): string {
  const v = field?.value as { href?: string; url?: string } | undefined;
  return v?.href || v?.url || '/search';
}

function NavigationIconsLayout(props: NavigationIconsProps, extra = ''): JSX.Element {
  const { params, fields, showSearchPanel = true } = props;
  const { isSearchOpen, toggleSearch, closeSearch } = useHeaderNav();
  const searchHref = getSearchHref(fields?.SearchPage);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const q = String(data.get('q') || '').trim();
    const url = q ? `${searchHref}?search_api_views_fulltext=${encodeURIComponent(q)}` : searchHref;
    window.location.href = url;
  };

  return (
    <>
      <div
        className={`bc-nav-icons component ${extra} ${params?.styles ?? ''}`.trim()}
        id={params?.RenderingIdentifier || 'bc-nav-icons'}
      >
        <button
          type="button"
          className={`bc-nav-icons__search-toggle${isSearchOpen ? ' is-open' : ''}`}
          onClick={toggleSearch}
          aria-expanded={isSearchOpen}
          aria-controls="bc-navbar-search"
          aria-label={isSearchOpen ? 'Close search' : 'Show search'}
        >
          <Search className="bc-nav-icons__search-icon" aria-hidden="true" size={18} />
          <span className="bc-nav-icons__search-label">Search</span>
        </button>
      </div>

      {showSearchPanel && isSearchOpen ? (
        <div className="bc-navbar-search" id="bc-navbar-search">
          <form className="bc-navbar-search__form" action={searchHref} method="get" onSubmit={onSubmit}>
            <label className="sr-only" htmlFor="bc-search-input">
              Search
            </label>
            <input
              id="bc-search-input"
              className="bc-navbar-search__input"
              type="search"
              name="q"
              placeholder="Search"
              autoFocus
            />
            <button type="submit" className="bc-navbar-search__submit">
              <Search size={16} aria-hidden="true" />
              Search
            </button>
          </form>
          <button type="button" className="bc-navbar-search__close" onClick={closeSearch} aria-label="Close search">
            <X size={18} aria-hidden="true" />
            <span>Close search</span>
          </button>
        </div>
      ) : null}
    </>
  );
}

export const Default = (p: NavigationIconsProps): JSX.Element => NavigationIconsLayout(p);
export const Inversed = (p: NavigationIconsProps): JSX.Element =>
  NavigationIconsLayout(p, 'component--inversed');
export const Animated = (p: NavigationIconsProps): JSX.Element =>
  NavigationIconsLayout(p, 'component--animated');
export const InversedAnimated = (p: NavigationIconsProps): JSX.Element =>
  NavigationIconsLayout(p, 'component--inversed component--animated');
