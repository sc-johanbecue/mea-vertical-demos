'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import { buildLoginUrl } from '@/lib/kpmg-auth0-profile';
import { isKpmgAuth0AuthenticatedUser } from '@/lib/kpmg-auth0-user';

export function useKpmgBeyondProfileNavigation(profilePath = '/profile') {
  const router = useRouter();
  const { user, isLoading } = useUser();

  const openProfile = useCallback(() => {
    if (isLoading) {
      return;
    }

    if (!isKpmgAuth0AuthenticatedUser(user)) {
      window.location.assign(buildLoginUrl(profilePath));
      return;
    }

    router.push(profilePath);
  }, [isLoading, profilePath, router, user]);

  const authenticatedUser = isKpmgAuth0AuthenticatedUser(user) ? user : null;

  const logoutUrl = '/auth/logout';

  return { isLoading, logoutUrl, openProfile, user: authenticatedUser };
}
