import { writeFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * Saves rendered HTML after client-side JS (Playwright page).
 * - page.html — full document
 */
export async function savePageHtml(page, pageDir) {
  const pageHtml = await page.content();
  const pagePath = path.join(pageDir, 'page.html');
  await writeFile(pagePath, pageHtml, 'utf8');
  return { page: pagePath };
}
