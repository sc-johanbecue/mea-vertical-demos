'use client';
import { useEffect, JSX } from 'react';
import { ensureCloudSdkInitialized } from '@/lib/cdp/cdp-cloud-sdk-init';

const Bootstrap = ({
  siteName,
  isPreviewMode,
}: {
  siteName: string;
  isPreviewMode: boolean;
}): JSX.Element | null => {
  useEffect(() => {
    void ensureCloudSdkInitialized(siteName, { skip: isPreviewMode }).catch((error) => {
      if (isPreviewMode) {
        console.debug('Cloud SDK events are not initialized in edit and preview modes');
        return;
      }

      console.debug('Cloud SDK events init skipped:', error.message);
    });
  }, [siteName, isPreviewMode]);

  return null;
};

export default Bootstrap;
