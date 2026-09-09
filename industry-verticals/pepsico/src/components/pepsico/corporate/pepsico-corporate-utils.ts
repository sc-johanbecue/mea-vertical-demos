import type { TextField } from '@sitecore-content-sdk/nextjs';
import type { PepsiCoWordColor } from './pepsico-corporate-tokens';

export function parsePipeList(raw: TextField | undefined): string[] {
  const v = String(raw?.value ?? '').trim();
  if (!v) return [];
  return v
    .split(/\|/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function parseWordColor(raw: TextField | undefined): PepsiCoWordColor {
  const v = String(raw?.value ?? 'blue')
    .trim()
    .toLowerCase();
  if (v === 'green' || v === 'yellow' || v === 'peach' || v === 'orange') return v;
  return 'blue';
}

export function normalizeTabKey(label: string): string {
  return label.trim().toLowerCase().replace(/\s+/g, '-');
}
