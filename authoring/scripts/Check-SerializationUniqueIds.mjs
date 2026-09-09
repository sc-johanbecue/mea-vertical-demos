#!/usr/bin/env node
/**
 * Detect duplicate Sitecore item IDs across serialization modules on disk.
 * SCS push fails when the same ID appears in more than one YAML file repo-wide.
 *
 * Usage:
 *   node authoring/scripts/Check-SerializationUniqueIds.mjs
 *   node authoring/scripts/Check-SerializationUniqueIds.mjs --module JM3Collection
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ITEMS_ROOT = join(__dirname, '..', 'items');
const moduleFilter = process.argv.includes('--module')
  ? process.argv[process.argv.indexOf('--module') + 1]
  : null;

function collectIdLocations(rootDir) {
  /** @type {Map<string, string[]>} */
  const byId = new Map();

  function walk(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (!entry.name.endsWith('.yml') && !entry.name.endsWith('.yaml')) continue;
      const text = readFileSync(full, 'utf8');
      const match = text.match(/^ID: "([^"]+)"/m);
      if (!match) continue;
      const id = match[1].toLowerCase();
      const rel = relative(process.cwd(), full).replace(/\\/g, '/');
      if (!byId.has(id)) byId.set(id, []);
      byId.get(id).push(rel);
    }
  }

  if (!existsSync(rootDir)) {
    console.error(`Items root not found: ${rootDir}`);
    process.exit(2);
  }

  for (const moduleName of readdirSync(rootDir, { withFileTypes: true })) {
    if (!moduleName.isDirectory()) continue;
    if (moduleFilter && moduleName.name !== moduleFilter) continue;
    const serialized = join(rootDir, moduleName.name, 'serialized-content');
    if (existsSync(serialized)) walk(serialized);
  }

  return byId;
}

const byId = collectIdLocations(ITEMS_ROOT);
const duplicates = [...byId.entries()].filter(([, paths]) => paths.length > 1);

if (!duplicates.length) {
  console.log(`OK — ${byId.size} item IDs scanned, no duplicates on disk.`);
  process.exit(0);
}

console.error(`ERROR — ${duplicates.length} item ID(s) appear in more than one YAML file:\n`);
for (const [id, paths] of duplicates.slice(0, 20)) {
  console.error(`  ${id}`);
  for (const p of paths) console.error(`    ${p}`);
  console.error('');
}
if (duplicates.length > 20) {
  console.error(`  … and ${duplicates.length - 20} more.`);
}
console.error(
  'Fix: regenerate YAML with a project-specific stableGuid prefix, or assign fresh UUIDs. See .cursor/skills/sitecore-serialization-skills/unique-serialization-ids/SKILL.md',
);
process.exit(1);
