import type { User } from '@auth0/nextjs-auth0/types';

/** True only after a successful Auth0 login (requires a stable Auth0 subject). */
export function isKpmgAuth0AuthenticatedUser(user: User | null | undefined): user is User {
  return Boolean(typeof user?.sub === 'string' && user.sub.trim());
}
