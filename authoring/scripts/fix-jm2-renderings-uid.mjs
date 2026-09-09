#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = 'c:/Projects/SE12/SE12-JBE-DM/authoring/items/Johnson Matthey 2';
const files = [
  'serialized-content/jm2/jm2/Home.yml',
  'serialized-content/jm2/jm2/Home/Science and Innovation.yml',
  'serialized-content/jm2/jm2/Presentation/Partial Designs/Header.yml',
  'serialized-content/jm2/jm2/Presentation/Partial Designs/Footer.yml',
];

const badUid = /uid="(\{[A-F0-9-]+\})\}"/g;
let total = 0;

for (const rel of files) {
  const fp = join(root, rel);
  const before = readFileSync(fp, 'utf8');
  const matches = before.match(badUid);
  if (!matches?.length) continue;
  writeFileSync(fp, before.replace(badUid, 'uid="$1"'));
  console.log('fixed', matches.length, 'in', rel);
  total += matches.length;
}

console.log('total fixed', total);
