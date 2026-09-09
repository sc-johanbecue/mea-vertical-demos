/**
 * Promote page-local section crops into the domain-level sections/ registry.
 * Skips site chrome when unchanged; deduplicates by structure fingerprint;
 * disambiguates cmsName/folder when the same name looks different.
 */
import { access, cp, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import crypto from 'node:crypto';
import path from 'node:path';

const SITE_SCOPED_TYPES = new Set([
  'cookie-banner',
  'topbar',
  'top-bar',
  'header',
  'nav',
  'navigation',
  'footer',
  'chat-widget',
  'floating-action',
]);

function normalizeHtml(html) {
  return html.replace(/\s+/g, ' ').trim();
}

async function readTextIfExists(filePath) {
  try {
    return await readFile(filePath, 'utf8');
  } catch {
    return null;
  }
}

async function fileSizeIfExists(filePath) {
  try {
    const s = await stat(filePath);
    return s.size;
  } catch {
    return 0;
  }
}

/** Stable fingerprint for “same section band” comparison. */
export async function fingerprintSectionDir(sectionDir, folderName) {
  const html = await readTextIfExists(path.join(sectionDir, 'section.html'));
  const desktop = path.join(sectionDir, `${folderName}-desktop.png`);
  const desktopAlt = path.join(sectionDir, 'section-desktop.png');
  const desktopSize = (await fileSizeIfExists(desktop)) || (await fileSizeIfExists(desktopAlt));
  const payload = [normalizeHtml(html ?? ''), String(desktopSize)].join('|');
  return crypto.createHash('sha256').update(payload).digest('hex').slice(0, 16);
}

export function folderNameFromCmsName(cmsName) {
  return cmsName
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase();
}

function purposePrefix(heading, pageSlug) {
  const source = heading?.trim() || pageSlug.split('--').pop() || 'page';
  const words = source
    .replace(/[^\w\s-]/g, ' ')
    .split(/[\s-]+/)
    .filter((w) => w.length > 2 && !/^(the|and|for|with|from|our|your)$/i.test(w))
    .slice(0, 3);
  if (words.length === 0) return 'Page';
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
}

export function disambiguateCmsName(baseCmsName, { heading, pageSlug }) {
  const prefix = purposePrefix(heading, pageSlug);
  if (!prefix || baseCmsName.startsWith(prefix)) {
    const short = pageSlug.split('--').pop() ?? 'page';
    const shortPascal = short
      .split('-')
      .filter(Boolean)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join('');
    return `${shortPascal}${baseCmsName}`;
  }
  return `${prefix}${baseCmsName}`;
}

function disambiguateFolderName(baseFolder, pageSlug) {
  const short = (pageSlug.split('--').pop() ?? 'page').slice(0, 40);
  return `${short}-${baseFolder}`.replace(/-+/g, '-');
}

async function copySectionDir(srcDir, destDir) {
  await mkdir(path.dirname(destDir), { recursive: true });
  await cp(srcDir, destDir, { recursive: true, force: true });
}

function relOutputs(sectionsRoot, outputs) {
  return Object.fromEntries(
    Object.entries(outputs).map(([device, p]) => [
      device,
      p ? path.relative(sectionsRoot, p).replace(/\\/g, '/') : null,
    ])
  );
}

function findDomainEntryByCmsName(globalManifest, cmsName) {
  return globalManifest.components?.[cmsName] ?? null;
}

function findDomainEntryByFolder(globalManifest, folderName) {
  for (const entry of Object.values(globalManifest.components ?? {})) {
    if (entry.folderName === folderName) return entry;
  }
  return null;
}

/**
 * @param {object} params
 * @param {string} params.pageDir — absolute page folder ({project}/{page-slug})
 * @param {string} params.domainSectionsRoot — absolute {project}/sections
 * @param {string} params.pageSlug
 * @param {object} params.globalManifest — mutated in place
 * @param {Array<object>} params.pageSections — section entries from this page capture
 */
export async function mergePageSectionsIntoDomain({
  pageDir,
  domainSectionsRoot,
  pageSlug,
  globalManifest,
  pageSections,
}) {
  const pageSectionsRoot = path.join(pageDir, 'sections');
  const projectRoot = path.dirname(domainSectionsRoot);
  const report = {
    pageSlug,
    pageDir: path.relative(projectRoot, pageDir).replace(/\\/g, '/'),
    pageSectionsRoot: path.relative(projectRoot, pageSectionsRoot).replace(/\\/g, '/'),
    domainSectionsRoot: path.relative(projectRoot, domainSectionsRoot).replace(/\\/g, '/'),
    mergedAt: new Date().toISOString(),
    sections: [],
    componentsToBuild: [],
  };

  try {
    await access(pageSectionsRoot);
  } catch {
    return report;
  }

  const entries = await readdir(pageSectionsRoot, { withFileTypes: true });
  const sectionFolders = entries.filter((e) => e.isDirectory()).map((e) => e.name);

  for (const sectionMeta of pageSections) {
    if (sectionMeta.metadataOnly || sectionMeta.screenshotSkipped) continue;
    if (sectionMeta.scope === 'site' || SITE_SCOPED_TYPES.has(sectionMeta.type)) continue;

    const folderName = sectionMeta.folderName;
    if (!sectionFolders.includes(folderName)) continue;

    const pageSectionDir = path.join(pageSectionsRoot, folderName);
    const fingerprint = await fingerprintSectionDir(pageSectionDir, folderName);
    const existing = findDomainEntryByCmsName(globalManifest, sectionMeta.cmsName);
    let action = 'promoted';
    let domainCmsName = sectionMeta.cmsName;
    let domainFolder = folderName;

    if (existing?.fingerprint && existing.fingerprint === fingerprint) {
      action = 'reuse';
      domainCmsName = existing.cmsName;
      domainFolder = existing.folderName;
      const seen = new Set(existing.seenOnPages ?? []);
      seen.add(pageSlug);
      globalManifest.components[domainCmsName] = {
        ...existing,
        seenOnPages: [...seen],
      };
      report.sections.push({
        action,
        cmsName: domainCmsName,
        sourceCmsName: sectionMeta.cmsName,
        domainFolder,
        pageSectionFolder: path.relative(projectRoot, pageSectionDir).replace(/\\/g, '/'),
        fingerprint,
        existingDomainCmsName: domainCmsName,
        buildComponent: false,
      });
      continue;
    }

    if (existing && existing.fingerprint !== fingerprint) {
      action = 'variant';
      domainCmsName = disambiguateCmsName(sectionMeta.cmsName, {
        heading: sectionMeta.heading,
        pageSlug,
      });
      domainFolder = disambiguateFolderName(folderName, pageSlug);
      while (findDomainEntryByCmsName(globalManifest, domainCmsName) || findDomainEntryByFolder(globalManifest, domainFolder)) {
        domainCmsName = `${domainCmsName}Section`;
        domainFolder = `${domainFolder}-alt`;
      }
    }

    const domainSectionDir = path.join(domainSectionsRoot, domainFolder);
    await copySectionDir(pageSectionDir, domainSectionDir);

    const outputs = {};
    for (const device of ['desktop', 'tablet', 'mobile']) {
      const candidate = path.join(domainSectionDir, `${folderName}-${device}.png`);
      const renamed = path.join(domainSectionDir, `${domainFolder}-${device}.png`);
      try {
        await access(candidate);
        if (domainFolder !== folderName) {
          await cp(candidate, renamed, { force: true });
        }
        outputs[device] = path.join(domainSectionDir, `${domainFolder}-${device}.png`);
      } catch {
        outputs[device] = null;
      }
    }

    const sectionHtmlRel = 'section.html';
    const seen = new Set(existing?.seenOnPages ?? []);
    seen.add(pageSlug);

    globalManifest.components[domainCmsName] = {
      ...sectionMeta,
      cmsName: domainCmsName,
      folderName: domainFolder,
      fingerprint,
      outputDir: domainSectionDir,
      outputs: relOutputs(domainSectionsRoot, outputs),
      sectionHtml: `${domainFolder}/${sectionHtmlRel}`,
      captured: Object.values(outputs).some(Boolean),
      seenOnPages: [...seen],
      promotedFromPage: pageSlug,
      ...(action === 'variant'
        ? { variantOf: sectionMeta.cmsName, disambiguationReason: 'same cmsName, different section fingerprint' }
        : {}),
    };

    report.sections.push({
      action,
      cmsName: domainCmsName,
      sourceCmsName: sectionMeta.cmsName,
      domainFolder,
      pageSectionFolder: path.relative(projectRoot, pageSectionDir).replace(/\\/g, '/'),
      fingerprint,
      existingDomainCmsName: action === 'variant' ? sectionMeta.cmsName : null,
      buildComponent: true,
    });
    report.componentsToBuild.push(domainCmsName);
  }

  const manifestPath = path.join(pageDir, 'new-sections-manifest.json');
  await writeFile(manifestPath, JSON.stringify(report, null, 2), 'utf8');
  return report;
}

export async function loadGlobalManifest(sectionsRoot) {
  const manifestPath = path.join(sectionsRoot, 'manifest.json');
  try {
    const raw = await readFile(manifestPath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return { components: {}, pages: [] };
  }
}

export async function saveGlobalManifest(sectionsRoot, manifest) {
  await mkdir(sectionsRoot, { recursive: true });
  await writeFile(path.join(sectionsRoot, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
}
