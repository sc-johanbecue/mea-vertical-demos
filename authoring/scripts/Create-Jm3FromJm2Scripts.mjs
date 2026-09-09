#!/usr/bin/env node
/** Creates Generate-Jm3Components.mjs and Complete-Jm3Authoring.mjs from jm2 scripts. */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const REPLACEMENTS = [
  ['Johnson Matthey 2 (jm2)', 'JM3Collection (jm3site)'],
  ["join(__dirname, '..', 'items', 'Johnson Matthey 2', 'serialized-content')", "join(__dirname, '..', 'items', 'JM3Collection', 'serialized-content')"],
  ["join(__dirname, '..', 'items', 'Johnson Matthey 2')", "join(__dirname, '..', 'items', 'JM3Collection')"],
  ["const PROJECT = 'johnson-matthey-2'", "const PROJECT = 'jm3collection'"],
  ["const SITE_PATH = '/sitecore/content/johnson-matthey-2/jm2'", "const SITE_PATH = '/sitecore/content/jm3collection/jm3site'"],
  ["const SITE_REL = 'jm2/jm2'", "const SITE_REL = 'jm3site/jm3site'"],
  ["const MODULE_NAMESPACE = 'johnson-matthey-2-scs'", "const MODULE_NAMESPACE = 'jm3collection-scs'"],
  ['Generate-Jm2Components.mjs', 'Generate-Jm3Components.mjs'],
  ['Complete-Jm2Authoring.mjs', 'Complete-Jm3Authoring.mjs'],
  ['jm2-component-ids.json', 'jm3-component-ids.json'],
  ['jm2-authoring-', 'jm3-authoring-'],
  ['johnson-matthey-2', 'jm3collection'],
  ['johnson-matthey-2/jm2', 'jm3collection/jm3site'],
  ["/jm2/", "/jm3site/"],
  ['jm2-pd-ph-', 'jm3-pd-ph-'],
];

const GENERATE_PARENTS = `const PARENTS = {
  templates: 'deb883dd-0dea-48b3-aea6-0965e2f5f23c',
  renderings: '3c0484d5-ae25-4447-a098-6fef0e181873',
  placeholders: 'f0cbc49d-5aa5-4a23-9ae0-22642ba9d5b2',
  presentation: 'b17e9321-2513-4f2d-aef8-f690846ef806',
  headlessVariantsRoot: '4c8a16c2-e36d-4e16-9189-04ea986bee90',
  branches: 'b55de8f2-de71-45c2-ad86-df253274dc08',
};`;

const COMPLETE_IDS = `
const HOME_ID = 'd9ac9d14-4209-45be-939a-6fcd2897be23';
const SITE_ID = 'c9e6e93d-0afd-477e-b55b-8c6c28bfad1d';
const PARTIAL_DESIGNS_FOLDER = 'd24251c0-02ff-484f-8c63-7be9db232f80';
const PARTIAL_DESIGN_PH_FOLDER = '61a80214-09b4-44f7-bb3d-54f8ff3ac386';
const PAGE_DESIGNS_FOLDER = 'de6660ed-cc1f-4bcf-b81c-3c094871863f';
const MEDIA_ROOT_ID = 'f5d4c7c9-ed19-49d7-a156-03461bc6427c';
const MEDIA_ROOT_DISK = join(ROOT, 'media-library', 'jm3collection', 'jm3site');
const SITE_MEDIA_PATH = '/sitecore/media library/Project/jm3collection/jm3site';
`;

function applyReplacements(content) {
  let out = content;
  for (const [from, to] of REPLACEMENTS) {
    out = out.split(from).join(to);
  }
  return out;
}

function stripCarouselVariants(content) {
  return content
    .replace(/,\s*'Carousel'/g, '')
    .replace(/,\s*"Carousel"/g, '')
    .replace(/,\s*'InversedAnimated'/g, '')
    .replace(/,\s*"InversedAnimated"/g, '')
    .replace(/\n  InversedAnimated: 350,\n  Carousel: 500,\n/, '\n');
}

async function main() {
  let gen = await readFile(join(__dirname, 'Generate-Jm2Components.mjs'), 'utf8');
  gen = applyReplacements(gen);
  gen = stripCarouselVariants(gen);
  gen = gen.replace(
    /const PARENTS = \{[\s\S]*?\};/,
    GENERATE_PARENTS,
  );
  await writeFile(join(__dirname, 'Generate-Jm3Components.mjs'), gen, 'utf8');

  let complete = await readFile(join(__dirname, 'Complete-Jm2Authoring.mjs'), 'utf8');
  complete = applyReplacements(complete);
  complete = complete.replace(
    /const HOME_ID = '[^']+';\nconst SITE_ID = '[^']+';\nconst PARTIAL_DESIGNS_FOLDER = '[^']+';\nconst PARTIAL_DESIGN_PH_FOLDER = '[^']+';\nconst PARTIAL_DESIGN_PH_SETTING_TEMPLATE = '[^']+';\nconst PAGE_DESIGNS_FOLDER = '[^']+';\nconst MEDIA_ROOT_ID = '[^']+';\nconst MEDIA_ROOT_DISK = join\(ROOT, 'media-library', '[^']+'\);\nconst SITE_MEDIA_PATH = '[^']+';\n/,
    `const PARTIAL_DESIGN_PH_SETTING_TEMPLATE = 'd2a6884c-04d5-4089-a64e-d27ca9d68d4c';\n${COMPLETE_IDS}\n`,
  );
  complete = complete.replace("result.headlessVariant = 'Carousel';", "// carousel is Default variant");
  complete = complete.replace(
    /entries\.push\(\{\s*uid: stableGuid\(`\$\{pageSlug\}-cookie`\),\s*renderingId: ids\.CookieBanner\.renderingId,\s*dsId: cookieDs,\s*ph: 'headless-main',\s*par: buildRenderingPar\('CookieBanner', 'Default'\),\s*\}\);\s*\n\s*\n/,
    '',
  );
  await writeFile(join(__dirname, 'Complete-Jm3Authoring.mjs'), complete, 'utf8');
  console.log('Created Generate-Jm3Components.mjs and Complete-Jm3Authoring.mjs');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
