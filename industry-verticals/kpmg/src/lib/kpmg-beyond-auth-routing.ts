export const KPMG_BEYOND_SITE = 'kpmgbeyond';
export const KPMG_BEYOND_HOMEPAGE_PATH = '/';
export const KPMG_BEYOND_JOIN_PATH = '/join';

/** Sitecore: /sitecore/content/kpmg/kpmgbeyond/Home/Dashboard */
export const KPMG_BEYOND_DASHBOARD_SEGMENTS = ['Dashboard'] as const;
export const KPMG_BEYOND_JOIN_SEGMENTS = ['join'] as const;

export function isKpmgBeyondHomepagePath(path?: string[]): boolean {
  return !path?.length;
}

export function isKpmgBeyondJoinPath(path?: string[]): boolean {
  const segment = path?.[0];
  return path?.length === 1 && typeof segment === 'string' && segment.toLowerCase() === 'join';
}

/** Paths reachable without an Auth0 session. */
export function isKpmgBeyondPublicPath(path?: string[]): boolean {
  return isKpmgBeyondHomepagePath(path) || isKpmgBeyondJoinPath(path);
}

/**
 * Rewrites Sitecore content paths for KPMG Beyond auth rules.
 * Logged-in users at `/` see Dashboard content while the URL stays `/`.
 */
export function resolveKpmgBeyondContentPath(
  path: string[] | undefined,
  isAuthenticated: boolean
): string[] {
  if (isAuthenticated && isKpmgBeyondHomepagePath(path)) {
    return [...KPMG_BEYOND_DASHBOARD_SEGMENTS];
  }

  return path ?? [];
}

/** Redirect anonymous visitors away from protected routes back to `/`. */
export function resolveKpmgBeyondAuthRedirect(options: {
  site: string;
  path?: string[];
  isLoggedIn: boolean;
  skipAuthRouting: boolean;
}): string | null {
  const { site, path, isLoggedIn, skipAuthRouting } = options;

  if (skipAuthRouting || site !== KPMG_BEYOND_SITE || isLoggedIn) {
    return null;
  }

  if (!isKpmgBeyondPublicPath(path)) {
    return KPMG_BEYOND_HOMEPAGE_PATH;
  }

  return null;
}
