/**
 * Digital Experience Bank layout — mirrors original app-shell / main structure.
 */
import { JSX } from 'react';
import Head from 'next/head';
import { Placeholder, Field, DesignLibrary, Page } from '@sitecore-content-sdk/nextjs';
import Scripts from 'src/Scripts';
import SitecoreStyles from 'src/components/content-sdk/SitecoreStyles';

interface LayoutProps {
  page: Page;
}

interface RouteFields {
  [key: string]: unknown;
  Title?: Field;
}

const Layout = ({ page }: LayoutProps): JSX.Element => {
  const { layout, mode } = page;
  const { route } = layout.sitecore;
  const fields = route?.fields as RouteFields;
  const mainClassPageEditing = mode.isEditing ? 'editing-mode' : 'prod-mode';

  return (
    <>
      <Scripts />
      <SitecoreStyles layoutData={layout} />
      <Head>
        <title>{fields?.Title?.value?.toString() || 'Digital Experience Bank'}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={`app-shell ${mainClassPageEditing}`.trim()}>
        {mode.isDesignLibrary ? (
          <DesignLibrary />
        ) : (
          <>
            {route && <Placeholder name="headless-header" rendering={route} />}
            <main>{route && <Placeholder name="headless-main" rendering={route} />}</main>
            {route && <Placeholder name="headless-footer" rendering={route} />}
            <div id="cookie-consent" className="layout-cookie" aria-live="polite">
              {route && <Placeholder name="headless-cookie" rendering={route} />}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Layout;
