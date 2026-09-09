import { createRequire } from 'node:module';
import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const skillRoot = path.resolve(__dirname, '../..');
export const repoRoot = path.resolve(skillRoot, '../../..');

export function tryRequirePlaywright(fromDir) {
  const pkgPath = path.join(fromDir, 'package.json');
  if (!existsSync(pkgPath)) {
    return null;
  }
  try {
    const req = createRequire(pkgPath);
    return req('playwright');
  } catch {
    return null;
  }
}

export function collectPlaywrightSearchDirs() {
  const dirs = [];
  const seen = new Set();

  const add = (dir) => {
    const resolved = path.resolve(dir);
    if (seen.has(resolved)) return;
    seen.add(resolved);
    dirs.push(resolved);
  };

  if (process.env.PLAYWRIGHT_MODULE_PATH) {
    add(path.dirname(process.env.PLAYWRIGHT_MODULE_PATH));
  }

  add(skillRoot);
  add(path.resolve(skillRoot, '..'));
  add(path.resolve(skillRoot, '../..'));
  add(path.join(repoRoot, '.cursor'));
  add(repoRoot);

  let current = process.cwd();
  for (let i = 0; i < 12; i++) {
    add(current);
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }

  const industryVerticals = path.join(repoRoot, 'industry-verticals');
  if (existsSync(industryVerticals)) {
    try {
      for (const entry of readdirSync(industryVerticals, { withFileTypes: true })) {
        if (entry.isDirectory()) {
          add(path.join(industryVerticals, entry.name));
        }
      }
    } catch {
      // ignore
    }
  }

  add(repoRoot);
  return dirs;
}

export function resolvePlaywright() {
  for (const dir of collectPlaywrightSearchDirs()) {
    const playwright = tryRequirePlaywright(dir);
    if (playwright) {
      return playwright;
    }
  }

  throw new Error(
    `Could not find playwright.\n\n` +
      `Run one-time runtime setup from the repository root:\n` +
      `  node .cursor/skills/capture-website/scripts/setup-cursor-runtime.mjs\n` +
      `  npm --prefix .cursor install\n` +
      `  npm --prefix .cursor run setup:playwright\n\n` +
      `This installs Playwright in .cursor/node_modules, not inside .cursor/skills.\n` +
      `Or set PLAYWRIGHT_MODULE_PATH to an existing Playwright install.`
  );
}
