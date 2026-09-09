'use client';

import { createContext, useContext } from 'react';

export type PortalNavContextValue = {
  navOpen: boolean;
  openNav: () => void;
  closeNav: () => void;
  toggleNav: () => void;
};

export const PortalNavContext = createContext<PortalNavContextValue>({
  navOpen: false,
  openNav: () => undefined,
  closeNav: () => undefined,
  toggleNav: () => undefined,
});

export function usePortalNav(): PortalNavContextValue {
  return useContext(PortalNavContext);
}
