import { NextFetchEvent, NextResponse, type NextRequest } from 'next/server';
import {
  defineProxy,
  MultisiteProxy,
  PersonalizeProxy,
  RedirectsProxy,
  BotTrackingProxy,
  PreviewProxy,
} from '@sitecore-content-sdk/nextjs/proxy';
import sites from '.sitecore/sites.json';
import scConfig from 'sitecore.config';
import client from 'lib/sitecore-client';
import { auth0 } from 'lib/auth0';
import { isAuth0AuthenticatedUser } from 'lib/auth0-user';
import {
  isBcPortalPath,
  pathSegmentsFromPathname,
  resolveBcAuthRedirect,
  shouldSkipBcAuthRouting,
} from 'lib/bc-auth-routing';

async function runSitecoreProxy(req: NextRequest, event: NextFetchEvent): Promise<NextResponse> {
  const preview = new PreviewProxy({
    client: client,
    ...scConfig.api.edge,
  });

  const botTracking = new BotTrackingProxy({
    ...scConfig.api.edge,
    sites,
    fetchEvent: event,
  });

  const multisite = new MultisiteProxy({
    sites,
    ...scConfig.api.edge,
    ...scConfig.multisite,
    skip: () => false,
  });

  const redirects = new RedirectsProxy({
    sites,
    ...scConfig.api.edge,
    ...scConfig.api.local,
    ...scConfig.redirects,
    skip: () => false,
  });

  const personalize = new PersonalizeProxy({
    sites,
    ...scConfig.api.edge,
    ...scConfig.personalize,
    skip: () => false,
  });

  return defineProxy(preview, botTracking, multisite, redirects, personalize).exec(req);
}

function isAuth0Configured(): boolean {
  return Boolean(
    process.env.AUTH0_DOMAIN &&
      process.env.AUTH0_CLIENT_ID &&
      process.env.AUTH0_CLIENT_SECRET &&
      process.env.AUTH0_SECRET &&
      process.env.APP_BASE_URL
  );
}

function shouldRunAuth0Middleware(req: NextRequest): boolean {
  // Never run Auth0 for XM Cloud Pages / Design Library / Next preview (KPMG pattern).
  if (shouldSkipBcAuthRouting(req)) {
    return false;
  }

  if (!isAuth0Configured()) {
    return false;
  }

  return req.nextUrl.pathname.startsWith('/auth');
}

/**
 * Portal login gate for anonymous visitors.
 * Skipped for Pages editing: EditingRenderMiddleware setPreviewData then server-fetches
 * `/Portal` with preview cookies + `x-sitecore-editing-params` (no mode=edit on that URL).
 * Entitlement/role Sitecore fields are not evaluated here.
 */
async function maybeRedirectAnonymousPortal(req: NextRequest): Promise<NextResponse | null> {
  if (shouldSkipBcAuthRouting(req)) {
    return null;
  }

  if (!isAuth0Configured()) {
    return null;
  }

  const path = pathSegmentsFromPathname(req.nextUrl.pathname);
  if (!isBcPortalPath(path)) {
    return null;
  }

  try {
    const session = await auth0.getSession(req);
    const isLoggedIn = isAuth0AuthenticatedUser(session?.user);
    const authRedirect = resolveBcAuthRedirect({
      pathname: req.nextUrl.pathname,
      isLoggedIn,
      skipAuthRouting: false,
    });

    if (authRedirect) {
      return NextResponse.redirect(new URL(authRedirect, req.nextUrl.origin));
    }
  } catch (error) {
    console.warn('[BC Auth0] Portal session check skipped:', error);
  }

  return null;
}

export default async function proxy(req: NextRequest, event: NextFetchEvent) {
  if (shouldRunAuth0Middleware(req)) {
    return auth0.middleware(req);
  }

  const portalRedirect = await maybeRedirectAnonymousPortal(req);
  if (portalRedirect) {
    return portalRedirect;
  }

  return runSitecoreProxy(req, event);
}

export const config = {
  /*
   * Match all paths except for:
   * 1. /api routes (includes /api/editing/render)
   * 2. /_next (Next.js internals)
   * 3. /sitecore/api (Sitecore API routes)
   * 4. /- (Sitecore media)
   * 5. /healthz (Health check)
   */
  matcher: ['/', '/((?!api/|_next/|healthz|sitecore/api/|-/|favicon.ico|sc_logo.svg).*)'],
};
