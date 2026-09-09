#!/usr/bin/env node
const contextId = 'rxtSA3d7Or97S8ZHOdkPc';
const url = `https://edge.sitecorecloud.io/api/graphql/v1?sitecoreContextId=${contextId}`;
const query = `
  query EditingQuery($itemId: String!, $language: String!, $version: String) {
    item(path: $itemId, language: $language, version: $version) {
      rendered
    }
  }
`;

async function inspect(site, itemId) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      sc_layoutKind: 'shared',
      sc_editMode: 'true',
      sc_previewMode: 'false',
      sc_site: site,
    },
    body: JSON.stringify({
      query,
      variables: { itemId, language: 'en', version: '1' },
    }),
  });
  const json = await res.json();
  if (json.errors) {
    console.log(site, 'errors', json.errors);
    return;
  }
  const rendered = json.data?.item?.rendered;
  const empties = [];
  function walk(obj) {
    if (!obj || typeof obj !== 'object') return;
    if (Array.isArray(obj)) return obj.forEach(walk);
    if (obj.componentName) empties.push({ n: obj.componentName, u: obj.uid });
    for (const v of Object.values(obj)) walk(v);
  }
  walk(rendered);
  console.log(`\n${site} (${itemId.slice(0, 8)}...)`, empties.length, 'components');
  for (const e of empties.slice(0, 8)) {
    const bad = !e.u || e.u === '00000000-0000-0000-0000-000000000000';
    console.log(bad ? 'BAD' : 'OK ', e.n, e.u);
  }
  console.log('bad', empties.filter((e) => !e.u || e.u === '00000000-0000-0000-0000-000000000000').length);
}

await inspect('jm2', 'd990e4cc-264b-4dbb-a3ef-444b2eeddf92');
await inspect('axa2', 'f72cad1f-b9fc-438c-bc67-276de60a7420');
