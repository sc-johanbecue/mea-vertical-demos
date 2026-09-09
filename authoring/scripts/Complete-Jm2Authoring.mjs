#!/usr/bin/env node
/**
 * Completes Johnson Matthey 2 (jm2) authoring: English datasource YAML, pages, partial designs, media.
 * Usage: node authoring/scripts/Complete-Jm2Authoring.mjs
 */
import { createHash, randomUUID } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { mkdir, writeFile, readFile, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = join(__dirname, '..', '..');
const COLLECTION_FOLDER = join(__dirname, '..', 'items', 'Johnson Matthey 2');
const ROOT = join(COLLECTION_FOLDER, 'serialized-content');
const SITE_REL = 'jm2/jm2';
const SECTIONS = join(REPO, 'authoring', 'items', 'Axa Insurance2', 'design-screenshots', 'sections');
const SITE_PATH = '/sitecore/content/johnson-matthey-2/jm2';
const OWNER = 'sitecore\\johan.becue@sitecore.com';
const NOW = '20260615T120000Z';
const BASE_URL = 'https://matthey.com';
const MODULE_NAMESPACE = 'johnson-matthey-2-scs';

const DEVICE_ID = 'FE5D7FDF-89C0-4D99-9AA3-B5FBD009C9F3';
const PAGE_TEMPLATE_ID = 'cd7fa85a-f3b7-492b-99a1-a6eee9878ffb';
const PARTIAL_DESIGN_TEMPLATE = 'fd2059fd-6043-4dfe-8c04-e2437ce87634';
const PAGE_DESIGN_TEMPLATE = '1105b8f8-1e00-426b-bf1f-c840742d827b';
const PAGE_TITLE_FIELD = '5e52319c-cb94-41a4-9a9a-95703035b99d';
const NAV_TITLE_FIELD = '4e0720e9-9d50-4ddc-87cf-ecd65e8e94c8';

const HOME_ID = 'd990e4cc-264b-4dbb-a3ef-444b2eeddf92';
const SITE_ID = 'f9474c64-06f9-4467-8509-bedd59bfaa0e';
const PARTIAL_DESIGNS_FOLDER = 'e0bbf871-b517-4a84-8466-dde6a5fceb19';
const PARTIAL_DESIGN_PH_FOLDER = '963d1ab4-d0d2-4713-8021-e5a17b111f5a';
const PARTIAL_DESIGN_PH_SETTING_TEMPLATE = 'd2a6884c-04d5-4089-a64e-d27ca9d68d4c';
const PAGE_DESIGNS_FOLDER = '4664e88d-2178-43c1-a580-5808c5f6a3f9';
const MEDIA_ROOT_ID = '2f7f209f-6166-450e-b6ec-5e2b43f48dc1';
const MEDIA_ROOT_DISK = join(ROOT, 'media-library', 'johnson-matthey-2', 'jm2');
const SITE_MEDIA_PATH = '/sitecore/media library/Project/johnson-matthey-2/jm2';

const COMPONENT_META = [
  { name: 'CookieBanner', dataFolder: 'CookieBanners' },
  { name: 'Header', dataFolder: 'Headers', ph: 'header-nav', child: 'Navigation' },
  { name: 'Navigation', dataFolder: 'Navigations' },
  { name: 'Footer', dataFolder: 'Footers', ph: 'footer-links', child: 'LinkList' },
  { name: 'LinkList', dataFolder: 'LinkLists' },
  { name: 'FullBleedHeroBannerSection', dataFolder: 'FullBleedHeroBannerSections' },
  { name: 'CompositeHeroBandSection', dataFolder: 'CompositeHeroBandSections', ph: 'hero-slides', child: 'HeroSlideCard' },
  { name: 'HeroSlideCard', dataFolder: 'HeroSlideCards' },
  { name: 'HeroPanelCard', dataFolder: 'HeroPanelCards' },
  { name: 'HeroStatsPanel', dataFolder: 'HeroStatsPanels' },
  { name: 'EyebrowTitleCarouselSection', dataFolder: 'EyebrowTitleCarouselSections', ph: 'carousel-slides', child: 'FeatureCarouselCard' },
  { name: 'FeatureCarouselCard', dataFolder: 'FeatureCarouselCards' },
  { name: 'TitleDescriptionLinkGridSection', dataFolder: 'TitleDescriptionLinkGridSections', ph: 'link-cards', child: 'HorizontalLinkCard' },
  { name: 'HorizontalLinkCard', dataFolder: 'HorizontalLinkCards' },
  { name: 'TitleDescriptionTeaserGridSection', dataFolder: 'TitleDescriptionTeaserGridSections', ph: 'teaser-cards', child: 'VerticalTeaserCard' },
  { name: 'VerticalTeaserCard', dataFolder: 'VerticalTeaserCards' },
  { name: 'TitleStatsBarSection', dataFolder: 'TitleStatsBarSections', ph: 'stats-items', child: 'StatsItem' },
  { name: 'StatsItem', dataFolder: 'StatsItems' },
  { name: 'TitleDescriptionCtaSection', dataFolder: 'TitleDescriptionCtaSections' },
  { name: 'ImageRichTextSection', dataFolder: 'ImageRichTextSections' },
  { name: 'FullBleedHeroBannerSection', dataFolder: 'FullBleedHeroBannerSections' },
];

const CMS_MAP = {
  HorizontalLinkCardGrid: 'homeHeroArea',
  JohnsonMattheyIsACtaBlock: 'cta',
  DevelopingTheFutureOfLinkGrid: 'developingPgms',
  ScienceAndInnovationHeroBanner: 'scienceHero',
  RichTextImageBlock: 'imageRichText',
  CoreTechnicalCapabilitiesUnderpinningTeaserGrid: 'coreCapabilities',
  CollaborativeInnovationForTheRichTextImageBlock: 'imageRichText',
  ExploreMoreTeaserGrid: 'exploreMore',
};

const DISPLAY_NAMES = {
  HorizontalLinkCardGrid: 'Home Hero',
  JohnsonMattheyIsACtaBlock: 'Johnson Matthey PGM Leader',
  DevelopingTheFutureOfLinkGrid: 'Developing The Future Of PGMs',
  ScienceAndInnovationHeroBanner: 'Science And Innovation Hero',
  RichTextImageBlock: 'Science And Innovation Intro',
  CoreTechnicalCapabilitiesUnderpinningTeaserGrid: 'Core Technical Capabilities',
  CollaborativeInnovationForTheRichTextImageBlock: 'Collaborative Innovation',
  ExploreMoreTeaserGrid: 'Explore More',
};

const ids = JSON.parse(await readFile(join(__dirname, 'jm2-component-ids.json'), 'utf8'));
const manifest = JSON.parse(await readFile(join(SECTIONS, 'manifest.json'), 'utf8'));
const dataFolderIds = {};
const mediaAssets = [];
const mediaUrlSet = new Set();
const datasourceRegistry = {};

function stableGuid(seed) {
  const hash = createHash('md5').update(`jm2-authoring-${seed}`, 'utf8').digest();
  hash[6] = (hash[6] & 0x0f) | 0x40;
  hash[8] = (hash[8] & 0x3f) | 0x80;
  const hex = hash.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function guidUpper(id) {
  return `{${id.toUpperCase()}}`;
}

function ownerBlock(indent = 8) {
  const pad = ' '.repeat(indent);
  return `|\n${pad}${OWNER}`;
}

function metaFields(revisionSeed, indent = 4) {
  const pad = ' '.repeat(indent);
  return `${pad}- ID: "25bed78c-4957-4165-998a-ca1b52f67497"
${pad}  Hint: __Created
${pad}  Value: ${NOW}
${pad}- ID: "52807595-0f8f-4b20-8d2a-cb71d28c6103"
${pad}  Hint: __Owner
${pad}  Value: ${ownerBlock(pad.length + 4)}
${pad}- ID: "5dd74568-4d4b-44c1-b513-0af5f4cda34f"
${pad}  Hint: __Created by
${pad}  Value: ${ownerBlock(pad.length + 4)}
${pad}- ID: "8cdc337e-a112-42fb-bbb4-4143751e123f"
${pad}  Hint: __Revision
${pad}  Value: "${stableGuid(revisionSeed)}"
${pad}- ID: "badd9cf9-53e0-4d0c-bcc0-2d784c282f6a"
${pad}  Hint: __Updated by
${pad}  Value: ${ownerBlock(pad.length + 4)}
${pad}- ID: "d9cf14b1-fa16-4ba6-9288-e8a174d4d522"
${pad}  Hint: __Updated
${pad}  Value: ${NOW}`;
}

function decodeHtml(s) {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripTags(html) {
  return decodeHtml(html.replace(/<[^>]+>/g, ' '));
}

function absUrl(href) {
  if (!href || href.startsWith('javascript')) return null;
  if (href.startsWith('http')) return href;
  return `${BASE_URL}${href.startsWith('/') ? '' : '/'}${href}`;
}

function trackMedia(url, alt = '') {
  const full = absUrl(url);
  if (!full || mediaUrlSet.has(full)) return;
  mediaUrlSet.add(full);
  mediaAssets.push({ Url: full, Alt: alt || 'Johnson Matthey' });
}

function linkField(text, href) {
  const url = absUrl(href);
  if (!url) return '';
  const safeText = (text || url).replace(/"/g, "'");
  return `<link text="${safeText}" linktype="external" url="${url}" />`;
}

function imageField(url, alt) {
  if (!url) return '';
  trackMedia(url, alt);
  const key = absUrl(url);
  return `|\n        <image mediaid="{MEDIA:${key}}" />`;
}

function yamlValue(component, field, value) {
  if (!value) return null;
  const fieldId = ids[component]?.fieldIds?.[field];
  if (!fieldId) return null;

  if (field === 'Image' || field === 'Logo' || field === 'BackgroundImage') {
    return `    - ID: "${fieldId}"
      Hint: ${field}
      Value: ${value}`;
  }
  if (value.startsWith('<link') || value.startsWith('<image') || value.startsWith('|\n')) {
    const block = value.startsWith('|') ? value : `|\n        ${value}`;
    return `    - ID: "${fieldId}"
      Hint: ${field}
      Value: ${block}`;
  }
  if (field === 'Body' || field === 'Description' || field === 'Message') {
    const lines = value.split('\n').map((l) => `        ${l}`).join('\n');
    return `    - ID: "${fieldId}"
      Hint: ${field}
      Value: |\n${lines}`;
  }
  const escaped = value.includes(':') || value.includes('"') ? `"${value.replace(/"/g, '\\"')}"` : value;
  return `    - ID: "${fieldId}"
      Hint: ${field}
      Value: ${escaped}`;
}

function getFieldId(component, field) {
  return ids[component]?.fieldIds?.[field] ?? stableGuid(`${component}-${field}`);
}

function getDataFolderId(name) {
  return dataFolderIds[name] ?? stableGuid(`${name}-data-folder`);
}

async function loadDataFolderIds() {
  for (const comp of COMPONENT_META) {
    const folderFile = join(ROOT, SITE_REL, 'Data', `${comp.dataFolder}.yml`);
    try {
      const body = await readFile(folderFile, 'utf8');
      const m = body.match(/^ID: "(.+?)"/m);
      if (m) dataFolderIds[comp.name] = m[1];
    } catch {
      dataFolderIds[comp.name] = stableGuid(`${comp.name}-data-folder`);
    }
  }
}


async function writeYaml(relPath, body) {
  const full = join(ROOT, relPath);
  await mkdir(dirname(full), { recursive: true });
  await writeFile(full, body, 'utf8');
}

function extractTextPanels(html) {
  const panels = [];
  const blocks = html.split(/<div class="jm-panel jmtext--panel-temp">/i).slice(1);
  for (const block of blocks) {
    const title = stripTags(block.match(/text-panel-title">\s*([\s\S]*?)<\/div>/i)?.[1] ?? '');
    const body = stripTags(block.match(/text-panel-body">([\s\S]*?)<\/div>/i)?.[1] ?? '');
    const href =
      block.match(/text-panel-full-link[^"]*" href="([^"]+)"/i)?.[1] ??
      block.match(/text-panel-link[\s\S]*?href="([^"]+)"/i)?.[1] ??
      null;
    const img =
      block.match(/text-panel-img[\s\S]*?<img[^>]+src="([^"]+)"/i)?.[1] ??
      block.match(/background-image:\s*url\(([^)]+)\)/i)?.[1]?.replace(/["']/g, '');
    if (title) panels.push({ title, body, href, image: img ? absUrl(img) : null });
  }
  return panels;
}

/** matthey.com home news panels are text-only; HorizontalLinkCard still needs Logo */
const NEWS_PANEL_LOGO_URLS = {
  News: 'https://matthey.com/documents/161599/0/JM+employees+in+Sonning.jpg/977b1cf4-537c-4ce0-88a5-718c74483c8d?t=1706549112824',
  'ARA 2026':
    'https://matthey.com/documents/161599/166663/Team-meeting-in-Cambridge-L.jpg/021cef6f-97cb-9ea9-2346-6857023aefea?t=1650968265959',
};

function resolveHorizontalLinkCardLogo(panel) {
  const url = panel.image || NEWS_PANEL_LOGO_URLS[panel.title];
  return url ? imageField(url, panel.title) : '';
}

function extractRichText(html) {
  const h = html.match(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/i);
  const title = h ? stripTags(h[1]) : '';
  const paragraphs = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((x) => stripTags(x[1]))
    .filter((p) => p && !p.match(/^@media/) && p.length > 20);
  const body = paragraphs.join('\n\n');
  const cta = html.match(/<a[^>]*class="[^"]*(?:jm_cta_button|home__btn|panel__btn)[^"]*"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);
  return {
    title,
    body,
    cta: cta ? { href: cta[1], text: stripTags(cta[2]) || 'Read more' } : null,
  };
}

function extractTeaserColumns(html) {
  const cards = [];
  const cols = html.split(/<div class="col col-lg-4/gi).slice(1);
  for (const col of cols) {
    const h2s = [...col.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map((x) => stripTags(x[1])).filter(Boolean);
    const title = h2s.join(' ').trim();
    const descParts = [...col.matchAll(/<(?:p|div)[^>]*>([\s\S]*?)<\/(?:p|div)>/gi)]
      .map((x) => stripTags(x[1]))
      .filter((t) => t && t.length > 8 && !t.includes('@media'));
    const description = descParts.join(' ').trim();
    const img = col.match(/<img[^>]*src="([^"]+)"/i);
    const imgUrl = img ? img[1] : null;
    if (title) cards.push({ title, description, image: imgUrl, cta: null });
  }
  return cards;
}

function extractStatsPanels(html) {
  const panels = extractTextPanels(html);
  return panels.map((p) => {
    const valueMatch = p.body.match(/([\d.,+]+\s*%?|c?\.?\d[\d,]*\+?)/i);
    const value = valueMatch ? valueMatch[1].trim() : p.title;
    const label = p.body.replace(valueMatch?.[0] ?? '', '').trim() || p.title;
    return { title: p.title, value, label, href: p.href };
  });
}

function extractNavLinks(html) {
  const links = [];
  const re = /<a class="header__menu" href="([^"]+)"[^>]*>\s*<span>\s*([^<]+)/gi;
  let m;
  while ((m = re.exec(html))) {
    links.push({ href: m[1], text: decodeHtml(m[2]) });
  }
  return links.slice(0, 6);
}

function extractFooterLists(html) {
  const lists = [];
  const sections = html.split(/<h2 class="jmfooter__heading"/i).slice(1);
  for (const sec of sections) {
    const titleMatch = sec.match(/>\s*([^<]+?)\s*(?:<span class="footersec__chevicon"|<\/h2>)/i);
    const title = titleMatch ? stripTags(titleMatch[1]) : 'Links';
    const links = [];
    const re = /<a class="jmfooter__listlink"[^>]*href="([^"]+)"[^>]*>\s*([\s\S]*?)\s*<\/a>/gi;
    let m;
    while ((m = re.exec(sec))) {
      links.push({ href: m[1], text: stripTags(m[2]) });
    }
    if (links.length) lists.push({ title, links });
  }
  return lists;
}

function extractCarouselSlides(html) {
  const slides = [];
  const seen = new Set();
  const re =
    /<div class="jmcarousal__image" style="background-image:\s*url\(([^)]+)\)[^>]*>[\s\S]*?<h1 class="homehero__heading">\s*([\s\S]*?)<\/h1>[\s\S]*?<p class="homehero__para">\s*([\s\S]*?)<\/p>[\s\S]*?<a class="home__btn" href="([^"]+)">([\s\S]*?)<span/gi;
  let m;
  while ((m = re.exec(html))) {
    const imageUrl = m[1].replace(/['"]/g, '').trim();
    const title = stripTags(m[2]);
    const subtitle = stripTags(m[3]);
    const href = m[4];
    const ctaText = stripTags(m[5]) || 'Read more';
    const key = imageUrl || subtitle || title;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    slides.push({ imageUrl, title, subtitle, href, ctaText });
  }
  if (slides.length) return slides.slice(0, 3);

  const fallbackRe =
    /<h1 class="homehero__heading">\s*([\s\S]*?)<\/h1>\s*<p class="homehero__para">\s*([\s\S]*?)<\/p>[\s\S]*?<a class="home__btn" href="([^"]+)">([\s\S]*?)<span/gi;
  while ((m = fallbackRe.exec(html))) {
    const title = stripTags(m[1]);
    const subtitle = stripTags(m[2]);
    const href = m[3];
    const ctaText = stripTags(m[4]) || 'Read more';
    const key = subtitle || title;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    slides.push({ imageUrl: null, title, subtitle, href, ctaText });
  }
  return slides.slice(0, 3);
}

function extractSharePriceStats(html) {
  const value = stripTags(html.match(/class="stockprice__value">([\s\S]*?)<\/span>/i)?.[1] ?? '');
  const percent = stripTags(html.match(/class="stockprice__percent">([\s\S]*?)<\/span>/i)?.[1] ?? '');
  const date = stripTags(html.match(/class="stockprice__date">([\s\S]*?)<\/p>/i)?.[1] ?? '');
  if (!value) return [];
  return [
    { value, label: 'Share Price', title: 'Share Price' },
    ...(percent ? [{ value: percent, label: date || 'Change', title: 'Change' }] : []),
  ];
}

function extractMontageCards(html) {
  const cards = [];
  const blocks = html.split(/<div class="col-md-6 montage__data"/gi).slice(1);
  for (const block of blocks) {
    const title = stripTags(block.match(/<h2 class="card__heading">([\s\S]*?)<\/h2>/i)?.[1] ?? '');
    const description = stripTags(block.match(/<p class="card__description">([\s\S]*?)<\/p>/i)?.[1] ?? '');
    const href = block.match(/href="([^"]+)"/i)?.[1];
    const img = block.match(/<img[^>]*src="([^"]+)"/i)?.[1];
    if (title) cards.push({ title, description, href, image: img });
  }
  return cards;
}

function extractScienceHero(html) {
  const title = stripTags(html.match(/panels-hero-header[\s\S]*?<h1>\s*([\s\S]*?)<\/h1>/i)?.[1] ?? 'Science and innovation');
  const body = stripTags(html.match(/panels-hero-para[\s\S]*?<h2>\s*([\s\S]*?)<\/h2>/i)?.[1] ?? '');
  const bg = html.match(/background-image:\s*url\(["']?([^"')]+)/i)?.[1];
  return { title, body, backgroundImage: bg };
}

function extractScienceHeroStats(html) {
  return extractTextPanels(html).map((p) => {
    const valueMatch = p.body.match(/<span[^>]*>([\s\S]*?)<\/span>/i);
    const value = valueMatch ? stripTags(valueMatch[1]) : stripTags(p.body.split('\n')[0] ?? p.body);
    const label = stripTags(p.body.replace(valueMatch?.[0] ?? '', '')) || p.title;
    return { title: p.title, value, label, href: p.href };
  });
}

function extractCoreCapabilityCards(html) {
  const title = stripTags(html.match(/<h2>\s*([\s\S]*?)<\/h2>/i)?.[1] ?? 'Core technical capabilities underpinning our business');
  const cols = html.split(/<div class="col-sm-12 col-md-6">/gi).slice(1, 3);
  const cards = cols.map((col, i) => {
    const img = col.match(/<img[^>]*src="([^"]+)"/i)?.[1];
    const bodyHtml = col.match(/text-panel-body">([\s\S]*?)<\/div>/i)?.[1] ?? '';
    const cardTitle = stripTags(col.match(/text-panel-title">\s*([\s\S]*?)<\/div>/i)?.[1] ?? '') || `Capability ${i + 1}`;
    const description = stripTags(bodyHtml.replace(/<a[\s\S]*?<\/a>/gi, '').trim());
    const cta = bodyHtml.match(/<a[^>]*href="([^"]+)"[^>]*>[\s\S]*?<span[^>]*>([\s\S]*?)<\/span>/i);
    return {
      title: i === 0 && img ? 'Technical expertise' : cardTitle || title,
      description: description || title,
      image: img,
      href: cta?.[1],
      ctaText: cta ? stripTags(cta[2]) : 'Explore',
    };
  });
  return { title, cards };
}

function extractHero(html) {
  const title =
    stripTags(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? '') ||
    stripTags(html.match(/panels-hero-header[\s\S]*?<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? '') ||
    DISPLAY_NAMES.ThePaceOfScientificHeroBanner;
  const bodyMatch = html.match(/homehero__para[^>]*>([\s\S]*?)<\/p>/i) || html.match(/panels-hero-para[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i);
  const body = bodyMatch ? stripTags(bodyMatch[1]) : '';
  const bg = html.match(/background-image:\s*url\(([^)]+)\)/i)?.[1]?.replace(/["']/g, '');
  const cta = html.match(/<a[^>]*class="[^"]*panel__btn[^"]*"[^>]*href="([^"]+)"[^>]*>[\s\S]*?<span class="panel__btntext">([\s\S]*?)<\/span>/i);
  return {
    title,
    body,
    backgroundImage: bg,
    cta: cta ? { href: cta[1], text: stripTags(cta[2]) } : null,
  };
}

function extractImages(html) {
  return [...html.matchAll(/(?:src|url)\s*[=:]\s*["']?([^"')]+\.(?:jpg|jpeg|png|svg|webp)[^"')]*)/gi)].map((m) => m[1]);
}

async function readSectionHtml(cmsName) {
  const comp = manifest.components[cmsName];
  if (!comp?.sectionHtml) return '';
  const path = join(SECTIONS, comp.sectionHtml);
  try {
    return await readFile(path, 'utf8');
  } catch {
    return '';
  }
}

function registerDatasource(component, itemName, parentFolderId, templateId, fields, folderPath) {
  const id = stableGuid(`ds-${component}-${itemName}`);
  datasourceRegistry[id] = { component, itemName, fields, templateId, parentFolderId, folderPath };
  return id;
}

async function writeDatasourceItem(dsId) {
  const ds = datasourceRegistry[dsId];
  if (!ds) return;
  const fieldLines = Object.entries(ds.fields)
    .map(([field, value]) => yamlValue(ds.component, field, value))
    .filter(Boolean)
    .join('\n');
  const path = `${SITE_PATH}/Data/${ds.folderPath}/${ds.itemName}`;
  await writeYaml(
    `${SITE_REL}/Data/${ds.folderPath}/${ds.itemName}.yml`,
    `---
ID: "${dsId}"
Parent: "${ds.parentFolderId}"
Template: "${ds.templateId}"
Path: "${path}"
Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
${fieldLines}
${metaFields(`ds-${ds.itemName}`)}
`
  );
}

function escapeRenderingPar(par) {
  return par.replace(/&/g, '&amp;');
}

function headlessVariantGuid(componentName, variant = 'Default') {
  return stableGuid(`${componentName}-variant-${variant}`);
}

function buildRenderingPar(componentName, variant = 'Default', extra = '') {
  const guid = headlessVariantGuid(componentName, variant).toUpperCase();
  const base = `CSSStyles&FieldNames=%7B${guid}%7D`;
  return extra ? `${base}&${extra}` : base;
}

function buildRenderingEntry({ uid, renderingId, dsId, ph, par = 'CSSStyles', before, after }) {
  const afterRef = after ? after.toUpperCase() : null;
  const pos = before ? `p:before="${before}"` : afterRef ? `p:after="r[@uid='{${afterRef}}']"` : `p:after="*[1=2]"`;
  const ds = dsId ? `\n          s:ds="${dsId}"` : '';
  return `        <r
          uid="${guidUpper(uid)}"
          ${pos}${ds}
          s:id="${guidUpper(renderingId)}"
          s:par="${escapeRenderingPar(par)}"
          s:ph="${ph}" />`;
}

function buildRenderingsXml(entries) {
  const body = entries
    .map((e, i) => {
      const before = i === 0 ? '*' : null;
      const after = i > 0 ? entries[i - 1].uid : null;
      return buildRenderingEntry({ ...e, before, after });
    })
    .join('\n');
  return `    <r xmlns:p="p" xmlns:s="s"
      p:p="1">
      <d
        id="{${DEVICE_ID}}">
${body}
      </d>
    </r>`;
}

async function buildSiteChrome() {
  const headerHtml = await readSectionHtml('Header');
  const footerHtml = await readSectionHtml('Footer');
  const cookieHtml = await readSectionHtml('CookieBanner');

  const logoUrl = headerHtml.match(/jmlogo__img[^>]*src="([^"]+)"/i)?.[1];
  trackMedia(logoUrl, 'Johnson Matthey logo');

  const headerDs = registerDatasource(
    'Header',
    'Site Header',
    getDataFolderId('Header'),
    ids.Header.templateId,
    {
      LogoText: 'Johnson Matthey',
      LogoLink: linkField('Johnson Matthey', BASE_URL),
      Logo: imageField(logoUrl, 'Johnson Matthey logo'),
    },
    'Headers',
  );

  const navLinks = extractNavLinks(headerHtml);
  const navFields = { SearchLabel: 'Search' };
  navLinks.forEach((l, i) => {
    navFields[`NavLink${i + 1}`] = linkField(l.text, l.href);
  });
  const navDs = registerDatasource(
    'Navigation',
    'Main Navigation',
    getDataFolderId('Navigation'),
    ids.Navigation.templateId,
    navFields,
    'Navigations',
  );

  const footerDs = registerDatasource(
    'Footer',
    'Site Footer',
    getDataFolderId('Footer'),
    ids.Footer.templateId,
    {
      CopyrightText: '© Johnson Matthey plc. All rights reserved.',
      Logo: imageField(logoUrl, 'Johnson Matthey logo'),
    },
    'Footers',
  );

  const footerLists = extractFooterLists(footerHtml);
  const linkListDsIds = [];
  footerLists.forEach((list, idx) => {
    const fields = { Title: list.title };
    list.links.slice(0, 6).forEach((l, i) => {
      fields[`Link${i + 1}`] = linkField(l.text, l.href);
    });
    const dsId = registerDatasource(
      'LinkList',
      `Footer ${list.title.replace(/[<>:"/\\|?*]/g, '').trim()}`,
      getDataFolderId('LinkList'),
      ids.LinkList.templateId,
      fields,
      'LinkLists'
    );
    linkListDsIds.push(dsId);
  });

  const cookieMsg = stripTags(cookieHtml.match(/id="onetrust-policy-text"[^>]*>([\s\S]*?)<\/div>/i)?.[1] ?? '') ||
    'We use cookies to improve your experience on our site.';
  const cookieDs = registerDatasource(
    'CookieBanner',
    'Site Cookie Banner',
    getDataFolderId('CookieBanner'),
    ids.CookieBanner.templateId,
    {
      Message: cookieMsg,
      AcceptLabel: 'Accept All Cookies',
      PrivacyLink: linkField('Cookie Notice', `${BASE_URL}/en/website-information/cookies-notice`),
    },
    'CookieBanners',
  );

  return { headerDs, navDs, footerDs, cookieDs, linkListDsIds };
}

async function buildSectionDatasource(cmsName) {
  const kind = CMS_MAP[cmsName];
  const html = await readSectionHtml(cmsName);
  const displayName = DISPLAY_NAMES[cmsName] || cmsName.replace(/([A-Z])/g, ' $1').trim();
  const result = { sectionDsId: null, childDsIds: [], renderingComponent: null, phKey: null, extras: [] };

  if (kind === 'homeHeroArea') {
    const slides = extractCarouselSlides(html);
    const compositeDs = registerDatasource(
      'CompositeHeroBandSection',
      'Home Hero Band',
      getDataFolderId('CompositeHeroBandSection'),
      ids.CompositeHeroBandSection.templateId,
      {},
      'CompositeHeroBandSections',
    );
    result.renderingComponent = 'CompositeHeroBandSection';
    result.sectionDsId = compositeDs;
    result.headlessVariant = 'Carousel';
    result.compositeChildren = [
      {
        phKey: 'hero-slides',
        childComponent: 'HeroSlideCard',
        childDsIds: slides.map((slide, i) => {
          if (slide.imageUrl) trackMedia(slide.imageUrl, slide.subtitle || `Hero slide ${i + 1}`);
          return registerDatasource(
            'HeroSlideCard',
            `Home Hero Slide ${i + 1}`,
            getDataFolderId('HeroSlideCard'),
            ids.HeroSlideCard.templateId,
            {
              Title: slide.title,
              Subtitle: slide.subtitle,
              Image: slide.imageUrl ? imageField(slide.imageUrl, slide.subtitle || slide.title) : '',
              Cta: linkField(slide.ctaText, slide.href),
            },
            'HeroSlideCards',
          );
        }),
      },
      {
        phKey: 'hero-panels',
        childComponent: 'HeroPanelCard',
        childDsIds: extractTextPanels(html)
          .filter((p) => p.title && p.title !== 'Share Price')
          .map((panel, i) =>
            registerDatasource(
              'HeroPanelCard',
              `Home Hero Panel ${i + 1}`,
              getDataFolderId('HeroPanelCard'),
              ids.HeroPanelCard.templateId,
              {
                PanelTitle: panel.title,
                Body: stripTags(panel.body) || panel.title,
                Cta: linkField('Read more', panel.href || '/'),
              },
              'HeroPanelCards',
            ),
          ),
      },
      {
        phKey: 'hero-stats',
        childComponent: 'HeroStatsPanel',
        childDsIds: (() => {
          const shareStats = extractSharePriceStats(html);
          if (!shareStats.length) return [];
          const value = shareStats[0]?.value ?? '';
          const change = shareStats[1]?.value ?? '';
          const date = shareStats[1]?.label ?? '';
          return [
            registerDatasource(
              'HeroStatsPanel',
              'Home Share Price',
              getDataFolderId('HeroStatsPanel'),
              ids.HeroStatsPanel.templateId,
              {
                Title: 'Share Price',
                Value: value,
                Change: change,
                Date: date,
              },
              'HeroStatsPanels',
            ),
          ];
        })(),
      },
    ];
    return result;
  }

  if (kind === 'developingPgms') {
    const rt = extractRichText(html);
    const sectionDs = registerDatasource(
      'TitleDescriptionLinkGridSection',
      displayName,
      getDataFolderId('TitleDescriptionLinkGridSection'),
      ids.TitleDescriptionLinkGridSection.templateId,
      { Title: rt.title || 'Developing the future of platinum group metals' },
      'TitleDescriptionLinkGridSections',
    );
    const img = extractImages(html).find((u) => !u.includes('.svg'));
    const childDs = registerDatasource(
      'HorizontalLinkCard',
      `${displayName} Card`,
      getDataFolderId('HorizontalLinkCard'),
      ids.HorizontalLinkCard.templateId,
      {
        Title: stripTags(rt.body.split('\n\n')[0] ?? 'Developing the future of platinum group metals'),
        Logo: img ? imageField(img, 'Future PGMs partnership') : '',
        Cta: rt.cta ? linkField(rt.cta.text, rt.cta.href) : linkField('Read more', '/future-pgms-partnership'),
      },
      'HorizontalLinkCards',
    );
    result.sectionDsId = sectionDs;
    result.renderingComponent = 'TitleDescriptionLinkGridSection';
    result.phKey = 'link-cards';
    result.childDsIds = [childDs];
    return result;
  }

  if (kind === 'scienceHero') {
    const hero = extractScienceHero(html);
    if (hero.backgroundImage) trackMedia(hero.backgroundImage, hero.title);
    const heroDs = registerDatasource(
      'FullBleedHeroBannerSection',
      displayName,
      getDataFolderId('FullBleedHeroBannerSection'),
      ids.FullBleedHeroBannerSection.templateId,
      {
        Title: hero.title,
        Body: hero.body,
        BackgroundImage: hero.backgroundImage ? imageField(hero.backgroundImage, hero.title) : '',
      },
      'FullBleedHeroBannerSections',
    );
    result.extras.push({
      renderingComponent: 'FullBleedHeroBannerSection',
      sectionDsId: heroDs,
    });

    const stats = extractScienceHeroStats(html);
    if (stats.length) {
      const statsDs = registerDatasource(
        'TitleStatsBarSection',
        'Science Hero Stats',
        getDataFolderId('TitleStatsBarSection'),
        ids.TitleStatsBarSection.templateId,
        { Title: 'Science and innovation at Johnson Matthey' },
        'TitleStatsBarSections',
      );
      result.extras.push({
        renderingComponent: 'TitleStatsBarSection',
        sectionDsId: statsDs,
        phKey: 'stats-items',
        childDsIds: stats.map((stat, i) =>
          registerDatasource(
            'StatsItem',
            `Science Hero Stat ${i + 1}`,
            getDataFolderId('StatsItem'),
            ids.StatsItem.templateId,
            {
              Value: stat.value,
              Label: stat.label || stat.title,
              Link: stat.href ? linkField('Read more', stat.href) : '',
            },
            'StatsItems',
          ),
        ),
      });
    }
    return result;
  }

  if (kind === 'coreCapabilities') {
    const { title, cards } = extractCoreCapabilityCards(html);
    const sectionDs = registerDatasource(
      'TitleDescriptionTeaserGridSection',
      displayName,
      getDataFolderId('TitleDescriptionTeaserGridSection'),
      ids.TitleDescriptionTeaserGridSection.templateId,
      { Title: title },
      'TitleDescriptionTeaserGridSections',
    );
    result.sectionDsId = sectionDs;
    result.renderingComponent = 'TitleDescriptionTeaserGridSection';
    result.phKey = 'teaser-cards';
    result.childDsIds = cards.map((card, i) =>
      registerDatasource(
        'VerticalTeaserCard',
        `${displayName} Card ${i + 1}`,
        getDataFolderId('VerticalTeaserCard'),
        ids.VerticalTeaserCard.templateId,
        {
          Title: card.title,
          Description: card.description,
          Image: card.image ? imageField(card.image, card.title) : '',
          Cta: card.href ? linkField(card.ctaText, card.href) : '',
        },
        'VerticalTeaserCards',
      ),
    );
    return result;
  }

  if (kind === 'exploreMore') {
    const cards = extractMontageCards(html);
    const sectionDs = registerDatasource(
      'TitleDescriptionTeaserGridSection',
      displayName,
      getDataFolderId('TitleDescriptionTeaserGridSection'),
      ids.TitleDescriptionTeaserGridSection.templateId,
      { Title: 'Explore more' },
      'TitleDescriptionTeaserGridSections',
    );
    result.sectionDsId = sectionDs;
    result.renderingComponent = 'TitleDescriptionTeaserGridSection';
    result.phKey = 'teaser-cards';
    result.childDsIds = cards.map((card, i) =>
      registerDatasource(
        'VerticalTeaserCard',
        `${displayName} Card ${i + 1}`,
        getDataFolderId('VerticalTeaserCard'),
        ids.VerticalTeaserCard.templateId,
        {
          Title: card.title,
          Description: card.description,
          Image: card.image ? imageField(card.image, card.title) : '',
          Cta: card.href ? linkField('Explore', card.href) : '',
        },
        'VerticalTeaserCards',
      ),
    );
    return result;
  }

  if (kind === 'cta') {
    const rt = extractRichText(html);
    const fields = {
      Title: rt.title || displayName,
      Body: rt.body,
    };
    if (rt.cta) fields.Cta = linkField(rt.cta.text, rt.cta.href);
    const dsId = registerDatasource(
      'TitleDescriptionCtaSection',
      displayName,
      getDataFolderId('TitleDescriptionCtaSection'),
      ids.TitleDescriptionCtaSection.templateId,
      fields,
      'TitleDescriptionCtaSections',
    );
    result.sectionDsId = dsId;
    result.renderingComponent = 'TitleDescriptionCtaSection';
    return result;
  }

  if (kind === 'imageRichText') {
    const rt = extractRichText(html);
    const img = extractImages(html).find((u) => !u.includes('.svg') && !u.includes('clay/icons'));
    const fields = {
      Title: rt.title || displayName,
      Body: rt.body,
    };
    if (img) fields.Image = imageField(img, rt.title);
    const ctaMatch = html.match(/<a[^>]*href="([^"]+)"[^>]*>[\s\S]*?<span class="btn--style-a">([\s\S]*?)<\/span>/i);
    if (ctaMatch) fields.Cta = linkField(stripTags(ctaMatch[2]), ctaMatch[1]);
    else if (rt.cta) fields.Cta = linkField(rt.cta.text, rt.cta.href);
    const dsId = registerDatasource(
      'ImageRichTextSection',
      displayName,
      getDataFolderId('ImageRichTextSection'),
      ids.ImageRichTextSection.templateId,
      fields,
      'ImageRichTextSections',
    );
    result.sectionDsId = dsId;
    result.renderingComponent = 'ImageRichTextSection';
    return result;
  }

  return result;
}

function pageSections(pageSlug) {
  const page = manifest.pages.find((p) => p.slug === pageSlug);
  if (!page) return [];
  return page.sectionOrder.filter((n) => CMS_MAP[n] && CMS_MAP[n] !== 'Header' && CMS_MAP[n] !== 'Footer');
}

function appendSectionRenderings(entries, section, dpCounterRef, pageSlug, cmsName) {
  if (section.compositeChildren?.length) {
    const dp = dpCounterRef.value++;
    const component = section.renderingComponent;
    const variant = section.headlessVariant ?? 'Default';
    entries.push({
      uid: stableGuid(`${pageSlug}-${cmsName}-${component}-${dp}`),
      renderingId: ids[component].renderingId,
      dsId: section.sectionDsId,
      ph: 'headless-main',
      par: buildRenderingPar(component, variant, `DynamicPlaceholderId=${dp}`),
    });
    for (const block of section.compositeChildren) {
      if (!block.childDsIds?.length || !block.phKey) continue;
      block.childDsIds.forEach((childDs, i) => {
        entries.push({
          uid: stableGuid(`${pageSlug}-${cmsName}-${block.childComponent}-${dp}-${i}`),
          renderingId: ids[block.childComponent].renderingId,
          dsId: childDs,
          ph: `/headless-main/${block.phKey}-${dp}`,
          par: buildRenderingPar(block.childComponent, 'Default'),
        });
      });
    }
    return;
  }

  const blocks = section.extras?.length
    ? section.extras
    : section.renderingComponent
      ? [section]
      : [];
  for (const block of blocks) {
    const dp = dpCounterRef.value++;
    const par = block.phKey
      ? buildRenderingPar(block.renderingComponent, block.headlessVariant ?? 'Default', `DynamicPlaceholderId=${dp}`)
      : buildRenderingPar(block.renderingComponent, block.headlessVariant ?? 'Default');
    entries.push({
      uid: stableGuid(`${pageSlug}-${cmsName}-${block.renderingComponent}-${dp}`),
      renderingId: ids[block.renderingComponent].renderingId,
      dsId: block.sectionDsId,
      ph: 'headless-main',
      par,
    });
    if (block.childDsIds?.length && block.phKey) {
      const childComponent =
        block.phKey === 'link-cards'
          ? 'HorizontalLinkCard'
          : block.phKey === 'teaser-cards'
            ? 'VerticalTeaserCard'
            : block.phKey === 'carousel-slides'
              ? 'FeatureCarouselCard'
              : 'StatsItem';
      block.childDsIds.forEach((childDs, i) => {
        entries.push({
          uid: stableGuid(`${pageSlug}-${cmsName}-child-${dp}-${i}`),
          renderingId: ids[childComponent].renderingId,
          dsId: childDs,
          ph: `/headless-main/${block.phKey}-${dp}`,
          par: buildRenderingPar(childComponent, 'Default'),
        });
      });
    }
  }
}

function buildPageRenderings(pageSlug, sectionResults, cookieDs) {
  const entries = [];
  const dpCounterRef = { value: 1 };

  entries.push({
    uid: stableGuid(`${pageSlug}-cookie`),
    renderingId: ids.CookieBanner.renderingId,
    dsId: cookieDs,
    ph: 'headless-main',
    par: buildRenderingPar('CookieBanner', 'Default'),
  });

  for (const cmsName of pageSections(pageSlug)) {
    const sr = sectionResults[cmsName];
    if (!sr) continue;
    appendSectionRenderings(entries, sr, dpCounterRef, pageSlug, cmsName);
  }

  return buildRenderingsXml(entries);
}

async function writePageYaml(fileName, itemName, parentId, pageId, title, renderingsXml) {
  await writeYaml(
    `${SITE_REL}/Home/${fileName}`,
    `---
ID: "${pageId}"
Parent: "${parentId}"
Template: "${PAGE_TEMPLATE_ID}"
Path: "${SITE_PATH}/Home/${itemName}"
SharedFields:
- ID: "f1a1fe9e-a60c-4ddb-a3a0-bb5b29fe732e"
  Hint: __Renderings
  Value: |
${renderingsXml}
Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
    - ID: "${NAV_TITLE_FIELD}"
      Hint: NavigationTitle
      Value: ${title}
    - ID: "${PAGE_TITLE_FIELD}"
      Hint: Title
      Value: ${title}
${metaFields(`page-${itemName}`)}
`,
  );
}

async function writePresentation(chrome) {
  const headerPdId = stableGuid('pd-header');
  const footerPdId = stableGuid('pd-footer');
  const defaultPdId = stableGuid('page-design-default');

  const headerEntries = [
    {
      uid: stableGuid('pd-header-rendering'),
      renderingId: ids.Header.renderingId,
      dsId: chrome.headerDs,
      ph: 'headless-header',
      par: 'CSSStyles&DynamicPlaceholderId=1',
    },
    {
      uid: stableGuid('pd-header-nav'),
      renderingId: ids.Navigation.renderingId,
      dsId: chrome.navDs,
      ph: '/headless-header/header-nav-1',
      par: 'CSSStyles',
    },
  ];

  const footerEntries = [
    {
      uid: stableGuid('pd-footer-rendering'),
      renderingId: ids.Footer.renderingId,
      dsId: chrome.footerDs,
      ph: 'headless-footer',
      par: 'CSSStyles&DynamicPlaceholderId=1',
    },
  ];
  chrome.linkListDsIds.forEach((dsId, i) => {
    footerEntries.push({
      uid: stableGuid(`pd-footer-linklist-${i}`),
      renderingId: ids.LinkList.renderingId,
      dsId,
      ph: '/headless-footer/footer-links-1',
      par: 'CSSStyles',
    });
  });

  await writeYaml(
    `${SITE_REL}/Presentation/Partial Designs/Header.yml`,
    `---
ID: "${headerPdId}"
Parent: "${PARTIAL_DESIGNS_FOLDER}"
Template: "${PARTIAL_DESIGN_TEMPLATE}"
Path: "${SITE_PATH}/Presentation/Partial Designs/Header"
SharedFields:
- ID: "55faae90-3bba-4f7f-96fe-13c3f40055ff"
  Hint: Signature
  Value: header
- ID: "f1a1fe9e-a60c-4ddb-a3a0-bb5b29fe732e"
  Hint: __Renderings
  Value: |
${buildRenderingsXml(headerEntries)}
Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
${metaFields('pd-header')}
`
  );

  await writeYaml(
    `${SITE_REL}/Presentation/Partial Designs/Footer.yml`,
    `---
ID: "${footerPdId}"
Parent: "${PARTIAL_DESIGNS_FOLDER}"
Template: "${PARTIAL_DESIGN_TEMPLATE}"
Path: "${SITE_PATH}/Presentation/Partial Designs/Footer"
SharedFields:
- ID: "55faae90-3bba-4f7f-96fe-13c3f40055ff"
  Hint: Signature
  Value: footer
- ID: "f1a1fe9e-a60c-4ddb-a3a0-bb5b29fe732e"
  Hint: __Renderings
  Value: |
${buildRenderingsXml(footerEntries)}
Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
${metaFields('pd-footer')}
`
  );

  const headerPhSettingId = stableGuid('jm2-pd-ph-header');
  const footerPhSettingId = stableGuid('jm2-pd-ph-footer');

  for (const [name, phKey, phSettingId, signature] of [
    ['Header', 'sxa-header', headerPhSettingId, 'header'],
    ['Footer', 'sxa-footer', footerPhSettingId, 'footer'],
  ]) {
    await writeYaml(
      `${SITE_REL}/Presentation/Placeholder Settings/Partial Design/${name}.yml`,
      `---
ID: "${phSettingId}"
Parent: "${PARTIAL_DESIGN_PH_FOLDER}"
Template: "${PARTIAL_DESIGN_PH_SETTING_TEMPLATE}"
Path: "${SITE_PATH}/Presentation/Placeholder Settings/Partial Design/${name}"
SharedFields:
- ID: "7256bdab-1fd2-49dd-b205-cb4873d2917c"
  Hint: Placeholder Key
  Value: "${phKey}"
Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
${metaFields(`pd-ph-${signature}`)}
`
    );
  }

  await writeYaml(
    `${SITE_REL}/Presentation/Page Designs/Default.yml`,
    `---
ID: "${defaultPdId}"
Parent: "${PAGE_DESIGNS_FOLDER}"
Template: "${PAGE_DESIGN_TEMPLATE}"
Path: "${SITE_PATH}/Presentation/Page Designs/Default"
SharedFields:
- ID: "0966b999-0d0e-4278-acc9-9da69d461fe6"
  Hint: PartialDesigns
  Value: "${headerPdId.toUpperCase()}|${footerPdId.toUpperCase()}"
Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
${metaFields('page-design-default')}
`
  );

  const mapping = `%7b${PAGE_TEMPLATE_ID.toUpperCase()}%7d%3d%257B${defaultPdId.toUpperCase()}%257D`;
  let pageDesignsYml = await readFile(join(ROOT, SITE_REL, 'Presentation/Page Designs.yml'), 'utf8');
  if (!pageDesignsYml.includes('TemplatesMapping')) {
    pageDesignsYml = pageDesignsYml.replace(
      'SharedFields:',
      `SharedFields:
- ID: "ba1f60d6-3deb-40cc-bb61-eec772279ee1"
  Hint: TemplatesMapping
  Value: "${mapping}"`
    );
    await writeFile(join(ROOT, SITE_REL, 'Presentation/Page Designs.yml'), pageDesignsYml, 'utf8');
  }
}

async function patchMediaIds(mediaResults) {
  const urlToId = Object.fromEntries(mediaResults.map((r) => [r.Url, r.MediaId]));

  async function patchFilesUnder(relDir) {
    const base = join(ROOT, relDir);
    async function walk(d) {
      for (const ent of await readdir(d, { withFileTypes: true })) {
        const p = join(d, ent.name);
        if (ent.isDirectory()) await walk(p);
        else if (ent.name.endsWith('.yml')) {
          let content = await readFile(p, 'utf8');
          let changed = false;
          for (const [url, mediaId] of Object.entries(urlToId)) {
            const token = `{MEDIA:${url}}`;
            if (content.includes(token)) {
              content = content.split(token).join(mediaId.toUpperCase());
              changed = true;
            }
          }
          if (changed) await writeFile(p, content, 'utf8');
        }
      }
    }
    await walk(base);
  }

  await patchFilesUnder(`${SITE_REL}/Data`);
}

function assertMediaReferencesSerialized() {
  const orphans = [];
  function walk(dir) {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) walk(full);
      else if (name.endsWith('.yml')) {
        const content = readFileSync(full, 'utf8');
        if (content.includes('{MEDIA:')) {
          const matches = content.match(/\{MEDIA:[^}]+\}/g) ?? [];
          orphans.push({ file: full.replace(ROOT + '\\', '').replace(ROOT + '/', ''), tokens: matches });
        }
      }
    }
  }
  walk(join(ROOT, SITE_REL));
  walk(join(ROOT, 'media-library'));
  if (orphans.length) {
    throw new Error(
      `Unresolved MEDIA placeholders remain after patchMediaIds:\n${orphans
        .map((o) => `  - ${o.file}: ${o.tokens.join(', ')}`)
        .join('\n')}`,
    );
  }
}

async function downloadMedia() {
  if (!mediaAssets.length) return [];
  const manifestPath = join(__dirname, 'jm2-media-manifest.json');
  await writeFile(manifestPath, JSON.stringify(mediaAssets, null, 2), 'utf8');
  console.log(`Wrote ${mediaAssets.length} media URLs to jm2-media-manifest.json`);

  const psScript = join(
    REPO,
    '.cursor',
    'skills',
    'sitecore-serialization-skills',
    'sitecore-media-from-url-yaml',
    'scripts',
    'create-media-from-urls.ps1',
  );
  const manifestPs = manifestPath.replace(/'/g, "''");
  const cmd = `powershell -NoProfile -ExecutionPolicy Bypass -Command "& { $raw = Get-Content '${manifestPs}' -Raw | ConvertFrom-Json; $assets = @($raw | ForEach-Object { @{ Url = $_.Url; Alt = $_.Alt } }); & '${psScript}' -MediaRoot '${MEDIA_ROOT_DISK}' -SiteMediaPath '${SITE_MEDIA_PATH}' -SiteRootItemId '${MEDIA_ROOT_ID}' -BaseUrl '${BASE_URL}' -Assets $assets }"`;
  try {
    const out = execSync(cmd, { cwd: REPO, encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
    const jsonStart = out.lastIndexOf('[');
    if (jsonStart < 0) throw new Error('No JSON array in media script output');
    const results = JSON.parse(out.slice(jsonStart).trim());
    console.log(`Downloaded/reused ${results.length} media items`);
    return results;
  } catch (e) {
    console.warn('Media download failed — YAML will contain MEDIA placeholders:', e.message?.slice(0, 400));
    return [];
  }
}

async function main() {
  await loadDataFolderIds();

  console.log('Building site chrome datasources...');
  const chrome = await buildSiteChrome();

  console.log('Building per-section datasources...');
  const sectionResults = {};
  const allCmsNames = new Set(manifest.pages.flatMap((p) => p.sectionOrder));
  for (const cmsName of allCmsNames) {
    if (!CMS_MAP[cmsName] || ['Header', 'Footer', 'CookieBanner'].includes(cmsName)) continue;
    sectionResults[cmsName] = await buildSectionDatasource(cmsName);
    console.log(`  ${cmsName}`);
  }

  console.log('Writing datasource YAML...');
  for (const dsId of Object.keys(datasourceRegistry)) {
    await writeDatasourceItem(dsId);
  }

  console.log('Writing presentation (partial designs + page design)...');
  await writePresentation(chrome);

  console.log('Writing page YAML...');
  const scienceId = stableGuid('page-science-innovation');

  const homeRenderings = buildPageRenderings('matthey-com--home', sectionResults, chrome.cookieDs);
  await writeYaml(
    `${SITE_REL}/Home.yml`,
    `---
ID: "${HOME_ID}"
Parent: "${SITE_ID}"
Template: "${PAGE_TEMPLATE_ID}"
Path: "${SITE_PATH}/Home"
SharedFields:
- ID: "f1a1fe9e-a60c-4ddb-a3a0-bb5b29fe732e"
  Hint: __Renderings
  Value: |
${homeRenderings}
Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
    - ID: "${NAV_TITLE_FIELD}"
      Hint: NavigationTitle
      Value: Home
    - ID: "${PAGE_TITLE_FIELD}"
      Hint: Title
      Value: Home
${metaFields('page-home')}
`,
  );

  await writePageYaml(
    'Science and Innovation.yml',
    'Science and Innovation',
    HOME_ID,
    scienceId,
    'Science and Innovation',
    buildPageRenderings('matthey-com--science-and-innovation', sectionResults, chrome.cookieDs),
  );

  console.log('Downloading media assets...');
  const mediaResults = await downloadMedia();
  if (mediaResults.length) {
    console.log('Patching media IDs into datasource YAML...');
    await patchMediaIds(mediaResults);
  }
  assertMediaReferencesSerialized();

  try {
    execSync(`dotnet sitecore serialization validate --fix -i ${MODULE_NAMESPACE}`, {
      cwd: COLLECTION_FOLDER,
      stdio: 'inherit',
    });
  } catch {
    console.warn('Validation reported issues — review output above.');
  }

  console.log('\nDone.');
  console.log(`Pages: Home (${SITE_PATH}/Home), Science and Innovation (${SITE_PATH}/Home/Science and Innovation)`);
  console.log(`Media assets tracked: ${mediaAssets.length}, downloaded/reused: ${mediaResults.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
