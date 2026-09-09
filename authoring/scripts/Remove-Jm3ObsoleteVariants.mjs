#!/usr/bin/env node
/**
 * Removes Headless Variant YAML files that no longer match TSX exports.
 * Run: node authoring/scripts/Remove-Jm3ObsoleteVariants.mjs
 */
import { readdirSync, unlinkSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const VARIANTS_ROOT = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'items/JM3Collection/serialized-content/jm3site/jm3site/Presentation/Headless Variants',
);

/** Must match Generate-Jm3Components.mjs COMPONENTS[].variants */
const EXPECTED = {
  CookieBanner: ['Default', 'Inversed', 'Animated'],
  Header: ['Default', 'Inversed', 'ImageTop', 'ImageBottom', 'Animated'],
  Navigation: ['Default', 'Animated'],
  Footer: ['Default', 'Inversed', 'ImageTop', 'ImageBottom', 'Animated'],
  LinkList: ['Default', 'Animated'],
  FullBleedHeroBannerSection: ['Default', 'Inversed', 'Animated'],
  CompositeHeroBandSection: ['Default', 'Animated'],
  HeroSlideCard: ['Default', 'Inversed', 'ImageTop', 'ImageBottom', 'Animated'],
  HeroPanelCard: ['Default', 'Animated'],
  HeroStatsPanel: ['Default', 'Animated'],
  EyebrowTitleCarouselSection: ['Default', 'Animated'],
  FeatureCarouselCard: ['Default', 'Animated'],
  TitleDescriptionLinkGridSection: ['Default', 'Animated', 'Carousel'],
  HorizontalLinkCard: ['Default', 'Inversed', 'ImageTop', 'ImageBottom', 'Animated'],
  TitleDescriptionTeaserGridSection: ['Default', 'ImageTop', 'Animated', 'Carousel'],
  VerticalTeaserCard: [
    'Default',
    'Inversed',
    'ImageTop',
    'ImageBottom',
    'PanelImage',
    'PanelText',
    'Animated',
  ],
  TitleStatsBarSection: ['Default', 'Animated', 'Carousel'],
  ImageRichTextSection: ['Default', 'Inversed', 'ImageTop', 'ImageBottom', 'Animated'],
  TitleDescriptionCtaSection: ['Default', 'Animated'],
  TitleDescriptionVideoSection: ['Default', 'Inversed', 'Animated'],
  StatsItem: ['Default', 'Animated'],
};

let removed = 0;
for (const [component, allowed] of Object.entries(EXPECTED)) {
  const dir = join(VARIANTS_ROOT, component);
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    console.warn('missing folder', component);
    continue;
  }
  const allowedSet = new Set(allowed);
  for (const name of entries) {
    if (!name.endsWith('.yml')) continue;
    const variant = name.replace(/\.yml$/, '');
    if (allowedSet.has(variant)) continue;
    const path = join(dir, name);
    unlinkSync(path);
    console.log('removed', `${component}/${variant}`);
    removed += 1;
  }
}

console.log(`Done. Removed ${removed} obsolete variant file(s).`);
