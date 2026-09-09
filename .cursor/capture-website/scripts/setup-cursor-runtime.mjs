#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(skillRoot, '../../..');
const cursorDir = path.join(repoRoot, '.cursor');
const pkgPath = path.join(cursorDir, 'package.json');
const gitignorePath = path.join(cursorDir, '.gitignore');

function readJson(filePath) {
  if (!existsSync(filePath)) return null;
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch (error) {
    throw new Error(`Could not parse ${filePath}: ${error.message}`);
  }
}

function mergeScript(target, name, command) {
  target.scripts ||= {};
  if (!target.scripts[name]) {
    target.scripts[name] = command;
  }
}

function appendGitignoreLine(line) {
  let current = '';
  if (existsSync(gitignorePath)) {
    current = readFileSync(gitignorePath, 'utf8');
  }
  const lines = new Set(current.split(/\r?\n/).map((value) => value.trim()).filter(Boolean));
  if (!lines.has(line)) {
    const next = current.endsWith('\n') || current.length === 0 ? current : `${current}\n`;
    writeFileSync(gitignorePath, `${next}${line}\n`, 'utf8');
  }
}

mkdirSync(cursorDir, { recursive: true });

const pkg = readJson(pkgPath) || {
  name: 'cursor-skill-runtime',
  private: true,
  type: 'module'
};

pkg.private = true;
pkg.type ||= 'module';
pkg.dependencies ||= {};
pkg.dependencies.playwright ||= '^1.60.0';

mergeScript(pkg, 'setup:playwright', 'playwright install chromium');
mergeScript(pkg, 'capture:website', 'node skills/capture-website/scripts/capture.mjs');
mergeScript(pkg, 'capture:html', 'node skills/capture-website/scripts/fetch-html.mjs');
mergeScript(pkg, 'capture:sections', 'node skills/capture-website/scripts/section-capture.mjs');
mergeScript(pkg, 'capture:merge-sections', 'node skills/capture-website/scripts/merge-page-sections.mjs');
mergeScript(pkg, 'capture:enrich-design', 'node skills/capture-website/scripts/enrich-page-design.mjs');

writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
appendGitignoreLine('node_modules/');
appendGitignoreLine('*.log');

console.log(`Cursor runtime package prepared at: ${pkgPath}`);
console.log('Next commands:');
console.log('  npm --prefix .cursor install');
console.log('  npm --prefix .cursor run setup:playwright');
console.log('Runtime dependencies will be installed in .cursor/node_modules, not in .cursor/skills.');
