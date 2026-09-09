#!/usr/bin/env node
import { writeFileSync } from 'node:fs';

const secret = '6RfNOF1HRP2wpj6SRReSgJ';
const url = `http://localhost:3000/api/editing/render?sc_itemid=d990e4cc-264b-4dbb-a3ef-444b2eeddf92&sc_lang=en&sc_site=jm2&sc_layoutKind=shared&mode=edit&secret=${secret}&route=%2F&sc_version=1`;
const html = await (await fetch(url)).text();
const m = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
if (!m) {
  console.log('no __NEXT_DATA__');
  process.exit(1);
}
const data = JSON.parse(m[1]);
writeFileSync('c:/Projects/SE12/SE12-JBE-DM/authoring/scripts/jm2-next-data.json', JSON.stringify(data, null, 2));

const empties = [];
function walk(obj) {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) return obj.forEach(walk);
  if (obj.componentName) {
    empties.push({
      componentName: obj.componentName,
      uid: obj.uid,
      ph: obj.params?.ph,
      sig: obj.params?.sig,
      ds: obj.dataSource,
    });
  }
  for (const v of Object.values(obj)) walk(v);
}
walk(data);
console.log('renderings found', empties.length);
for (const e of empties) {
  const bad = !e.uid || e.uid === '00000000-0000-0000-0000-000000000000';
  console.log(bad ? 'BAD' : 'OK ', e.componentName, e.uid?.slice(0, 8), e.ph || e.sig || '');
}
console.log('bad count', empties.filter((e) => !e.uid || e.uid === '00000000-0000-0000-0000-000000000000').length);
