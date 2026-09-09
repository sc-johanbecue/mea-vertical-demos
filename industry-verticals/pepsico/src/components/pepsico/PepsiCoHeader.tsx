'use client';

import type { CSSProperties, JSX } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Image as SitecoreImage,
  ImageField,
  Placeholder,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { ChevronDown, Menu, X } from 'lucide-react';
import { ComponentProps } from '@/lib/component-props';
import { isLaysSite, LAYS_BRAND_YELLOW } from '@/lib/is-lays-site';

/** Walkers brand header red */
const HEADER_RED = '#b5121b';

const walkersHeaderTextureStyle: CSSProperties = {
  backgroundColor: HEADER_RED,
  backgroundImage: `repeating-linear-gradient(
    90deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.07) 2px,
    rgba(0, 0, 0, 0.07) 3px
  )`,
};

const laysHeaderStyle: CSSProperties = {
  backgroundColor: LAYS_BRAND_YELLOW,
};

export interface PepsiCoHeaderFields {
  Logo: ImageField;
}

const defaultFields: PepsiCoHeaderFields = {
  Logo: { value: { src: '', alt: 'Brand logo' } },
};

export type PepsiCoHeaderProps = ComponentProps & {
  fields?: PepsiCoHeaderFields;
};

function BrandLogo({ logoField }: { logoField?: ImageField }) {
  return (
    <a href="/" className="inline-flex shrink-0 items-center no-underline">
      <SitecoreImage
        field={logoField}
        className="h-11 w-auto max-w-[9.5rem] object-contain md:h-12 md:max-w-[10.5rem]"
        alt={logoField?.value?.alt ?? 'Brand logo'}
      />
    </a>
  );
}

function LaysLocaleControl() {
  const { page } = useSitecore();
  const label = useMemo(() => {
    const locale = page?.locale || 'nl-BE';
    const primary = locale.split('-')[0];
    return primary ? primary.toUpperCase() : 'NL';
  }, [page?.locale]);

  return (
    <button
      type="button"
      className="pepsico-header__locale inline-flex items-center gap-1 border-0 bg-transparent p-0 text-sm font-bold tracking-wide text-black uppercase"
      aria-label={`Language: ${label}`}
    >
      <span>{label}</span>
      <ChevronDown className="h-4 w-4 stroke-[2.5]" aria-hidden />
    </button>
  );
}

export const Default = (props: PepsiCoHeaderProps): JSX.Element => {
  const id = props.params.RenderingIdentifier ?? props.rendering?.uid;
  const { styles: paramStyles, DynamicPlaceholderId } = props.params;
  const fields = props.fields ?? defaultFields;
  const navPlaceholder = `pepsico-header-nav-${DynamicPlaceholderId ?? '1'}`;
  const [menuOpen, setMenuOpen] = useState(false);
  const { page } = useSitecore();
  const isLays = isLaysSite(page);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const openMenu = useCallback(() => setMenuOpen(true), []);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen, closeMenu]);

  const barStyle = isLays ? laysHeaderStyle : walkersHeaderTextureStyle;

  return (
    <header
      key={id ?? props.rendering?.uid}
      className={[
        'component pepsico-header w-full',
        isLays ? 'pepsico-header--lays' : 'pepsico-header--walkers',
        menuOpen
          ? 'fixed inset-0 z-[200] flex flex-col lg:sticky lg:inset-auto lg:z-50'
          : 'sticky top-0 z-50',
        paramStyles || '',
      ]
        .filter(Boolean)
        .join(' ')}
      id={id}
      data-pepsico-header-variant={isLays ? 'lays' : 'walkers'}
    >
      <div
        className="pepsico-header__bar flex shrink-0 items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-3.5 lg:px-8"
        style={barStyle}
      >
        <BrandLogo logoField={fields.Logo} />

        {!menuOpen ? (
          <nav
            className={[
              'pepsico-header__nav-desktop hidden min-w-0 flex-1 lg:flex',
              isLays ? 'lg:justify-center' : 'lg:justify-center xl:justify-end',
            ].join(' ')}
            aria-label="Main"
          >
            <Placeholder name={navPlaceholder} rendering={props.rendering} />
          </nav>
        ) : null}

        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          {isLays ? <LaysLocaleControl /> : null}

          {menuOpen ? (
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center border-0 bg-transparent p-0 text-black lg:hidden"
              aria-label="Close menu"
              onClick={closeMenu}
            >
              <X className="h-8 w-8 stroke-[2.5]" aria-hidden />
            </button>
          ) : (
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center border-0 bg-transparent p-0 text-black lg:hidden"
              aria-label="Open menu"
              onClick={openMenu}
            >
              <Menu className="h-8 w-8 stroke-[2.5]" aria-hidden />
            </button>
          )}
        </div>
      </div>

      {menuOpen ? (
        <nav
          className={[
            'pepsico-header__nav-mobile flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-12 lg:hidden',
            !isLays && 'bg-white',
          ].join(' ')}
          style={isLays ? { backgroundColor: LAYS_BRAND_YELLOW } : undefined}
          aria-label="Main"
        >
          <Placeholder name={navPlaceholder} rendering={props.rendering} />
        </nav>
      ) : null}
    </header>
  );
};
