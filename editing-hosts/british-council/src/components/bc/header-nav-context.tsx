'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type JSX,
  type ReactNode,
} from 'react';

type HeaderNavContextValue = {
  isMenuOpen: boolean;
  isSearchOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
};

const HeaderNavContext = createContext<HeaderNavContextValue | null>(null);

export function HeaderNavProvider({ children }: { children: ReactNode }): JSX.Element {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const openMenu = useCallback(() => {
    setSearchOpen(false);
    setMenuOpen(true);
  }, []);
  const toggleMenu = useCallback(() => {
    setSearchOpen(false);
    setMenuOpen((v) => !v);
  }, []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const openSearch = useCallback(() => {
    setMenuOpen(false);
    setSearchOpen(true);
  }, []);
  const toggleSearch = useCallback(() => {
    setMenuOpen(false);
    setSearchOpen((v) => !v);
  }, []);

  useEffect(() => {
    if (!isMenuOpen && !isSearchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isMenuOpen, isSearchOpen]);

  const value = useMemo(
    () => ({
      isMenuOpen,
      isSearchOpen,
      openMenu,
      closeMenu,
      toggleMenu,
      openSearch,
      closeSearch,
      toggleSearch,
    }),
    [isMenuOpen, isSearchOpen, openMenu, closeMenu, toggleMenu, openSearch, closeSearch, toggleSearch]
  );

  return <HeaderNavContext.Provider value={value}>{children}</HeaderNavContext.Provider>;
}

export function useHeaderNav(): HeaderNavContextValue {
  const ctx = useContext(HeaderNavContext);
  if (!ctx) {
    return {
      isMenuOpen: false,
      isSearchOpen: false,
      openMenu: () => undefined,
      closeMenu: () => undefined,
      toggleMenu: () => undefined,
      openSearch: () => undefined,
      closeSearch: () => undefined,
      toggleSearch: () => undefined,
    };
  }
  return ctx;
}
