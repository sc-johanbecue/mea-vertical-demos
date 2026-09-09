import type { Page } from '@sitecore-content-sdk/nextjs';

/** Lay's brand yellow (header, product sections, etc.) */
export const LAYS_BRAND_YELLOW = '#ffd218';

/** Sitecore content root for the Lays brand site */
const LAYS_SITE_CONTENT_PREFIX = '/sitecore/content/Pepsico/lays';

function readItemPath(source: unknown): string | undefined {
  if (!source || typeof source !== 'object' || !('itemPath' in source)) return undefined;
  const { itemPath } = source as { itemPath?: unknown };
  return typeof itemPath === 'string' ? itemPath : undefined;
}

/** True when the current page belongs to the Lays site (Home or any descendant). */
export function isLaysSite(page: Page | null | undefined): boolean {
  if (!page) return false;

  if (page.siteName?.toLowerCase() === 'lays') return true;

  const sitecore = page.layout?.sitecore;
  const itemPath = readItemPath(sitecore?.route) ?? readItemPath(sitecore?.context);

  if (!itemPath?.trim()) return false;

  const normalized = itemPath.replace(/\\/g, '/');
  return (
    normalized === LAYS_SITE_CONTENT_PREFIX || normalized.startsWith(`${LAYS_SITE_CONTENT_PREFIX}/`)
  );
}
