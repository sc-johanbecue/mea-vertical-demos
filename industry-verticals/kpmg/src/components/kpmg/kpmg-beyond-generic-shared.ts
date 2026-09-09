import type { ImageField, LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { buildLoginUrl } from '@/lib/kpmg-auth0-profile';

export const KPMG_BEYOND_JOIN_PATH = '/join';

export function fieldText(field: TextField | undefined, fallback = ''): string {
  return field?.value?.toString().trim() || fallback;
}

export function linkHref(field: LinkField | undefined, fallback = ''): string {
  const href = field?.value?.href?.trim();
  return href || fallback;
}

export function linkText(field: LinkField | undefined, fallback = ''): string {
  const text = field?.value?.text?.toString().trim();
  return text || fallback;
}

export function imageSrc(field: ImageField | undefined): string {
  return field?.value?.src?.trim() || '';
}

export function imageAlt(field: ImageField | undefined, fallback = ''): string {
  const alt = field?.value?.alt;
  if (typeof alt === 'string' && alt.trim()) {
    return alt.trim();
  }
  return fallback;
}

export function fileSrc(field: LinkField | ImageField | undefined): string {
  const value = field?.value as { src?: string; href?: string } | undefined;
  if (!value) {
    return '';
  }
  return value.src?.trim() || value.href?.trim() || '';
}

export function joinHref(field: LinkField | undefined): string {
  return linkHref(field, KPMG_BEYOND_JOIN_PATH);
}

export function loginHref(field: LinkField | undefined): string {
  return linkHref(field, buildLoginUrl('/home'));
}

export type GenericCtaVariant = 'solid' | 'outline';

export function genericCtaClassName(variant: GenericCtaVariant, className = ''): string {
  const base =
    'inline-flex min-h-[48px] items-center justify-center rounded-full px-8 py-3 text-base font-semibold no-underline transition-opacity hover:opacity-90';
  const variantClass =
    variant === 'solid'
      ? 'bg-kpmg-purple text-white'
      : 'border border-white/40 bg-transparent text-white hover:bg-white/10';
  return [base, variantClass, className].filter(Boolean).join(' ');
}
