#!/usr/bin/env node
/**
 * Extract CSS + design tokens for existing page folders without full section re-capture.
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { extractPageDesign } from './lib/extract-page-design.mjs';
import { hideCookieBannerInPage } from './lib/cookie-banner.mjs';
import { buildSiteSummary } from './lib/build-site-summary.mjs';
import { resolvePlaywright } from './lib/playwright-resolve.mjs';
import { readdir } from 'node:fs/promises';

const VIEWPORTS = { width: 1440, height: 900 };

function parseArgs(argv) {
  let project = path.resolve(process.cwd(), 'design-screenshots');
  let waitMs = 2000;
  let timeoutMs = 90000;
  let loadUntil = 'domcontentloaded';
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--project') project = path.resolve(process.cwd(), argv[++i]);
    if (argv[i] === '--wait-ms') waitMs = Number(argv[++i]) || waitMs;
    if (argv[i] === '--timeout-ms') timeoutMs = Number(argv[++i]) || timeoutMs;
    if (argv[i] === '--load') loadUntil = argv[++i] === 'networkidle' ? 'networkidle' : 'domcontentloaded';
    if (argv[i] === '--help' || argv[i] === '-h') {
      console.log('Usage: node enrich-page-design.mjs --project ./design-screenshots/{domain}');
      process.exit(0);
    }
  }
  return { project, waitMs, timeoutMs, loadUntil };
}

async function listPageDirs(projectRoot) {
  const entries = await readdir(projectRoot, { withFileTypes: true });
  const dirs = [];
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name === 'sections') continue;
    const pageDir = path.join(projectRoot, entry.name);
    try {
      const url = (await readFile(path.join(pageDir, 'source-url.txt'), 'utf8')).trim();
      if (url) dirs.push({ slug: entry.name, pageDir, url });
    } catch {
      /* skip */
    }
  }
  return dirs.sort((a, b) => a.slug.localeCompare(b.slug));
}

async function updatePageManifest(pageDir, design) {
  const manifestPath = path.join(pageDir, 'page-manifest.json');
  let manifest = {};
  try {
    manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  } catch {
    manifest = { slug: path.basename(pageDir) };
  }
  manifest.design = design;
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
}

async function main() {
  const { project, waitMs, timeoutMs, loadUntil } = parseArgs(process.argv.slice(2));
  const pages = await listPageDirs(project);
  if (!pages.length) {
    console.error('No page folders with source-url.txt found.');
    process.exit(1);
  }

  const { chromium } = resolvePlaywright();
  const browser = await chromium.launch({ headless: true });

  console.log(`Enriching design tokens for ${pages.length} page(s) in ${project}\n`);

  try {
    for (const { slug, pageDir, url } of pages) {
      console.log(`${slug} — ${url}`);
      const context = await browser.newContext({ viewport: VIEWPORTS });
      const page = await context.newPage();
      page.setDefaultNavigationTimeout(timeoutMs);
      try {
        await page.goto(url, { waitUntil: loadUntil, timeout: timeoutMs });
        if (waitMs > 0) await page.waitForTimeout(waitMs);
        await page.evaluate(async () => {
          const delay = (ms) => new Promise((r) => setTimeout(r, ms));
          const step = Math.max(window.innerHeight * 0.75, 400);
          let y = 0;
          const max = document.documentElement.scrollHeight;
          while (y < max) {
            window.scrollTo(0, y);
            await delay(120);
            y += step;
          }
          window.scrollTo(0, 0);
        });
        await page.evaluate(hideCookieBannerInPage);
        const design = await extractPageDesign(page, pageDir);
        await updatePageManifest(pageDir, design);
        console.log(
          `  ✓ ${design.fonts.length} fonts, primary ${(design.colors.primary?.hex ?? design.colors.primary ?? []).length} hex, ${(design.colors.primary?.gradients ?? []).length} gradients, ${design.css.files.length} css files`
        );
      } catch (err) {
        console.error(`  ✗ ${err instanceof Error ? err.message : err}`);
      } finally {
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }

  const { path: summaryPath } = await buildSiteSummary(project);
  console.log(`\nSite summary: ${summaryPath}`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
