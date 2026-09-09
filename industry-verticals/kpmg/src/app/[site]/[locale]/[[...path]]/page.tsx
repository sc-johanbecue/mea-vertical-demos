import { LayoutServicePageState } from '@sitecore-content-sdk/nextjs';
import { isDesignLibraryPreviewData } from '@sitecore-content-sdk/nextjs/editing';

const SITECORE_EDITING_PARAMS_HEADER = 'x-sitecore-editing-params';
import { notFound, redirect } from 'next/navigation';
import { draftMode, headers as nextHeaders } from 'next/headers';
import client from 'src/lib/sitecore-client';
import {
  resolveKpmgBeyondAuthRedirect,
  resolveKpmgBeyondContentPath,
} from 'src/lib/kpmg-beyond-auth-routing';
import { getKpmgAuth0Session, isKpmgAuth0AuthenticatedUser } from 'src/lib/kpmg-auth0-session';
import { buildLoginUrl } from 'src/lib/kpmg-auth0-profile';
import Layout, { RouteFields } from 'src/Layout';
import Providers from 'src/Providers';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

type PageProps = {
  params: Promise<{ site: string; locale: string; path?: string[]; [key: string]: string | string[] | undefined }>;
};

export default async function Page({ params }: PageProps) {
  const { site, locale, path } = await params;

  // Set site and locale to be available in src/i18n/request.ts for fetching the dictionary
  setRequestLocale(`${site}_${locale}`);

  const draft = await draftMode();
  const session = await getKpmgAuth0Session();
  const isAuthenticated = isKpmgAuth0AuthenticatedUser(session?.user);
  const authRedirect = resolveKpmgBeyondAuthRedirect({
    site,
    path,
    isLoggedIn: isAuthenticated,
    skipAuthRouting: draft.isEnabled,
  });

  if (authRedirect) {
    redirect(authRedirect);
  }

  const contentPath = resolveKpmgBeyondContentPath(path, isAuthenticated);

  // Fetch the page data from Sitecore
  let page;
  if (draft.isEnabled) {
    const headers = await nextHeaders();
    const previewData = client.getPreviewData(headers);

    if (isDesignLibraryPreviewData(previewData)) {
      page = await client.getDesignLibraryData(previewData);
    } else {
      const editingPreview =
        previewData && typeof previewData === 'object' && 'mode' in previewData
          ? (previewData as { mode?: string })
          : undefined;
      const isPreviewMode = editingPreview?.mode === LayoutServicePageState.Preview;
      const isEditingRenderRequest = Boolean(headers.get(SITECORE_EDITING_PARAMS_HEADER));
      // Sitecore /api/editing/render fetches HTML server-side; it cannot complete an Auth0 redirect flow.
      if (isPreviewMode && !isAuthenticated && !isEditingRenderRequest) {
        const pathSuffix = path?.length ? `/${path.join('/')}` : '';
        redirect(buildLoginUrl(pathSuffix || '/'));
      }
      page = await client.getPreview(previewData);
    }
  } else {
    page = await client.getPage(contentPath, { site, locale });
  }

  // If the page is not found, return a 404
  if (!page) {
    notFound();
  }

  return (
    <NextIntlClientProvider>
      <Providers page={page} user={session?.user ?? undefined}>
        <Layout page={page} />
      </Providers>
    </NextIntlClientProvider>
  );
}

// Metadata fields for the page.
export const generateMetadata = async ({ params }: PageProps) => {
  const { path, site, locale } = await params;
  const draft = await draftMode();
  const session = await getKpmgAuth0Session();
  const isAuthenticated = isKpmgAuth0AuthenticatedUser(session?.user);
  const authRedirect = resolveKpmgBeyondAuthRedirect({
    site,
    path,
    isLoggedIn: isAuthenticated,
    skipAuthRouting: draft.isEnabled,
  });

  if (authRedirect) {
    redirect(authRedirect);
  }

  const contentPath = resolveKpmgBeyondContentPath(path, isAuthenticated);

  // The same call as for rendering the page. Should be cached by default react behavior
  const page = await client.getPage(contentPath, { site, locale });
  return {
    title: (page?.layout.sitecore.route?.fields as RouteFields)?.Title?.value?.toString() || 'Page',
  };
};
