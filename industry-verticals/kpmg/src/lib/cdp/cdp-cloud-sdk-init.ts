import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import '@sitecore-cloudsdk/events/browser';
import config from 'sitecore.config';

let initPromise: Promise<void> | null = null;

/**
 * Initializes the Sitecore Cloud SDK events package in the browser.
 * @see https://doc.sitecore.com/sdk/en/developers/006/cloud-sdk/set-up-identity-events.html
 */
export function ensureCloudSdkInitialized(
  siteName: string,
  options?: { skip?: boolean }
): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Cloud SDK can only be initialized in the browser'));
  }

  if (options?.skip) {
    return Promise.reject(new Error('Cloud SDK initialization skipped for this mode'));
  }

  const contextId = config.api.edge?.clientContextId;
  if (!contextId) {
    return Promise.reject(new Error('Client Edge API settings missing from configuration'));
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = Promise.resolve().then(() => {
    CloudSDK({
      sitecoreEdgeUrl: config.api.edge.edgeUrl,
      sitecoreEdgeContextId: contextId,
      siteName: siteName || config.defaultSite,
      enableBrowserCookie: true,
      cookieDomain: window.location.hostname.replace(/^www\./, ''),
    })
      .addEvents()
      .initialize();
  });

  return initPromise;
}
