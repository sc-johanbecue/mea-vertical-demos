'use client';

import type { JSX } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Placeholder } from '@sitecore-content-sdk/nextjs';
import { Menu, X } from 'lucide-react';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';
import { PortalNavContext } from './portal-nav-context';

export type PortalShellProps = ComponentProps;

function Layout(props: PortalShellProps, extra = ''): JSX.Element {
  const { params, rendering } = props;
  const id = params?.DynamicPlaceholderId ?? '1';
  const [navOpen, setNavOpen] = useState(false);

  const openNav = useCallback(() => setNavOpen(true), []);
  const closeNav = useCallback(() => setNavOpen(false), []);
  const toggleNav = useCallback(() => setNavOpen((v) => !v), []);

  const ctx = useMemo(
    () => ({ navOpen, openNav, closeNav, toggleNav }),
    [navOpen, openNav, closeNav, toggleNav]
  );

  useEffect(() => {
    if (!navOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeNav();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [navOpen, closeNav]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => {
      if (mq.matches) setNavOpen(false);
    };
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <PortalNavContext.Provider value={ctx}>
      <div
        key={componentKey(props)}
        className={`bc-portal-shell component ${navOpen ? 'is-nav-open' : ''} ${extra} ${params?.styles ?? ''}`.trim()}
        id={params?.RenderingIdentifier}
      >
        <header className="bc-portal-shell__topbar">
          <button
            type="button"
            className="bc-portal-shell__menu-btn"
            aria-label={navOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={navOpen}
            aria-controls="bc-portal-sidebar"
            onClick={toggleNav}
          >
            {navOpen ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
          </button>
          <span className="bc-portal-shell__topbar-label">Digital Library</span>
        </header>

        <button
          type="button"
          className="bc-portal-shell__backdrop"
          aria-label="Close menu"
          tabIndex={navOpen ? 0 : -1}
          onClick={closeNav}
        />

        <aside id="bc-portal-sidebar" className="bc-portal-shell__sidebar" aria-hidden={false}>
          <Placeholder name={`portal-sidebar-${id}`} rendering={rendering} />
        </aside>

        <div className="bc-portal-shell__main">
          <Placeholder name={`portal-main-${id}`} rendering={rendering} />
        </div>
      </div>
    </PortalNavContext.Provider>
  );
}

export const Default = (p: PortalShellProps): JSX.Element => Layout(p);
export const Inversed = (p: PortalShellProps): JSX.Element => Layout(p, 'component--inversed');
export const Animated = (p: PortalShellProps): JSX.Element => Layout(p, 'component--animated');
export const InversedAnimated = (p: PortalShellProps): JSX.Element =>
  Layout(p, 'component--inversed component--animated');
