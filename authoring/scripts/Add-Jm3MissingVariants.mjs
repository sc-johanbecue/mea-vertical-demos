#!/usr/bin/env node
/**
 * Adds missing Headless Variant YAML files for jm3site (ImageBottom, Carousel).
 * Run from repo root: node authoring/scripts/Add-Jm3MissingVariants.mjs
 */
import { createHash } from 'node:crypto';
import { mkdir, writeFile, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const VARIANTS_ROOT = join(
  ROOT,
  'items/JM3Collection/serialized-content/jm3site/jm3site/Presentation/Headless Variants',
);

const SORT = {
  Default: 100,
  Inversed: 200,
  ImageTop: 300,
  ImageBottom: 350,
  PanelText: 275,
  PanelImage: 285,
  Animated: 400,
  Carousel: 500,
};

const TO_ADD = [
  ['Header', 'ImageBottom'],
  ['Footer', 'ImageBottom'],
  ['FullBleedHeroBannerSection', 'ImageBottom'],
  ['HeroSlideCard', 'ImageBottom'],
  ['HorizontalLinkCard', 'ImageBottom'],
  ['ImageRichTextSection', 'ImageBottom'],
  ['VerticalTeaserCard', 'ImageBottom'],
  ['TitleDescriptionLinkGridSection', 'Carousel'],
  ['TitleDescriptionTeaserGridSection', 'Carousel'],
  ['TitleStatsBarSection', 'Carousel'],
];

function stableGuid(seed) {
  const hash = createHash('md5').update(`jm3-${seed}`, 'utf8').digest();
  hash[6] = (hash[6] & 0x0f) | 0x40;
  hash[8] = (hash[8] & 0x3f) | 0x80;
  const hex = hash.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

async function folderId(componentName) {
  const folderYml = join(VARIANTS_ROOT, `${componentName}.yml`);
  const { readFile } = await import('node:fs/promises');
  const text = await readFile(folderYml, 'utf8');
  const m = text.match(/^ID: "([^"]+)"/m);
  if (!m) throw new Error(`No folder ID for ${componentName}`);
  return m[1];
}

function variantYaml(componentName, variantName, id, parentId) {
  const sort = SORT[variantName] ?? 400;
  return `---
ID: "${id}"
Parent: "${parentId}"
Template: "4d50cdae-c2d9-4de8-b080-8f992bfb1b55"
Path: "/sitecore/content/jm3collection/jm3site/Presentation/Headless Variants/${componentName}/${variantName}"
SharedFields:
- ID: "ba3f86a2-4a1c-4d78-b63d-91c2779c1b5e"
  Hint: __Sortorder
  Value: ${sort}
Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
    - ID: "25bed78c-4957-4165-998a-ca1b52f67497"
      Hint: __Created
      Value: 20260616T120000Z
    - ID: "52807595-0f8f-4b20-8d2a-cb71d28c6103"
      Hint: __Owner
      Value: |
        sitecore\\johan.becue@sitecore.com
    - ID: "5dd74568-4d4b-44c1-b513-0af5f4cda34f"
      Hint: __Created by
      Value: |
        sitecore\\johan.becue@sitecore.com
    - ID: "8cdc337e-a112-42fb-bbb4-4143751e123f"
      Hint: __Revision
      Value: "${id}"
    - ID: "badd9cf9-53e0-4d0c-bcc0-2d784c282f6a"
      Hint: __Updated by
      Value: |
        sitecore\\johan.becue@sitecore.com
    - ID: "d9cf14b1-fa16-4ba6-9288-e8a174d4d522"
      Hint: __Updated
      Value: 20260616T120000Z
`;
}

async function main() {
  for (const [component, variant] of TO_ADD) {
    const path = join(VARIANTS_ROOT, component, `${variant}.yml`);
    try {
      await access(path);
      console.log('skip (exists)', path);
      continue;
    } catch {
      /* create */
    }
    const parentId = await folderId(component);
    const id = stableGuid(`${component}-variant-${variant}`);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, variantYaml(component, variant, id, parentId), 'utf8');
    console.log('created', component, variant, id);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
