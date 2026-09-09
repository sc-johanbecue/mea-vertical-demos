#!/usr/bin/env node
/**
 * Completes RAI Amsterdam (rai-amsterdam) authoring: datasource YAML, pages, partial designs, media.
 * Usage: node authoring/scripts/Complete-RaiAuthoring.mjs
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { mkdir, writeFile, readFile, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = join(__dirname, '..', '..');
const COLLECTION_FOLDER = join(__dirname, '..', 'items', 'RAI');
const ROOT = join(COLLECTION_FOLDER, 'serialized-content');
const SITE_REL = 'rai-amsterdam/rai-amsterdam';
const DESIGN = join(REPO, 'design-screenshots', 'rai-nl');
const SECTIONS = join(DESIGN, 'sections');
const SITE_PATH = '/sitecore/content/rai/rai-amsterdam';
const OWNER = 'sitecore\\johan.becue@sitecore.com';
const NOW = '20260616T120000Z';
const BASE_URL = 'https://www.rai.nl';
const MODULE_NAMESPACE = 'rai-scs';

const DEVICE_ID = 'FE5D7FDF-89C0-4D99-9AA3-B5FBD009C9F3';
const PAGE_TEMPLATE_ID = '9e26a1fe-a630-47d7-909d-87c0312f6050';
const PARTIAL_DESIGN_TEMPLATE = 'fd2059fd-6043-4dfe-8c04-e2437ce87634';
const PAGE_DESIGN_TEMPLATE = '1105b8f8-1e00-426b-bf1f-c840742d827b';
const PAGE_TITLE_FIELD = '15322bac-ffae-49b3-ac01-09b0f7579584';
const NAV_TITLE_FIELD = '4e0720e9-9d50-4ddc-87cf-ecd65e8e94c8';
const NAV_FILTER_FIELD = '1fbc6a49-6281-48ee-87e9-a3970b145adb';
const NAVIGATION_FILTER_ID = 'D063E9D1-C7B5-4B1E-B31E-69886C9C59F5';
const NAV_LEVEL_FROM = '1BB88840-5FB3-4353-AD8D-81136F6FF75A';
const NAV_LEVEL_TO = 'A59325BB-5A27-46F9-B8110-9D499715F3BE';

const PAGE_VISITING_ID = stableGuid('rai-page-visiting');
const PAGE_ABOUT_US_ID = stableGuid('rai-page-about-us');

const SITE_ID = '40d2b773-e76d-4a26-bd51-0b6e1451c4d9';
const HOME_FOLDER_ID = '768fb77a-5cf1-4775-b8b6-3a3bea645ce3';
const PARTIAL_DESIGNS_FOLDER = '47dc7414-2a65-4fda-9485-eb841660d831';
const PARTIAL_DESIGN_PH_FOLDER = 'af085447-7bb4-4c3b-9f58-b0bc49a507f8';
const PARTIAL_DESIGN_PH_SETTING_TEMPLATE = 'd2a6884c-04d5-4089-a64e-d27ca9d68d4c';
const PAGE_DESIGNS_FOLDER = '7a79cb7f-0294-4db4-8101-48ed52c8d20d';
const MEDIA_ROOT_ID = '854d1aca-249f-4987-8142-fbbde5fea6e0';
const MEDIA_ROOT_DISK = join(ROOT, 'media-library', 'rai', 'rai-amsterdam');
const SITE_MEDIA_PATH = '/sitecore/media library/Project/rai/rai-amsterdam';

const PAGE_CALENDAR_ID = stableGuid('rai-page-calendar');
const PAGE_HLTH_ID = stableGuid('rai-page-hlth-2026');

const COMPONENT_META = [
  { name: 'CookieBanner', dataFolder: 'CookieBanners' },
  { name: 'Header', dataFolder: 'Headers', ph: 'header-nav', child: 'Navigation' },
  { name: 'Header', dataFolder: 'Headers', ph: 'header-utility', child: 'HeaderIconLink' },
  { name: 'Navigation', dataFolder: 'Navigations' },
  { name: 'HeaderIconLink', dataFolder: 'HeaderIconLinks' },
  { name: 'Footer', dataFolder: 'Footers' },
  { name: 'LinkList', dataFolder: 'LinkLists' },
  { name: 'Breadcrumb', dataFolder: 'Breadcrumbs' },
  { name: 'FullBleedHeroBannerSection', dataFolder: 'FullBleedHeroBannerSections' },
  { name: 'HomeHeroEventsSection', dataFolder: 'HomeHeroEventsSections', ph: 'event-cards', child: 'EventListCard' },
  { name: 'EventListCard', dataFolder: 'EventListCards' },
  { name: 'NewsArticlesSection', dataFolder: 'NewsArticlesSections', ph: 'news-cards', child: 'NewsArticleCard' },
  { name: 'NewsArticleCard', dataFolder: 'NewsArticleCards' },
  { name: 'CalendarListingSection', dataFolder: 'CalendarListingSections', ph: 'calendar-events', child: 'EventListCard' },
  { name: 'EventDetailHeroSection', dataFolder: 'EventDetailHeroSections' },
  { name: 'EventDetailInfoSection', dataFolder: 'EventDetailInfoSections' },
];

const ids = JSON.parse(await readFile(join(__dirname, 'rai-component-ids.json'), 'utf8'));
const dataFolderIds = {};
const mediaAssets = [];
const mediaUrlSet = new Set();
const datasourceRegistry = {};
const variantGuids = {};
/** @type {{ byRoute: Map<string, object>, byPathname: Map<string, object>, languagePrefixes: string[], pageIdByPath: Map<string, string> } | null} */
let contentTreeLinks = null;

function stableGuid(seed) {
  const hash = createHash('md5').update(`rai-${seed}`, 'utf8').digest();
  hash[6] = (hash[6] & 0x0f) | 0x40;
  hash[8] = (hash[8] & 0x3f) | 0x80;
  const hex = hash.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function guidUpper(id) {
  return id.toUpperCase();
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
  if (href === '#') return '#';
  if (href.startsWith('http')) return href;
  return `${BASE_URL}${href.startsWith('/') ? '' : '/'}${href}`;
}

/** Prefer stable Sitecore /-/media/ or edge CDN URLs over raicdn resize wrappers. */
function normalizeMediaUrl(url) {
  if (!url) return null;
  const decoded = url.replace(/&amp;/g, '&');
  const edge = decoded.match(/https:\/\/edge\.sitecorecloud\.io\/[^"'\s)]+/i)?.[0];
  if (edge) return edge;
  const sitecoreMedia = decoded.match(/https:\/\/www\.rai\.nl\/-\/media\/[^"'\s)]+/i)?.[0];
  if (sitecoreMedia) return sitecoreMedia;
  return absUrl(decoded);
}

function trackMedia(url, alt = '') {
  const full = normalizeMediaUrl(url);
  if (!full || mediaUrlSet.has(full)) return;
  mediaUrlSet.add(full);
  mediaAssets.push({ Url: full, Alt: alt || 'RAI Amsterdam' });
}

function stripLanguagePrefix(pathname, languagePrefixes) {
  let p = pathname || '/';
  for (const prefix of [...languagePrefixes].sort((a, b) => b.length - a.length)) {
    if (p === prefix || p === `${prefix}/`) return '/';
    if (p.startsWith(`${prefix}/`)) {
      p = p.slice(prefix.length);
      break;
    }
  }
  return p.startsWith('/') ? p : `/${p}`;
}

function sitecorePathToLinkUrl(sitecorePath) {
  return sitecorePath.replace(/^\/sitecore\/content/, '') || sitecorePath;
}

function buildPageIdMapFromTree(tree) {
  const pageIdByPath = new Map([
    [`${SITE_PATH}/Home`, HOME_FOLDER_ID],
    [`${SITE_PATH}/Home/Calendar`, PAGE_CALENDAR_ID],
    [`${SITE_PATH}/Home/Calendar/Hlth 2026`, PAGE_HLTH_ID],
  ]);

  for (const page of tree?.pages ?? []) {
    if (!page.sitecorePath) continue;
    if (!pageIdByPath.has(page.sitecorePath)) {
      pageIdByPath.set(page.sitecorePath, stableGuid(`rai-page-${page.sitecorePath}`));
    }
  }
  return pageIdByPath;
}

function buildContentTreeLinkIndex(tree, pageIdByPath) {
  const languagePrefixes = tree?.languagePrefixes?.length ? tree.languagePrefixes : ['/en'];
  const byRoute = new Map();
  const byPathname = new Map();

  for (const page of tree?.pages ?? []) {
    const id = pageIdByPath.get(page.sitecorePath);
    if (!id) continue;
    const entry = {
      id,
      sitecorePath: page.sitecorePath,
      linkUrl: sitecorePathToLinkUrl(page.sitecorePath),
      routePath: page.routePath,
      title: page.title || page.itemName,
    };
    const routeKey = page.routePath === '' ? '/' : page.routePath;
    byRoute.set(routeKey, entry);
    for (const variant of page.pathnameVariants ?? []) {
      const pathname = variant.split('#')[0].split('?')[0];
      if (!pathname) continue;
      byPathname.set(pathname, entry);
      const normalized = stripLanguagePrefix(pathname, languagePrefixes);
      byRoute.set(normalized === '' ? '/' : normalized, entry);
    }
  }

  return { byRoute, byPathname, languagePrefixes };
}

async function loadContentTreeLinks() {
  try {
    const tree = JSON.parse(await readFile(join(DESIGN, 'site-content-tree.json'), 'utf8'));
    const pageIdByPath = buildPageIdMapFromTree(tree);
    contentTreeLinks = { ...buildContentTreeLinkIndex(tree, pageIdByPath), pageIdByPath };
  } catch {
    const homeEntry = {
      id: HOME_FOLDER_ID,
      sitecorePath: `${SITE_PATH}/Home`,
      linkUrl: sitecorePathToLinkUrl(`${SITE_PATH}/Home`),
      routePath: '/',
      title: 'Home',
    };
    contentTreeLinks = {
      byRoute: new Map([['/', homeEntry]]),
      byPathname: new Map([
        ['/', homeEntry],
        ['/en', homeEntry],
        ['/en/', homeEntry],
      ]),
      languagePrefixes: ['/en'],
      pageIdByPath: new Map([[`${SITE_PATH}/Home`, HOME_FOLDER_ID]]),
    };
  }
}

function resolveInternalLink(href) {
  if (!href || href === '#' || href.startsWith('javascript:')) return null;
  let pathname = href;
  if (href.startsWith('http')) {
    try {
      const u = new URL(href);
      if (u.origin !== new URL(BASE_URL).origin) return null;
      pathname = u.pathname;
    } catch {
      return null;
    }
  }
  pathname = pathname.split('#')[0].split('?')[0];
  if (!pathname) return null;

  let entry = contentTreeLinks?.byPathname.get(pathname);
  if (!entry && contentTreeLinks) {
    const route = stripLanguagePrefix(pathname, contentTreeLinks.languagePrefixes);
    entry = contentTreeLinks.byRoute.get(route === '' ? '/' : route);
  }
  return entry ?? null;
}

function linkField(text, href) {
  const anchor = href?.includes('#') ? href.split('#').slice(1).join('#') : '';
  const hrefPath = href?.split('#')[0] ?? href;
  const internal = resolveInternalLink(hrefPath);
  if (internal) {
    const safeText = (text || internal.title || '').replace(/"/g, "'");
    return `<link class="" id="${internal.id}" querystring="" anchor="${anchor}" target="" title="" linktype="internal" text="${safeText}" url="${internal.linkUrl}" />`;
  }
  const url = absUrl(href);
  if (!url) return '';
  const safeText = (text || url).replace(/"/g, "'");
  return `<link text="${safeText}" linktype="external" url="${url}" anchor="${anchor}" />`;
}

function imageField(url, alt) {
  const key = normalizeMediaUrl(url);
  if (!key) return '';
  trackMedia(key, alt);
  return `|\n        <image mediaid="{MEDIA:${key}}" />`;
}

function yamlValue(component, field, value) {
  if (!value) return null;
  const fieldId = ids[component]?.fieldIds?.[field];
  if (!fieldId) return null;

  if (
    field === 'Image' ||
    field === 'Logo' ||
    field === 'BackgroundImage' ||
    field === 'BrandImage' ||
    field === 'OrganizationLogo'
  ) {
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
  if (
    field === 'Body' ||
    field === 'Description' ||
    field === 'Message' ||
    field === 'ContactBody' ||
    field === 'OpeningHours' ||
    field === 'Location' ||
    field === 'TicketInfo' ||
    field === 'Subtitle'
  ) {
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

function getDataFolderId(name) {
  return dataFolderIds[name] ?? stableGuid(`rai-${name}-data-folder`);
}

async function loadDataFolderIds() {
  for (const comp of COMPONENT_META) {
    const folderFile = join(ROOT, SITE_REL, 'Data', `${comp.dataFolder}.yml`);
    try {
      const body = await readFile(folderFile, 'utf8');
      const m = body.match(/^ID: "(.+?)"/m);
      if (m) dataFolderIds[comp.name] = m[1];
    } catch {
      dataFolderIds[comp.name] = stableGuid(`rai-${comp.name}-data-folder`);
    }
  }
}

function loadVariantGuids() {
  const variantsRoot = join(ROOT, SITE_REL, 'Presentation', 'Headless Variants');
  for (const comp of COMPONENT_META.map((c) => c.name).concat(['CookieBanner'])) {
    const defaultFile = join(variantsRoot, comp, 'Default.yml');
    try {
      const content = readFileSync(defaultFile, 'utf8');
      const idMatch = content.match(/^ID:\s*"([^"]+)"/m);
      if (idMatch) variantGuids[comp] = { Default: idMatch[1] };
    } catch {
      console.warn(`Default variant YAML not found for ${comp}`);
    }
  }
}

async function writeYaml(relPath, body) {
  const full = join(ROOT, relPath);
  await mkdir(dirname(full), { recursive: true });
  await writeFile(full, body, 'utf8');
}

async function readPageHtml(slug) {
  const path = join(DESIGN, slug, 'page.html');
  try {
    return await readFile(path, 'utf8');
  } catch {
    return '';
  }
}

async function readSectionHtml(sectionPath) {
  try {
    return await readFile(join(SECTIONS, sectionPath), 'utf8');
  } catch {
    return '';
  }
}

function extractLogoUrl(html) {
  const m = html.match(/https:\/\/[^"'\s]+rai-amsterdam-logo[^"'\s]+\.png/i);
  return normalizeMediaUrl(m?.[0]) ?? 'https://edge.sitecorecloud.io/raiamsterda13f7-raidigitalpdb6c-productionf3f5-ef30/media/project/rai-amsterdam-xmc/shared/master/rai-amsterdam-logo-500x300.png';
}

function extractFooterLogoUrl(html) {
  const m = html.match(/https:\/\/[^"'\s]+rai-footer-logo[^"'\s]+\.png/i);
  return normalizeMediaUrl(m?.[0]);
}

function extractPartnerLogoUrl(html) {
  const m =
    html.match(/https:\/\/edge\.sitecorecloud\.io\/[^"'\s]+partner-logo\/i-amsterdam-transparent\.png/i) ??
    html.match(/\/partner-logo\/i-amsterdam-transparent\.png/i);
  if (!m) return null;
  if (m[0].startsWith('http')) return normalizeMediaUrl(m[0]);
  const edge = html.match(
    new RegExp(`https://edge\\.sitecorecloud\\.io/[^"'\\s]+${m[0].replace(/\//g, '\\/')}`, 'i'),
  )?.[0];
  return normalizeMediaUrl(edge ?? m[0]);
}

function extractFooterEventLinks(html) {
  const chunk = html.slice(html.indexOf('bg-brand-footer-about-bg'), html.indexOf('footer-copyright'));
  const defaults = [
    { text: 'Check out all events', href: '/en/calendar' },
    { text: 'Organise your event', href: '/en/organising' },
    { text: 'Become an exhibitor', href: '/en/exhibiting' },
  ];
  const found = [...chunk.matchAll(/fa-arrow-down-right[\s\S]*?href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)]
    .map((x) => ({ href: x[1], text: stripTags(x[2]) }))
    .filter((l) => l.text);
  return defaults.map((fallback, i) => found[i] ?? fallback);
}

function extractFooterLegalLinks(html) {
  const chunk = html.slice(html.indexOf('footer-link'), html.indexOf('footer-copyright') + 200);
  const links = [...chunk.matchAll(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi)]
    .map((x) => ({ href: x[1], text: stripTags(x[2]) }))
    .filter((l) => l.text && l.text.length < 40);
  const defaults = [
    { text: 'Privacyverklaring', href: '/en/privacy-statement' },
    { text: 'Cookie settings', href: '#' },
    { text: 'Terms of use', href: '/en/terms-of-use' },
  ];
  return defaults.map((fallback, i) => links[i] ?? fallback);
}

function extractFooterSocialLinks(html) {
  const chunk = html.slice(html.indexOf('social-platform'), html.indexOf('</footer'));
  const links = [...chunk.matchAll(/<a[^>]*href="([^"]+)"[^>]*aria-label="([^"]+)"/gi)].map((x) => ({
    href: x[1],
    text: x[2],
  }));
  const defaults = [
    { text: 'LinkedIn', href: 'https://www.linkedin.com/company/raiamsterdam' },
    { text: 'Instagram', href: 'https://www.instagram.com/raiamsterdam/' },
    { text: 'Youtube', href: 'http://www.youtube.com/user/amsterdamrai' },
  ];
  return defaults.map((fallback, i) => links[i] ?? fallback);
}

function extractUtilityIconLinks(html) {
  const links = [];
  const anchorRe =
    /<a href="([^"]+)"[^>]*class="[^"]*flex flex-col gap-y-1 items-center[^"]*"[^>]*>[\s\S]*?<i class="([^"]+)"[^>]*aria-hidden="true"[\s\S]*?<span class="text-\[14px\][^>]*uppercase">([^<]+)/gi;
  let m;
  while ((m = anchorRe.exec(html))) {
    links.push({ href: m[1], icon: m[2].trim(), text: decodeHtml(m[3]) });
  }
  if (links.length >= 4) return links.slice(0, 4);

  const defaults = [
    { text: 'FAQ', href: '/en/frequently-asked-questions', icon: 'fa-duotone fa-light fa-messages-question' },
    { text: 'Contact', href: '/en/contact', icon: 'fa-duotone fa-solid fa-messages' },
    { text: 'Careers', href: 'https://careers.rai.nl/', icon: 'fa-duotone fa-light fa-briefcase' },
    { text: 'Search', href: '/en/search', icon: 'fa-duotone fa-regular fa-magnifying-glass' },
  ];
  return defaults.map((fallback, i) => links[i] ?? fallback);
}

function extractLanguageUtility(html) {
  const globeMatch = html.match(
    /<button[^>]*>[\s\S]*?<i class="(fa-regular fa-globe[^"]*)"[\s\S]*?<span class="text-left text-\[14px\] uppercase">([^<]+)/i,
  );
  const enMatch = html.match(/href="(\/en\/[^"]*)"[^>]*>[\s\S]*?>\s*English\s*</);
  const nlMatch = html.match(/href="(\/agenda\/[^"]*)"[^>]*>[\s\S]*?>\s*Nederlands\s*</);
  return {
    text: globeMatch ? decodeHtml(globeMatch[2]) : 'English',
    href: '/en/',
    icon: globeMatch ? globeMatch[1].trim() : 'fa-regular fa-globe',
    dropdown1: { text: 'English', href: enMatch?.[1] ?? '/en/' },
    dropdown2: { text: 'Nederlands', href: nlMatch?.[1] ?? '/agenda/' },
  };
}

function extractNavFromHeader(html) {
  const mainNav = [];
  const re = /font-brand-font-family-nav-main-link uppercase[^>]*>([^<]+)</gi;
  let m;
  while ((m = re.exec(html))) {
    const text = decodeHtml(m[1]);
    if (text && !mainNav.includes(text)) mainNav.push(text);
  }
  return { mainNav: mainNav.slice(0, 4) };
}

function extractCookie(html) {
  const msg =
    stripTags(html.match(/CybotCookiebotDialogBodyContent[^>]*>([\s\S]*?)<\/div>/i)?.[1] ?? '') ||
    stripTags(html.match(/id="CybotCookiebotDialogBodyLevelButton[^"]*"[^>]*>([\s\S]*?)<\/div>/i)?.[1] ?? '') ||
    'By clicking "Accept All Cookies", you agree to the storing of cookies on your device to enhance site navigation, analyze site usage, and assist in our marketing efforts.';
  const accept =
    stripTags(html.match(/CybotCookiebotDialogBodyLevelButton[^>]*>([\s\S]*?)<\/button>/i)?.[1] ?? '') ||
    'Accept All Cookies';
  return { msg, accept };
}

const EVENT_SLUGS = {
  'HLTH Europe 2026': { slug: 'hlth-2026', dateRange: '15 - 18 June 2026', imageKey: 'hlth2026' },
  'Advanced Maritime Technology Expo': {
    slug: 'advanced-maritime-technology-2026',
    dateRange: '10 - 12 March 2026',
    imageKey: 'advanced-maritime-technology',
  },
  'Realize LIVE': { slug: 'realize-live-2026', dateRange: '19 - 21 May 2026', imageKey: 'siemens-realize-live' },
  'HumanX Amsterdam': { slug: 'human-x-amsterdam2026', dateRange: '7 - 8 October 2026', imageKey: 'humanx' },
  'Marathon Expo Amsterdam': {
    slug: 'marathon-expo-amsterdam-2026',
    dateRange: '16 - 18 October 2026',
    imageKey: 'marathon-expo-amsterdam',
  },
  'TechEx Europe 2026': { slug: 'tech-ex-2026', dateRange: '1 - 2 October 2026', imageKey: 'tech-ex' },
};

function findEventImage(html, imageKey) {
  if (!imageKey) return null;
  const re = new RegExp(`https://[^"'\\s]+/${imageKey}\\.png`, 'i');
  return normalizeMediaUrl(html.match(re)?.[0]);
}

function extractEventCards(html, titles) {
  return titles.map((title) => {
    const meta = EVENT_SLUGS[title] ?? { slug: title.toLowerCase().replace(/\s+/g, '-'), dateRange: '', imageKey: null };
    const idx = html.indexOf(title);
    let href = `/en/calendar/${meta.slug}`;
    let image = findEventImage(html, meta.imageKey);
    if (idx >= 0) {
      const before = html.slice(Math.max(0, idx - 2000), idx);
      const hrefs = [...before.matchAll(/href="(\/en\/calendar\/[^"#?]+)"/gi)].map((x) => x[1]);
      if (hrefs.length) href = hrefs[hrefs.length - 1];
      if (!image) {
        const img =
          before.match(/https:\/\/[^"'\s]+\.(?:png|jpg|webp)/gi)?.pop() ??
          html.slice(idx, idx + 800).match(/https:\/\/[^"'\s]+\.(?:png|jpg|webp)/i)?.[0];
        image = normalizeMediaUrl(img);
      }
    }
    return { title, dateRange: meta.dateRange, href, image };
  });
}

const NEWS_FALLBACK = [
  {
    title: 'Work on RAI Kwartier temporarily paused',
    date: '05/06/2026',
    href: '/en/news/work-on-rai-kwartier-temporarily-paused',
    category: 'Neighbourhood-news',
  },
  {
    title: 'RAI Amsterdam welcomes Zuidas Sustainability Award',
    date: '28/05/2026',
    href: '/en/news/rai-amsterdam-welcomes-zuidas-sustainability-award',
    category: 'Sustainability',
  },
  {
    title: 'Strong year driven by growth in exhibitions',
    date: '15/05/2026',
    href: '/en/news/strong-year-driven-by-growth-in-exhibitions',
    category: 'Corporate news',
  },
];

function extractNewsCards(html) {
  return NEWS_FALLBACK.map((fallback) => {
    const idx = html.indexOf(fallback.title);
    if (idx < 0) return { ...fallback, image: null };
    const chunk = html.slice(idx, idx + 1000);
    const href = chunk.match(/href="(\/en\/news\/[^"]+)"/i)?.[1] ?? fallback.href;
    const date = chunk.match(/\d{2}\/\d{2}\/\d{4}/)?.[0] ?? fallback.date;
    const image =
      normalizeMediaUrl(
        html.slice(Math.max(0, idx - 1200), idx + 400).match(/https:\/\/[^"'\s]+\.(?:png|jpg|webp)/i)?.[0],
      ) ?? null;
    return { ...fallback, href, date, image };
  });
}

function extractHlthDetail(html, sectionHtml = '') {
  const source = sectionHtml || html;
  const title = stripTags(source.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? 'HLTH Europe 2026');
  const dateRange = stripTags(
    source.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i)?.[1] ??
      source.match(/15\s*-\s*18\s+June\s+2026/i)?.[0] ??
      '15 - 18 June 2026',
  );
  const descHtml =
    source.match(/<p>HLTH Europe is[\s\S]*?<\/p>/i)?.[0] ??
    source.match(/content="(HLTH Europe is[^"]+)"/i)?.[1] ??
    '<p>HLTH Europe is where global expertise meets local insight to address Europe\'s unique healthcare challenges and opportunities. From digital health breakthroughs to policy innovations, HLTH Europe offers an immersive experience shaping the future of European healthcare. Join us at the epicentre of transformation, where healthcare providers, policymakers, and pioneers unite to create a healthier Europe for all.</p>';
  const description = descHtml.startsWith('<') ? descHtml : `<p>${descHtml}</p>`;
  const logo = normalizeMediaUrl(
    source.match(/hlth2026\.(?:png|jpg|webp)/i)
      ? source.match(/https:\/\/[^"'\s]+hlth2026\.(?:png|jpg|webp)/i)?.[0]
      : source.match(/https:\/\/[^"'\s]+hlth[^"'\s]*\.(?:png|jpg|webp)/i)?.[0],
  );
  const openingHours = [
    '15 June  12:00PM - 07:30PM',
    '16 June  08:00AM - 06:45PM',
    '17 June  08:00AM - 10:30PM',
    '18 June  09:00AM - 03:00PM',
  ]
    .map((line) => {
      const found = source.includes(line.replace(/\s+/g, ' ').trim());
      return found ? line : null;
    })
    .filter(Boolean);
  const openingBlock =
    openingHours.length > 0
      ? `<p>${openingHours.join('<br>')}</p>`
      : '<p>15 June  12:00PM - 07:30PM<br>16 June  08:00AM - 06:45PM<br>17 June  08:00AM - 10:30PM<br>18 June  09:00AM - 03:00PM</p>';
  const locationText = stripTags(
    source.match(/Location<\/h2>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i)?.[1] ?? 'Entrance K',
  );
  const ticketText = stripTags(
    source.match(/Ticket info<\/h2>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i)?.[1] ?? '2795',
  );
  return {
    title,
    dateRange,
    description,
    primaryCta: { text: 'Buy your tickets', href: 'https://hlth.com/events/europe/register/' },
    secondaryCta: { text: 'Hotel Services', href: 'https://hotelmap.com/MA67N' },
    logo,
    openingHours: openingBlock,
    location: `<p>${locationText}</p>`,
    ticketInfo: `<p>${ticketText}</p>`,
    organization: 'HLTH 2026',
    organizationLink: 'https://hlth.com/events/europe/',
  };
}

function registerDatasource(component, itemName, parentFolderId, templateId, fields, folderPath) {
  const id = stableGuid(`rai-ds-${component}-${itemName}`);
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
${metaFields(`rai-ds-${ds.itemName}`)}
`,
  );
}

function escapeRenderingPar(par) {
  return par.replace(/&/g, '&amp;');
}

function buildRenderingPar(componentName, variant = 'Default', extra = '') {
  const guid = (variantGuids[componentName]?.[variant] ?? '').toUpperCase();
  const parts = ['CSSStyles'];
  if (guid) parts.push(`FieldNames=%7B${guid}%7D`);
  if (extra) parts.push(extra);
  return parts.join('&');
}

function buildNavigationPar(variant = 'Default', extra = '') {
  const guid = (variantGuids.Navigation?.[variant] ?? '').toUpperCase();
  const parts = [
    'CSSStyles',
    guid ? `FieldNames=%7B${guid}%7D` : '',
    `LevelFrom=%7B${NAV_LEVEL_FROM}%7D`,
    `LevelTo=%7B${NAV_LEVEL_TO}%7D`,
    `Filter=%7B${NAVIGATION_FILTER_ID}%7D`,
    'Flattened',
    'AddRoot=1',
  ].filter(Boolean);
  if (extra) parts.push(extra);
  return parts.join('&');
}

function buildRenderingEntry({ uid, renderingId, dsId, ph, par = 'CSSStyles', before, after }) {
  const afterRef = after ? after.toUpperCase() : null;
  const pos = before ? `p:before="${before}"` : afterRef ? `p:after="r[@uid='${afterRef}']"` : `p:after="*[1=2]"`;
  const ds = dsId ? `\n          s:ds="${dsId}"` : '';
  return `        <r
          uid="${guidUpper(uid)}"
          ${pos}${ds}
          s:id="{${guidUpper(renderingId)}}"
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

function appendSectionWithChildren(
  entries,
  dpCounterRef,
  pageKey,
  sectionComponent,
  sectionDsId,
  phKey,
  childComponent,
  childDsIds,
  childVariant = 'Default',
) {
  const dp = dpCounterRef.value++;
  entries.push({
    uid: stableGuid(`rai-${pageKey}-${sectionComponent}-${dp}`),
    renderingId: ids[sectionComponent].renderingId,
    dsId: sectionDsId,
    ph: 'headless-main',
    par: buildRenderingPar(sectionComponent, 'Default', `DynamicPlaceholderId=${dp}`),
  });
  childDsIds.forEach((childDs, i) => {
    entries.push({
      uid: stableGuid(`rai-${pageKey}-${childComponent}-${dp}-${i}`),
      renderingId: ids[childComponent].renderingId,
      dsId: childDs,
      ph: `/headless-main/${phKey}-${dp}`,
      par: buildRenderingPar(childComponent, childVariant),
    });
  });
}

async function buildSiteChrome(homeHtml, headerHtml, cookieHtml) {
  const logoUrl = extractLogoUrl(headerHtml || homeHtml);
  const footerLogoUrl = extractFooterLogoUrl(homeHtml);

  const headerDs = registerDatasource(
    'Header',
    'Site Header',
    getDataFolderId('Header'),
    ids.Header.templateId,
    {
      LogoText: 'RAI Amsterdam',
      LogoLink: linkField('RAI Amsterdam', '/en/'),
      Logo: imageField(logoUrl, 'RAI Amsterdam logo'),
    },
    'Headers',
  );

  const utilityLinks = extractUtilityIconLinks(headerHtml);
  const languageUtility = extractLanguageUtility(headerHtml);
  const iconLinkDsIds = utilityLinks.map((item, i) =>
    registerDatasource(
      'HeaderIconLink',
      `Header Utility ${item.text}`,
      getDataFolderId('HeaderIconLink'),
      ids.HeaderIconLink.templateId,
      {
        Link: linkField(item.text, item.href),
        IconClass: item.icon,
      },
      'HeaderIconLinks',
    ),
  );
  iconLinkDsIds.push(
    registerDatasource(
      'HeaderIconLink',
      'Header Language English',
      getDataFolderId('HeaderIconLink'),
      ids.HeaderIconLink.templateId,
      {
        Link: linkField(languageUtility.text, languageUtility.href),
        IconClass: languageUtility.icon,
        DropdownLink1: linkField(languageUtility.dropdown1.text, languageUtility.dropdown1.href),
        DropdownLink2: linkField(languageUtility.dropdown2.text, languageUtility.dropdown2.href),
      },
      'HeaderIconLinks',
    ),
  );

  const eventLinks = extractFooterEventLinks(homeHtml);
  const legalLinks = extractFooterLegalLinks(homeHtml);
  const socialLinks = extractFooterSocialLinks(homeHtml);
  const partnerLogoUrl = extractPartnerLogoUrl(homeHtml);

  const footerDs = registerDatasource(
    'Footer',
    'Site Footer',
    getDataFolderId('Footer'),
    ids.Footer.templateId,
    {
      EventsTitle: 'Events at RAI Amsterdam',
      EventLink1: linkField(eventLinks[0].text, eventLinks[0].href),
      EventLink2: linkField(eventLinks[1].text, eventLinks[1].href),
      EventLink3: linkField(eventLinks[2].text, eventLinks[2].href),
      NewsletterTitle: 'Subscribe for newsletter',
      NewsletterCta: linkField('Subscribe', '/en/newsletter'),
      ContactTitle: 'Contact us',
      ContactBody: 'RAI Amsterdam\nP.O. Box 77777, 1070 MS Amsterdam\nEuropaplein 24, 1078 GZ Amsterdam\nThe Netherlands',
      ContactPhone: '+31 (0)20 549 12 12',
      ContactLink: linkField('Contact', '/en/contact'),
      DirectionsLink: linkField('Get directions', '/en/route'),
      Logo: footerLogoUrl ? imageField(footerLogoUrl, 'RAI Amsterdam') : '',
      PartnerLogo: partnerLogoUrl ? imageField(partnerLogoUrl, 'I amsterdam') : '',
      LegalLink1: linkField(legalLinks[0].text, legalLinks[0].href),
      LegalLink2: linkField(legalLinks[1].text, legalLinks[1].href),
      LegalLink3: linkField(legalLinks[2].text, legalLinks[2].href),
      SocialLink1: linkField(socialLinks[0].text, socialLinks[0].href),
      SocialLink2: linkField(socialLinks[1].text, socialLinks[1].href),
      SocialLink3: linkField(socialLinks[2].text, socialLinks[2].href),
      CopyrightYear: '2026',
      CopyrightText: 'Copyright',
    },
    'Footers',
  );

  const cookie = extractCookie(cookieHtml);
  const cookieDs = registerDatasource(
    'CookieBanner',
    'Site Cookie Banner',
    getDataFolderId('CookieBanner'),
    ids.CookieBanner.templateId,
    {
      Message: cookie.msg,
      AcceptLabel: cookie.accept,
      PrivacyLink: linkField('Cookie Notice', `${BASE_URL}/en/privacy-statement`),
    },
    'CookieBanners',
  );

  return { headerDs, iconLinkDsIds, footerDs, cookieDs };
}

function buildEventCardDs(event, index, prefix) {
  return registerDatasource(
    'EventListCard',
    `${prefix} Event ${index + 1}`,
    getDataFolderId('EventListCard'),
    ids.EventListCard.templateId,
    {
      Title: event.title,
      DateRange: event.dateRange,
      Image: event.image ? imageField(event.image, event.title) : '',
      Link: linkField(event.title, event.href),
    },
    'EventListCards',
  );
}

function buildNewsCardDs(article, index) {
  return registerDatasource(
    'NewsArticleCard',
    `Home News ${index + 1}`,
    getDataFolderId('NewsArticleCard'),
    ids.NewsArticleCard.templateId,
    {
      Title: article.title,
      Date: article.date,
      Category: article.category,
      Image: article.image ? imageField(article.image, article.title) : '',
      Link: linkField('Read article', article.href),
    },
    'NewsArticleCards',
  );
}

function extractHeroBannerImages(html) {
  const bgUrl = normalizeMediaUrl(html.match(/https:[^"'\s]+home-banner\.jpg/i)?.[0]);
  const brandUrl = normalizeMediaUrl(html.match(/https:[^"'\s]+brand-element-rai-website\.png/i)?.[0]);
  return { bgUrl, brandUrl };
}

async function buildPageDatasources(homeHtml, calendarHtml, hlthHtml, hlthSectionHtml) {
  const eventTitles = Object.keys(EVENT_SLUGS);
  const homeEvents = extractEventCards(homeHtml, eventTitles);
  const calendarEvents = extractEventCards(calendarHtml, eventTitles);
  const { bgUrl, brandUrl } = extractHeroBannerImages(homeHtml);

  const heroBannerDs = registerDatasource(
    'FullBleedHeroBannerSection',
    'Home Hero Banner',
    getDataFolderId('FullBleedHeroBannerSection'),
    ids.FullBleedHeroBannerSection.templateId,
    {
      Title: 'RAI Amsterdam',
      BackgroundImage: bgUrl ? imageField(bgUrl, 'RAI Amsterdam home banner') : '',
      BrandImage: brandUrl ? imageField(brandUrl, 'Hero') : '',
    },
    'FullBleedHeroBannerSections',
  );

  const heroDs = registerDatasource(
    'HomeHeroEventsSection',
    'Home Events',
    getDataFolderId('HomeHeroEventsSection'),
    ids.HomeHeroEventsSection.templateId,
    {
      Title: 'These events will be at RAI Amsterdam soon',
      AllEventsLink: linkField('ALL EVENTS', '/en/calendar'),
    },
    'HomeHeroEventsSections',
  );

  const newsDs = registerDatasource(
    'NewsArticlesSection',
    'Home News',
    getDataFolderId('NewsArticlesSection'),
    ids.NewsArticlesSection.templateId,
    { Title: 'The latest news articles' },
    'NewsArticlesSections',
  );

  const calendarDs = registerDatasource(
    'CalendarListingSection',
    'Calendar Listing',
    getDataFolderId('CalendarListingSection'),
    ids.CalendarListingSection.templateId,
    { Title: 'What is on the RAI Amsterdam calendar' },
    'CalendarListingSections',
  );

  const breadcrumbCalendarDs = registerDatasource(
    'Breadcrumb',
    'Calendar Breadcrumb',
    getDataFolderId('Breadcrumb'),
    ids.Breadcrumb.templateId,
    { Separator: '/' },
    'Breadcrumbs',
  );

  const breadcrumbHlthDs = registerDatasource(
    'Breadcrumb',
    'HLTH Breadcrumb',
    getDataFolderId('Breadcrumb'),
    ids.Breadcrumb.templateId,
    { Separator: '/' },
    'Breadcrumbs',
  );

  const hlth = extractHlthDetail(hlthHtml, hlthSectionHtml);
  const hlthHeroDs = registerDatasource(
    'EventDetailHeroSection',
    'HLTH 2026 Hero',
    getDataFolderId('EventDetailHeroSection'),
    ids.EventDetailHeroSection.templateId,
    {
      Title: hlth.title,
      DateRange: hlth.dateRange,
      Description: hlth.description,
      PrimaryCta: linkField(hlth.primaryCta.text, hlth.primaryCta.href),
      SecondaryCta: linkField(hlth.secondaryCta.text, hlth.secondaryCta.href),
      Image: hlth.logo ? imageField(hlth.logo, hlth.title) : '',
    },
    'EventDetailHeroSections',
  );

  const hlthInfoDs = registerDatasource(
    'EventDetailInfoSection',
    'HLTH 2026 Info',
    getDataFolderId('EventDetailInfoSection'),
    ids.EventDetailInfoSection.templateId,
    {
      OpeningHoursTitle: 'Opening hours',
      OpeningHours: hlth.openingHours,
      LocationTitle: 'Location',
      Location: hlth.location,
      TicketTitle: 'Ticket info',
      TicketInfo: hlth.ticketInfo,
      OrganisationName: hlth.organization,
      OrganisationLink: linkField(hlth.organization, hlth.organizationLink),
    },
    'EventDetailInfoSections',
  );

  return {
    heroBannerDs,
    heroDs,
    homeEventDsIds: homeEvents.map((e, i) => buildEventCardDs(e, i, 'Home')),
    newsDs,
    newsCardDsIds: extractNewsCards(homeHtml).map((a, i) => buildNewsCardDs(a, i)),
    calendarDs,
    calendarEventDsIds: calendarEvents.map((e, i) => buildEventCardDs(e, i, 'Calendar')),
    breadcrumbCalendarDs,
    breadcrumbHlthDs,
    hlthHeroDs,
    hlthInfoDs,
  };
}

function buildHomeRenderings(ds) {
  const entries = [];
  const dp = { value: 1 };
  entries.push({
    uid: stableGuid('rai-home-hero-banner'),
    renderingId: ids.FullBleedHeroBannerSection.renderingId,
    dsId: ds.heroBannerDs,
    ph: 'headless-main',
    par: buildRenderingPar('FullBleedHeroBannerSection', 'Default'),
  });
  appendSectionWithChildren(entries, dp, 'home', 'HomeHeroEventsSection', ds.heroDs, 'event-cards', 'EventListCard', ds.homeEventDsIds);
  appendSectionWithChildren(entries, dp, 'home', 'NewsArticlesSection', ds.newsDs, 'news-cards', 'NewsArticleCard', ds.newsCardDsIds);
  return buildRenderingsXml(entries);
}

function buildCalendarRenderings(ds) {
  const entries = [];
  const dp = { value: 1 };
  entries.push({
    uid: stableGuid('rai-calendar-breadcrumb'),
    renderingId: ids.Breadcrumb.renderingId,
    dsId: ds.breadcrumbCalendarDs,
    ph: 'headless-main',
    par: buildRenderingPar('Breadcrumb', 'Default'),
  });
  appendSectionWithChildren(
    entries,
    dp,
    'calendar',
    'CalendarListingSection',
    ds.calendarDs,
    'calendar-events',
    'EventListCard',
    ds.calendarEventDsIds,
    'ImageTop',
  );
  return buildRenderingsXml(entries);
}

function buildHlthRenderings(ds) {
  const entries = [];
  entries.push({
    uid: stableGuid('rai-hlth-breadcrumb'),
    renderingId: ids.Breadcrumb.renderingId,
    dsId: ds.breadcrumbHlthDs,
    ph: 'headless-main',
    par: buildRenderingPar('Breadcrumb', 'Default'),
  });
  entries.push({
    uid: stableGuid('rai-hlth-hero'),
    renderingId: ids.EventDetailHeroSection.renderingId,
    dsId: ds.hlthHeroDs,
    ph: 'headless-main',
    par: buildRenderingPar('EventDetailHeroSection', 'Default'),
  });
  entries.push({
    uid: stableGuid('rai-hlth-info'),
    renderingId: ids.EventDetailInfoSection.renderingId,
    dsId: ds.hlthInfoDs,
    ph: 'headless-main',
    par: buildRenderingPar('EventDetailInfoSection', 'Default'),
  });
  return buildRenderingsXml(entries);
}

async function writeHomePageYaml(renderingsXml) {
  await writeYaml(
    `${SITE_REL}/Home.yml`,
    `---
ID: "${HOME_FOLDER_ID}"
Parent: "${SITE_ID}"
Template: "${PAGE_TEMPLATE_ID}"
Path: "${SITE_PATH}/Home"
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
      Value: Home
    - ID: "${PAGE_TITLE_FIELD}"
      Hint: Title
      Value: Home
${metaFields('rai-page-home')}
`,
  );
}

async function writePageYaml(relPath, itemName, parentId, pageId, title, renderingsXml) {
  await writeYaml(
    `${SITE_REL}/Home/${relPath}`,
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
${metaFields(`rai-page-${itemName}`)}
`,
  );
}

async function writeMainNavPageYaml(relPath, itemName, parentId, pageId, navTitle, pageTitle = navTitle, sortOrder) {
  const sortField = sortOrder
    ? `- ID: "ba3f86a2-4a1c-4d78-b63d-91c2779c1b5e"
  Hint: __Sortorder
  Value: ${sortOrder}
`
    : '';
  await writeYaml(
    `${SITE_REL}/Home/${relPath}`,
    `---
ID: "${pageId}"
Parent: "${parentId}"
Template: "${PAGE_TEMPLATE_ID}"
Path: "${SITE_PATH}/Home/${itemName}"
SharedFields:
- ID: "${NAV_FILTER_FIELD}"
  Hint: NavigationFilter
  Value: "{${NAVIGATION_FILTER_ID}}"
${sortField}Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
    - ID: "${NAV_TITLE_FIELD}"
      Hint: NavigationTitle
      Value: ${navTitle}
    - ID: "${PAGE_TITLE_FIELD}"
      Hint: Title
      Value: ${pageTitle}
${metaFields(`rai-page-${itemName.replace(/\//g, '-')}`)}
`,
  );
}

async function writeMainNavPages() {
  const exhibitingId = '13e2d65d-13f4-4636-b235-f2d627178c37';
  const organisingId = '3cc66307-cd18-4865-a0f9-97dde1553bbe';

  await writeMainNavPageYaml('Visiting.yml', 'Visiting', HOME_FOLDER_ID, PAGE_VISITING_ID, 'Visiting', 'Visiting', 100);
  await writeMainNavPageYaml(
    'Exhibiting.yml',
    'Exhibiting',
    HOME_FOLDER_ID,
    exhibitingId,
    'Exhibiting',
    'Exhibiting',
    200,
  );
  await writeMainNavPageYaml(
    'Organising.yml',
    'Organising',
    HOME_FOLDER_ID,
    organisingId,
    'Organising',
    'Organising',
    300,
  );
  await writeMainNavPageYaml(
    'About us.yml',
    'About us',
    HOME_FOLDER_ID,
    PAGE_ABOUT_US_ID,
    'About us',
    'About us',
    400,
  );
}

async function writeStubPageYaml(relPath, itemName, parentId, pageId, title) {
  await writeYaml(
    `${SITE_REL}/Home/${relPath}`,
    `---
ID: "${pageId}"
Parent: "${parentId}"
Template: "${PAGE_TEMPLATE_ID}"
Path: "${SITE_PATH}/Home/${itemName}"
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
${metaFields(`rai-page-stub-${itemName}`)}
`,
  );
}

async function writeStubPagesFromTree() {
  const treePath = join(DESIGN, 'site-content-tree.json');
  let tree;
  try {
    tree = JSON.parse(await readFile(treePath, 'utf8'));
  } catch {
    console.warn('No site-content-tree.json — skipping stub pages');
    return 0;
  }

  const pageIdByPath = new Map([
    [`${SITE_PATH}/Home`, HOME_FOLDER_ID],
    [`${SITE_PATH}/Home/Calendar`, PAGE_CALENDAR_ID],
    [`${SITE_PATH}/Home/Calendar/Hlth 2026`, PAGE_HLTH_ID],
  ]);

  for (const page of tree.pages ?? []) {
    if (page.status === 'mimicked' && page.sitecorePath && !pageIdByPath.has(page.sitecorePath)) {
      pageIdByPath.set(page.sitecorePath, stableGuid(`rai-page-${page.sitecorePath}`));
    }
  }

  const stubs = (tree.pages ?? [])
    .filter((p) => p.status === 'stub' && p.routePath !== '/' && p.sitecoreSegments?.length)
    .sort((a, b) => a.sitecoreSegments.length - b.sitecoreSegments.length);

  let written = 0;

  async function ensureStubChain(segments, leafTitle) {
    const sitecorePath = `${SITE_PATH}/Home/${segments.join('/')}`;
    if (pageIdByPath.has(sitecorePath)) return pageIdByPath.get(sitecorePath);

    const parentSegments = segments.slice(0, -1);
    const parentId =
      parentSegments.length === 0
        ? HOME_FOLDER_ID
        : await ensureStubChain(parentSegments, segments[segments.length - 1]);

    const pageId = stableGuid(`rai-page-${sitecorePath}`);
    pageIdByPath.set(sitecorePath, pageId);
    const relPath = `${segments.join('/')}.yml`;
    const itemName = segments.join('/');
    const title = (leafTitle || segments[segments.length - 1]).replace(/"/g, '\\"');
    await writeStubPageYaml(relPath, itemName, parentId, pageId, title);
    written++;
    return pageId;
  }

  for (const page of stubs) {
    await ensureStubChain(page.sitecoreSegments, page.title || page.itemName);
  }
  return written;
}

async function writePresentation(chrome) {
  const headerPdId = stableGuid('rai-pd-header');
  const footerPdId = stableGuid('rai-pd-footer');
  const cookiePdId = stableGuid('rai-pd-cookie');
  const defaultPdId = stableGuid('rai-page-design-default');

  const headerEntries = [
    {
      uid: stableGuid('rai-pd-header-rendering'),
      renderingId: ids.Header.renderingId,
      dsId: chrome.headerDs,
      ph: 'headless-header',
      par: buildRenderingPar('Header', 'Default', 'DynamicPlaceholderId=1'),
    },
    {
      uid: stableGuid('rai-pd-header-nav'),
      renderingId: ids.Navigation.renderingId,
      ph: '/headless-header/header-nav-1',
      par: buildNavigationPar('Default', 'DynamicPlaceholderId=1'),
    },
    ...chrome.iconLinkDsIds.map((dsId, i) => ({
      uid: stableGuid(`rai-pd-header-icon-${i}`),
      renderingId: ids.HeaderIconLink.renderingId,
      dsId,
      ph: '/headless-header/header-utility-1',
      par: buildRenderingPar('HeaderIconLink', 'Default'),
    })),
  ];

  const footerEntries = [
    {
      uid: stableGuid('rai-pd-footer-rendering'),
      renderingId: ids.Footer.renderingId,
      dsId: chrome.footerDs,
      ph: 'headless-footer',
      par: buildRenderingPar('Footer', 'Default', 'DynamicPlaceholderId=1'),
    },
  ];

  const cookieEntries = [
    {
      uid: stableGuid('rai-pd-cookie-rendering'),
      renderingId: ids.CookieBanner.renderingId,
      dsId: chrome.cookieDs,
      ph: 'headless-cookie',
      par: buildRenderingPar('CookieBanner', 'Default'),
    },
  ];

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
${metaFields('rai-pd-header')}
`,
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
${metaFields('rai-pd-footer')}
`,
  );

  await writeYaml(
    `${SITE_REL}/Presentation/Partial Designs/Cookie.yml`,
    `---
ID: "${cookiePdId}"
Parent: "${PARTIAL_DESIGNS_FOLDER}"
Template: "${PARTIAL_DESIGN_TEMPLATE}"
Path: "${SITE_PATH}/Presentation/Partial Designs/Cookie"
SharedFields:
- ID: "55faae90-3bba-4f7f-96fe-13c3f40055ff"
  Hint: Signature
  Value: cookie
- ID: "f1a1fe9e-a60c-4ddb-a3a0-bb5b29fe732e"
  Hint: __Renderings
  Value: |
${buildRenderingsXml(cookieEntries)}
Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
${metaFields('rai-pd-cookie')}
`,
  );

  const headerPhSettingId = stableGuid('rai-pd-ph-header');
  const footerPhSettingId = stableGuid('rai-pd-ph-footer');
  const cookiePhSettingId = stableGuid('rai-pd-ph-cookie');

  for (const [name, phKey, phSettingId, signature] of [
    ['Header', 'sxa-header', headerPhSettingId, 'header'],
    ['Footer', 'sxa-footer', footerPhSettingId, 'footer'],
    ['Cookie', 'sxa-cookie', cookiePhSettingId, 'cookie'],
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
${metaFields(`rai-pd-ph-${signature}`)}
`,
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
  Value: "${headerPdId.toUpperCase()}|${footerPdId.toUpperCase()}|${cookiePdId.toUpperCase()}"
Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
${metaFields('rai-page-design-default')}
`,
  );

  const mapping = `%7b${PAGE_TEMPLATE_ID.toUpperCase()}%7d%3d%257B${defaultPdId.toUpperCase()}%257D`;
  let pageDesignsYml = await readFile(join(ROOT, SITE_REL, 'Presentation/Page Designs.yml'), 'utf8');
  if (!pageDesignsYml.includes('TemplatesMapping')) {
    pageDesignsYml = pageDesignsYml.replace(
      'SharedFields:',
      `SharedFields:
- ID: "ba1f60d6-3deb-40cc-bb61-eec772279ee1"
  Hint: TemplatesMapping
  Value: "${mapping}"`,
    );
    await writeFile(join(ROOT, SITE_REL, 'Presentation/Page Designs.yml'), pageDesignsYml, 'utf8');
  }

  return { headerPdId, footerPdId, cookiePdId, defaultPdId, headerPhSettingId, footerPhSettingId, cookiePhSettingId };
}

async function patchMediaIds(mediaResults) {
  const urlToId = Object.fromEntries(mediaResults.map((r) => [r.Url, r.MediaId]));

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

  await walk(join(ROOT, SITE_REL, 'Data'));
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
  if (orphans.length) {
    console.warn(
      `Unresolved MEDIA placeholders remain:\n${orphans.map((o) => `  - ${o.file}: ${o.tokens.join(', ')}`).join('\n')}`,
    );
  }
}

async function downloadMedia() {
  if (!mediaAssets.length) return [];
  const manifestPath = join(__dirname, 'rai-media-manifest.json');
  await writeFile(manifestPath, JSON.stringify(mediaAssets, null, 2), 'utf8');
  console.log(`Wrote ${mediaAssets.length} media URLs to rai-media-manifest.json`);

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
  const errors = [];
  await loadDataFolderIds();
  loadVariantGuids();
  await loadContentTreeLinks();

  const homeHtml = await readPageHtml('rai-nl--en');
  const calendarHtml = await readPageHtml('rai-nl--en-calendar');
  const hlthHtml = await readPageHtml('rai-nl--en-calendar-hlth-2026');
  const hlthSectionHtml = await readSectionHtml('event-detail-info-section/section.html');
  const headerHtml = await readSectionHtml('header/section.html');
  const cookieHtml = await readSectionHtml('cookie-banner/section.html');

  if (!homeHtml) errors.push('Missing home page HTML capture');
  if (!calendarHtml) errors.push('Missing calendar page HTML capture');
  if (!hlthHtml) errors.push('Missing HLTH event page HTML capture');

  console.log('Building site chrome datasources...');
  const chrome = await buildSiteChrome(homeHtml, headerHtml, cookieHtml);

  console.log('Building page datasources...');
  const pageDs = await buildPageDatasources(homeHtml, calendarHtml, hlthHtml, hlthSectionHtml);

  console.log('Writing datasource YAML...');
  for (const dsId of Object.keys(datasourceRegistry)) {
    await writeDatasourceItem(dsId);
  }

  console.log('Writing presentation (partial designs + page design)...');
  const presentationIds = await writePresentation(chrome);

  console.log('Writing page YAML...');
  await writeHomePageYaml(buildHomeRenderings(pageDs));
  await writePageYaml('Calendar.yml', 'Calendar', HOME_FOLDER_ID, PAGE_CALENDAR_ID, 'Calendar', buildCalendarRenderings(pageDs));
  await writePageYaml('Calendar/Hlth 2026.yml', 'Calendar/Hlth 2026', PAGE_CALENDAR_ID, PAGE_HLTH_ID, 'HLTH Europe 2026', buildHlthRenderings(pageDs));

  const stubCount = await writeStubPagesFromTree();
  if (stubCount) console.log(`Wrote ${stubCount} stub page(s) from site-content-tree.json`);

  console.log('Writing main navigation pages...');
  await writeMainNavPages();

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
    errors.push('Serialization validate reported issues');
  }

  console.log('\n=== RAI Authoring Complete ===');
  console.log('Pages created:');
  console.log(`  Home: ${SITE_PATH}/Home (${HOME_FOLDER_ID})`);
  console.log(`  Calendar: ${SITE_PATH}/Home/Calendar (${PAGE_CALENDAR_ID})`);
  console.log(`  HLTH 2026: ${SITE_PATH}/Home/Calendar/Hlth 2026 (${PAGE_HLTH_ID})`);
  console.log('Key GUIDs:');
  console.log(`  Site: ${SITE_ID}`);
  console.log(`  Home folder: ${HOME_FOLDER_ID}`);
  console.log(`  Page design: ${presentationIds.defaultPdId}`);
  console.log(`  Header PD: ${presentationIds.headerPdId}`);
  console.log(`  Footer PD: ${presentationIds.footerPdId}`);
  console.log(`  Cookie PD: ${presentationIds.cookiePdId}`);
  console.log(`  PH settings: Header=${presentationIds.headerPhSettingId}, Footer=${presentationIds.footerPhSettingId}, Cookie=${presentationIds.cookiePhSettingId}`);
  console.log(`  Datasources written: ${Object.keys(datasourceRegistry).length}`);
  console.log(`  Media assets tracked: ${mediaAssets.length}, downloaded/reused: ${mediaResults.length}`);
  if (errors.length) {
    console.log('Errors/warnings:');
    errors.forEach((e) => console.log(`  - ${e}`));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
