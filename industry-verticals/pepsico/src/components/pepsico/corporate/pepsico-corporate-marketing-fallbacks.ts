import type { ComponentRendering } from '@sitecore-content-sdk/nextjs';

/**
 * Demo fallbacks inspired by the public marketing IA at https://www.pepsico.com/
 * Used when serialized navigation / link lists / tiles are not yet in Experience Edge.
 */
export const PEPSICO_MARKETING_SITE = 'https://www.pepsico.com';

export const PEPSICO_CORPORATE_MAIN_NAV: ReadonlyArray<{ label: string; href: string }> = [
  { label: 'About', href: `${PEPSICO_MARKETING_SITE}/about` },
  { label: 'Innovation', href: `${PEPSICO_MARKETING_SITE}/innovation` },
  { label: 'Brands', href: `${PEPSICO_MARKETING_SITE}/brands` },
  { label: 'Partners', href: `${PEPSICO_MARKETING_SITE}/partners` },
  { label: 'Investors', href: `${PEPSICO_MARKETING_SITE}/investors` },
  { label: 'News & Media', href: `${PEPSICO_MARKETING_SITE}/news` },
  { label: 'Careers', href: `${PEPSICO_MARKETING_SITE}/careers` },
];

export const PEPSICO_FOOTER_COLUMNS: ReadonlyArray<{
  title: string;
  links: ReadonlyArray<{ label: string; href: string }>;
}> = [
  {
    title: 'About PepsiCo',
    links: [
      { label: 'About us', href: `${PEPSICO_MARKETING_SITE}/about` },
      { label: 'Our Brands', href: `${PEPSICO_MARKETING_SITE}/brands` },
      { label: 'Investors', href: `${PEPSICO_MARKETING_SITE}/investors` },
      { label: 'News', href: `${PEPSICO_MARKETING_SITE}/news` },
      { label: 'Sustainability', href: `${PEPSICO_MARKETING_SITE}/sustainability` },
      { label: 'Careers', href: `${PEPSICO_MARKETING_SITE}/careers` },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'PepsiCo Product Facts', href: `${PEPSICO_MARKETING_SITE}/nutrition/product-facts` },
      { label: 'PepsiCo Partners', href: 'https://www.pepsicopartners.com/' },
      { label: 'Contact', href: `${PEPSICO_MARKETING_SITE}/contact` },
      { label: 'Terms of Use', href: `${PEPSICO_MARKETING_SITE}/terms` },
      { label: 'Privacy Policy', href: `${PEPSICO_MARKETING_SITE}/privacy-policy` },
    ],
  },
];

/** Stock photography — not PepsiCo-owned media; for layout demo only. */
export const PEPSICO_DEMO_HERO_IMAGE =
  'https://images.unsplash.com/photo-1504674900240-87b2e29c71b5?auto=format&fit=crop&w=2000&q=80';

export const PEPSICO_DEMO_BRAND_SLIDES: ReadonlyArray<{
  category: 'food' | 'drink' | 'nutrition' | 'all';
  productSrc: string;
  brandLabel: string;
  href: string;
}> = [
  {
    category: 'food',
    productSrc:
      'https://images.unsplash.com/photo-1566478989037-eec20c1ab75d?auto=format&fit=crop&w=800&q=80',
    brandLabel: 'Snacks',
    href: `${PEPSICO_MARKETING_SITE}/brands`,
  },
  {
    category: 'drink',
    productSrc:
      'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80',
    brandLabel: 'Beverages',
    href: `${PEPSICO_MARKETING_SITE}/brands`,
  },
  {
    category: 'nutrition',
    productSrc:
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80',
    brandLabel: 'Nutrition',
    href: `${PEPSICO_MARKETING_SITE}/nutrition`,
  },
];

export type WordStripEntry =
  | { kind: 'word'; text: string; color: 'blue' | 'green' | 'yellow' | 'peach' | 'orange' }
  | { kind: 'image'; src: string; alt: string };

export const PEPSICO_DEMO_WORD_STRIP: ReadonlyArray<WordStripEntry> = [
  { kind: 'word', text: 'AHHH', color: 'blue' },
  {
    kind: 'image',
    src: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=200&h=200&fit=crop',
    alt: 'People enjoying food',
  },
  { kind: 'word', text: 'SNAP', color: 'green' },
  { kind: 'word', text: 'SUSTAIN', color: 'blue' },
  {
    kind: 'image',
    src: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=200&h=200&fit=crop',
    alt: 'Ingredients and agriculture',
  },
  { kind: 'word', text: 'SIP', color: 'yellow' },
  { kind: 'word', text: 'SAVOR', color: 'peach' },
  {
    kind: 'image',
    src: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop',
    alt: 'Fresh food',
  },
  { kind: 'word', text: 'SMILES', color: 'green' },
];

export function renderingPlaceholderHasContent(
  rendering: ComponentRendering | undefined,
  placeholderName: string
): boolean {
  const list = rendering?.placeholders?.[placeholderName];
  return Array.isArray(list) && list.length > 0;
}
