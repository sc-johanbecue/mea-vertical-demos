import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const optsPath = path.join(__dirname, '../src/components/kpmg/kpmg-beyond-profile-options.ts');
const yamlPath = path.join(
  __dirname,
  '../../../authoring/items/kpmg/kpmg/site/kpmgbeyond/Data/KpmgBeyondProfileSections/Default Profile Section.yml'
);

const src = fs.readFileSync(optsPath, 'utf8');

function extractArray(name) {
  const re = new RegExp(`export const ${name} = \\[([\\s\\S]*?)\\] as const;`);
  const match = src.match(re);
  if (!match) {
    throw new Error(`missing ${name}`);
  }
  return [...match[1].matchAll(/'([^']*)'/g)].map((entry) => entry[1]);
}

const fields = {
  JobRoleOptions: { id: 'a1010101-1111-4111-8111-111111111111', values: extractArray('kpmgBeyondJobRoleOptions') },
  SectorOptions: { id: 'a1010101-1111-4111-8111-111111111115', values: extractArray('kpmgBeyondSectorOptions') },
  AnnualTurnoverOptions: {
    id: 'a1010101-1111-4111-8111-111111111116',
    values: extractArray('kpmgBeyondAnnualTurnoverOptions'),
  },
};

function toYamlBlock(values) {
  return `      Value: |\n${values.map((value) => `        ${value}`).join('\n')}`;
}

let yaml = fs.readFileSync(yamlPath, 'utf8');

for (const [hint, { id, values }] of Object.entries(fields)) {
  const blockRe = new RegExp(
    `- ID: "${id}"\\r?\\n      Hint: ${hint}\\r?\\n      Value:[\\s\\S]*?(?=\\r?\\n    - ID:)`,
    'm'
  );
  const replacement = `- ID: "${id}"\n      Hint: ${hint}\n${toYamlBlock(values)}`;
  if (!blockRe.test(yaml)) {
    throw new Error(`block not found for ${hint}`);
  }
  yaml = yaml.replace(blockRe, replacement);
}

fs.writeFileSync(yamlPath, yaml, 'utf8');
console.log('Updated profile section YAML option lists.');
