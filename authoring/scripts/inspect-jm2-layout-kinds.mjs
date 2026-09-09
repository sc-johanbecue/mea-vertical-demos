#!/usr/bin/env node
const secret = '6RfNOF1HRP2wpj6SRReSgJ';
for (const kind of ['shared', 'final']) {
  const url = `http://localhost:3000/api/editing/render?sc_itemid=d990e4cc-264b-4dbb-a3ef-444b2eeddf92&sc_lang=en&sc_site=jm2&sc_layoutKind=${kind}&mode=edit&secret=${secret}&route=%2F&sc_version=1`;
  const html = await (await fetch(url)).text();
  const m = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!m) {
    console.log(kind, 'no data');
    continue;
  }
  const data = JSON.parse(m[1]);
  let bad = 0;
  let tot = 0;
  function walk(o) {
    if (!o || typeof o !== 'object') return;
    if (Array.isArray(o)) return o.forEach(walk);
    if (o.componentName) {
      tot++;
      if (!o.uid || o.uid === '00000000-0000-0000-0000-000000000000') bad++;
    }
    for (const v of Object.values(o)) walk(v);
  }
  walk(data);
  console.log(kind, 'bad', bad, '/', tot);
}
