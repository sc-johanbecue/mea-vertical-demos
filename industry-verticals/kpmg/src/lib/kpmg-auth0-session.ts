import { auth0 } from './auth0';
import { enrichAuth0SessionUser } from './auth0-enrich-user';
import { isKpmgAuth0AuthenticatedUser } from './kpmg-auth0-user';

export { isKpmgAuth0AuthenticatedUser };

/** Session with roles, entitlements, and communities merged from tokens and Management API. */
export async function getKpmgAuth0Session() {
  const session = await auth0.getSession();
  if (!session || !isKpmgAuth0AuthenticatedUser(session.user)) {
    return null;
  }

  return enrichAuth0SessionUser(session, session.tokenSet.idToken ?? null);
}
