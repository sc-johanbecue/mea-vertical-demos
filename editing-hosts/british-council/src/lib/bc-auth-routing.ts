import type { NextRequest } from 'next/server';
import { buildLoginUrl } from './auth0-profile';

export const BC_REGISTER_PATH = '/register';
export const BC_PORTAL_SEGMENT = 'portal';

/** Same header Content SDK EditingRenderMiddleware sets on the internal page fetch. */
export const SITECORE_EDITING_PARAMS_HEADER = 'x-sitecore-editing-params';

/** Next.js Pages Router / draft preview cookies set by `res.setPreviewData`. */
const NEXT_PREVIEW_BYPASS_COOKIE = '__prerender_bypass';
const NEXT_PREVIEW_DATA_COOKIE = '__next_preview_data';

/** Strip leading/trailing slashes and split path segments (locale-agnostic). */
export function pathSegmentsFromPathname(pathname: string): string[] {
  return pathname
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean);
}

export function isBcRegisterPath(path?: string[]): boolean {
  const segment = path?.[0];
  return path?.length === 1 && typeof segment === 'string' && segment.toLowerCase() === 'register';
}

/** `/Portal` and any descendant require Auth0 login. */
export function isBcPortalPath(path?: string[]): boolean {
  const segment = path?.[0];
  return typeof segment === 'string' && segment.toLowerCase() === BC_PORTAL_SEGMENT;
}

function hasNextPreviewCookies(req: NextRequest): boolean {
  return (
    req.cookies.has(NEXT_PREVIEW_BYPASS_COOKIE) || req.cookies.has(NEXT_PREVIEW_DATA_COOKIE)
  );
}

/**
 * True when XM Cloud Pages / Design Library / Next preview is loading the page.
 * Matches KPMG `skipAuthRouting: draft.isEnabled` — editing render redirects to `/Portal`
 * with preview cookies but without `mode=edit` on the internal request URL.
 */
export function shouldSkipBcAuthRouting(req: NextRequest): boolean {
  // Content SDK editing render server-side fetch of the page route
  if (req.headers.get(SITECORE_EDITING_PARAMS_HEADER)) {
    return true;
  }

  // Preview mode cookies from EditingRenderMiddleware → setPreviewData → internal /Portal fetch
  if (hasNextPreviewCookies(req)) {
    return true;
  }

  const params = req.nextUrl.searchParams;
  const mode = (params.get('mode') || params.get('sc_mode') || '').toLowerCase();

  if (mode === 'edit' || mode === 'preview' || mode === 'shared') {
    return true;
  }

  if (params.has('itemId') && params.has('site')) {
    return true;
  }

  if (params.has('layoutKind') || params.has('sc_layoutKind')) {
    return true;
  }

  if (
    params.has('sc_itemid') ||
    params.has('sc_mode') ||
    params.has('sc_site') ||
    params.has('sc_lang') ||
    params.has('sc_version') ||
    params.has('sc_horizon') ||
    params.has('sc_rend')
  ) {
    return true;
  }

  const editingSecret = process.env.SITECORE_EDITING_SECRET;
  const secret = params.get('secret') || params.get('sc_apikey');
  if (editingSecret && secret && secret === editingSecret) {
    return true;
  }

  const referer = req.headers.get('referer') || '';
  if (
    /pages\.sitecorecloud\.io/i.test(referer) ||
    /pages\.sitecore\.com/i.test(referer) ||
    /sitecorecloud\.io\/pages/i.test(referer)
  ) {
    return true;
  }

  if (
    req.headers.get('x-sitecore-editing-mode') ||
    req.headers.get('x-sc-editing') ||
    req.headers.get('sc_editmode')
  ) {
    return true;
  }

  return false;
}

/** @deprecated Prefer shouldSkipBcAuthRouting — kept for call-site clarity. */
export function isSitecorePagesEditorRequest(req: NextRequest): boolean {
  return shouldSkipBcAuthRouting(req);
}

/**
 * When anonymous users hit a protected Portal path, return a login URL with returnTo.
 * Returns null when access should proceed (public path, logged in, or editing).
 */
export function resolveBcAuthRedirect(options: {
  pathname: string;
  isLoggedIn: boolean;
  skipAuthRouting: boolean;
}): string | null {
  const { pathname, isLoggedIn, skipAuthRouting } = options;

  if (skipAuthRouting || isLoggedIn) {
    return null;
  }

  const path = pathSegmentsFromPathname(pathname);
  if (!isBcPortalPath(path)) {
    return null;
  }

  return buildLoginUrl(pathname || '/Portal');
}
