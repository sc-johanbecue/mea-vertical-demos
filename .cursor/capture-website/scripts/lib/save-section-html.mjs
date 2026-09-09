import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { extractBandHtml } from './capture-band.mjs';

/**
 * Saves the outerHTML of a discovered section element into its section folder.
 * - section.html — matched element outerHTML (same DOM as screenshot capture)
 * - When bandSelectors is set, concatenates outerHTML of each band member.
 */
export async function saveSectionHtml(page, section, sectionDir) {
  const bandSelectors = section.bandSelectors?.filter(Boolean);
  if (bandSelectors?.length) {
    const html = await extractBandHtml(page, bandSelectors);
    if (!html) return null;
    const filePath = path.join(sectionDir, 'section.html');
    await writeFile(filePath, html, 'utf8');
    return filePath;
  }

  const selector = section.selector;
  if (!selector) return null;

  const html = await page.evaluate((sel) => {
    try {
      const el = document.querySelector(sel);
      if (!el) return null;
      return el.outerHTML;
    } catch {
      return null;
    }
  }, selector);

  if (!html) return null;

  const filePath = path.join(sectionDir, 'section.html');
  await writeFile(filePath, html, 'utf8');
  return filePath;
}
