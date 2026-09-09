#!/usr/bin/env node
/**
 * Promote {page-dir}/sections/ into {project}/sections/ without re-running Playwright.
 * Usage:
 *   node merge-page-sections.mjs --page-dir "./design-screenshots/{domain}/{page-slug}"
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  mergePageSectionsIntoDomain,
  loadGlobalManifest,
  saveGlobalManifest,
} from './lib/merge-domain-sections.mjs';
import { writeSectionPlans } from './lib/section-plan.mjs';
import { buildSiteSummary } from './lib/build-site-summary.mjs';

function printHelp() {
  console.log(`Usage: node merge-page-sections.mjs --page-dir "./design-screenshots/{domain}/{page-slug}"`);
}

function parseArgs(argv) {
  const options = { pageDirs: [] };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '-h' || arg === '--help') {
      printHelp();
      process.exit(0);
    }
    if (arg === '--page-dir') {
      options.pageDirs.push(path.resolve(process.cwd(), argv[++i] ?? ''));
    }
  }
  return options;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.pageDirs.length === 0) {
    printHelp();
    process.exit(1);
  }

  for (const pageDir of options.pageDirs) {
    const projectRoot = path.dirname(pageDir);
    const domainSectionsRoot = path.join(projectRoot, 'sections');
    const pageSlug = path.basename(pageDir);

    let pageManifest;
    try {
      pageManifest = JSON.parse(await readFile(path.join(pageDir, 'page-manifest.json'), 'utf8'));
    } catch {
      console.warn(`Skip ${pageDir}: missing page-manifest.json (run section-capture first)`);
      continue;
    }

    const globalManifest = await loadGlobalManifest(domainSectionsRoot);
    if (!globalManifest.components) globalManifest.components = {};
    globalManifest.projectRoot = projectRoot;
    globalManifest.sectionsRoot = domainSectionsRoot;

    const report = await mergePageSectionsIntoDomain({
      pageDir,
      domainSectionsRoot,
      pageSlug,
      globalManifest,
      pageSections: pageManifest.components ?? [],
    });

    globalManifest.updatedAt = new Date().toISOString();
    await saveGlobalManifest(domainSectionsRoot, globalManifest);
    await writeSectionPlans(projectRoot, globalManifest);
    await buildSiteSummary(projectRoot, globalManifest);

    console.log(
      `Merged ${pageSlug}: ${report.componentsToBuild.length} new component(s), ${report.sections.filter((s) => s.action === 'reuse').length} reused`
    );
    console.log(`  → ${path.join(pageDir, 'new-sections-manifest.json')}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
