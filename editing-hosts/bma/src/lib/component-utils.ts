import { useEffect, useState } from 'react';
import { ComponentProps } from '@/lib/component-props';

/** Stable React key for Sitecore placeholder siblings. */
export function componentKey(props: ComponentProps): string {
  return props.params?.RenderingIdentifier ?? props.rendering?.uid ?? 'component';
}

/** Build dynamic placeholder key; chrome partial designs use id `1` when param is missing. */
export function dynamicPlaceholderKey(
  base: string,
  params?: { DynamicPlaceholderId?: string | number },
): string {
  const raw = params?.DynamicPlaceholderId;
  const id = raw === undefined || raw === null || String(raw).trim() === '' ? '1' : String(raw).trim();
  return `${base}-${id}`;
}

/**
 * True when a rendering has placeholder entries for `name`.
 * Also matches layout-service keys that use a full path suffix (e.g. `.../nav-children-8`).
 */
export function placeholderHasItems(
  rendering: { placeholders?: Record<string, unknown> } | undefined,
  name: string,
): boolean {
  const placeholders = rendering?.placeholders;
  if (!placeholders || !name) return false;

  const direct = placeholders[name];
  if (Array.isArray(direct) && direct.length > 0) return true;

  return Object.entries(placeholders).some(([key, entries]) => {
    if (!Array.isArray(entries) || entries.length === 0) return false;
    return key === name || key.endsWith(`/${name}`) || key.endsWith(`-${name}`) || key.endsWith(name);
  });
}

/**
 * True only after the client has hydrated. Use before localStorage or client-only markup.
 */
export function useClientMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/** Link field value shape from Sitecore (internal links often use url/id without href). */
export type LinkFieldValue = {
  href?: string;
  url?: string;
  id?: string;
  text?: string;
  linktype?: string;
};

/** Returns true when the link field has a usable target (href, url, or internal id). */
export function hasLink(hrefOrValue?: string | LinkFieldValue | null): boolean {
  if (hrefOrValue == null) return false;
  if (typeof hrefOrValue === 'string') {
    const trimmed = hrefOrValue.trim();
    return Boolean(trimmed && trimmed !== '' && trimmed !== '#');
  }
  const href = hrefOrValue.href?.toString().trim() ?? '';
  const url = hrefOrValue.url?.toString().trim() ?? '';
  const id = hrefOrValue.id?.toString().trim() ?? '';
  if (href && href !== '#') return true;
  if (url && url !== '#') return true;
  return Boolean(id);
}
