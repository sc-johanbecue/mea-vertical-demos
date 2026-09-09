'use client';

import dynamic from 'next/dynamic';
import type { JSX } from 'react';

const CdpProfileShell = dynamic(() => import('./CdpProfileShell'), { ssr: false });

/** Client-only loader for CDP engagement tools (App Router). */
export function CdpProfileShellLoader(): JSX.Element {
  return <CdpProfileShell />;
}
