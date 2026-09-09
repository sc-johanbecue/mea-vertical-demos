#!/usr/bin/env node
const secret = '6RfNOF1HRP2wpj6SRReSgJ';
const url = `http://localhost:3000/api/editing/render?sc_itemid=f72cad1f-b9fc-438c-bc67-276de60a7420&sc_lang=en&sc_site=axa2&sc_layoutKind=shared&mode=edit&secret=${secret}&route=%2F&sc_version=1`;
const html = await (await fetch(url)).text();
const m = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
import { writeFileSync } from 'node:fs';
writeFileSync('c:/Projects/SE12/SE12-JBE-DM/authoring/scripts/axa2-next-data.json', JSON.stringify(JSON.parse(m[1]), null, 2));
console.log('written axa2-next-data.json');
