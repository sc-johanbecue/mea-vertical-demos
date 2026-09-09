'use client';

import { usePathname } from 'next/navigation';
import { useEffect, type JSX } from 'react';
import { recordPageView } from '@/lib/cdp/cdp-session-tracker';

/** Records page views for the CDP engagement panel (Cloud SDK session tracker). */
export function CdpPageViewTracker(): JSX.Element | null {
  const pathname = usePathname();

  useEffect(() => {
    const path = pathname.split('?')[0] || '/';
    recordPageView(path);
  }, [pathname]);

  return null;
}
