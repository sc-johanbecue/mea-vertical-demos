'use client';
import React from 'react';
import { Auth0Provider } from '@auth0/nextjs-auth0/client';
import { Page, SitecoreProvider } from '@sitecore-content-sdk/nextjs';
import type { User } from '@auth0/nextjs-auth0/types';
import scConfig from 'sitecore.config';
import components from '.sitecore/component-map.client';
import { CdpAuth0IdentityTracker } from '@/components/cdp-profile-panel/CdpAuth0IdentityTracker';

const KPMG_PROFILE_ROUTE = '/api/kpmg-beyond/profile';

export default function Providers({
  children,
  page,
  user,
}: {
  children: React.ReactNode;
  page: Page;
  user?: User | null;
}) {
  return (
    <Auth0Provider user={user ?? undefined} profileRoute={KPMG_PROFILE_ROUTE}>
      <CdpAuth0IdentityTracker />
      <SitecoreProvider
        api={scConfig.api}
        componentMap={components}
        page={page}
        loadImportMap={() => import('.sitecore/import-map.client')}
      >
        {children}
      </SitecoreProvider>
    </Auth0Provider>
  );
}
