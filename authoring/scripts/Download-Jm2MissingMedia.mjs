#!/usr/bin/env node
/**
 * Download matthey.com images referenced on home/science pages but missing from jm2 media library.
 * Usage: node authoring/scripts/Download-Jm2MissingMedia.mjs
 */
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = join(__dirname, '..', '..');
const ROOT = join(REPO, 'authoring', 'items', 'Johnson Matthey 2', 'serialized-content');
const MEDIA_ROOT_DISK = join(ROOT, 'media-library', 'johnson-matthey-2', 'jm2');
const MEDIA_ROOT_ID = '2f7f209f-6166-450e-b6ec-5e2b43f48dc1';
const SITE_MEDIA_PATH = '/sitecore/media library/Project/johnson-matthey-2/jm2';

const EXTRA_ASSETS = [
  {
    Url: 'https://matthey.com/documents/161599/348539/cormetech+site.jpg/5bc54dac-56e5-23e9-da48-4b85c3556698?t=1779951077595',
    Alt: 'Cormetech site',
  },
  {
    Url: 'https://matthey.com/documents/161599/4387813/Tapping+molten+metal+in+PGM+refining+%283%29.jpg/3b37cba0-2a78-64bb-0b7e-13bc9e33cc89?t=1749559547937',
    Alt: 'PGM refining',
  },
  {
    Url: 'https://matthey.com/documents/161599/3147297/Aerial+view+of+blue+lake+and+green+pine+tree+forest.jpg/108ca62e-103d-47af-f656-0109afb1ee6c?t=1747663922388',
    Alt: 'Aerial forest view',
  },
  {
    Url: 'https://matthey.com/documents/161599/348539/home+video+thumbnail+%282%29.png/5efa312c-403b-df93-1f35-9cd185f1d7f8?t=1771427143621',
    Alt: 'Johnson Matthey video thumbnail',
  },
];

const manifestPath = join(__dirname, 'jm2-missing-media-manifest.json');
writeFileSync(manifestPath, JSON.stringify(EXTRA_ASSETS, null, 2), 'utf8');

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
const cmd = `powershell -NoProfile -ExecutionPolicy Bypass -Command "& { $raw = Get-Content '${manifestPs}' -Raw | ConvertFrom-Json; $assets = @($raw | ForEach-Object { @{ Url = $_.Url; Alt = $_.Alt } }); & '${psScript}' -MediaRoot '${MEDIA_ROOT_DISK}' -SiteMediaPath '${SITE_MEDIA_PATH}' -SiteRootItemId '${MEDIA_ROOT_ID}' -BaseUrl 'https://matthey.com' -Assets $assets }"`;

try {
  const out = execSync(cmd, { cwd: REPO, encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
  const jsonStart = out.lastIndexOf('[');
  const results = JSON.parse(out.slice(jsonStart).trim());
  console.log(`Downloaded/reused ${results.length} extra media items`);
  for (const r of results) console.log(' ', r.MediaId, r.Url.slice(0, 80));
} catch (e) {
  console.error('Media download failed:', e.message?.slice(0, 500));
  process.exit(1);
}

// Merge into main manifest for traceability
const mainManifest = JSON.parse(readFileSync(join(__dirname, 'jm2-media-manifest.json'), 'utf8'));
const seen = new Set(mainManifest.map((a) => a.Url));
for (const a of EXTRA_ASSETS) {
  if (!seen.has(a.Url)) mainManifest.push(a);
}
writeFileSync(join(__dirname, 'jm2-media-manifest.json'), JSON.stringify(mainManifest, null, 2), 'utf8');
