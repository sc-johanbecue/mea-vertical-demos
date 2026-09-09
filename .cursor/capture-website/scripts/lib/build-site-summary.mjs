/**
 * Aggregate per-page design tokens into a concise site-level summary.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  isGradientValue,
  isHexValue,
  normalizeColorRole,
  rgbToHex,
} from './extract-page-design.mjs';

const SYSTEM_FONTS = new Set([
  '-apple-system',
  'system-ui',
  'BlinkMacSystemFont',
  'Segoe UI',
  'Roboto',
  'Arial',
  'sans-serif',
]);

function mergeFonts(pageSummaries) {
  const map = new Map();
  for (const page of pageSummaries) {
    for (const font of page.design?.fonts ?? []) {
      if (SYSTEM_FONTS.has(font.family)) continue;
      const key = font.family;
      const existing = map.get(key) ?? { family: key, weight: 0, sources: new Set() };
      existing.weight += font.count ?? 1;
      for (const url of font.sources ?? []) {
        if (url) existing.sources.add(url);
      }
      map.set(key, existing);
    }
  }
  return [...map.values()]
    .sort((a, b) => b.weight - a.weight)
    .map(({ family, weight, sources }) => ({
      family,
      weight,
      sources: preferFontUrlsFromSet(sources),
    }));
}

function preferFontUrlsFromSet(urlSet) {
  const FONT_FILE_EXT = /\.(woff2?|ttf|otf|eot|svg)(\?|#|$)/i;
  const score = (url) => {
    if (/\.woff2(\?|#|$)/i.test(url)) return 5;
    if (/\.woff(\?|#|$)/i.test(url)) return 4;
    if (/\.ttf(\?|#|$)/i.test(url)) return 3;
    if (/\.otf(\?|#|$)/i.test(url)) return 2;
    if (/\.eot(\?|#|$)/i.test(url)) return 1;
    return 0;
  };
  const urls = [...urlSet];
  const fileUrls = urls.filter((u) => FONT_FILE_EXT.test(u)).sort((a, b) => score(b) - score(a) || a.localeCompare(b));
  const otherUrls = urls.filter((u) => !FONT_FILE_EXT.test(u)).sort();
  return [...fileUrls, ...otherUrls];
}

function mergeColorsExclusive(pageSummaries) {
  const arrayRoles = ['primary', 'secondary', 'accent', 'neutrals'];
  const roleWeight = { primary: 4, secondary: 3, accent: 2, neutrals: 1 };
  const hexLimits = { primary: 5, secondary: 2, accent: 1, neutrals: 10 };
  const gradientLimits = { primary: 2, secondary: 1, accent: 1, neutrals: 2 };
  /** @type {Map<string, { role: string, weight: number, value: string, kind: 'hex' | 'gradient' }>} */
  const bestRole = new Map();
  const semantic = { success: null, error: null, warning: null, info: null };

  for (const page of pageSummaries) {
    for (const role of arrayRoles) {
      const { hex, gradients } = normalizeColorRole(page.design?.colors?.[role]);
      for (const value of hex) {
        const normalized = rgbToHex(value) ?? value;
        if (!normalized) continue;
        const weight = roleWeight[role];
        const existing = bestRole.get(normalized);
        if (!existing || weight > existing.weight) {
          bestRole.set(normalized, { role, weight, value: normalized, kind: 'hex' });
        }
      }
      for (const value of gradients) {
        if (!value) continue;
        const weight = roleWeight[role];
        const existing = bestRole.get(value);
        if (!existing || weight > existing.weight) {
          bestRole.set(value, { role, weight, value, kind: 'gradient' });
        }
      }
    }
    const pageSemantic = page.design?.colors?.semantic ?? {};
    for (const type of Object.keys(semantic)) {
      if (semantic[type]) continue;
      const hex = rgbToHex(pageSemantic[type]);
      if (hex?.startsWith('#')) semantic[type] = hex;
    }
  }

  const buckets = {
    primary: { hex: [], gradients: [] },
    secondary: { hex: [], gradients: [] },
    accent: { hex: [], gradients: [] },
    neutrals: { hex: [], gradients: [] },
    semantic,
  };
  for (const { role, value, kind } of bestRole.values()) {
    if (kind === 'gradient') buckets[role].gradients.push(value);
    else buckets[role].hex.push(value);
  }
  for (const role of arrayRoles) {
    buckets[role] = {
      hex: [...new Set(buckets[role].hex)].sort().slice(0, hexLimits[role]),
      gradients: [...new Set(buckets[role].gradients)].slice(0, gradientLimits[role] ?? 0),
    };
  }
  return buckets;
}

function mergeStylesheets(pageSummaries) {
  const files = new Set();
  for (const page of pageSummaries) {
    for (const file of page.design?.css?.files ?? []) {
      const name = path.basename(file.file || file.href || '');
      if (name) files.add(name);
    }
  }
  return [...files].sort();
}

function summarizeSectionNames(sectionsManifest) {
  const site = [];
  const content = [];
  for (const c of Object.values(sectionsManifest?.components ?? {})) {
    if (c.scope === 'site' || c.isStickyOverlay) site.push(c.cmsName);
    else if (c.type !== 'card' || c.captureScreenshot) content.push(c.cmsName);
  }
  return {
    site: [...new Set(site)].sort(),
    content: [...new Set(content)].sort(),
  };
}

async function readPageManifests(projectRoot) {
  const entries = await readdir(projectRoot, { withFileTypes: true });
  const pages = [];
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name === 'sections') continue;
    const pageDir = path.join(projectRoot, entry.name);
    try {
      const raw = JSON.parse(await readFile(path.join(pageDir, 'page-manifest.json'), 'utf8'));
      let design = raw.design ?? null;
      if (!design) {
        try {
          design = JSON.parse(await readFile(path.join(pageDir, 'design-tokens.json'), 'utf8'));
        } catch {
          /* no tokens file */
        }
      }
      pages.push({
        slug: raw.slug ?? entry.name,
        url: raw.url,
        design,
      });
    } catch {
      /* not a page folder */
    }
  }
  return pages.sort((a, b) => a.slug.localeCompare(b.slug));
}

/**
 * @param {string} projectRoot — design-screenshots/{domain}
 * @param {object} [sectionsManifest] — parsed sections/manifest.json (optional)
 */
export async function buildSiteSummary(projectRoot, sectionsManifest = null) {
  if (!sectionsManifest) {
    try {
      sectionsManifest = JSON.parse(
        await readFile(path.join(projectRoot, 'sections', 'manifest.json'), 'utf8')
      );
    } catch {
      sectionsManifest = { components: {}, pages: [] };
    }
  }

  const pages = await readPageManifests(projectRoot);
  const pagesWithDesign = pages.filter((p) => p.design);

  const summary = {
    version: 1,
    generatedAt: new Date().toISOString(),
    project: path.basename(projectRoot),
    urls: pages.map((p) => p.url).filter(Boolean),
    sections: summarizeSectionNames(sectionsManifest),
    fonts: mergeFonts(pagesWithDesign),
    colors: mergeColorsExclusive(pagesWithDesign),
    stylesheets: mergeStylesheets(pagesWithDesign),
  };

  const outPath = path.join(projectRoot, 'site-summary.json');
  await writeFile(outPath, JSON.stringify(summary, null, 2), 'utf8');
  return { path: outPath, summary };
}
