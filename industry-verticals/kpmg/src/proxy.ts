import { NextFetchEvent, NextResponse, type NextRequest } from 'next/server';
import {
  defineProxy,
  AppRouterMultisiteProxy,
  PersonalizeProxy,
  RedirectsProxy,
  LocaleProxy,
  BotTrackingProxy,
  PreviewProxy,
} from '@sitecore-content-sdk/nextjs/proxy';
import sites from '.sitecore/sites.json';
import scConfig from 'sitecore.config';
import { routing } from './i18n/routing';
import client from './lib/sitecore-client';
import { auth0 } from './lib/auth0';

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

  const locale = new LocaleProxy({
    sites,
    locales: routing.locales.slice(),
    skip: () => false,
  });

  const multisite = new AppRouterMultisiteProxy({
    sites,
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

  return defineProxy(preview, botTracking, locale, multisite, redirects, personalize).exec(req);
}

function isSitecorePagesEditorRequest(req: NextRequest): boolean {
  const params = req.nextUrl.searchParams;
  const mode = params.get('mode');

  if (mode === 'edit' || mode === 'preview') {
    return true;
  }

  // Pages editor iframe loads the rendering host with item/site params (not always mode=edit on every sub-request).
  if (params.has('itemId') && params.has('site')) {
    return true;
  }

  if (params.has('layoutKind')) {
    return true;
  }

  return false;
}

function shouldRunAuth0Middleware(req: NextRequest): boolean {
  if (isSitecorePagesEditorRequest(req)) {
    return false;
  }

  // Only /auth/* needs the Auth0 middleware (login, callback, logout). Avoids OIDC discovery on every page view.
  return req.nextUrl.pathname.startsWith('/auth');
}

export async function proxy(req: NextRequest, event: NextFetchEvent) {
  if (!shouldRunAuth0Middleware(req)) {
    return runSitecoreProxy(req, event);
  }

  const authRes = await auth0.middleware(req);
  return authRes;
}

export const config = {
  matcher: [
    '/',
    '/((?!api/|sitemap|robots|_next/|healthz|sitecore/api/|-/|favicon.ico|sc_logo.svg).*)',
  ],
};
