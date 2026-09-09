#!/usr/bin/env node
/**
 * Fetch rendered HTML for one or more URLs (Playwright — post-JS).
 * HTML-only alternative to capture.mjs (which also saves PNGs).
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { resolvePlaywright } from './lib/playwright-resolve.mjs';
import { savePageHtml } from './lib/save-page-html.mjs';
import { readUrlsFromFile, slugFromUrl, validateUrl } from './lib/url-utils.mjs';

function printHelp() {
  console.log(`Usage: node fetch-html.mjs [options]

Options:
  --urls <a,b,c>     Comma-separated URLs
  --file <path>      One URL per line (# comments ignored)
  --out <dir>        Output directory (default: ./design-screenshots)
  --wait-ms <n>      Extra wait after load (default: 1500)
  --timeout-ms <n>   Navigation timeout (default: 60000)
  --manifest         Write manifest.json
  -h, --help         Show help

Output per URL:
  {out}/{slug}/page.html   — full document
  {out}/{slug}/source-url.txt
`);
}

function parseArgs(argv) {
  const options = {
    urls: [],
    file: null,
    out: path.resolve(process.cwd(), 'design-screenshots'),
    waitMs: 1500,
    timeoutMs: 60000,
    manifest: false,
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
    if (arg === '--wait-ms') {
      options.waitMs = Number(argv[++i]) || options.waitMs;
      continue;
    }
    if (arg === '--timeout-ms') {
      options.timeoutMs = Number(argv[++i]) || options.timeoutMs;
      continue;
    }
    if (arg === '--manifest') {
      options.manifest = true;
      continue;
    }
    if (arg.startsWith('http://') || arg.startsWith('https://')) {
      options.urls.push(arg.trim());
    }
  }

  return options;
}

async function fetchHtmlForUrl(browser, url, outDir, options) {
  const slug = slugFromUrl(url);
  const pageDir = path.join(outDir, slug);
  await mkdir(pageDir, { recursive: true });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  page.setDefaultNavigationTimeout(options.timeoutMs);

  const result = { url, slug, dir: pageDir, html: {} };

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: options.timeoutMs });
    if (options.waitMs > 0) {
      await page.waitForTimeout(options.waitMs);
    }

    result.html = await savePageHtml(page, pageDir);
    console.log(`  ✓ page.html: ${result.html.page}`);
  } catch (error) {
    result.error = error instanceof Error ? error.message : String(error);
    console.error(`  ✗ ${result.error}`);
  } finally {
    await context.close();
  }

  await writeFile(path.join(pageDir, 'source-url.txt'), url, 'utf8');
  return result;
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

  const validatedUrls = options.urls.map(validateUrl);
  await mkdir(options.out, { recursive: true });

  const { chromium } = resolvePlaywright();
  const browser = await chromium.launch({ headless: true });
  const manifest = [];

  console.log(`Output: ${options.out}`);
  console.log(`URLs: ${validatedUrls.length}\n`);

  try {
    for (const url of validatedUrls) {
      console.log(`Fetching ${url}`);
      manifest.push(await fetchHtmlForUrl(browser, url, options.out, options));
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
