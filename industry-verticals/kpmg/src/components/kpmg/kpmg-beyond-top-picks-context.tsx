'use client';

import { createContext, useContext } from 'react';

export const TopPickCategoryFilterContext = createContext<string | null>(null);

export function useTopPickCategoryFilter() {
  return useContext(TopPickCategoryFilterContext);
}

/** Case-insensitive match for card CategoryLabel vs topic chip label. */
export function categoryMatches(cardCategory: string, filterCategory: string): boolean {
  const normalize = (value: string) => value.trim().toLowerCase().replace(/\s+/g, ' ');
  return normalize(cardCategory) === normalize(filterCategory);
}
