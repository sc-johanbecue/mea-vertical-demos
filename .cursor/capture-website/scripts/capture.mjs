#!/usr/bin/env node
/**
 * Capture desktop, tablet, and mobile screenshots plus rendered HTML for URLs.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { resolvePlaywright } from './lib/playwright-resolve.mjs';
import { savePageHtml } from './lib/save-page-html.mjs';
import { extractPageDesign } from './lib/extract-page-design.mjs';
import { hideAllStickyOverlaysInPage } from './lib/sticky-overlays.mjs';
import { readUrlsFromFile, slugFromUrl, validateUrl, hostSlugFromUrl, isGenericDesignScreenshotsDir } from './lib/url-utils.mjs';

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 },
};

function printHelp() {
  console.log(`Usage: node capture.mjs [options]

Options:
  --urls <a,b,c>     Comma-separated URLs to capture
  --file <path>      Text file with one URL per line (# comments ignored)
  --out <dir>        Output directory (default: ./design-screenshots)
  --full-page        Capture full scrollable page (default: true)
  --viewport-only    Capture above-the-fold only
  --no-html          Skip saving page.html
  --wait-ms <n>      Extra wait after load in ms (default: 1500)
  --timeout-ms <n>   Navigation timeout (default: 60000)
  --devices <list>   Comma-separated: desktop,tablet,mobile (default: all)
  --manifest         Write manifest.json listing all output paths
  --load <mode>      domcontentloaded | networkidle (default: domcontentloaded)
  -h, --help         Show this help

Per viewport, two full-page PNGs are saved:
  {device}.png        — with sticky overlays visible (cookie, nav, chat, …)
  {device}-clean.png  — same viewport after all sticky overlays are hidden

HTML (default on): saved once per URL on first device load:
  page.html — full document after JS
`);
}

function parseArgs(argv) {
  const options = {
    urls: [],
    file: null,
    out: path.resolve(process.cwd(), 'design-screenshots'),
    fullPage: true,
    saveHtml: true,
    waitMs: 1500,
    timeoutMs: 60000,
    devices: ['desktop', 'tablet', 'mobile'],
    manifest: false,
    loadUntil: 'domcontentloaded',
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '-h' || arg === '--help') {
      printHelp();
      process.exit(0);
    }
    if (arg === '--urls') {
      options.urls.push(...(argv[++i] ?? '').split(',').map((u) => u.trim()).filter(Boolean));
      continue;
    }
    if (arg === '--file') {
      options.file = argv[++i];
      continue;
    }
    if (arg === '--out') {
      options.out = path.resolve(process.cwd(), argv[++i] ?? options.out);
      continue;
    }
    if (arg === '--full-page') {
      options.fullPage = true;
      continue;
    }
    if (arg === '--viewport-only') {
      options.fullPage = false;
      continue;
    }
    if (arg === '--no-html') {
      options.saveHtml = false;
      continue;
    }
    if (arg === '--wait-ms') {
      options.waitMs = Number(argv[++i]) || options.waitMs;
      continue;
    }
    if (arg === '--timeout-ms') {
      options.timeoutMs = Number(argv[++i]) || options.timeoutMs;
      continue;
    }
    if (arg === '--devices') {
      options.devices = (argv[++i] ?? '')
        .split(',')
        .map((d) => d.trim().toLowerCase())
        .filter((d) => d in VIEWPORTS);
      continue;
    }
    if (arg === '--manifest') {
      options.manifest = true;
      continue;
    }
    if (arg === '--load') {
      options.loadUntil = argv[++i] === 'networkidle' ? 'networkidle' : 'domcontentloaded';
      continue;
    }
    if (arg.startsWith('http://') || arg.startsWith('https://')) {
      options.urls.push(arg.trim());
    }
  }

  return options;
}

async function captureUrl(browser, url, outDir, options) {
  const slug = slugFromUrl(url);
  const pageDir = path.join(outDir, slug);
  await mkdir(pageDir, { recursive: true });
  await writeFile(path.join(pageDir, 'source-url.txt'), url, 'utf8');

  const results = { url, slug, dir: pageDir, shots: {}, shotsClean: {}, html: {} };
  let htmlSaved = false;

  for (const device of options.devices) {
    const viewport = VIEWPORTS[device];
    if (!viewport) continue;

    const context = await browser.newContext({
      viewport,
      deviceScaleFactor: device === 'mobile' ? 2 : 1,
      userAgent:
        device === 'mobile'
          ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
          : undefined,
    });

    const page = await context.newPage();
    page.setDefaultNavigationTimeout(options.timeoutMs);

    try {
      await page.goto(url, { waitUntil: options.loadUntil, timeout: options.timeoutMs });
      if (options.waitMs > 0) {
        await page.waitForTimeout(options.waitMs);
      }

      if (options.saveHtml && !htmlSaved) {
        results.html = await savePageHtml(page, pageDir);
        htmlSaved = true;
        console.log(`  ✓ page.html: ${results.html.page}`);
        try {
          results.design = await extractPageDesign(page, pageDir);
          const tokensPath = path.join(pageDir, 'design-tokens.json');
          await writeFile(tokensPath, JSON.stringify(results.design, null, 2), 'utf8');
          console.log(
            `  ✓ design tokens: ${results.design.fonts.length} fonts, ${results.design.css.files.length} css files`
          );
        } catch (err) {
          console.warn(`  ⚠ design tokens: ${err instanceof Error ? err.message : err}`);
        }
      }

      const overlayPath = path.join(pageDir, `${device}.png`);
      await page.screenshot({ path: overlayPath, fullPage: options.fullPage });
      results.shots[device] = overlayPath;
      console.log(`  ✓ ${device} (overlay): ${overlayPath}`);

      await page.evaluate(hideAllStickyOverlaysInPage);
      await page.waitForTimeout(300);

      const cleanPath = path.join(pageDir, `${device}-clean.png`);
      await page.screenshot({ path: cleanPath, fullPage: options.fullPage });
      results.shotsClean[device] = cleanPath;
      console.log(`  ✓ ${device} (clean): ${cleanPath}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`  ✗ ${device}: ${message}`);
      results.shots[device] = null;
      results.error = message;
    } finally {
      await context.close();
    }
  }

  return results;
}

function resolveProjectRoot(out, urls) {
  if (!isGenericDesignScreenshotsDir(out) || urls.length === 0) {
    return out;
  }
  const hosts = [...new Set(urls.map(hostSlugFromUrl))];
  const projectRoot = path.join(out, hosts[0]);
  if (hosts.length > 1) {
    console.warn(
      `Warning: URLs span multiple hosts (${hosts.join(', ')}). Using project folder: ${hosts[0]}`
    );
  }
  console.log(`Project folder: ${projectRoot} (derived from host)`);
  return projectRoot;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.file) {
    options.urls.push(...(await readUrlsFromFile(options.file)));
  }

  options.urls = [...new Set(options.urls.map((u) => u.trim()).filter(Boolean))];

  if (options.urls.length === 0) {
    printHelp();
    process.exit(1);
  }

  options.out = resolveProjectRoot(options.out, options.urls);

  const validatedUrls = options.urls.map(validateUrl);
  await mkdir(options.out, { recursive: true });

  const { chromium } = resolvePlaywright();
  // Prefer installed Chrome when present: some CDNs (e.g. Akamai) reset headless Chromium.
  const browser = await chromium.launch({
    headless: process.env.CAPTURE_HEADLESS === '1',
    channel: process.env.CAPTURE_CHANNEL || 'chrome',
  });
  const manifest = [];

  console.log(`Output: ${options.out}`);
  console.log(`Devices: ${options.devices.join(', ')}`);
  console.log(`HTML: ${options.saveHtml ? 'yes' : 'no'}`);
  console.log(`URLs: ${validatedUrls.length}\n`);

  try {
    for (const url of validatedUrls) {
      console.log(`Capturing ${url}`);
      manifest.push(await captureUrl(browser, url, options.out, options));
      console.log('');
    }
  } finally {
    await browser.close();
  }

  if (options.manifest) {
    const manifestPath = path.join(options.out, 'manifest.json');
    await writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
    console.log(`Manifest: ${manifestPath}`);
  }

  if (manifest.some((m) => m.error)) {
    process.exitCode = 1;
  }

  console.log('Done.');
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
