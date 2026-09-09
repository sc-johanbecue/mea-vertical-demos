#!/usr/bin/env node
const sites = [
  {
    name: 'jm2',
    itemId: 'd990e4cc-264b-4dbb-a3ef-444b2eeddf92',
    port: 3000,
  },
  {
    name: 'axa2',
    itemId: 'f72cad1f-b9fc-438c-bc67-276de60a7420',
    port: 3001,
  },
];

const secret = '6RfNOF1HRP2wpj6SRReSgJ';

for (const site of sites) {
  const url = `http://localhost:${site.port}/api/editing/render?sc_itemid=${site.itemId}&sc_lang=en&sc_site=${site.name}&sc_layoutKind=shared&mode=edit&secret=${secret}&route=%2F&sc_version=1`;
  try {
    const res = await fetch(url);
    const text = await res.text();
    console.log(`\n=== ${site.name} status ${res.status} len ${text.length} ===`);
    if (!res.ok) {
      console.log(text.slice(0, 500));
      continue;
    }
    const zeros = (text.match(/00000000-0000-0000-0000-000000000000/g) || []).length;
    console.log('empty uid occurrences', zeros);
    const componentBlocks = [...text.matchAll(/"componentName":"([^"]+)"[\s\S]*?"uid":"([^"]+)"/g)];
    const byName = {};
    for (const [, name, uid] of componentBlocks) {
      if (!byName[name]) byName[name] = [];
      byName[name].push(uid);
    }
    for (const [name, uids] of Object.entries(byName).sort()) {
      const bad = uids.filter((u) => u === '00000000-0000-0000-0000-000000000000');
      if (bad.length) console.log(`  BAD ${name}: ${bad.length}/${uids.length} empty uid`);
      else console.log(`  OK   ${name}: ${uids.length} uid(s)`);
    }
  } catch (err) {
    console.log(`\n=== ${site.name} FAILED ===`, err.message);
  }
}
