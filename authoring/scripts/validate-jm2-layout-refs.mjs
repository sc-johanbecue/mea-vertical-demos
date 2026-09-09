#!/usr/bin/env node
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..', 'items', 'Johnson Matthey 2', 'serialized-content');
const renderingDir = join(root, 'renderings/johnson-matthey-2');
const renderingIds = new Set(
  readdirSync(renderingDir)
    .filter((f) => f.endsWith('.yml'))
    .map((f) => readFileSync(join(renderingDir, f), 'utf8').match(/^ID: "(.+?)"/m)?.[1].toLowerCase())
    .filter(Boolean),
);

const files = [
  'jm2/jm2/Home.yml',
  'jm2/jm2/Home/Science and Innovation.yml',
  'jm2/jm2/Presentation/Partial Designs/Header.yml',
  'jm2/jm2/Presentation/Partial Designs/Footer.yml',
];

let bad = false;
for (const rel of files) {
  const text = readFileSync(join(root, rel), 'utf8');
  const ids = [...text.matchAll(/s:id="\{(.+?)\}"/g)].map((m) => m[1].toLowerCase());
  const missing = [...new Set(ids.filter((id) => !renderingIds.has(id)))];
  console.log(`${rel}: ${ids.length} refs, missing: ${missing.length ? missing.join(', ') : 'none'}`);
  if (missing.length) bad = true;
}
process.exit(bad ? 1 : 0);
