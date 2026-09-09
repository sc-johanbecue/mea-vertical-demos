#!/usr/bin/env node
/**
 * Completes JM3Collection (jm3site) authoring: English datasource YAML, pages, partial designs, media.
 * Usage: node authoring/scripts/Complete-Jm3Authoring.mjs
 */
import { createHash, randomUUID } from "node:crypto";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { mkdir, writeFile, readFile, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = join(__dirname, "..", "..");
const COLLECTION_FOLDER = join(__dirname, "..", "items", "JM3Collection");
const ROOT = join(COLLECTION_FOLDER, "serialized-content");
const SITE_REL = "jm3site/jm3site";
const SECTIONS = join(
  REPO,
  "authoring",
  "items",
  "Axa Insurance2",
  "design-screenshots",
  "sections",
);
const MATTHEY_DECOMP = join(REPO, "design-screenshots", "matthey-com");
const SITE_PATH = "/sitecore/content/jm3collection/jm3site";
const OWNER = "sitecore\\johan.becue@sitecore.com";
const NOW = "20260615T120000Z";
const BASE_URL = "https://matthey.com";
const MODULE_NAMESPACE = "jm3collection-scs";

const DEVICE_ID = "FE5D7FDF-89C0-4D99-9AA3-B5FBD009C9F3";
const PAGE_TEMPLATE_ID = "57324db5-db3c-4006-8e80-1dfe584bdda2";
const PARTIAL_DESIGN_TEMPLATE = "fd2059fd-6043-4dfe-8c04-e2437ce87634";
const PAGE_DESIGN_TEMPLATE = "1105b8f8-1e00-426b-bf1f-c840742d827b";
const PAGE_TITLE_FIELD = "89586614-7410-48b9-9775-73739234893e";
const NAV_TITLE_FIELD = "4e0720e9-9d50-4ddc-87cf-ecd65e8e94c8";
const NAVIGATION_FILTER_ID = "D063E9D1-C7B5-4B1E-B31E-69886C9C59F5";
const NAV_LEVEL_FROM = "1BB88840-5FB3-4353-AD8D-81136F6FF75A";
const NAV_LEVEL_TO = "A59325BB-5A27-46F9-B8110-9D499715F3BE";
const NAV_FILTER_FIELD = "1fbc6a49-6281-48ee-87e9-a3970b145adb";

const HOME_ID = "d9ac9d14-4209-45be-939a-6fcd2897be23";
const SITE_ID = "c9e6e93d-0afd-477e-b55b-8c6c28bfad1d";
const PARTIAL_DESIGNS_FOLDER = "d24251c0-02ff-484f-8c63-7be9db232f80";
const PARTIAL_DESIGN_PH_FOLDER = "61a80214-09b4-44f7-bb3d-54f8ff3ac386";
const PARTIAL_DESIGN_PH_SETTING_TEMPLATE =
  "d2a6884c-04d5-4089-a64e-d27ca9d68d4c";
const PAGE_DESIGNS_FOLDER = "de6660ed-cc1f-4bcf-b81c-3c094871863f";
const MEDIA_ROOT_ID = "f5d4c7c9-ed19-49d7-a156-03461bc6427c";
const MEDIA_ROOT_DISK = join(ROOT, "media-library", "jm3collection", "jm3site");
const SITE_MEDIA_PATH = "/sitecore/media library/Project/jm3collection/jm3site";

const COMPONENT_META = [
  { name: "CookieBanner", dataFolder: "CookieBanners" },
  {
    name: "Header",
    dataFolder: "Headers",
    ph: "header-nav",
    child: "Navigation",
    utilityPh: "header-utility",
    utilityChild: "HeaderIconLink",
  },
  { name: "Navigation", dataFolder: "Navigations" },
  { name: "HeaderIconLink", dataFolder: "HeaderIconLinks" },
  {
    name: "Footer",
    dataFolder: "Footers",
    ph: "footer-links",
    child: "LinkList",
  },
  { name: "LinkList", dataFolder: "LinkLists" },
  {
    name: "FullBleedHeroBannerSection",
    dataFolder: "FullBleedHeroBannerSections",
  },
  {
    name: "CompositeHeroBandSection",
    dataFolder: "CompositeHeroBandSections",
    ph: "hero-slides",
    child: "HeroSlideCard",
  },
  { name: "HeroSlideCard", dataFolder: "HeroSlideCards" },
  { name: "HeroPanelCard", dataFolder: "HeroPanelCards" },
  { name: "HeroStatsPanel", dataFolder: "HeroStatsPanels" },
  {
    name: "EyebrowTitleCarouselSection",
    dataFolder: "EyebrowTitleCarouselSections",
    ph: "carousel-slides",
    child: "FeatureCarouselCard",
  },
  { name: "FeatureCarouselCard", dataFolder: "FeatureCarouselCards" },
  {
    name: "TitleDescriptionLinkGridSection",
    dataFolder: "TitleDescriptionLinkGridSections",
    ph: "link-cards",
    child: "HorizontalLinkCard",
  },
  { name: "ImageRichTextSection", dataFolder: "ImageRichTextSections" },
  { name: "BackgroundPanelSection", dataFolder: "BackgroundPanelSections" },
  {
    name: "TitleDescriptionTeaserGridSection",
    dataFolder: "TitleDescriptionTeaserGridSections",
    ph: "teaser-cards",
    child: "VerticalTeaserCard",
  },
  { name: "VerticalTeaserCard", dataFolder: "VerticalTeaserCards" },
  {
    name: "TitleStatsBarSection",
    dataFolder: "TitleStatsBarSections",
    ph: "stats-items",
    child: "StatsItem",
  },
  { name: "StatsItem", dataFolder: "StatsItems" },
  {
    name: "TitleDescriptionCtaSection",
    dataFolder: "TitleDescriptionCtaSections",
  },
  {
    name: "TitleDescriptionVideoSection",
    dataFolder: "TitleDescriptionVideoSections",
  },
  { name: "ImageRichTextSection", dataFolder: "ImageRichTextSections" },
  {
    name: "FullBleedHeroBannerSection",
    dataFolder: "FullBleedHeroBannerSections",
  },
  { name: "Breadcrumb", dataFolder: "Breadcrumbs" },
  {
    name: "NewsArticleGridSection",
    dataFolder: "NewsArticleGridSections",
    ph: "news-articles",
    child: "NewsArticleCard",
  },
  { name: "NewsArticleCard", dataFolder: "NewsArticleCards" },
  { name: "ArticleHeroSection", dataFolder: "ArticleHeroSections" },
  { name: "ArticleBodySection", dataFolder: "ArticleBodySections" },
];

const CMS_MAP = {
  HorizontalLinkCardGrid: "homeHeroArea",
  JohnsonMattheyIsACtaBlock: "cta",
  DevelopingTheFutureOfLinkGrid: "developingPgms",
  ScienceAndInnovationHeroBanner: "scienceHero",
  RichTextImageBlock: "imageRichText",
  CoreTechnicalCapabilitiesUnderpinningTeaserGrid: "coreCapabilities",
  CollaborativeInnovationForTheRichTextImageBlock: "imageRichText",
  ExploreMoreTeaserGrid: "exploreMore",
  NewsArticleGrid: "newsGrid",
  ArticleBreadcrumb: "articleBreadcrumb",
  ArticleHero: "articleHero",
  ArticleBody: "articleBody",
  BackToAllNewsListBlock: "backToNews",
};

const DISPLAY_NAMES = {
  HorizontalLinkCardGrid: "Home Hero",
  JohnsonMattheyIsACtaBlock: "Johnson Matthey PGM Leader",
  DevelopingTheFutureOfLinkGrid: "Developing The Future Of PGMs",
  ScienceAndInnovationHeroBanner: "Science And Innovation Hero",
  RichTextImageBlock: "Science And Innovation Intro",
  CoreTechnicalCapabilitiesUnderpinningTeaserGrid:
    "Core Technical Capabilities",
  CollaborativeInnovationForTheRichTextImageBlock: "Collaborative Innovation",
  ExploreMoreTeaserGrid: "Explore More",
  NewsArticleGrid: "News",
  ArticleBreadcrumb: "Article Breadcrumb",
  ArticleHero: "Article Hero",
  ArticleBody: "Article Body",
  BackToAllNewsListBlock: "Back To All News",
};

const ids = JSON.parse(
  await readFile(join(__dirname, "jm3-component-ids.json"), "utf8"),
);
const manifest = JSON.parse(
  await readFile(join(SECTIONS, "manifest.json"), "utf8"),
);
const dataFolderIds = {};
const mediaAssets = [];
const mediaUrlSet = new Set();
const datasourceRegistry = {};

function stableGuid(seed) {
  const hash = createHash("md5")
    .update(`jm3-authoring-${seed}`, "utf8")
    .digest();
  hash[6] = (hash[6] & 0x0f) | 0x40;
  hash[8] = (hash[8] & 0x3f) | 0x80;
  const hex = hash.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function guidUpper(id) {
  return `{${id.toUpperCase()}}`;
}

function ownerBlock(indent = 8) {
  const pad = " ".repeat(indent);
  return `|\n${pad}${OWNER}`;
}

function metaFields(revisionSeed, indent = 4) {
  const pad = " ".repeat(indent);
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
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function stripTags(html) {
  return decodeHtml(html.replace(/<[^>]+>/g, " "));
}

/** Preserve line breaks from <br> in panel body copy (e.g. "View highlights >>" on second line). */
function panelBodyFromHtml(html) {
  if (!html) return "";
  return decodeHtml(
    html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .trim(),
  );
}

function absUrl(href) {
  if (!href || href.startsWith("javascript")) return null;
  if (href.startsWith("http")) return href;
  return `${BASE_URL}${href.startsWith("/") ? "" : "/"}${href}`;
}

function trackMedia(url, alt = "") {
  const full = absUrl(url);
  if (!full || mediaUrlSet.has(full)) return;
  mediaUrlSet.add(full);
  mediaAssets.push({ Url: full, Alt: alt || "Johnson Matthey" });
}

function linkField(text, href) {
  const url = absUrl(href);
  if (!url) return "";
  const safeText = (text || url).replace(/"/g, "'");
  return `<link text="${safeText}" linktype="external" url="${url}" />`;
}

function siteLinkField(text, href) {
  if (!href) return "";
  const path = href.startsWith("/") ? href : `/${href}`;
  const safeText = (text || path).replace(/"/g, "'");
  return `<link text="${safeText}" linktype="internal" url="${path}" />`;
}

function imageField(url, alt) {
  if (!url) return "";
  trackMedia(url, alt);
  const key = absUrl(url);
  return `|\n        <image mediaid="{MEDIA:${key}}" />`;
}

function yamlValue(component, field, value) {
  if (!value) return null;
  const fieldId = ids[component]?.fieldIds?.[field];
  if (!fieldId) return null;

  if (
    field === "Image" ||
    field === "Logo" ||
    field === "BackgroundImage" ||
    field === "VideoThumbnail" ||
    field === "VideoThumbnailMobile" ||
    /^Card\d+Image$/.test(field)
  ) {
    return `    - ID: "${fieldId}"
      Hint: ${field}
      Value: ${value}`;
  }
  if (
    value.startsWith("<link") ||
    value.startsWith("<image") ||
    value.startsWith("|\n")
  ) {
    const block = value.startsWith("|") ? value : `|\n        ${value}`;
    return `    - ID: "${fieldId}"
      Hint: ${field}
      Value: ${block}`;
  }
  if (
    field === "Body" ||
    field === "Description" ||
    field === "Message" ||
    /^Card\d+Description$/.test(field)
  ) {
    const lines = value
      .split("\n")
      .map((l) => `        ${l}`)
      .join("\n");
    return `    - ID: "${fieldId}"
      Hint: ${field}
      Value: |\n${lines}`;
  }
  const escaped =
    value.includes(":") || value.includes('"')
      ? `"${value.replace(/"/g, '\\"')}"`
      : value;
  return `    - ID: "${fieldId}"
      Hint: ${field}
      Value: ${escaped}`;
}

function getFieldId(component, field) {
  return (
    ids[component]?.fieldIds?.[field] ?? stableGuid(`${component}-${field}`)
  );
}

function getDataFolderId(name) {
  return dataFolderIds[name] ?? stableGuid(`${name}-data-folder`);
}

async function loadDataFolderIds() {
  for (const comp of COMPONENT_META) {
    const folderFile = join(ROOT, SITE_REL, "Data", `${comp.dataFolder}.yml`);
    try {
      const body = await readFile(folderFile, "utf8");
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
  await writeFile(full, body, "utf8");
}

function extractTextPanels(html) {
  const panels = [];
  const blocks = html
    .split(/<div class="jm-panel jmtext--panel-temp">/i)
    .slice(1);
  for (const block of blocks) {
    const title = stripTags(
      block.match(/text-panel-title">\s*([\s\S]*?)<\/div>/i)?.[1] ?? "",
    );
    const body = panelBodyFromHtml(
      block.match(/text-panel-body">([\s\S]*?)<\/div>/i)?.[1] ?? "",
    );
    const href =
      block.match(/text-panel-full-link[^"]*" href="([^"]+)"/i)?.[1] ??
      block.match(/text-panel-link[\s\S]*?href="([^"]+)"/i)?.[1] ??
      null;
    const img =
      block.match(/text-panel-img[\s\S]*?<img[^>]+src="([^"]+)"/i)?.[1] ??
      block
        .match(/background-image:\s*url\(([^)]+)\)/i)?.[1]
        ?.replace(/["']/g, "");
    if (title)
      panels.push({ title, body, href, image: img ? absUrl(img) : null });
  }
  return panels;
}

/** matthey.com home news panels are text-only; HorizontalLinkCard still needs Logo */
const NEWS_PANEL_LOGO_URLS = {
  News: "https://matthey.com/documents/161599/0/JM+employees+in+Sonning.jpg/977b1cf4-537c-4ce0-88a5-718c74483c8d?t=1706549112824",
  "ARA 2026":
    "https://matthey.com/documents/161599/166663/Team-meeting-in-Cambridge-L.jpg/021cef6f-97cb-9ea9-2346-6857023aefea?t=1650968265959",
};

function resolveHorizontalLinkCardLogo(panel) {
  const url = panel.image || NEWS_PANEL_LOGO_URLS[panel.title];
  return url ? imageField(url, panel.title) : "";
}

function extractRichText(html) {
  const h = html.match(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/i);
  const title = h ? stripTags(h[1]) : "";
  const paragraphs = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((x) => stripTags(x[1]))
    .filter((p) => p && !p.match(/^@media/) && p.length > 20);
  const body = paragraphs.join("\n\n");
  const cta = html.match(
    /<a[^>]*class="[^"]*(?:jm_cta_button|home__btn|panel__btn)[^"]*"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i,
  );
  return {
    title,
    body,
    cta: cta ? { href: cta[1], text: stripTags(cta[2]) || "Read more" } : null,
  };
}

function extractTeaserColumns(html) {
  const cards = [];
  const cols = html.split(/<div class="col col-lg-4/gi).slice(1);
  for (const col of cols) {
    const h2s = [...col.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)]
      .map((x) => stripTags(x[1]))
      .filter(Boolean);
    const title = h2s.join(" ").trim();
    const descParts = [
      ...col.matchAll(/<(?:p|div)[^>]*>([\s\S]*?)<\/(?:p|div)>/gi),
    ]
      .map((x) => stripTags(x[1]))
      .filter((t) => t && t.length > 8 && !t.includes("@media"));
    const description = descParts.join(" ").trim();
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
    const label = p.body.replace(valueMatch?.[0] ?? "", "").trim() || p.title;
    return { title: p.title, value, label, href: p.href };
  });
}

function extractContactUtility(html) {
  const match = html.match(
    /<a class="contact-us" href="([^"]+)"[^>]*(?:title="([^"]*)")?[^>]*aria-label="([^"]*)"/i,
  );
  if (!match) {
    return {
      text: "Support",
      href: `${BASE_URL}/about-us/contact-us`,
      icon: "jmheader__callicon",
    };
  }
  return {
    text: match[3] || match[2] || "Support",
    href: match[1],
    icon: "jmheader__callicon",
  };
}
function extractNavLinks(html) {
  const links = [];
  const re =
    /<a class="header__menu" href="([^"]+)"[^>]*>\s*<span>\s*([^<]+)/gi;
  let m;
  while ((m = re.exec(html))) {
    links.push({ href: m[1], text: decodeHtml(m[2]) });
  }
  return links.slice(0, 6);
}

/** Map matthey.com top-level nav hrefs to existing Sitecore item segment names. */
const TOP_LEVEL_HREF_SEGMENT = {
  "https://matthey.com/news": "News",
  "https://matthey.com/science-and-innovation": "Science and Innovation",
};

function navItemName(text) {
  return decodeHtml(stripTags(text)).replace(/\s+/g, " ").trim();
}

function sanitizeNavSegment(text) {
  return navItemName(text)
    .replace(/[/\\:*?"<>|]/g, " - ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Parse header section.html into a Sitecore content tree (nav hierarchy).
 * Top-level items follow jmheader__navlist; dropdown h2 + sub-child links become descendants.
 */
function parseHeaderNavTree(html) {
  const pages = [];
  const seen = new Set();

  function addPage(segments, title, sortOrder) {
    const key = segments.join("/");
    if (!key || seen.has(key)) return;
    seen.add(key);
    pages.push({
      segments,
      title: navItemName(title),
      sortOrder: sortOrder ?? null,
    });
  }

  const navIdx = html.search(/<ul role="menubar" class="jmheader__navlinks">/i);
  if (navIdx < 0) return pages;

  const navHtml = html.slice(navIdx);
  const topBlocks =
    navHtml.match(
      /<li class="jmheader__navlist[^"]*"[\s\S]*?(?=<li class="jmheader__navlist|$)/gi,
    ) ?? [];
  let topSort = 100;

  for (const block of topBlocks) {
    const topLink = block.match(
      /<a(?=[^>]*class="header__menu")[^>]*href="([^"]+)"[^>]*>[\s\S]*?<span>\s*([^<]+)/i,
    );
    if (!topLink) continue;

    const topHref = topLink[1].trim();
    const topTitle = topLink[2];
    const topSegment =
      TOP_LEVEL_HREF_SEGMENT[topHref] ?? sanitizeNavSegment(topTitle);
    addPage([topSegment], topTitle, topSort);
    topSort += 100;

    const childMenu = block.match(/<ul class="child-menu[\s\S]*?<\/ul>/i)?.[0];
    if (!childMenu) continue;

    const childHeaders = childMenu.split(/<div class="child-header/i).slice(1);
    for (const ch of childHeaders) {
      const h2Match = ch.match(
        /<h2>\s*<a href="[^"]+"[^>]*>\s*([\s\S]*?)<\/a>\s*<\/h2>/i,
      );
      if (!h2Match) continue;

      const childTitle = h2Match[1];
      const childSegment = sanitizeNavSegment(childTitle);
      addPage([topSegment, childSegment], childTitle);

      const subRe =
        /<a href="[^"]+"[^>]*class="sub-child"[^>]*>\s*([\s\S]*?)<\/a>/gi;
      let sm;
      while ((sm = subRe.exec(ch))) {
        addPage(
          [topSegment, childSegment, sanitizeNavSegment(sm[1])],
          sm[1],
        );
      }
    }
  }

  return pages.sort(
    (a, b) => a.segments.length - b.segments.length || a.segments.join("/").localeCompare(b.segments.join("/")),
  );
}

function buildKnownFullPageIdMap() {
  return new Map([
    [`${SITE_PATH}/Home`, HOME_ID],
    [
      `${SITE_PATH}/Home/Science and Innovation`,
      stableGuid("page-science-innovation"),
    ],
    [`${SITE_PATH}/Home/News`, stableGuid("page-news")],
    [
      `${SITE_PATH}/Home/News/Johnson Matthey publishes 2026 PGM market report`,
      stableGuid("page-pgm-market-report-2026"),
    ],
  ]);
}

function yamlScalar(value) {
  const s = String(value ?? "");
  if (/[:#|>\n"]/.test(s) || s.startsWith(" ") || s.endsWith(" ")) {
    return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  }
  return s;
}

async function writeNavStubPageYaml(
  segments,
  parentId,
  pageId,
  title,
  sortOrder,
  includeNavFilter,
) {
  const itemName = segments.join("/");
  const sortField =
    sortOrder != null
      ? `- ID: "ba3f86a2-4a1c-4d78-b63d-91c2779c1b5e"
  Hint: __Sortorder
  Value: ${sortOrder}
`
      : "";
  const navFilterField = includeNavFilter
    ? `- ID: "${NAV_FILTER_FIELD}"
  Hint: NavigationFilter
  Value: "{${NAVIGATION_FILTER_ID}}"
`
    : "";

  await writeYaml(
    `${SITE_REL}/Home/${itemName}.yml`,
    `---
ID: "${pageId}"
Parent: "${parentId}"
Template: "${PAGE_TEMPLATE_ID}"
Path: "${SITE_PATH}/Home/${itemName}"
SharedFields:
${navFilterField}${sortField}Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
    - ID: "${NAV_TITLE_FIELD}"
      Hint: NavigationTitle
      Value: ${yamlScalar(title)}
    - ID: "${PAGE_TITLE_FIELD}"
      Hint: Title
      Value: ${yamlScalar(title)}
${metaFields(`nav-page-${itemName.replace(/\//g, "-")}`)}
`,
  );
}

async function readMattheyHeaderHtml() {
  const path = join(MATTHEY_DECOMP, "sections", "header", "section.html");
  return readFile(path, "utf8");
}

async function writeNavPagesFromHeader() {
  const headerHtml = await readMattheyHeaderHtml();
  const navPages = parseHeaderNavTree(headerHtml);
  const knownFullPages = buildKnownFullPageIdMap();
  const pageIdByPath = new Map(knownFullPages);
  let written = 0;

  async function ensurePage(segments, title, sortOrder) {
    const sitecorePath = `${SITE_PATH}/Home/${segments.join("/")}`;
    if (pageIdByPath.has(sitecorePath)) {
      return pageIdByPath.get(sitecorePath);
    }

    const parentSegments = segments.slice(0, -1);
    const parentId =
      parentSegments.length === 0
        ? HOME_ID
        : await ensurePage(
            parentSegments,
            parentSegments[parentSegments.length - 1],
            null,
          );

    const pageId = stableGuid(`jm3-page-${sitecorePath}`);
    pageIdByPath.set(sitecorePath, pageId);

    const includeNavFilter = segments.length === 1;
    await writeNavStubPageYaml(
      segments,
      parentId,
      pageId,
      title,
      sortOrder,
      includeNavFilter,
    );
    written++;
    return pageId;
  }

  for (const page of navPages) {
    const sitecorePath = `${SITE_PATH}/Home/${page.segments.join("/")}`;
    if (knownFullPages.has(sitecorePath)) continue;
    await ensurePage(page.segments, page.title, page.sortOrder);
  }

  return written;
}

function extractFooterLists(html) {
  const lists = [];
  const sections = html.split(/<h2 class="jmfooter__heading"/i).slice(1);
  for (const sec of sections) {
    const titleMatch = sec.match(
      />\s*([^<]+?)\s*(?:<span class="footersec__chevicon"|<\/h2>)/i,
    );
    const title = titleMatch ? stripTags(titleMatch[1]) : "Links";
    const links = [];
    const re =
      /<a class="jmfooter__listlink"[^>]*href="([^"]+)"[^>]*>\s*([\s\S]*?)\s*<\/a>/gi;
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
    const imageUrl = m[1].replace(/['"]/g, "").trim();
    const title = stripTags(m[2]);
    const subtitle = stripTags(m[3]);
    const href = m[4];
    const ctaText = stripTags(m[5]) || "Read more";
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
    const ctaText = stripTags(m[4]) || "Read more";
    const key = subtitle || title;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    slides.push({ imageUrl: null, title, subtitle, href, ctaText });
  }
  return slides.slice(0, 3);
}

function extractSharePriceStats(html) {
  const value = stripTags(
    html.match(/class="stockprice__value">([\s\S]*?)<\/span>/i)?.[1] ?? "",
  );
  const percent = stripTags(
    html.match(/class="stockprice__percent">([\s\S]*?)<\/span>/i)?.[1] ?? "",
  );
  const date = stripTags(
    html.match(/class="stockprice__date">([\s\S]*?)<\/p>/i)?.[1] ?? "",
  );
  if (!value) return [];
  return [
    { value, label: "Share Price", title: "Share Price" },
    ...(percent
      ? [{ value: percent, label: date || "Change", title: "Change" }]
      : []),
  ];
}

function extractMontageCards(html) {
  const cards = [];
  const blocks = html.split(/<div class="col-md-6 montage__data"/gi).slice(1);
  for (const block of blocks) {
    const title = stripTags(
      block.match(/<h2 class="card__heading">([\s\S]*?)<\/h2>/i)?.[1] ?? "",
    );
    const description = stripTags(
      block.match(/<p class="card__description">([\s\S]*?)<\/p>/i)?.[1] ?? "",
    );
    const href = block.match(/href="([^"]+)"/i)?.[1];
    const img = block.match(/<img[^>]*src="([^"]+)"/i)?.[1];
    if (title) cards.push({ title, description, href, image: img });
  }
  return cards;
}

function extractScienceHero(html) {
  const title = stripTags(
    html.match(/panels-hero-header[\s\S]*?<h1>\s*([\s\S]*?)<\/h1>/i)?.[1] ??
      "Science and innovation",
  );
  const body = stripTags(
    html.match(/panels-hero-para[\s\S]*?<h2>\s*([\s\S]*?)<\/h2>/i)?.[1] ?? "",
  );
  const bg = html.match(/background-image:\s*url\(["']?([^"')]+)/i)?.[1];
  return { title, body, backgroundImage: bg };
}

function extractScienceHeroStats(html) {
  return extractTextPanels(html).map((p) => {
    const valueMatch = p.body.match(/<span[^>]*>([\s\S]*?)<\/span>/i);
    const value = valueMatch ? stripTags(valueMatch[1]).trim() : stripTags(p.body.split("\n")[0] ?? p.body);
    const label = stripTags(p.body.replace(valueMatch?.[0] ?? "", "")).trim();
    return { title: p.title, value, label, href: p.href };
  });
}

function extractCoreCapabilityCards(html) {
  const title = stripTags(
    html.match(/<h2>\s*([\s\S]*?)<\/h2>/i)?.[1] ??
      "Core technical capabilities underpinning our business",
  );
  const cols = html.split(/<div class="col-sm-12 col-md-6">/gi).slice(1, 3);
  const cards = cols.map((col, i) => {
    const img = col.match(/<img[^>]*src="([^"]+)"/i)?.[1];
    const bodyHtml =
      col.match(/text-panel-body">([\s\S]*?)<\/div>/i)?.[1] ?? "";
    const cardTitle =
      stripTags(
        col.match(/text-panel-title">\s*([\s\S]*?)<\/div>/i)?.[1] ?? "",
      ) || `Capability ${i + 1}`;
    const description = stripTags(
      bodyHtml.replace(/<a[\s\S]*?<\/a>/gi, "").trim(),
    );
    const cta = bodyHtml.match(
      /<a[^>]*href="([^"]+)"[^>]*>[\s\S]*?<span[^>]*>([\s\S]*?)<\/span>/i,
    );
    return {
      title: i === 0 && img ? "Technical expertise" : cardTitle || title,
      description: description || title,
      image: img,
      href: cta?.[1],
      ctaText: cta ? stripTags(cta[2]) : "Explore",
    };
  });
  return { title, cards };
}

function extractHero(html) {
  const title =
    stripTags(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "") ||
    stripTags(
      html.match(/panels-hero-header[\s\S]*?<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ??
        "",
    ) ||
    DISPLAY_NAMES.ThePaceOfScientificHeroBanner;
  const bodyMatch =
    html.match(/homehero__para[^>]*>([\s\S]*?)<\/p>/i) ||
    html.match(/panels-hero-para[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i);
  const body = bodyMatch ? stripTags(bodyMatch[1]) : "";
  const bg = html
    .match(/background-image:\s*url\(([^)]+)\)/i)?.[1]
    ?.replace(/["']/g, "");
  const cta = html.match(
    /<a[^>]*class="[^"]*panel__btn[^"]*"[^>]*href="([^"]+)"[^>]*>[\s\S]*?<span class="panel__btntext">([\s\S]*?)<\/span>/i,
  );
  return {
    title,
    body,
    backgroundImage: bg,
    cta: cta ? { href: cta[1], text: stripTags(cta[2]) } : null,
  };
}

const ARTICLE_INTERNAL_PATHS = {
  "/media/2026/johnson-matthey-publishes-2026-pgm-market-report1":
    "/News/Johnson Matthey publishes 2026 PGM market report",
};

function internalHref(href) {
  if (!href) return "/";
  const normalized = href.replace(BASE_URL, "").split("?")[0];
  return (
    ARTICLE_INTERNAL_PATHS[normalized] ??
    (normalized.startsWith("/") ? normalized : `/${normalized}`)
  );
}

function extractNewsArticles(html, limit = 20) {
  const articles = [];
  const blocks = [
    ...html.matchAll(
      /largeImageshow"[\s\S]*?<img src="([^"]+)"[\s\S]*?<span class="title-date">([^<]+)<\/span>[\s\S]*?<a href="([^"]+)"[^>]*title="([^"]*)"[\s\S]*?>\s*([\s\S]*?)<\/a>/gi,
    ),
  ];
  for (const match of blocks) {
    const blockHtml = match[0];
    const smallImg =
      blockHtml.match(/smallImageshow"[\s\S]*?<img src="([^"]+)"/i)?.[1] ??
      null;
    articles.push({
      image: absUrl(match[1]),
      imageMobile: smallImg ? absUrl(smallImg) : null,
      date: decodeHtml(match[2]),
      href: match[3],
      title: stripTags(match[5]),
    });
    if (articles.length >= limit) break;
  }
  return articles;
}

function extractArticleBreadcrumb(html) {
  const parentLabel = stripTags(
    html.match(
      /breadcrumb-item[\s\S]*?breadcrumb-link[\s\S]*?breadcrumb-text-truncate">([\s\S]*?)<\/span>/i,
    )?.[1] ?? "Media",
  );
  const parentHref =
    html.match(/breadcrumb-link" href="([^"]+)"/i)?.[1] ?? "/news";
  const currentTitle = stripTags(
    html.match(/active breadcrumb-text-truncate">([\s\S]*?)<\/span>/i)?.[1] ??
      "Article",
  );
  return { parentLabel, parentHref, currentTitle };
}

function extractArticleHero(html) {
  const block =
    html.match(
      /jmarticle__hero-main-container">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/i,
    )?.[1] ?? html;
  const title = stripTags(
    block.match(/article__heading">([\s\S]*?)<\/h1>/i)?.[1] ?? "",
  );
  const date = stripTags(
    block.match(/article__date">\s*([\s\S]*?)<\/p>/i)?.[1] ?? "",
  );
  const bg =
    html
      .match(
        /jmarticle__hero-banner[\s\S]*?background-image:\s*url\(([^)]+)\)/i,
      )?.[1]
      ?.replace(/["']/g, "") ??
    html
      .match(/jmarticle__hero-banner[\s\S]*?url\(([^)]+)\)/i)?.[1]
      ?.replace(/["']/g, "");
  const buttons = [
    ...block.matchAll(
      /class="article__btn"[^>]*href="([^"]+)"[^>]*title="([^"]*)"[\s\S]*?btn__text">([\s\S]*?)<\/span/gi,
    ),
  ];
  return {
    title,
    date,
    backgroundImage: bg ? absUrl(bg) : null,
    primaryCta: buttons[0]
      ? { href: buttons[0][1], text: stripTags(buttons[0][3] || buttons[0][2]) }
      : null,
    secondaryCta: buttons[1]
      ? { href: buttons[1][1], text: stripTags(buttons[1][3] || buttons[1][2]) }
      : null,
  };
}

function extractArticleBody(html) {
  const intro =
    html.match(
      /<div class="article__intro">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/i,
    )?.[1] ?? "";
  const linkedIn =
    html.match(/href="(https:\/\/linkedin\.com\/shareArticle[^"]+)"/i)?.[1] ??
    null;
  const twitter =
    html.match(/href="(https:\/\/twitter\.com\/share[^"]+)"/i)?.[1] ?? null;
  return { body: intro.trim(), linkedIn, twitter };
}

function extractListBlock(html) {
  const block =
    html.match(
      /<div class="jmlistblock"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/i,
    )?.[0] ?? "";
  const title = stripTags(
    block.match(/jmlistblock__title">([\s\S]*?)<\/h2>/i)?.[1] ??
      "Back to all news",
  );
  const summary = stripTags(
    block.match(/jmlistblock__summary">([\s\S]*?)<\/h6>/i)?.[1] ?? "",
  );
  const href = block.match(/panel__btn" href="([^"]+)"/i)?.[1] ?? "/news";
  const ctaText = stripTags(
    block.match(/panel__btntext">([\s\S]*?)<\/span>/i)?.[1] ?? "Explore",
  );
  return { title, summary, href, ctaText };
}

function extractImages(html) {
  return [
    ...html.matchAll(
      /(?:src|url)\s*[=:]\s*["']?([^"')]+\.(?:jpg|jpeg|png|svg|webp)[^"')]*)/gi,
    ),
  ].map((m) => m[1]);
}

async function readPageHtml(pageSlug) {
  const path = join(MATTHEY_DECOMP, pageSlug, "page.html");
  try {
    return await readFile(path, "utf8");
  } catch {
    return "";
  }
}

async function readSectionHtml(cmsName) {
  const comp = manifest.components[cmsName];
  if (!comp?.sectionHtml) return "";
  const path = join(SECTIONS, comp.sectionHtml);
  try {
    return await readFile(path, "utf8");
  } catch {
    return "";
  }
}

function registerDatasource(
  component,
  itemName,
  parentFolderId,
  templateId,
  fields,
  folderPath,
) {
  const id = stableGuid(`ds-${component}-${itemName}-${templateId}`);
  datasourceRegistry[id] = {
    component,
    itemName,
    fields,
    templateId,
    parentFolderId,
    folderPath,
  };
  return id;
}

async function writeDatasourceItem(dsId) {
  const ds = datasourceRegistry[dsId];
  if (!ds) return;
  const fieldLines = Object.entries(ds.fields)
    .map(([field, value]) => yamlValue(ds.component, field, value))
    .filter(Boolean)
    .join("\n");
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
`,
  );
}

function escapeRenderingPar(par) {
  return par.replace(/&/g, "&amp;");
}

/** Site-scaffold spacing styles — read GUIDs from YAML; do not create duplicate style items. */
const SPACING_STYLE_FILES = {
  "indent-top": "Indent top.yml",
  "indent-bottom": "Indent bottom.yml",
  "indent-side": "Indent side.yml",
};

let spacingStyleIds = null;

function loadSpacingStyleIds() {
  if (spacingStyleIds) return spacingStyleIds;
  spacingStyleIds = {};
  const spacingDir = join(ROOT, SITE_REL, "Presentation", "Styles", "Spacing");
  for (const [key, fileName] of Object.entries(SPACING_STYLE_FILES)) {
    const filePath = join(spacingDir, fileName);
    try {
      const content = readFileSync(filePath, "utf8");
      const idMatch = content.match(/^ID:\s*"([^"]+)"/m);
      if (idMatch) spacingStyleIds[key] = idMatch[1];
    } catch {
      console.warn(`Spacing style YAML not found: ${filePath}`);
    }
  }
  return spacingStyleIds;
}

const pagePresentationStylesCache = new Map();

function encodePresentationStylesParam(styleKeys = []) {
  const ids = loadSpacingStyleIds();
  const guids = styleKeys.map((key) => ids[key]?.toUpperCase()).filter(Boolean);
  if (!guids.length) return "";
  const encoded =
    guids.length === 1
      ? `%7B${guids[0]}%7D`
      : guids.map((g) => `%7C%7B${g}%7D`).join("");
  return `Styles=${encoded}`;
}

function headlessVariantGuid(componentName, variant = "Default") {
  return stableGuid(`${componentName}-variant-${variant}`);
}

function buildRenderingPar(
  componentName,
  variant = "Default",
  extra = "",
  presentationStyles = [],
) {
  const guid = headlessVariantGuid(componentName, variant).toUpperCase();
  const parts = ["CSSStyles", `FieldNames=%7B${guid}%7D`];
  const stylesPar = encodePresentationStylesParam(presentationStyles);
  if (stylesPar) parts.push(stylesPar);
  if (extra) parts.push(extra);
  return parts.join("&");
}

function buildNavigationPar(variant = "Default", extra = "") {
  const guid = headlessVariantGuid("Navigation", variant).toUpperCase();
  const parts = [
    "CSSStyles",
    guid ? `FieldNames=%7B${guid}%7D` : "",
    `LevelFrom=%7B${NAV_LEVEL_FROM}%7D`,
    `LevelTo=%7B${NAV_LEVEL_TO}%7D`,
    `Filter=%7B${NAVIGATION_FILTER_ID}%7D`,
    "Flattened",
    "AddRoot=1",
  ].filter(Boolean);
  if (extra) parts.push(extra);
  return parts.join("&");
}

function loadPagePresentationStyles(pageSlug) {
  if (pagePresentationStylesCache.has(pageSlug)) {
    return pagePresentationStylesCache.get(pageSlug);
  }
  const byFolder = new Map();
  const decompositionPath = join(
    MATTHEY_DECOMP,
    pageSlug,
    "page-decomposition.json",
  );
  try {
    const decomposition = JSON.parse(readFileSync(decompositionPath, "utf8"));
    for (const section of decomposition.sections ?? []) {
      const styles = section.parentComponent?.presentationStyles;
      if (section.sectionFolder && styles?.length) {
        byFolder.set(section.sectionFolder, styles);
      }
    }
  } catch {
    // page-decomposition optional for pages without matthey capture
  }
  pagePresentationStylesCache.set(pageSlug, byFolder);
  return byFolder;
}

function presentationStylesForSection(pageSlug, cmsName) {
  const folderName = manifest.components?.[cmsName]?.folderName;
  if (!folderName) return [];
  return loadPagePresentationStyles(pageSlug).get(folderName) ?? [];
}

function buildRenderingEntry({
  uid,
  renderingId,
  dsId,
  ph,
  par = "CSSStyles",
  before,
  after,
}) {
  const afterRef = after ? after.toUpperCase() : null;
  const pos = before
    ? `p:before="${before}"`
    : afterRef
      ? `p:after="r[@uid='{${afterRef}}']"`
      : `p:after="*[1=2]"`;
  const ds = dsId ? `\n          s:ds="${dsId}"` : "";
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
      const before = i === 0 ? "*" : null;
      const after = i > 0 ? entries[i - 1].uid : null;
      return buildRenderingEntry({ ...e, before, after });
    })
    .join("\n");
  return `    <r xmlns:p="p" xmlns:s="s"
      p:p="1">
      <d
        id="{${DEVICE_ID}}">
${body}
      </d>
    </r>`;
}

async function buildSiteChrome() {
  const headerHtml = await readSectionHtml("Header");
  const footerHtml = await readSectionHtml("Footer");
  const cookieHtml = await readSectionHtml("CookieBanner");

  const logoUrl = headerHtml.match(/jmlogo__img[^>]*src="([^"]+)"/i)?.[1];
  trackMedia(logoUrl, "Johnson Matthey logo");

  const headerDs = registerDatasource(
    "Header",
    "Site Header",
    getDataFolderId("Header"),
    ids.Header.templateId,
    {
      LogoText: "Johnson Matthey",
      LogoLink: linkField("Johnson Matthey", BASE_URL),
      Logo: imageField(logoUrl, "Johnson Matthey logo"),
      SearchLabel: "Search",
    },
    "Headers",
  );

  const contactUtility = extractContactUtility(headerHtml);
  const iconLinkDsIds = [
    registerDatasource(
      "HeaderIconLink",
      "Header Utility Contact",
      getDataFolderId("HeaderIconLink"),
      ids.HeaderIconLink.templateId,
      {
        Link: linkField(contactUtility.text, contactUtility.href),
        IconClass: contactUtility.icon,
      },
      "HeaderIconLinks",
    ),
  ];

  const footerDs = registerDatasource(
    "Footer",
    "Site Footer",
    getDataFolderId("Footer"),
    ids.Footer.templateId,
    {
      CopyrightText: "© Johnson Matthey plc. All rights reserved.",
      Logo: imageField(logoUrl, "Johnson Matthey logo"),
    },
    "Footers",
  );

  const footerLists = extractFooterLists(footerHtml);
  const linkListDsIds = [];
  footerLists.forEach((list, idx) => {
    const fields = { Title: list.title };
    list.links.slice(0, 6).forEach((l, i) => {
      fields[`Link${i + 1}`] = linkField(l.text, l.href);
    });
    const dsId = registerDatasource(
      "LinkList",
      `Footer ${list.title.replace(/[<>:"/\\|?*]/g, "").trim()}`,
      getDataFolderId("LinkList"),
      ids.LinkList.templateId,
      fields,
      "LinkLists",
    );
    linkListDsIds.push(dsId);
  });

  const cookieMsg =
    stripTags(
      cookieHtml.match(
        /id="onetrust-policy-text"[^>]*>([\s\S]*?)<\/div>/i,
      )?.[1] ?? "",
    ) || "We use cookies to improve your experience on our site.";
  const cookieDs = registerDatasource(
    "CookieBanner",
    "Site Cookie Banner",
    getDataFolderId("CookieBanner"),
    ids.CookieBanner.templateId,
    {
      Message: cookieMsg,
      AcceptLabel: "Accept All Cookies",
      PrivacyLink: linkField(
        "Cookie Notice",
        `${BASE_URL}/en/website-information/cookies-notice`,
      ),
    },
    "CookieBanners",
  );

  return { headerDs, iconLinkDsIds, footerDs, cookieDs, linkListDsIds };
}

async function buildSectionDatasource(cmsName) {
  const kind = CMS_MAP[cmsName];
  const html = await readSectionHtml(cmsName);
  const displayName =
    DISPLAY_NAMES[cmsName] || cmsName.replace(/([A-Z])/g, " $1").trim();
  const result = {
    sectionDsId: null,
    childDsIds: [],
    renderingComponent: null,
    phKey: null,
    extras: [],
  };

  if (kind === "homeHeroArea") {
    const slides = extractCarouselSlides(html);
    const compositeDs = registerDatasource(
      "CompositeHeroBandSection",
      "Home Hero Band",
      getDataFolderId("CompositeHeroBandSection"),
      ids.CompositeHeroBandSection.templateId,
      {},
      "CompositeHeroBandSections",
    );
    result.renderingComponent = "CompositeHeroBandSection";
    result.sectionDsId = compositeDs;
    // carousel is Default variant
    result.compositeChildren = [
      {
        phKey: "hero-slides",
        childComponent: "HeroSlideCard",
        childDsIds: slides.map((slide, i) => {
          if (slide.imageUrl)
            trackMedia(slide.imageUrl, slide.subtitle || `Hero slide ${i + 1}`);
          return registerDatasource(
            "HeroSlideCard",
            `Home Hero Slide ${i + 1}`,
            getDataFolderId("HeroSlideCard"),
            ids.HeroSlideCard.templateId,
            {
              Title: slide.title,
              Subtitle: slide.subtitle,
              Image: slide.imageUrl
                ? imageField(slide.imageUrl, slide.subtitle || slide.title)
                : "",
              Cta: linkField(slide.ctaText, slide.href),
            },
            "HeroSlideCards",
          );
        }),
      },
      {
        phKey: "hero-panels",
        childComponent: "HeroPanelCard",
        childDsIds: extractTextPanels(html)
          .filter((p) => p.title && p.title !== "Share Price")
          .map((panel, i) =>
            registerDatasource(
              "HeroPanelCard",
              `Home Hero Panel ${i + 1}`,
              getDataFolderId("HeroPanelCard"),
              ids.HeroPanelCard.templateId,
              {
                PanelTitle: panel.title,
                Body: panel.body || panel.title,
                Cta: linkField("Read more", panel.href || "/"),
              },
              "HeroPanelCards",
            ),
          ),
      },
      {
        phKey: "hero-stats",
        childComponent: "HeroStatsPanel",
        childDsIds: (() => {
          const shareStats = extractSharePriceStats(html);
          if (!shareStats.length) return [];
          const value = shareStats[0]?.value ?? "";
          const change = shareStats[1]?.value ?? "";
          const date = shareStats[1]?.label ?? "";
          return [
            registerDatasource(
              "HeroStatsPanel",
              "Home Share Price",
              getDataFolderId("HeroStatsPanel"),
              ids.HeroStatsPanel.templateId,
              {
                Title: "Share Price",
                Value: value,
                Change: change,
                Date: date,
              },
              "HeroStatsPanels",
            ),
          ];
        })(),
      },
    ];
    return result;
  }

  function pickVideoThumbnails(html) {
    const fromExtract = extractImages(html);
    const fromAttr = [
      ...html.matchAll(
        /\.attr\s*\(\s*["']src["']\s*,\s*["']([^"']+\.(?:png|jpg|jpeg|webp)[^"']*)["']/gi,
      ),
    ].map((m) => m[1]);
    const fromSrc = [
      ...html.matchAll(/\bsrc=["']([^"']+\.(?:png|jpg|jpeg|webp)[^"']*)["']/gi),
    ].map((m) => m[1]);
    const images = [
      ...new Set([...fromExtract, ...fromAttr, ...fromSrc]),
    ].filter((u) => !u.includes(".svg") && /video|thumbnail/i.test(u));
    const mobile = images.find((u) =>
      /thumbnail\+S\.png|thumbnail\+S\//i.test(u),
    );
    const desktop = images.find(
      (u) =>
        /thumbnail\+.*%282%29|thumbnail\+\(2\)|thumbnail\+.*\(2\)/i.test(u) &&
        u !== mobile,
    );
    return {
      desktop: desktop ?? mobile ?? images[0],
      mobile: mobile ?? desktop ?? images[0],
    };
  }

  if (kind === "developingPgms") {
    const rt = extractRichText(html);
    const { desktop: desktopImg, mobile: mobileImg } =
      pickVideoThumbnails(html);
    const videoUrlMatch = html.match(/youtube\.com\/embed\/([^"?&]+)/);
    const watchUrl = videoUrlMatch
      ? `https://www.youtube.com/watch?v=${videoUrlMatch[1]}`
      : "https://www.youtube.com/watch?v=vnjUaXJzgAc";
    const dsId = registerDatasource(
      "TitleDescriptionVideoSection",
      displayName,
      getDataFolderId("TitleDescriptionVideoSection"),
      ids.TitleDescriptionVideoSection.templateId,
      {
        Title: rt.title || "Developing the future of platinum group metals",
        Body: rt.body,
        Cta: rt.cta
          ? linkField(rt.cta.text, rt.cta.href)
          : linkField("Read more", "/future-pgms-partnership"),
        VideoThumbnail: desktopImg
          ? imageField(desktopImg, "Future PGMs video desktop")
          : "",
        VideoThumbnailMobile: mobileImg
          ? imageField(mobileImg, "Future PGMs video mobile")
          : "",
        PlayVideoLabel: "Play Video",
        VideoLink: linkField("Play Video", watchUrl),
      },
      "TitleDescriptionVideoSections",
    );
    result.sectionDsId = dsId;
    result.renderingComponent = "TitleDescriptionVideoSection";
    return result;
  }

  if (kind === "scienceHero") {
    const hero = extractScienceHero(html);
    if (hero.backgroundImage) trackMedia(hero.backgroundImage, hero.title);
    const stats = extractScienceHeroStats(html);
    const childDsIds = stats.map((stat, i) =>
      registerDatasource(
        "StatsItem",
        `Science Hero Stat ${i + 1}`,
        getDataFolderId("StatsItem"),
        ids.StatsItem.templateId,
        {
          Title: stat.title,
          Value: stat.value,
          Label: stat.label,
          Link: stat.href ? linkField("Read more", stat.href) : "",
        },
        "StatsItems",
      ),
    );
    const heroDs = registerDatasource(
      "FullBleedHeroBannerSection",
      displayName,
      getDataFolderId("FullBleedHeroBannerSection"),
      ids.FullBleedHeroBannerSection.templateId,
      {
        Title: hero.title,
        Body: hero.body,
        BackgroundImage: hero.backgroundImage
          ? imageField(hero.backgroundImage, hero.title)
          : "",
      },
      "FullBleedHeroBannerSections",
    );
    result.extras.push({
      renderingComponent: "FullBleedHeroBannerSection",
      sectionDsId: heroDs,
      phKey: childDsIds.length ? "stats-items" : undefined,
      childDsIds: childDsIds.length ? childDsIds : undefined,
    });
    return result;
  }

  if (kind === "coreCapabilities") {
    const title = stripTags(
      html.match(/jmpanelblock__header[\s\S]*?<h2>\s*([\s\S]*?)<\/h2>/i)?.[1] ??
        "Core technical capabilities underpinning our business",
    );
    const bg = html
      .match(/panel_block[\s\S]*?background-image:\s*url\(([^)]+)\)/i)?.[1]
      ?.replace(/["']/g, "");
    const img = html.match(/text-panel-img[\s\S]*?<img[^>]*src="([^"]+)"/i)?.[1];
    const bodyHtml = html.match(/text-panel-body">([\s\S]*?)<\/div>/i)?.[1] ?? "";
    const body = panelBodyFromHtml(bodyHtml.replace(/<a[\s\S]*?<\/a>/gi, "").trim());
    const cta = bodyHtml.match(
      /<a[^>]*href="([^"]+)"[^>]*>[\s\S]*?<span[^>]*>([\s\S]*?)<\/span>/i,
    );
    const fields = { Title: title, Body: body || title };
    if (bg) fields.BackgroundImage = imageField(absUrl(bg), title);
    if (img) fields.Image = imageField(absUrl(img), title);
    if (cta) fields.Cta = linkField(stripTags(cta[2]), cta[1]);
    const sectionDs = registerDatasource(
      "BackgroundPanelSection",
      displayName,
      getDataFolderId("BackgroundPanelSection"),
      ids.BackgroundPanelSection.templateId,
      fields,
      "BackgroundPanelSections",
    );
    result.sectionDsId = sectionDs;
    result.renderingComponent = "BackgroundPanelSection";
    return result;
  }

  if (kind === "exploreMore") {
    const cards = extractMontageCards(html);
    const sectionDs = registerDatasource(
      "TitleDescriptionTeaserGridSection",
      displayName,
      getDataFolderId("TitleDescriptionTeaserGridSection"),
      ids.TitleDescriptionTeaserGridSection.templateId,
      { Title: "Explore more" },
      "TitleDescriptionTeaserGridSections",
    );
    result.sectionDsId = sectionDs;
    result.renderingComponent = "TitleDescriptionTeaserGridSection";
    result.phKey = "teaser-cards";
    result.childDsIds = cards.map((card, i) =>
      registerDatasource(
        "VerticalTeaserCard",
        `${displayName} Card ${i + 1}`,
        getDataFolderId("VerticalTeaserCard"),
        ids.VerticalTeaserCard.templateId,
        {
          Title: card.title,
          Description: card.description,
          Image: card.image ? imageField(absUrl(card.image), card.title) : "",
          Cta: card.href ? linkField("Explore", card.href) : "",
        },
        "VerticalTeaserCards",
      ),
    );
    return result;
  }

  if (kind === "cta") {
    const rt = extractRichText(html);
    const fields = {
      Title: rt.title || displayName,
      Body: rt.body,
    };
    if (rt.cta) fields.Cta = linkField(rt.cta.text, rt.cta.href);
    const dsId = registerDatasource(
      "TitleDescriptionCtaSection",
      displayName,
      getDataFolderId("TitleDescriptionCtaSection"),
      ids.TitleDescriptionCtaSection.templateId,
      fields,
      "TitleDescriptionCtaSections",
    );
    result.sectionDsId = dsId;
    result.renderingComponent = "TitleDescriptionCtaSection";
    return result;
  }

  if (kind === "imageRichText") {
    const rt = extractRichText(html);
    const img = extractImages(html).find(
      (u) => !u.includes(".svg") && !u.includes("clay/icons"),
    );
    const fields = {
      Title: rt.title || displayName,
      Body: rt.body,
    };
    if (img) fields.Image = imageField(img, rt.title);
    const ctaMatch = html.match(
      /<a[^>]*href="([^"]+)"[^>]*>[\s\S]*?<span class="btn--style-a">([\s\S]*?)<\/span>/i,
    );
    if (ctaMatch) fields.Cta = linkField(stripTags(ctaMatch[2]), ctaMatch[1]);
    else if (rt.cta) fields.Cta = linkField(rt.cta.text, rt.cta.href);
    const dsId = registerDatasource(
      "ImageRichTextSection",
      displayName,
      getDataFolderId("ImageRichTextSection"),
      ids.ImageRichTextSection.templateId,
      fields,
      "ImageRichTextSections",
    );
    result.sectionDsId = dsId;
    result.renderingComponent = "ImageRichTextSection";
    return result;
  }

  if (kind === "newsGrid") {
    const pageHtml = await readPageHtml("matthey-com--news");
    const articles = extractNewsArticles(pageHtml);
    const sectionDs = registerDatasource(
      "NewsArticleGridSection",
      displayName,
      getDataFolderId("NewsArticleGridSection"),
      ids.NewsArticleGridSection.templateId,
      {
        Title: "News",
        FilterLabel: "Date",
        TotalEntries: "210",
        CurrentPage: "1",
        EntriesPerPage: "20",
      },
      "NewsArticleGridSections",
    );
    result.sectionDsId = sectionDs;
    result.renderingComponent = "NewsArticleGridSection";
    result.phKey = "news-articles";
    result.childDsIds = articles.map((article, i) =>
      registerDatasource(
        "NewsArticleCard",
        `${displayName} Article ${i + 1}`,
        getDataFolderId("NewsArticleCard"),
        ids.NewsArticleCard.templateId,
        {
          Date: article.date,
          Title: article.title,
          Image: article.image ? imageField(article.image, article.title) : "",
          ImageMobile: article.imageMobile
            ? imageField(article.imageMobile, article.title)
            : "",
          Link: siteLinkField(article.title, internalHref(article.href)),
        },
        "NewsArticleCards",
      ),
    );
    return result;
  }

  if (kind === "articleBreadcrumb") {
    const pageHtml = await readPageHtml(
      "matthey-com--media-2026-johnson-matthey-publishes-2026-pgm-market-report1",
    );
    const crumb = extractArticleBreadcrumb(pageHtml);
    const dsId = registerDatasource(
      "Breadcrumb",
      displayName,
      getDataFolderId("Breadcrumb"),
      ids.Breadcrumb.templateId,
      {
        ParentLabel: crumb.parentLabel,
        ParentLink: siteLinkField(
          crumb.parentLabel,
          internalHref(crumb.parentHref),
        ),
        CurrentTitle: crumb.currentTitle,
      },
      "Breadcrumbs",
    );
    result.sectionDsId = dsId;
    result.renderingComponent = "Breadcrumb";
    return result;
  }

  if (kind === "articleHero") {
    const pageHtml = await readPageHtml(
      "matthey-com--media-2026-johnson-matthey-publishes-2026-pgm-market-report1",
    );
    const hero = extractArticleHero(pageHtml);
    if (hero.backgroundImage) trackMedia(hero.backgroundImage, hero.title);
    const fields = {
      Title: hero.title,
      Date: hero.date,
    };
    if (hero.backgroundImage)
      fields.BackgroundImage = imageField(hero.backgroundImage, hero.title);
    if (hero.primaryCta)
      fields.PrimaryCta = linkField(hero.primaryCta.text, hero.primaryCta.href);
    if (hero.secondaryCta)
      fields.SecondaryCta = linkField(
        hero.secondaryCta.text,
        hero.secondaryCta.href,
      );
    const dsId = registerDatasource(
      "ArticleHeroSection",
      displayName,
      getDataFolderId("ArticleHeroSection"),
      ids.ArticleHeroSection.templateId,
      fields,
      "ArticleHeroSections",
    );
    result.sectionDsId = dsId;
    result.renderingComponent = "ArticleHeroSection";
    return result;
  }

  if (kind === "articleBody") {
    const pageHtml = await readPageHtml(
      "matthey-com--media-2026-johnson-matthey-publishes-2026-pgm-market-report1",
    );
    const body = extractArticleBody(pageHtml);
    const fields = { Body: body.body };
    if (body.linkedIn)
      fields.LinkedInShareUrl = linkField("LinkedIn", body.linkedIn);
    if (body.twitter)
      fields.TwitterShareUrl = linkField("Twitter", body.twitter);
    const dsId = registerDatasource(
      "ArticleBodySection",
      displayName,
      getDataFolderId("ArticleBodySection"),
      ids.ArticleBodySection.templateId,
      fields,
      "ArticleBodySections",
    );
    result.sectionDsId = dsId;
    result.renderingComponent = "ArticleBodySection";
    return result;
  }

  if (kind === "backToNews") {
    const pageHtml = await readPageHtml(
      "matthey-com--media-2026-johnson-matthey-publishes-2026-pgm-market-report1",
    );
    const block = extractListBlock(pageHtml);
    const dsId = registerDatasource(
      "TitleDescriptionCtaSection",
      displayName,
      getDataFolderId("TitleDescriptionCtaSection"),
      ids.TitleDescriptionCtaSection.templateId,
      {
        Title: block.title,
        Body: block.summary,
        Cta: siteLinkField(block.ctaText, internalHref(block.href)),
      },
      "TitleDescriptionCtaSections",
    );
    result.sectionDsId = dsId;
    result.renderingComponent = "TitleDescriptionCtaSection";
    result.headlessVariant = "ListBlock";
    return result;
  }

  return result;
}

function pageSections(pageSlug) {
  const page = manifest.pages.find((p) => p.slug === pageSlug);
  if (!page) return [];
  return page.sectionOrder.filter(
    (n) => CMS_MAP[n] && CMS_MAP[n] !== "Header" && CMS_MAP[n] !== "Footer",
  );
}

function appendSectionRenderings(
  entries,
  section,
  dpCounterRef,
  pageSlug,
  cmsName,
) {
  const presentationStyles = presentationStylesForSection(pageSlug, cmsName);
  if (section.compositeChildren?.length) {
    const dp = dpCounterRef.value++;
    const component = section.renderingComponent;
    const variant = section.headlessVariant ?? "Default";
    entries.push({
      uid: stableGuid(`${pageSlug}-${cmsName}-${component}-${dp}`),
      renderingId: ids[component].renderingId,
      dsId: section.sectionDsId,
      ph: "headless-main",
      par: buildRenderingPar(
        component,
        variant,
        `DynamicPlaceholderId=${dp}`,
        presentationStyles,
      ),
    });
    for (const block of section.compositeChildren) {
      if (!block.childDsIds?.length || !block.phKey) continue;
      block.childDsIds.forEach((childDs, i) => {
        entries.push({
          uid: stableGuid(
            `${pageSlug}-${cmsName}-${block.childComponent}-${dp}-${i}`,
          ),
          renderingId: ids[block.childComponent].renderingId,
          dsId: childDs,
          ph: `/headless-main/${block.phKey}-${dp}`,
          par: buildRenderingPar(block.childComponent, "Default"),
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
      ? buildRenderingPar(
          block.renderingComponent,
          block.headlessVariant ?? "Default",
          `DynamicPlaceholderId=${dp}`,
          presentationStyles,
        )
      : buildRenderingPar(
          block.renderingComponent,
          block.headlessVariant ?? "Default",
          "",
          presentationStyles,
        );
    entries.push({
      uid: stableGuid(
        `${pageSlug}-${cmsName}-${block.renderingComponent}-${dp}`,
      ),
      renderingId: ids[block.renderingComponent].renderingId,
      dsId: block.sectionDsId,
      ph: "headless-main",
      par,
    });
    if (block.childDsIds?.length && block.phKey) {
      const childComponent =
        block.phKey === "link-cards"
          ? "HorizontalLinkCard"
          : block.phKey === "teaser-cards"
            ? "VerticalTeaserCard"
            : block.phKey === "news-articles"
              ? "NewsArticleCard"
              : block.phKey === "carousel-slides"
                ? "FeatureCarouselCard"
                : "StatsItem";
      block.childDsIds.forEach((childDs, i) => {
        entries.push({
          uid: stableGuid(`${pageSlug}-${cmsName}-child-${dp}-${i}`),
          renderingId: ids[childComponent].renderingId,
          dsId: childDs,
          ph: `/headless-main/${block.phKey}-${dp}`,
          par: buildRenderingPar(childComponent, "Default"),
        });
      });
    }
  }
}

function buildPageRenderings(pageSlug, sectionResults, cookieDs) {
  const entries = [];
  const dpCounterRef = { value: 1 };

  for (const cmsName of pageSections(pageSlug)) {
    const sr = sectionResults[cmsName];
    if (!sr) continue;
    appendSectionRenderings(entries, sr, dpCounterRef, pageSlug, cmsName);
  }

  return buildRenderingsXml(entries);
}

async function writePageYaml(
  fileName,
  itemName,
  parentId,
  pageId,
  title,
  renderingsXml,
  parentPath = "Home",
  options = {},
) {
  const { sortOrder, includeNavFilter } = options;
  const sortField =
    sortOrder != null
      ? `- ID: "ba3f86a2-4a1c-4d78-b63d-91c2779c1b5e"
  Hint: __Sortorder
  Value: ${sortOrder}
`
      : "";
  const navFilterField = includeNavFilter
    ? `- ID: "${NAV_FILTER_FIELD}"
  Hint: NavigationFilter
  Value: "{${NAVIGATION_FILTER_ID}}"
`
    : "";

  await writeYaml(
    `${SITE_REL}/${parentPath}/${fileName}`,
    `---
ID: "${pageId}"
Parent: "${parentId}"
Template: "${PAGE_TEMPLATE_ID}"
Path: "${SITE_PATH}/${parentPath}/${itemName}"
SharedFields:
${navFilterField}${sortField}- ID: "f1a1fe9e-a60c-4ddb-a3a0-bb5b29fe732e"
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
      Value: ${yamlScalar(title)}
    - ID: "${PAGE_TITLE_FIELD}"
      Hint: Title
      Value: ${yamlScalar(title)}
${metaFields(`page-${itemName}`)}
`,
  );
}

async function writePresentation(chrome) {
  const headerPdId = stableGuid("pd-header");
  const footerPdId = stableGuid("pd-footer");
  const cookiePdId = stableGuid("pd-cookie");
  const defaultPdId = stableGuid("page-design-default");

  const headerEntries = [
    {
      uid: stableGuid("pd-header-rendering"),
      renderingId: ids.Header.renderingId,
      dsId: chrome.headerDs,
      ph: "headless-header",
      par: "CSSStyles&DynamicPlaceholderId=1",
    },
    {
      uid: stableGuid("pd-header-nav"),
      renderingId: ids.Navigation.renderingId,
      ph: "/headless-header/header-nav-1",
      par: buildNavigationPar("Default", "DynamicPlaceholderId=1"),
    },
    ...chrome.iconLinkDsIds.map((dsId, i) => ({
      uid: stableGuid(`pd-header-icon-${i}`),
      renderingId: ids.HeaderIconLink.renderingId,
      dsId,
      ph: "/headless-header/header-utility-1",
      par: buildRenderingPar("HeaderIconLink", "Default"),
    })),
  ];

  const footerEntries = [
    {
      uid: stableGuid("pd-footer-rendering"),
      renderingId: ids.Footer.renderingId,
      dsId: chrome.footerDs,
      ph: "headless-footer",
      par: "CSSStyles&DynamicPlaceholderId=1",
    },
  ];
  chrome.linkListDsIds.forEach((dsId, i) => {
    footerEntries.push({
      uid: stableGuid(`pd-footer-linklist-${i}`),
      renderingId: ids.LinkList.renderingId,
      dsId,
      ph: "/headless-footer/footer-links-1",
      par: "CSSStyles",
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
${metaFields("pd-header")}
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
${metaFields("pd-footer")}
`,
  );

  const cookieEntries = [
    {
      uid: stableGuid("pd-cookie-rendering"),
      renderingId: ids.CookieBanner.renderingId,
      dsId: chrome.cookieDs,
      ph: "headless-cookie",
      par: buildRenderingPar("CookieBanner", "Default"),
    },
  ];

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
${metaFields("pd-cookie")}
`,
  );

  const headerPhSettingId = stableGuid("jm3-pd-ph-header");
  const footerPhSettingId = stableGuid("jm3-pd-ph-footer");
  const cookiePhSettingId = stableGuid("jm3-pd-ph-cookie");

  for (const [name, phKey, phSettingId, signature] of [
    ["Header", "sxa-header", headerPhSettingId, "header"],
    ["Footer", "sxa-footer", footerPhSettingId, "footer"],
    ["Cookie", "sxa-cookie", cookiePhSettingId, "cookie"],
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
${metaFields("page-design-default")}
`,
  );

  const mapping = `%7b${PAGE_TEMPLATE_ID.toUpperCase()}%7d%3d%257B${defaultPdId.toUpperCase()}%257D`;
  let pageDesignsYml = await readFile(
    join(ROOT, SITE_REL, "Presentation/Page Designs.yml"),
    "utf8",
  );
  if (!pageDesignsYml.includes("TemplatesMapping")) {
    pageDesignsYml = pageDesignsYml.replace(
      "SharedFields:",
      `SharedFields:
- ID: "ba1f60d6-3deb-40cc-bb61-eec772279ee1"
  Hint: TemplatesMapping
  Value: "${mapping}"`,
    );
    await writeFile(
      join(ROOT, SITE_REL, "Presentation/Page Designs.yml"),
      pageDesignsYml,
      "utf8",
    );
  }
}

async function patchMediaIds(mediaResults) {
  const urlToId = Object.fromEntries(
    mediaResults.map((r) => [r.Url, r.MediaId]),
  );

  async function patchFilesUnder(relDir) {
    const base = join(ROOT, relDir);
    async function walk(d) {
      for (const ent of await readdir(d, { withFileTypes: true })) {
        const p = join(d, ent.name);
        if (ent.isDirectory()) await walk(p);
        else if (ent.name.endsWith(".yml")) {
          let content = await readFile(p, "utf8");
          let changed = false;
          for (const [url, mediaId] of Object.entries(urlToId)) {
            const token = `{MEDIA:${url}}`;
            if (content.includes(token)) {
              content = content.split(token).join(mediaId.toUpperCase());
              changed = true;
            }
          }
          if (changed) await writeFile(p, content, "utf8");
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
      else if (name.endsWith(".yml")) {
        const content = readFileSync(full, "utf8");
        if (content.includes("{MEDIA:")) {
          const matches = content.match(/\{MEDIA:[^}]+\}/g) ?? [];
          orphans.push({
            file: full.replace(ROOT + "\\", "").replace(ROOT + "/", ""),
            tokens: matches,
          });
        }
      }
    }
  }
  walk(join(ROOT, SITE_REL));
  walk(join(ROOT, "media-library"));
  if (orphans.length) {
    throw new Error(
      `Unresolved MEDIA placeholders remain after patchMediaIds:\n${orphans
        .map((o) => `  - ${o.file}: ${o.tokens.join(", ")}`)
        .join("\n")}`,
    );
  }
}

async function downloadMedia() {
  if (!mediaAssets.length) return [];
  const manifestPath = join(__dirname, "jm2-media-manifest.json");
  await writeFile(manifestPath, JSON.stringify(mediaAssets, null, 2), "utf8");
  console.log(
    `Wrote ${mediaAssets.length} media URLs to jm2-media-manifest.json`,
  );

  const psScript = join(
    REPO,
    ".cursor",
    "skills",
    "sitecore-serialization-skills",
    "sitecore-media-from-url-yaml",
    "scripts",
    "create-media-from-urls.ps1",
  );
  const manifestPs = manifestPath.replace(/'/g, "''");
  const cmd = `powershell -NoProfile -ExecutionPolicy Bypass -Command "& { $raw = Get-Content '${manifestPs}' -Raw | ConvertFrom-Json; $assets = @($raw | ForEach-Object { @{ Url = $_.Url; Alt = $_.Alt } }); & '${psScript}' -MediaRoot '${MEDIA_ROOT_DISK}' -SiteMediaPath '${SITE_MEDIA_PATH}' -SiteRootItemId '${MEDIA_ROOT_ID}' -BaseUrl '${BASE_URL}' -Assets $assets }"`;
  try {
    const out = execSync(cmd, {
      cwd: REPO,
      encoding: "utf8",
      maxBuffer: 50 * 1024 * 1024,
    });
    const jsonStart = out.lastIndexOf("[");
    if (jsonStart < 0) throw new Error("No JSON array in media script output");
    const results = JSON.parse(out.slice(jsonStart).trim());
    console.log(`Downloaded/reused ${results.length} media items`);
    return results;
  } catch (e) {
    console.warn(
      "Media download failed — YAML will contain MEDIA placeholders:",
      e.message?.slice(0, 400),
    );
    return [];
  }
}

async function main() {
  await loadDataFolderIds();

  console.log("Building site chrome datasources...");
  const chrome = await buildSiteChrome();

  console.log("Building per-section datasources...");
  const sectionResults = {};
  const allCmsNames = new Set(manifest.pages.flatMap((p) => p.sectionOrder));
  for (const cmsName of allCmsNames) {
    if (
      !CMS_MAP[cmsName] ||
      ["Header", "Footer", "CookieBanner"].includes(cmsName)
    )
      continue;
    sectionResults[cmsName] = await buildSectionDatasource(cmsName);
    console.log(`  ${cmsName}`);
  }

  console.log("Writing datasource YAML...");
  for (const dsId of Object.keys(datasourceRegistry)) {
    await writeDatasourceItem(dsId);
  }

  console.log("Writing presentation (partial designs + page design)...");
  loadSpacingStyleIds();
  await writePresentation(chrome);

  console.log("Writing navigation stub pages from header HTML...");
  const navPageCount = await writeNavPagesFromHeader();
  console.log(`  ${navPageCount} navigation stub page(s)`);

  console.log("Writing page YAML...");
  const scienceId = stableGuid("page-science-innovation");

  const homeRenderings = buildPageRenderings(
    "matthey-com--home",
    sectionResults,
    chrome.cookieDs,
  );
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
${metaFields("page-home")}
`,
  );

  await writePageYaml(
    "Science and Innovation.yml",
    "Science and Innovation",
    HOME_ID,
    scienceId,
    "Science and Innovation",
    buildPageRenderings(
      "matthey-com--science-and-innovation",
      sectionResults,
      chrome.cookieDs,
    ),
    "Home",
    { sortOrder: 300, includeNavFilter: true },
  );

  const newsId = stableGuid("page-news");
  await writePageYaml(
    "News.yml",
    "News",
    HOME_ID,
    newsId,
    "Media",
    buildPageRenderings("matthey-com--news", sectionResults, chrome.cookieDs),
    "Home",
    { sortOrder: 600, includeNavFilter: true },
  );

  const articleId = stableGuid("page-pgm-market-report-2026");
  const articleTitle = "Johnson Matthey publishes 2026 PGM market report";
  await writePageYaml(
    "Johnson Matthey publishes 2026 PGM market report.yml",
    "Johnson Matthey publishes 2026 PGM market report",
    newsId,
    articleId,
    articleTitle,
    buildPageRenderings(
      "matthey-com--media-2026-johnson-matthey-publishes-2026-pgm-market-report1",
      sectionResults,
      chrome.cookieDs,
    ),
    "Home/News",
  );

  console.log("Downloading media assets...");
  const mediaResults = await downloadMedia();
  if (mediaResults.length) {
    console.log("Patching media IDs into datasource YAML...");
    await patchMediaIds(mediaResults);
  }
  assertMediaReferencesSerialized();

  try {
    execSync(
      `dotnet sitecore serialization validate --fix -i ${MODULE_NAMESPACE}`,
      {
        cwd: COLLECTION_FOLDER,
        stdio: "inherit",
      },
    );
  } catch {
    console.warn("Validation reported issues — review output above.");
  }

  console.log("\nDone.");
  console.log(
    `Pages: Home (${SITE_PATH}/Home), Science and Innovation (${SITE_PATH}/Home/Science and Innovation)`,
  );
  console.log(
    `         News (${SITE_PATH}/Home/News), PGM Report (${SITE_PATH}/Home/News/${articleTitle})`,
  );
  console.log(`Navigation stub pages from header: ${navPageCount}`);
  console.log(
    `Media assets tracked: ${mediaAssets.length}, downloaded/reused: ${mediaResults.length}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
