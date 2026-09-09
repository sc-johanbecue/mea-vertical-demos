import { readFileSync } from 'fs';
import { GraphQLRequestClient } from '@sitecore-content-sdk/core';
import { getEdgeProxyContentUrl } from '@sitecore-content-sdk/content/client';

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const index = line.indexOf('=');
      return [line.slice(0, index), line.slice(index + 1)];
    })
);

const client = new GraphQLRequestClient(getEdgeProxyContentUrl(), {
  contextId: env.SITECORE_EDGE_CONTEXT_ID,
});

const folderId = '31ED7662-82C7-402C-85C0-CC041B93C9BC';
const path = '/sitecore/content/kpmg/kpmgbeyond/Data/KpmgBeyondTopPickCards';

const queries = [
  {
    label: 'id-plain',
    query: `query($path: String!, $language: String!) {
      item(path: $path, language: $language) { id children(first: 100) { results { id name } } }
    }`,
    vars: { path: `{${folderId}}`, language: 'en' },
  },
  {
    label: 'path-plain-guid',
    query: `query($path: String!, $language: String!) {
      item(path: $path, language: $language) { id children(first: 100) { results { id name } } }
    }`,
    vars: { path: folderId, language: 'en' },
  },
  {
    label: 'path',
    query: `query($path: String!, $language: String!) {
      item(path: $path, language: $language) { id children { results { id name } } }
    }`,
    vars: { path, language: 'en' },
  },
];

for (const { label, query, vars } of queries) {
  try {
    const data = await client.request(query, vars);
    console.log(label, 'item:', data?.item?.id, 'children:', data?.item?.children?.results?.length ?? 0);
  } catch (error) {
    console.log(label, 'ERROR:', error.message?.slice(0, 300));
  }
}
