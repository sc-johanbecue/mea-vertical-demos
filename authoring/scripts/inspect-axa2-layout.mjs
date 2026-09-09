#!/usr/bin/env node
const secret = '6RfNOF1HRP2wpj6SRReSgJ';
const url = `http://localhost:3000/api/editing/render?sc_itemid=f72cad1f-b9fc-438c-bc67-276de60a7420&sc_lang=en&sc_site=axa2&sc_layoutKind=shared&mode=edit&secret=${secret}&route=%2F&sc_version=1`;
const html = await (await fetch(url)).text();
const m = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
if (!m) {
  console.log('no __NEXT_DATA__');
  process.exit(1);
}
const data = JSON.parse(m[1]);
const empties = [];
function walk(obj) {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) return obj.forEach(walk);
  if (obj.componentName) {
    empties.push({ componentName: obj.componentName, uid: obj.uid });
  }
  for (const v of Object.values(obj)) walk(v);
}
walk(data);
console.log('renderings found', empties.length);
for (const e of empties) {
  const bad = !e.uid || e.uid === '00000000-0000-0000-0000-000000000000';
  console.log(bad ? 'BAD' : 'OK ', e.componentName, e.uid?.slice(0, 8));
}
console.log('bad count', empties.filter((e) => !e.uid || e.uid === '00000000-0000-0000-0000-000000000000').length);
