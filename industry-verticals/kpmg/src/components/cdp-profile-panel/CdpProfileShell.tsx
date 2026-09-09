'use client';

import type { JSX } from 'react';
import { CdpProfilePanel } from '@/components/cdp-profile-panel/CdpProfilePanel';
import { CdpPageViewTracker } from '@/components/cdp-profile-panel/CdpPageViewTracker';

/**
 * Global CDP engagement tools (Cloud SDK only — no REST API env vars).
 */
export default function CdpProfileShell(): JSX.Element {
  return (
    <>
      <CdpPageViewTracker />
      <CdpProfilePanel />
    </>
  );
}
