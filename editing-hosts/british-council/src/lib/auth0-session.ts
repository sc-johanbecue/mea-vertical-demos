import type { IncomingMessage } from 'http';
import type { NextRequest } from 'next/server';
import { auth0 } from './auth0';
import { enrichAuth0SessionUser } from './auth0-enrich-user';
import { isAuth0AuthenticatedUser } from './auth0-user';

export { isAuth0AuthenticatedUser };

type Auth0SessionRequest = IncomingMessage | NextRequest;

/** Session with roles and entitlements merged from tokens and Management API. */
export async function getAuth0Session(req?: Auth0SessionRequest) {
  const session = req ? await auth0.getSession(req) : await auth0.getSession();
  if (!session || !isAuth0AuthenticatedUser(session.user)) {
    return null;
  }

  return enrichAuth0SessionUser(session, session.tokenSet.idToken ?? null);
}
