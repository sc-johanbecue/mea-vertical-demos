#!/usr/bin/env node
/**
 * Discover page sections, capture cookie banner first (if present), dismiss it,
 * capture site chrome (always), hide it, then capture shared component
 * screenshots under {project}/sections/.
 */
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { discoverSectionsInPage } from './lib/discover-sections.mjs';
import { resolvePlaywright } from './lib/playwright-resolve.mjs';
import { savePageHtml } from './lib/save-page-html.mjs';
import { saveSectionHtml } from './lib/save-section-html.mjs';
import { screenshotBandRegion } from './lib/capture-band.mjs';
import {
  detectAllStickyOverlaysInPage,
  hideAllStickyOverlaysInPage,
  hideCookieBannerAndBackdropInPage,
} from './lib/sticky-overlays.mjs';
import { resolveSectionSelectorInPage } from './lib/resolve-section-selector.mjs';
import { decomposeProject } from '../../sitecore-from-capture/scripts/decompose-sections.mjs';
import { writeSectionPlans } from './lib/section-plan.mjs';
import { extractPageDesign } from './lib/extract-page-design.mjs';
import { buildSiteSummary } from './lib/build-site-summary.mjs';
import { mergePageSectionsIntoDomain } from './lib/merge-domain-sections.mjs';
import { readUrlsFromFile, slugFromUrl, validateUrl, hostSlugFromUrl, isGenericDesignScreenshotsDir } from './lib/url-utils.mjs';

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 },
};

function printHelp() {
  console.log(`Usage: node section-capture.mjs [options]

Output layout (per site project — never write to a repo-wide design-screenshots/sections/):
  {out}/{host-slug}/sections/manifest.json     ← when --out is ./design-screenshots, host slug is auto-appended
  {out}/{page-slug}/sections/              ← page-local staging (content sections)
  {out}/{page-slug}/new-sections-manifest.json  ← sections promoted this run (for component skills)
  {out}/sections/{folder-name}/{folder-name}-desktop.png   ← domain registry (merged)
  {out}/sections/{folder-name}/section.html
  {out}/sections/{folder-name}/section-plan.json   ← reviewable TSX/YAML build plan
  {out}/{page-slug}/page-manifest.json   ← page-specific section order

Site-scoped sticky overlays (CookieBanner, TopBar, Header, Navigation, ChatWidget, …) use overlay screenshots.
Content section crops use a single PNG per viewport (no -clean suffix).
`);
}

function parseArgs(argv) {
  const options = {
    urls: [],
    pageDirs: [],
    file: null,
    out: path.resolve(process.cwd(), 'design-screenshots'),
    devices: ['desktop', 'tablet', 'mobile'],
    waitMs: 2000,
    timeoutMs: 90000,
    loadUntil: 'domcontentloaded',
    refreshHtml: false,
    refreshDesign: false,
    refreshChrome: false,
    decompose: true,
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
    if (arg === '--page-dir') {
      options.pageDirs.push(...(argv[++i] ?? '').split(',').map((p) => p.trim()).filter(Boolean));
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
    if (arg === '--devices') {
      options.devices = (argv[++i] ?? '')
        .split(',')
        .map((d) => d.trim().toLowerCase())
        .filter((d) => d in VIEWPORTS);
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
    if (arg === '--load') {
      options.loadUntil = argv[++i] === 'networkidle' ? 'networkidle' : 'domcontentloaded';
      continue;
    }
    if (arg === '--refresh-html') {
      options.refreshHtml = true;
      continue;
    }
    if (arg === '--refresh-design') {
      options.refreshDesign = true;
      continue;
    }
    if (arg === '--refresh-chrome') {
      options.refreshChrome = true;
      continue;
    }
    if (arg === '--no-decompose') {
      options.decompose = false;
      continue;
    }
    if (arg.startsWith('http://') || arg.startsWith('https://')) {
      options.urls.push(arg.trim());
    }
  }

  return options;
}

function resolveProjectRoot(out, urls) {
  if (!isGenericDesignScreenshotsDir(out) || urls.length === 0) {
    return out;
  }
  const hosts = [...new Set(urls.map(hostSlugFromUrl))];
  if (hosts.length > 1) {
    console.warn(
      `Warning: URLs span multiple hosts (${hosts.join(', ')}). Sections will be stored under the first host folder: ${hosts[0]}`
    );
  }
  const projectRoot = path.join(out, hosts[0]);
  console.log(`Project folder: ${projectRoot} (derived from host — avoids cross-site sections/)`);
  return projectRoot;
}

async function resolvePageJobs(options) {
  /** @type {Array<{ url: string; pageDir: string; slug: string }>} */
  const jobs = [];

  for (const url of options.urls) {
    const validated = validateUrl(url);
    const slug = slugFromUrl(validated);
    jobs.push({ url: validated, pageDir: path.join(options.out, slug), slug });
  }

  for (const dir of options.pageDirs) {
    const pageDir = path.resolve(process.cwd(), dir);
    const url = validateUrl((await readFile(path.join(pageDir, 'source-url.txt'), 'utf8')).trim());
    jobs.push({ url, pageDir, slug: slugFromUrl(url) });
  }

  return jobs;
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function loadGlobalManifest(sectionsRoot) {
  const manifestPath = path.join(sectionsRoot, 'manifest.json');
  try {
    const raw = await readFile(manifestPath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return { components: {}, pages: [] };
  }
}

async function saveGlobalManifest(sectionsRoot, manifest) {
  await mkdir(sectionsRoot, { recursive: true });
  await writeFile(path.join(sectionsRoot, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
}

const STICKY_OVERLAY_TYPES = new Set([
  'cookie-banner',
  'topbar',
  'top-bar',
  'header',
  'nav',
  'navigation',
  'chat-widget',
  'floating-action',
]);

const SITE_CHROME_OVERLAYS = new Set(['TopBar', 'Header', 'Navigation']);

async function captureComponentScreenshots(page, section, sectionDir, devices, { suffix = '', saveHtml = false, hideChrome = false } = {}) {
  const outputs = {};
  let sectionHtmlPath = null;
  let resolvedSelector = section.selector;

  async function ensureChromeHidden() {
    if (!hideChrome) return;
    await page.evaluate(hideAllStickyOverlaysInPage);
    await page.waitForTimeout(200);
  }

  await ensureChromeHidden();

  if (saveHtml) {
    resolvedSelector =
      (await page.evaluate(resolveSectionSelectorInPage, {
        selector: section.selector,
        anchorWebid: section.anchorWebid ?? null,
        heading: section.heading ?? null,
      })) ?? section.selector;

    try {
      sectionHtmlPath = await saveSectionHtml(page, { ...section, selector: resolvedSelector }, sectionDir);
      if (sectionHtmlPath) {
        console.log(`    ✓ ${section.cmsName} section.html`);
      }
    } catch (err) {
      console.warn(
        `    ✗ ${section.cmsName} section.html: ${err instanceof Error ? err.message : err}`
      );
    }
  }

  for (const device of devices) {
    await page.setViewportSize(VIEWPORTS[device]);
    await page.waitForTimeout(300);
    await ensureChromeHidden();

    const selector =
      (await page.evaluate(resolveSectionSelectorInPage, {
        selector: resolvedSelector ?? section.selector,
        anchorWebid: section.anchorWebid ?? null,
        heading: section.heading ?? null,
      })) ??
      resolvedSelector ??
      section.selector;

    if (!selector) {
      outputs[device] = null;
      continue;
    }

    const bandSelectors = section.bandSelectors?.filter(Boolean);

    if (bandSelectors?.length) {
      const fileName = `${section.folderName}-${device}${suffix}.png`;
      const filePath = path.join(sectionDir, fileName);
      try {
        const ok = await screenshotBandRegion(page, bandSelectors, filePath);
        outputs[device] = ok ? filePath : null;
        if (ok) {
          const label = hideChrome ? `${device} content` : suffix ? `${device} clean` : `${device} overlay`;
          console.log(`    ✓ ${section.cmsName} ${label} (band)`);
        } else {
          console.log(`    ↷ ${section.cmsName} ${device} (band not visible)`);
        }
      } catch (err) {
        outputs[device] = null;
        console.warn(`    ✗ ${section.cmsName} ${device}${suffix}: ${err instanceof Error ? err.message : err}`);
      }
      continue;
    }

    const locator = page.locator(selector).first();
    if ((await locator.count()) === 0) {
      outputs[device] = null;
      continue;
    }

    const visible = await locator.isVisible().catch(() => false);
    if (!visible) {
      outputs[device] = null;
      console.log(`    ↷ ${section.cmsName} ${device} (not visible at viewport)`);
      continue;
    }

    const fileName = `${section.folderName}-${device}${suffix}.png`;
    const filePath = path.join(sectionDir, fileName);
    try {
      await locator.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(200);
      await locator.screenshot({ path: filePath, animations: 'disabled' });
      outputs[device] = filePath;
      const label = hideChrome ? `${device} content` : suffix ? `${device} clean` : `${device} overlay`;
      console.log(`    ✓ ${section.cmsName} ${label}`);
    } catch (err) {
      outputs[device] = null;
      console.warn(`    ✗ ${section.cmsName} ${device}${suffix}: ${err instanceof Error ? err.message : err}`);
    }
  }
  return { outputs, sectionHtmlPath, selector: resolvedSelector ?? section.selector };
}

async function captureFullPageViewports(page, pageDir, devices, { loadUntil, waitMs, timeoutMs }) {
  const outputs = { overlay: {}, clean: {} };
  const url = page.url();

  for (const device of devices) {
    await page.setViewportSize(VIEWPORTS[device]);
    await page.goto(url, { waitUntil: loadUntil, timeout: timeoutMs });
    if (waitMs > 0) await page.waitForTimeout(waitMs);

    const overlayPath = path.join(pageDir, `${device}.png`);
    await page.screenshot({ path: overlayPath, fullPage: true });
    outputs.overlay[device] = overlayPath;
    console.log(`  ✓ full-page ${device} (overlay)`);

    await page.evaluate(hideAllStickyOverlaysInPage);
    await page.waitForTimeout(300);

    const cleanPath = path.join(pageDir, `${device}-clean.png`);
    await page.screenshot({ path: cleanPath, fullPage: true });
    outputs.clean[device] = cleanPath;
    console.log(`  ✓ full-page ${device} (clean)`);
  }
  return outputs;
}

function isStickyOverlaySection(section) {
  return section.scope === 'site' && (section.isStickyOverlay || STICKY_OVERLAY_TYPES.has(section.type));
}

async function captureSectionsForPage(browser, job, options, globalManifest, sectionsRoot) {
  const { url, pageDir, slug } = job;
  const pageSectionsRoot = path.join(pageDir, 'sections');
  await mkdir(pageDir, { recursive: true });
  await mkdir(pageSectionsRoot, { recursive: true });
  await writeFile(path.join(pageDir, 'source-url.txt'), url, 'utf8');

  const context = await browser.newContext({ viewport: VIEWPORTS.desktop, deviceScaleFactor: 1 });
  const page = await context.newPage();
  page.setDefaultNavigationTimeout(options.timeoutMs);

  const pageResult = {
    url,
    slug,
    pageDir,
    components: [],
    stickyOverlays: { components: [], hideMethod: null },
    fullPageShots: null,
    design: null,
    errors: [],
  };

  try {
    await page.goto(url, { waitUntil: options.loadUntil, timeout: options.timeoutMs });
    if (options.waitMs > 0) await page.waitForTimeout(options.waitMs);

    if (options.refreshHtml || !(await fileExists(path.join(pageDir, 'page.html')))) {
      await savePageHtml(page, pageDir);
    }

    let hasDesign = false;
    try {
      const existingManifest = JSON.parse(await readFile(path.join(pageDir, 'page-manifest.json'), 'utf8'));
      hasDesign = !!existingManifest.design;
      if (!pageResult.design) pageResult.design = existingManifest.design ?? null;
    } catch {
      /* no manifest yet */
    }

    if (options.refreshDesign || options.refreshHtml || !hasDesign) {
      try {
        pageResult.design = await extractPageDesign(page, pageDir);
        console.log(
          `  ✓ design tokens: ${pageResult.design.fonts.length} fonts, ${pageResult.design.css.files.length} css files`
        );
      } catch (err) {
        console.warn(`  ⚠ design tokens: ${err instanceof Error ? err.message : err}`);
      }
    }

    /** @type {string[]} */
    const pageOrder = [];

    // 1) Cookie banner first — capture while visible, then hide banner + dim backdrop
    const stickyOverlays = await page.evaluate(detectAllStickyOverlaysInPage);
    const cookieOverlay = stickyOverlays.find((o) => o.cmsName === 'CookieBanner') ?? null;
    const chromeOverlays = stickyOverlays.filter((o) => o.cmsName !== 'CookieBanner');
    const cookiePresentOnLoad = !!cookieOverlay;
    pageResult.stickyOverlays.found = stickyOverlays.length > 0;

    async function captureStickyOverlay(overlay, { forceRecapture = false } = {}) {
      const overlaySection = {
        cmsName: overlay.cmsName,
        folderName: overlay.folderName,
        name: overlay.folderName,
        selector: overlay.selector,
        type: overlay.type,
        scope: 'site',
        reason: `Sticky overlay (${overlay.cmsName}) — captured before hide`,
        componentType: overlay.cmsName,
        isStickyOverlay: true,
        captureMode: 'overlay',
        capturedBeforeHide: true,
      };

      const overlayDir = path.join(sectionsRoot, overlaySection.folderName);
      await mkdir(overlayDir, { recursive: true });

      const existing = globalManifest.components[overlaySection.cmsName];
      const alreadyCaptured = existing?.captured;
      const seenOnPages = new Set(existing?.seenOnPages ?? []);
      seenOnPages.add(slug);

      const shouldRecapture =
        forceRecapture ||
        options.refreshChrome ||
        (cookiePresentOnLoad && SITE_CHROME_OVERLAYS.has(overlaySection.cmsName) && alreadyCaptured);

      if (!alreadyCaptured || shouldRecapture) {
        if (shouldRecapture && alreadyCaptured) {
          console.log(`  Re-capturing sticky overlay ${overlaySection.cmsName} (cookie backdrop cleared)…`);
        } else {
          console.log(`  Capturing sticky overlay ${overlaySection.cmsName}…`);
        }
        const { outputs, sectionHtmlPath, selector } = await captureComponentScreenshots(
          page,
          overlaySection,
          overlayDir,
          options.devices,
          { suffix: '', saveHtml: true }
        );
        globalManifest.components[overlaySection.cmsName] = {
          ...overlaySection,
          selector: selector ?? overlaySection.selector,
          outputDir: overlayDir,
          outputs: relOutputs(sectionsRoot, outputs),
          sectionHtml: sectionHtmlPath ? path.relative(sectionsRoot, sectionHtmlPath).replace(/\\/g, '/') : null,
          captured: Object.values(outputs).some(Boolean),
          seenOnPages: [...seenOnPages],
        };
        pageResult.stickyOverlays.components.push({ cmsName: overlaySection.cmsName, captured: true, recaptured: shouldRecapture });
      } else {
        globalManifest.components[overlaySection.cmsName] = { ...existing, seenOnPages: [...seenOnPages] };
        console.log(`    ↷ ${overlaySection.cmsName} (site-scoped, already captured)`);
        pageResult.stickyOverlays.components.push({ cmsName: overlaySection.cmsName, captured: false, skipped: true });
      }

      if (!pageOrder.includes(overlaySection.cmsName)) {
        pageOrder.push(overlaySection.cmsName);
      }
    }

    if (cookieOverlay) {
      await captureStickyOverlay(cookieOverlay);
    }

    if (cookiePresentOnLoad) {
      await page.evaluate(hideCookieBannerAndBackdropInPage);
      await page.waitForTimeout(300);
    }

    for (const overlay of chromeOverlays) {
      await captureStickyOverlay(overlay);
    }

    // 2) Full-page viewport shots — overlay then clean per device
    console.log('  Capturing full-page viewport shots…');
    pageResult.fullPageShots = await captureFullPageViewports(page, pageDir, options.devices, {
      loadUntil: options.loadUntil,
      waitMs: options.waitMs,
      timeoutMs: options.timeoutMs,
    });
    pageResult.stickyOverlays.hideMethod = 'css';

    // 3) Discover content sections — site chrome must stay hidden for crops
    await page.evaluate(hideAllStickyOverlaysInPage);
    await page.waitForTimeout(300);
    await page.setViewportSize(VIEWPORTS.desktop);
    if (options.waitMs > 0) await page.waitForTimeout(options.waitMs);
    const discovered = await page.evaluate(discoverSectionsInPage);
    console.log(`  Discovered ${discovered.length} components`);

    for (const section of discovered) {
      if (section.type === 'card' && section.captureScreenshot !== true) {
        pageResult.components.push({
          cmsName: section.cmsName,
          folderName: section.folderName,
          type: section.type,
          scope: section.scope,
          selector: section.selector,
          reason: section.reason,
          order: section.order,
          placeholderFor: section.placeholderFor ?? null,
          parentSection: section.parentSection ?? null,
          screenshotSkipped: true,
          metadataOnly: true,
        });
        continue;
      }

      pageOrder.push(section.cmsName);
      const sticky = isStickyOverlaySection(section);
      const sectionDir = sticky
        ? path.join(sectionsRoot, section.folderName)
        : path.join(pageSectionsRoot, section.folderName);
      await mkdir(sectionDir, { recursive: true });

      const existing = sticky ? globalManifest.components[section.cmsName] : null;
      const skipCapture = sticky && existing?.captured;
      const captureMode = sticky ? 'overlay' : 'clean';
      const suffix = '';

      let outputs = existing?.outputs ?? {};
      let sectionHtml = existing?.sectionHtml ?? null;
      let selector = section.selector;
      if (!skipCapture) {
        const captured = await captureComponentScreenshots(page, section, sectionDir, options.devices, {
          suffix,
          saveHtml: true,
          hideChrome: !sticky,
        });
        outputs = captured.outputs;
        selector = captured.selector ?? section.selector;
        if (captured.sectionHtmlPath) {
          const relRoot = sticky ? sectionsRoot : pageSectionsRoot;
          sectionHtml = path.relative(relRoot, captured.sectionHtmlPath).replace(/\\/g, '/');
        }
      } else {
        console.log(`    ↷ ${section.cmsName} (site-scoped, already captured)`);
      }

      const captured = skipCapture || Object.values(outputs).some(Boolean);
      const seenOnPages = new Set(existing?.seenOnPages ?? []);
      seenOnPages.add(slug);

      const relRoot = sticky ? sectionsRoot : pageSectionsRoot;
      const pageSectionEntry = {
        ...section,
        selector,
        captureMode,
        isStickyOverlay: sticky,
        outputDir: sectionDir,
        outputs: skipCapture && sticky ? existing.outputs : relOutputs(relRoot, outputs),
        sectionHtml: sectionHtml ?? existing?.sectionHtml ?? null,
        captured,
        seenOnPages: [...seenOnPages],
      };

      if (sticky) {
        globalManifest.components[section.cmsName] = pageSectionEntry;
      }

      pageResult.components.push({
        cmsName: section.cmsName,
        folderName: section.folderName,
        type: section.type,
        scope: section.scope,
        selector: section.selector,
        reason: section.reason,
        order: section.order,
        heading: section.heading ?? null,
        placeholderFor: section.placeholderFor ?? null,
        parentSection: section.parentSection ?? null,
        captureMode,
        screenshotSkipped: skipCapture,
        stagedInPageSections: !sticky,
      });
    }

    const mergeReport = await mergePageSectionsIntoDomain({
      pageDir,
      domainSectionsRoot: sectionsRoot,
      pageSlug: slug,
      globalManifest,
      pageSections: pageResult.components,
    });
    pageResult.newSections = mergeReport;
    for (const merged of mergeReport.sections) {
      if (!merged.sourceCmsName || merged.sourceCmsName === merged.cmsName) continue;
      const idx = pageOrder.indexOf(merged.sourceCmsName);
      if (idx >= 0) pageOrder[idx] = merged.cmsName;
    }
    if (mergeReport.componentsToBuild.length > 0) {
      console.log(
        `  Promoted ${mergeReport.componentsToBuild.length} new section(s) to domain registry: ${mergeReport.componentsToBuild.join(', ')}`
      );
    }

    globalManifest.pages = globalManifest.pages.filter((p) => p.slug !== slug);
    globalManifest.pages.push({
      slug,
      url,
      pageDir,
      capturedAt: new Date().toISOString(),
      sectionOrder: pageOrder,
      components: pageResult.components,
    });

    await writeFile(
      path.join(pageDir, 'page-manifest.json'),
      JSON.stringify(
        {
          url,
          slug,
          sectionOrder: pageOrder,
          components: pageResult.components,
          stickyOverlays: pageResult.stickyOverlays,
          fullPageShots: {
            overlay: Object.fromEntries(
              Object.entries(pageResult.fullPageShots?.overlay ?? {}).map(([d, p]) => [
                d,
                path.relative(pageDir, p).replace(/\\/g, '/'),
              ])
            ),
            clean: Object.fromEntries(
              Object.entries(pageResult.fullPageShots?.clean ?? {}).map(([d, p]) => [
                d,
                path.relative(pageDir, p).replace(/\\/g, '/'),
              ])
            ),
          },
          design: pageResult.design ?? null,
          newSections: pageResult.newSections ?? null,
        },
        null,
        2
      ),
      'utf8'
    );
  } catch (err) {
    pageResult.errors.push(err instanceof Error ? err.message : String(err));
    console.error(`  ✗ ${pageResult.errors.at(-1)}`);
  } finally {
    await context.close();
  }

  return pageResult;
}

function relOutputs(sectionsRoot, outputs) {
  return Object.fromEntries(
    Object.entries(outputs).map(([device, p]) => [
      device,
      p ? path.relative(sectionsRoot, p).replace(/\\/g, '/') : null,
    ])
  );
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.file) options.urls.push(...(await readUrlsFromFile(options.file)));

  options.out = resolveProjectRoot(options.out, options.urls);

  const jobs = await resolvePageJobs(options);
  if (jobs.length === 0) {
    printHelp();
    process.exit(1);
  }

  const sectionsRoot = path.join(options.out, 'sections');
  const globalManifest = await loadGlobalManifest(sectionsRoot);
  if (!globalManifest.components) globalManifest.components = {};
  if (!globalManifest.pages) globalManifest.pages = [];
  globalManifest.projectRoot = options.out;
  globalManifest.sectionsRoot = sectionsRoot;

  const { chromium } = resolvePlaywright();
  // Prefer installed Chrome when present: some CDNs (e.g. Akamai) reset headless Chromium.
  const browser = await chromium.launch({
    headless: process.env.CAPTURE_HEADLESS === '1',
    channel: process.env.CAPTURE_CHANNEL || 'chrome',
  });
  const summary = [];

  console.log(`Section capture — ${jobs.length} page(s)`);
  console.log(`Shared sections: ${sectionsRoot}\n`);

  try {
    for (const job of jobs) {
      console.log(`Processing ${job.url}`);
      summary.push(await captureSectionsForPage(browser, job, options, globalManifest, sectionsRoot));
      console.log('');
    }
  } finally {
    await browser.close();
  }

  globalManifest.updatedAt = new Date().toISOString();
  await saveGlobalManifest(sectionsRoot, globalManifest);

  const plans = await writeSectionPlans(options.out, globalManifest);
  console.log(`Section plans: ${plans.written} × section-plan.json under ${plans.sectionsRoot}`);

  try {
    const { path: summaryPath } = await buildSiteSummary(options.out, globalManifest);
    console.log(`Site summary: ${summaryPath}`);
  } catch (err) {
    console.warn(`  ⚠ Site summary skipped: ${err instanceof Error ? err.message : err}`);
  }

  console.log(`Global manifest: ${path.join(sectionsRoot, 'manifest.json')}`);

  try {
    if (options.decompose) {
      console.log('\nDecomposing sections → Sitecore component blueprints…');
      const decomposed = await decomposeProject(options.out);
      console.log(`  ✓ component-blueprint.json (${decomposed.componentCount} components, ${decomposed.pageCount} pages)`);
    }
  } catch (err) {
    console.warn(`  ⚠ Decomposition skipped: ${err instanceof Error ? err.message : err}`);
  }

  console.log('Done.');

  if (summary.some((s) => s.errors.length)) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
