'use client';

import { useSitecore } from '@sitecore-content-sdk/nextjs';

/** Suppress attribute mismatches from Sitecore Pages editor chrome (e.g. cursor:pointer). */
export function useEditingHydrationProps(): { suppressHydrationWarning?: boolean } {
  const { page } = useSitecore();
  return page.mode?.isEditing ? { suppressHydrationWarning: true } : {};
}
