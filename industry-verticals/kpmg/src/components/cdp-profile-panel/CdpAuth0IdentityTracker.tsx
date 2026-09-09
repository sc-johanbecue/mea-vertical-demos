'use client';

import { useEffect, useRef } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import config from 'sitecore.config';
import { ensureCloudSdkInitialized } from '@/lib/cdp/cdp-cloud-sdk-init';
import { clearAuth0IdentityMarker, identifyAuth0User } from '@/lib/cdp/cdp-identity';
import { isKpmgAuth0AuthenticatedUser } from '@/lib/kpmg-auth0-user';

/**
 * Sends a Cloud SDK identity event when an Auth0 session is present.
 * Mounted inside Auth0Provider (see Providers.tsx).
 */
export function CdpAuth0IdentityTracker(): null {
  const { user, isLoading } = useUser();
  const inFlightRef = useRef(false);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isKpmgAuth0AuthenticatedUser(user)) {
      clearAuth0IdentityMarker();
      return;
    }

    if (inFlightRef.current) {
      return;
    }

    inFlightRef.current = true;
    void ensureCloudSdkInitialized(config.defaultSite)
      .then(() => identifyAuth0User(user))
      .catch((error) => {
        console.error('[CDP] Auth0 identity failed:', error);
      })
      .finally(() => {
        inFlightRef.current = false;
      });
  }, [user, isLoading]);

  return null;
}
