'use client';

import {
  ComponentPropsCollection,
  ComponentPropsContext,
  Page,
  SitecoreProvider,
} from '@sitecore-content-sdk/nextjs';
import { Auth0Provider } from '@auth0/nextjs-auth0/client';
import components from '.sitecore/component-map';
import scConfig from 'sitecore.config';

const Providers = ({
  children,
  componentProps,
  page,
}: {
  children: React.ReactNode;
  componentProps?: ComponentPropsCollection;
  page: Page;
}) => {
  return (
    <Auth0Provider>
      <ComponentPropsContext value={componentProps || {}}>
        <SitecoreProvider
          componentMap={components}
          api={scConfig.api}
          page={page}
          loadImportMap={() => import('.sitecore/import-map')}
        >
          {children}
        </SitecoreProvider>
      </ComponentPropsContext>
    </Auth0Provider>
  );
};

export default Providers;
