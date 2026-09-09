#!/usr/bin/env node
const pages = [
  { name: 'News Card 1', url: 'https://matthey.com/media/2026/full-year-results-25-26' },
  { name: 'News Card 2', url: 'https://matthey.com/investors/financial-results-and-reports/report-archive/annual-report-26' },
];

function pickImage(html) {
  const og = html.match(/property="og:image"\s+content="([^"]+)"/i)?.[1];
  if (og) return og;
  const doc = html.match(/https:\/\/matthey\.com\/documents\/[^"'\s]+\.(?:jpg|jpeg|png|webp)[^"'\s]*/i)?.[0];
  if (doc) return doc.replace(/&amp;/g, '&');
  const img = html.match(/<img[^>]+src="(https:\/\/matthey\.com\/documents\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/i)?.[1];
  return img?.replace(/&amp;/g, '&') ?? null;
}

for (const p of pages) {
  const html = await (await fetch(p.url)).text();
  console.log(p.name, pickImage(html));
}
