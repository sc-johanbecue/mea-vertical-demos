'use client';

import type { JSX, ReactNode } from 'react';
import { createContext, useContext } from 'react';

/** True when this card is rendered inside a hero that shows the full-bleed desktop background. */
const PepsiCoHeroDesktopBgContext = createContext(false);

export function PepsiCoHeroDesktopBgProvider({
  value,
  children,
}: {
  value: boolean;
  children: ReactNode;
}): JSX.Element {
  return (
    <PepsiCoHeroDesktopBgContext.Provider value={value}>
      {children}
    </PepsiCoHeroDesktopBgContext.Provider>
  );
}

export function usePepsiCoHeroDesktopBg(): boolean {
  return useContext(PepsiCoHeroDesktopBgContext);
}
