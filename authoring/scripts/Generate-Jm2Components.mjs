#!/usr/bin/env node
/**
 * Generates Sitecore serialization YAML for Johnson Matthey 2 (jm2) components.
 * Usage: node authoring/scripts/Generate-Jm2Components.mjs
 */
import { createHash } from 'node:crypto';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { readFileSync, readdirSync, statSync, unlinkSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', 'items', 'Johnson Matthey 2', 'serialized-content');
const COLLECTION_FOLDER = join(__dirname, '..', 'items', 'Johnson Matthey 2');
const PROJECT = 'johnson-matthey-2';
const SITE_PATH = '/sitecore/content/johnson-matthey-2/jm2';
const SITE_REL = 'jm2/jm2';
const MODULE_NAMESPACE = 'johnson-matthey-2-scs';
const OWNER = 'sitecore\\johan.becue@sitecore.com';
const NOW = '20260612T120000Z';

const PARENTS = {
  templates: '905a88e2-573e-4bcc-9744-cca993844170',
  renderings: 'e5b83a7d-028d-4114-a5bd-ad0ff21e9181',
  placeholders: 'b9b87a5c-5e5c-4d14-a45f-ab999f9f5493',
  presentation: '25d1406c-551d-4f4d-a9ba-485cbb9a1fc0',
  headlessVariantsRoot: 'c25c5118-1367-471b-9657-d41397e24a64',
  branches: 'ab27ace8-d7c2-4e42-89a5-76a4c38d9e92',
};

const TPL = {
  branch: '0437fee2-44c9-46a6-abe9-28858d9fee8c',
  template: 'ab86861a-6030-46c5-b394-e8f99e8b87db',
  data: 'e269fbb5-3750-427a-9149-7aa950b49301',
  field: '455a3e98-a627-4b40-8035-e683a0331ac7',
  rendering: '04646a89-996f-4ee7-878a-ffdbf1f0ef0d',
  renderingParamsBase: '4247aad4-ebde-4994-998f-e067a51b1fe4',
  placeholder: '5c547d4e-7111-4995-95b0-6b561751bf2e',
  headlessVariant: '4d50cdae-c2d9-4de8-b080-8f992bfb1b55',
  headlessVariantsFolder: '49c111d0-6867-4798-a724-1f103166e6e9',
  folderBase: 'a87a00b1-e6db-45ab-8b54-636fec3b5523',
  standardPage: '1930bbeb-7805-471a-a3be-4858ac7cf696',
  standardValues: '44a022db-56d3-419a-b43b-e27e4d8e9c41',
};

const VARIANT_SORT = {
  Default: 100,
  Inversed: 200,
  ImageTop: 300,
  Animated: 400,
  InversedAnimated: 350,
  Carousel: 500,
};

const COMPONENTS = [
  {
    name: 'CookieBanner',
    dataFolder: 'CookieBanners',
    group: 'Page Structure',
    fields: [
      { name: 'Message', type: 'Multi-Line Text' },
      { name: 'AcceptLabel', type: 'Single-Line Text' },
      { name: 'PrivacyLink', type: 'General Link' },
    ],
    variants: ['Default', 'Inversed', 'ImageTop', 'Animated'],
    defaults: {
      Message: 'We use cookies to improve your experience on our site.',
      AcceptLabel: 'Accept all cookies',
      PrivacyLink: '<link text="Privacy policy" linktype="external" url="https://matthey.com/privacy" />',
    },
  },
  {
    name: 'Header',
    dataFolder: 'Headers',
    group: 'Page Structure',
    fields: [
      { name: 'Logo', type: 'Image' },
      { name: 'LogoLink', type: 'General Link' },
      { name: 'LogoText', type: 'Single-Line Text' },
    ],
    placeholders: [{ key: 'header-nav', allowed: ['Navigation'] }],
    variants: ['Default', 'Inversed', 'ImageTop', 'Animated'],
    defaults: {
      LogoText: 'Johnson Matthey',
      LogoLink: '<link linktype="external" url="https://matthey.com" />',
    },
  },
  {
    name: 'Navigation',
    dataFolder: 'Navigations',
    group: 'Navigation',
    fields: [
      { name: 'SearchLabel', type: 'Single-Line Text' },
      ...Array.from({ length: 6 }, (_, i) => ({ name: `NavLink${i + 1}`, type: 'General Link' })),
    ],
    variants: ['Default', 'Inversed', 'ImageTop', 'Animated'],
    defaults: {
      SearchLabel: 'Search',
      NavLink1:
        '<link text="Products and markets" linktype="external" url="https://matthey.com/products-and-markets" />',
      NavLink2: '<link text="About us" linktype="external" url="https://matthey.com/about-us" />',
      NavLink3:
        '<link text="Science and innovation" linktype="external" url="https://matthey.com/science-and-innovation" />',
      NavLink4: '<link text="Careers" linktype="external" url="https://matthey.com/careers" />',
      NavLink5: '<link text="News" linktype="external" url="https://matthey.com/news" />',
      NavLink6: '<link text="Contact" linktype="external" url="https://matthey.com/contact-us" />',
    },
  },
  {
    name: 'Footer',
    dataFolder: 'Footers',
    group: 'Page Structure',
    fields: [
      { name: 'CopyrightText', type: 'Single-Line Text' },
      { name: 'Logo', type: 'Image' },
    ],
    placeholders: [{ key: 'footer-links', allowed: ['LinkList'] }],
    variants: ['Default', 'Inversed', 'ImageTop', 'Animated'],
    defaults: { CopyrightText: '© Johnson Matthey plc' },
  },
  {
    name: 'LinkList',
    dataFolder: 'LinkLists',
    group: 'Navigation',
    fields: [
      { name: 'Title', type: 'Single-Line Text' },
      ...Array.from({ length: 6 }, (_, i) => ({ name: `Link${i + 1}`, type: 'General Link' })),
    ],
    variants: ['Default', 'Inversed', 'ImageTop', 'Animated'],
    defaults: {
      Title: 'Quick access',
      Link1:
        '<link text="Policies and disclosures" linktype="external" url="https://matthey.com/sustainability/policies-and-disclosures" />',
      Link2:
        '<link text="Quality certificates" linktype="external" url="https://matthey.com/products-and-markets/quality-certificates" />',
      Link3:
        '<link text="Partnering with us" linktype="external" url="https://matthey.com/about-us/partnering-with-us" />',
      Link4: '<link text="Careers" linktype="external" url="https://matthey.com/careers" />',
    },
  },
  {
    name: 'FullBleedHeroBannerSection',
    dataFolder: 'FullBleedHeroBannerSections',
    group: 'Page Content',
    fields: [
      { name: 'Title', type: 'Single-Line Text' },
      { name: 'Body', type: 'Multi-Line Text' },
      { name: 'BackgroundImage', type: 'Image' },
      { name: 'Cta', type: 'General Link' },
    ],
    variants: ['Default', 'Inversed', 'ImageTop', 'Animated'],
    defaults: {
      Title: 'Hero title',
      Body: 'Hero description',
      Cta: '<link text="Explore" linktype="external" url="/" />',
    },
  },
  {
    name: 'CompositeHeroBandSection',
    dataFolder: 'CompositeHeroBandSections',
    group: 'Page Content',
    fields: [],
    placeholders: [
      { key: 'hero-slides', allowed: ['HeroSlideCard'] },
      { key: 'hero-panels', allowed: ['HeroPanelCard'] },
      { key: 'hero-stats', allowed: ['HeroStatsPanel'] },
    ],
    variants: ['Default', 'Inversed', 'ImageTop', 'Animated', 'Carousel'],
    defaults: {},
  },
  {
    name: 'HeroSlideCard',
    dataFolder: 'HeroSlideCards',
    group: 'Page Content',
    fields: [
      { name: 'Image', type: 'Image' },
      { name: 'Title', type: 'Single-Line Text' },
      { name: 'Subtitle', type: 'Multi-Line Text' },
      { name: 'Cta', type: 'General Link' },
    ],
    variants: ['Default', 'Inversed', 'ImageTop', 'Animated', 'InversedAnimated'],
    defaults: {
      Title: 'Slide title',
      Subtitle: 'Slide description',
      Cta: '<link text="Read more" linktype="external" url="/" />',
    },
  },
  {
    name: 'HeroPanelCard',
    dataFolder: 'HeroPanelCards',
    group: 'Page Content',
    fields: [
      { name: 'PanelTitle', type: 'Single-Line Text' },
      { name: 'Body', type: 'Multi-Line Text' },
      { name: 'Cta', type: 'General Link' },
    ],
    variants: ['Default', 'Inversed', 'ImageTop', 'Animated', 'InversedAnimated'],
    defaults: {
      PanelTitle: 'News',
      Body: 'Panel body copy',
      Cta: '<link text="Read more" linktype="external" url="/" />',
    },
  },
  {
    name: 'HeroStatsPanel',
    dataFolder: 'HeroStatsPanels',
    group: 'Page Content',
    fields: [
      { name: 'Title', type: 'Single-Line Text' },
      { name: 'Value', type: 'Single-Line Text' },
      { name: 'Change', type: 'Single-Line Text' },
      { name: 'Date', type: 'Single-Line Text' },
      { name: 'Link', type: 'General Link' },
    ],
    variants: ['Default', 'Inversed', 'ImageTop', 'Animated', 'InversedAnimated'],
    defaults: {
      Title: 'Share price',
      Value: '0.00',
      Change: '+0.0%',
      Date: '',
    },
  },
  {
    name: 'EyebrowTitleCarouselSection',
    dataFolder: 'EyebrowTitleCarouselSections',
    group: 'Page Content',
    fields: [],
    placeholders: [{ key: 'carousel-slides', allowed: ['FeatureCarouselCard'] }],
    variants: ['Default', 'Inversed', 'ImageTop', 'Animated', 'Carousel'],
    defaults: {},
  },
  {
    name: 'FeatureCarouselCard',
    dataFolder: 'FeatureCarouselCards',
    group: 'Page Content',
    fields: [
      { name: 'Eyebrow', type: 'Single-Line Text' },
      { name: 'Title', type: 'Single-Line Text' },
      { name: 'Body', type: 'Multi-Line Text' },
    ],
    variants: ['Default', 'Inversed', 'ImageTop', 'Animated', 'InversedAnimated'],
    defaults: {
      Eyebrow: 'Products and markets',
      Title: 'Clean air',
      Body: 'Advanced emission control catalysts for cleaner air worldwide.',
    },
  },
  {
    name: 'TitleDescriptionCtaSection',
    dataFolder: 'TitleDescriptionCtaSections',
    group: 'Page Content',
    fields: [
      { name: 'Title', type: 'Single-Line Text' },
      { name: 'Body', type: 'Multi-Line Text' },
      { name: 'Cta', type: 'General Link' },
    ],
    variants: ['Default', 'Inversed', 'ImageTop', 'Animated'],
    defaults: {
      Title: 'Johnson Matthey is a world leader in platinum group metals (PGMs).',
      Body: 'We apply our expertise in science and technology to solve the world’s biggest challenges.',
      Cta: '<link text="Learn more" linktype="external" url="https://matthey.com/about-us" />',
    },
  },
  {
    name: 'ImageRichTextSection',
    dataFolder: 'ImageRichTextSections',
    group: 'Page Content',
    fields: [
      { name: 'Title', type: 'Single-Line Text' },
      { name: 'Body', type: 'Multi-Line Text' },
      { name: 'Image', type: 'Image' },
      { name: 'Cta', type: 'General Link' },
    ],
    variants: ['Default', 'Inversed', 'ImageTop', 'Animated', 'InversedAnimated'],
    defaults: {
      Title: 'Collaborative innovation for the future',
      Body: 'We partner with customers and academia to accelerate sustainable innovation.',
      Cta: '<link text="Read more" linktype="external" url="https://matthey.com/science-and-innovation" />',
    },
  },
  {
    name: 'TitleDescriptionLinkGridSection',
    dataFolder: 'TitleDescriptionLinkGridSections',
    group: 'Page Content',
    fields: [{ name: 'Title', type: 'Single-Line Text' }],
    placeholders: [{ key: 'link-cards', allowed: ['HorizontalLinkCard'] }],
    variants: ['Default', 'Inversed', 'ImageTop', 'Animated', 'Carousel'],
    defaults: { Title: 'Explore our world' },
  },
  {
    name: 'HorizontalLinkCard',
    dataFolder: 'HorizontalLinkCards',
    group: 'Page Content',
    fields: [
      { name: 'Logo', type: 'Image' },
      { name: 'Title', type: 'Single-Line Text' },
      { name: 'Cta', type: 'General Link' },
    ],
    variants: ['Default', 'Inversed', 'ImageTop', 'Animated', 'InversedAnimated'],
    defaults: {
      Title: 'Products and markets',
      Cta: '<link text="Read more" linktype="external" url="https://matthey.com/products-and-markets" />',
    },
  },
  {
    name: 'TitleDescriptionTeaserGridSection',
    dataFolder: 'TitleDescriptionTeaserGridSections',
    group: 'Page Content',
    fields: [{ name: 'Title', type: 'Single-Line Text' }],
    placeholders: [{ key: 'teaser-cards', allowed: ['VerticalTeaserCard'] }],
    variants: ['Default', 'Inversed', 'ImageTop', 'Animated', 'Carousel'],
    defaults: { Title: 'Explore more' },
  },
  {
    name: 'VerticalTeaserCard',
    dataFolder: 'VerticalTeaserCards',
    group: 'Page Content',
    fields: [
      { name: 'Image', type: 'Image' },
      { name: 'Title', type: 'Single-Line Text' },
      { name: 'Description', type: 'Multi-Line Text' },
      { name: 'Cta', type: 'General Link' },
    ],
    variants: ['Default', 'Inversed', 'ImageTop', 'Animated', 'InversedAnimated'],
    defaults: {
      Title: 'Science and innovation',
      Description: 'Discover how we accelerate sustainable innovation.',
      Cta: '<link text="Read more" linktype="external" url="https://matthey.com/science-and-innovation" />',
    },
  },
  {
    name: 'TitleStatsBarSection',
    dataFolder: 'TitleStatsBarSections',
    group: 'Page Content',
    fields: [{ name: 'Title', type: 'Single-Line Text' }],
    placeholders: [{ key: 'stats-items', allowed: ['StatsItem'] }],
    variants: ['Default', 'Inversed', 'ImageTop', 'Animated', 'Carousel'],
    defaults: { Title: 'Global presence' },
  },
  {
    name: 'StatsItem',
    dataFolder: 'StatsItems',
    group: 'Page Content',
    fields: [
      { name: 'Value', type: 'Single-Line Text' },
      { name: 'Label', type: 'Single-Line Text' },
      { name: 'Link', type: 'General Link' },
    ],
    variants: ['Default', 'Inversed', 'ImageTop', 'Animated', 'InversedAnimated'],
    defaults: { Value: '40+', Label: 'Countries' },
  },
];

function stableGuid(seed) {
  const hash = createHash('md5').update(`jm2-${seed}`, 'utf8').digest();
  hash[6] = (hash[6] & 0x0f) | 0x40;
  hash[8] = (hash[8] & 0x3f) | 0x80;
  const hex = hash.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function guidUpper(id) {
  return `{${id.toUpperCase()}}`;
}

function ownerBlock(indent = 8) {
  const pad = ' '.repeat(indent);
  return `|\n${pad}${OWNER}`;
}

function metaFields(revisionSeed, indent = 4) {
  const pad = ' '.repeat(indent);
  return `${pad}- ID: "25bed78c-4957-4165-998a-ca1b52f67497"
${pad}  Hint: __Created
${pad}  Value: ${NOW}
${pad}- ID: "52807595-0f8f-4b20-8d2a-cb71d28c6103"
${pad}  Hint: __Owner
${pad}  Value: ${ownerBlock(pad.length + 4)}
${pad}- ID: "5dd74568-4d4b-44c1-b513-0af5f4cda34f"
${pad}  Hint: __Created by
${pad}  Value: ${ownerBlock(pad.length + 4)}
${pad}- ID: "8cdc337e-a112-42fb-bbb4-4143751e123f"
${pad}  Hint: __Revision
${pad}  Value: "${stableGuid(revisionSeed)}"
${pad}- ID: "badd9cf9-53e0-4d0c-bcc0-2d784c282f6a"
${pad}  Hint: __Updated by
${pad}  Value: ${ownerBlock(pad.length + 4)}
${pad}- ID: "d9cf14b1-fa16-4ba6-9288-e8a174d4d522"
${pad}  Hint: __Updated
${pad}  Value: ${NOW}`;
}

function defaultFieldLines(comp, ids) {
  return comp.fields
    .map((f) => {
      const val = comp.defaults?.[f.name];
      if (!val) return null;
      const valueLine =
        f.type === 'Multi-Line Text' ? `      Value: |\n        ${val}` : `      Value: ${val}`;
      return `    - ID: "${ids.fieldIds[f.name]}"
      Hint: ${f.name}
${valueLine}`;
    })
    .filter(Boolean)
    .join('\n');
}

async function writeYaml(relPath, body) {
  const full = join(ROOT, relPath);
  await mkdir(dirname(full), { recursive: true });
  await writeFile(full, body, 'utf8');
  return relPath;
}

function dedupeSerializationPaths(root) {
  const files = [];
  function walk(dir) {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) walk(full);
      else if (name.endsWith('.yml')) files.push(full);
    }
  }
  walk(root);

  const byPath = new Map();
  const isHashPath = (file) => /[\\/][0-9A-F]{16}[\\/]/i.test(file);

  for (const file of files) {
    const content = readFileSync(file, 'utf8');
    const pathMatch = content.match(/^Path: "(.+?)"/m);
    if (!pathMatch) continue;
    const itemPath = pathMatch[1];
    const existing = byPath.get(itemPath);
    if (!existing) {
      byPath.set(itemPath, file);
      continue;
    }
    const keep =
      isHashPath(existing) && !isHashPath(file)
        ? file
        : isHashPath(file) && !isHashPath(existing)
          ? existing
          : file;
    const drop = keep === file ? existing : file;
    byPath.set(itemPath, keep);
    unlinkSync(drop);
    console.log(`Deduped ${itemPath}`);
  }
}

function assertTemplatesSerialized(results) {
  const templateFiles = [];
  function walk(dir) {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) walk(full);
      else if (name.endsWith('.yml')) templateFiles.push(readFileSync(full, 'utf8'));
    }
  }
  walk(join(ROOT, 'templates'));

  const missing = results
    .filter((r) => !templateFiles.some((body) => body.includes(`ID: "${r.ids.templateId}"`)))
    .map((r) => `${r.comp} (template ${r.ids.templateId})`);

  if (missing.length) {
    throw new Error(
      `Datasource template items missing from serialization — push will fail with "Template ID did not exist":\n${missing.map((m) => `  - ${m}`).join('\n')}\nRe-run this script or restore {Component} Template.yml under templates/${PROJECT}/.`,
    );
  }
}

function idsForComponent(comp) {
  const n = comp.name;
  const branchId = stableGuid(`${n}-branch`);
  const folderId = stableGuid(`${n}-folder`);
  const templateId = stableGuid(`${n}-template`);
  const dataId = stableGuid(`${n}-data`);
  const paramsId = stableGuid(`${n}-params`);
  const stdValuesId = stableGuid(`${n}-stdvalues`);
  const folderStdId = stableGuid(`${n}-folder-std`);
  const paramsStdId = stableGuid(`${n}-params-std`);
  const renderingId = stableGuid(`${n}-rendering`);
  const datasourceId = stableGuid(`${n}-datasource`);
  const dataFolderId = stableGuid(`${n}-data-folder`);
  const variantsFolderId = stableGuid(`${n}-variants-folder`);
  const fieldIds = Object.fromEntries(
    comp.fields.map((f) => [f.name, stableGuid(`${n}-field-${f.name}`)]),
  );
  const variantIds = Object.fromEntries(
    comp.variants.map((v) => [v, stableGuid(`${n}-variant-${v}`)]),
  );
  const placeholderIds = Object.fromEntries(
    (comp.placeholders ?? []).map((p) => [p.key, stableGuid(`${n}-ph-${p.key}`)]),
  );
  return {
    branchId,
    folderId,
    templateId,
    dataId,
    paramsId,
    stdValuesId,
    folderStdId,
    paramsStdId,
    renderingId,
    datasourceId,
    dataFolderId,
    variantsFolderId,
    fieldIds,
    variantIds,
    placeholderIds,
  };
}

async function generateComponent(comp) {
  const ids = idsForComponent(comp);
  const base = `/sitecore/templates/Project/${PROJECT}/${comp.name}`;
  const files = [];

  files.push(
    await writeYaml(
      `templates/${PROJECT}/${comp.name}.yml`,
      `---
ID: "${ids.branchId}"
Parent: "${PARENTS.templates}"
Template: "${TPL.branch}"
Path: "${base}"
Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
${metaFields(`${comp.name}-branch`)}
`,
    ),
  );

  files.push(
    await writeYaml(
      `templates/${PROJECT}/${comp.name}/${comp.name} Folder.yml`,
      `---
ID: "${ids.folderId}"
Parent: "${ids.branchId}"
Template: "${TPL.template}"
Path: "${base}/${comp.name} Folder"
SharedFields:
- ID: "12c33f3f-86c5-43a5-aeb4-5598cec45116"
  Hint: __Base template
  Value: "${guidUpper(TPL.folderBase)}"
- ID: "f7d48a55-2158-4f02-9356-756654404f73"
  Hint: __Standard values
  Value: "${guidUpper(ids.folderStdId)}"
Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
${metaFields(`${comp.name}-folder`)}
`,
    ),
  );

  files.push(
    await writeYaml(
      `templates/${PROJECT}/${comp.name}/${comp.name} Folder/__Standard Values.yml`,
      `---
ID: "${ids.folderStdId}"
Parent: "${ids.folderId}"
Template: "${ids.folderId}"
Path: "${base}/${comp.name} Folder/__Standard Values"
SharedFields:
- ID: "1172f251-dad4-4efb-a329-0c63500e4f1e"
  Hint: __Masters
  Value: |
    ${guidUpper(ids.branchId)}
    ${guidUpper(ids.folderId)}
Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
${metaFields(`${comp.name}-folder-std`)}
`,
    ),
  );

  files.push(
    await writeYaml(
      `templates/${PROJECT}/${comp.name}/${comp.name} Template.yml`,
      `---
ID: "${ids.templateId}"
Parent: "${ids.branchId}"
Template: "${TPL.template}"
Path: "${base}/${comp.name} Template"
SharedFields:
- ID: "12c33f3f-86c5-43a5-aeb4-5598cec45116"
  Hint: __Base template
  Value: |
    ${guidUpper(TPL.standardPage)}
    ${guidUpper(TPL.standardValues)}
- ID: "f7d48a55-2158-4f02-9356-756654404f73"
  Hint: __Standard values
  Value: "${guidUpper(ids.stdValuesId)}"
Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
${metaFields(`${comp.name}-template`)}
`,
    ),
  );

  files.push(
    await writeYaml(
      `templates/${PROJECT}/${comp.name}/${comp.name} Template/Data.yml`,
      `---
ID: "${ids.dataId}"
Parent: "${ids.templateId}"
Template: "${TPL.data}"
Path: "${base}/${comp.name} Template/Data"
Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
${metaFields(`${comp.name}-data`)}
`,
    ),
  );

  const stdFieldLines = defaultFieldLines(comp, ids);
  files.push(
    await writeYaml(
      `templates/${PROJECT}/${comp.name}/${comp.name} Template/__Standard Values.yml`,
      `---
ID: "${ids.stdValuesId}"
Parent: "${ids.templateId}"
Template: "${ids.templateId}"
Path: "${base}/${comp.name} Template/__Standard Values"
Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
${stdFieldLines}
${metaFields(`${comp.name}-stdvalues`, 4)}
`,
    ),
  );

  for (let index = 0; index < comp.fields.length; index++) {
    const field = comp.fields[index];
    files.push(
      await writeYaml(
        `templates/${PROJECT}/${comp.name}/${comp.name} Template/Data/${field.name}.yml`,
        `---
ID: "${ids.fieldIds[field.name]}"
Parent: "${ids.dataId}"
Template: "${TPL.field}"
Path: "${base}/${comp.name} Template/Data/${field.name}"
SharedFields:
- ID: "ab162cc0-dc80-4abf-8871-998ee5d7ba32"
  Hint: Type
  Value: "${field.type}"
- ID: "ba3f86a2-4a1c-4d78-b63d-91c2779c1b5e"
  Hint: __Sortorder
  Value: ${(index + 1) * 100}
Languages:
- Language: en
  Fields:
  - ID: "19a69332-a23e-4e70-8d16-b2640cb24cc8"
    Hint: Title
    Value: ${field.name}
  Versions:
  - Version: 1
    Fields:
${metaFields(`${comp.name}-field-${field.name}`)}
`,
      ),
    );
  }

  files.push(
    await writeYaml(
      `templates/${PROJECT}/${comp.name}/${comp.name} Rendering Parameters.yml`,
      `---
ID: "${ids.paramsId}"
Parent: "${ids.branchId}"
Template: "${TPL.template}"
Path: "${base}/${comp.name} Rendering Parameters"
SharedFields:
- ID: "12c33f3f-86c5-43a5-aeb4-5598cec45116"
  Hint: __Base template
  Value: "${guidUpper(TPL.renderingParamsBase)}"
- ID: "f7d48a55-2158-4f02-9356-756654404f73"
  Hint: __Standard values
  Value: "${guidUpper(ids.paramsStdId)}"
Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
${metaFields(`${comp.name}-params`)}
`,
    ),
  );

  files.push(
    await writeYaml(
      `templates/${PROJECT}/${comp.name}/${comp.name} Rendering Parameters/__Standard Values.yml`,
      `---
ID: "${ids.paramsStdId}"
Parent: "${ids.paramsId}"
Template: "${ids.paramsId}"
Path: "${base}/${comp.name} Rendering Parameters/__Standard Values"
Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
${metaFields(`${comp.name}-params-std`)}
`,
    ),
  );

  const dsQuery = `query:$site/*[@@name='Data']/*[@@name='${comp.dataFolder}']|query:$sharedSites/*[@@name='Data']/*[@@name='${comp.dataFolder}']`;
  const placeholderField =
    (comp.placeholders ?? []).length > 0
      ? `- ID: "069a8361-b1cd-437c-8c32-a3be78941446"
  Hint: Placeholders
  Value: |
    ${(comp.placeholders ?? [])
      .map((ph) => guidUpper(ids.placeholderIds[ph.key]))
      .join('\n    ')}
`
      : '';

  files.push(
    await writeYaml(
      `renderings/${PROJECT}/${comp.name}.yml`,
      `---
ID: "${ids.renderingId}"
Parent: "${PARENTS.renderings}"
Template: "${TPL.rendering}"
Path: "/sitecore/layout/Renderings/Project/${PROJECT}/${comp.name}"
SharedFields:
- ID: "037fe404-dd19-4bf7-8e30-4dadf68b27b0"
  Hint: componentName
  Value: ${comp.name}
${placeholderField}- ID: "1a7c85e5-dc0b-490d-9187-bb1dbcb4c72f"
  Hint: Datasource Template
  Value: "${guidUpper(ids.templateId)}"
- ID: "a77e8568-1ab3-44f1-a664-b7c37ec7810d"
  Hint: Parameters Template
  Value: "${guidUpper(ids.paramsId)}"
- ID: "b5b27af1-25ef-405c-87ce-369b3a004016"
  Hint: Datasource Location
  Value: "${dsQuery}"
Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
${metaFields(`${comp.name}-rendering`)}
`,
    ),
  );

  for (const ph of comp.placeholders ?? []) {
    const phId = ids.placeholderIds[ph.key];
    const allowed = ph.allowed.map((name) => guidUpper(stableGuid(`${name}-rendering`))).join('\n    ');
    files.push(
      await writeYaml(
        `placeholder-settings/${PROJECT}/${ph.key}.yml`,
        `---
ID: "${phId}"
Parent: "${PARENTS.placeholders}"
Template: "${TPL.placeholder}"
Path: "/sitecore/layout/Placeholder Settings/Project/${PROJECT}/${ph.key}"
SharedFields:
- ID: "7256bdab-1fd2-49dd-b205-cb4873d2917c"
  Hint: Placeholder Key
  Value: "${ph.key}-{*}"
- ID: "e391b526-d0c5-439d-803e-17512eae6222"
  Hint: Allowed Controls
  Value: |
    ${allowed}
Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
${metaFields(`${comp.name}-ph-${ph.key}`)}
`,
      ),
    );
  }

  files.push(
    await writeYaml(
      `${SITE_REL}/Presentation/Headless Variants/${comp.name}.yml`,
      `---
ID: "${ids.variantsFolderId}"
Parent: "${PARENTS.headlessVariantsRoot}"
Template: "${TPL.headlessVariantsFolder}"
Path: "${SITE_PATH}/Presentation/Headless Variants/${comp.name}"
Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
${metaFields(`${comp.name}-variants-folder`)}
`,
    ),
  );

  for (const variant of comp.variants) {
    const variantId = ids.variantIds[variant];
    const sort = VARIANT_SORT[variant] ?? 100;
    files.push(
      await writeYaml(
        `${SITE_REL}/Presentation/Headless Variants/${comp.name}/${variant}.yml`,
        `---
ID: "${variantId}"
Parent: "${ids.variantsFolderId}"
Template: "${TPL.headlessVariant}"
Path: "${SITE_PATH}/Presentation/Headless Variants/${comp.name}/${variant}"
SharedFields:
- ID: "ba3f86a2-4a1c-4d78-b63d-91c2779c1b5e"
  Hint: __Sortorder
  Value: ${sort}
Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
${metaFields(`${comp.name}-variant-${variant}`)}
`,
      ),
    );
  }

  files.push(
    await writeYaml(
      `${SITE_REL}/Data/${comp.dataFolder}.yml`,
      `---
ID: "${ids.dataFolderId}"
Parent: "stableGuid-placeholder"
Template: "a87a00b1-e6db-45ab-8b54-636fec3b5523"
Path: "${SITE_PATH}/Data/${comp.dataFolder}"
Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
${metaFields(`${comp.name}-data-folder`)}
`,
    ),
  );

  const contentFieldLines = defaultFieldLines(comp, ids);
  files.push(
    await writeYaml(
      `${SITE_REL}/Data/${comp.dataFolder}/Default ${comp.name}.yml`,
      `---
ID: "${ids.datasourceId}"
Parent: "${ids.dataFolderId}"
Template: "${ids.templateId}"
Path: "${SITE_PATH}/Data/${comp.dataFolder}/Default ${comp.name}"
Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
${contentFieldLines}
${metaFields(`${comp.name}-datasource`, 4)}
`,
    ),
  );

  return { comp: comp.name, ids, group: comp.group, files };
}

async function main() {
  const results = [];
  for (const comp of COMPONENTS) {
    console.log(`Generating ${comp.name}...`);
    results.push(await generateComponent(comp));
  }

  const dataYml = join(ROOT, `${SITE_REL}/Data.yml`);
  let dataParentId = 'a726aac9-61b7-46b5-b6bf-07c5495dbe61';
  try {
    const dataContent = await readFile(dataYml, 'utf8');
    const m = dataContent.match(/^ID: "(.+?)"/m);
    if (m) dataParentId = m[1];
  } catch {
    /* use fallback */
  }
  console.log(`Data parent ID: ${dataParentId}`);

  for (const comp of COMPONENTS) {
    const folderFile = join(ROOT, `${SITE_REL}/Data/${comp.dataFolder}.yml`);
    let content = await readFile(folderFile, 'utf8');
    content = content.replace(/Parent: "stableGuid-placeholder"/, `Parent: "${dataParentId}"`);
    await writeFile(folderFile, content, 'utf8');
  }

  for (const [groupName, relPath] of [
    ['Page Structure', `${SITE_REL}/Presentation/Available Renderings/Page Structure.yml`],
    ['Page Content', `${SITE_REL}/Presentation/Available Renderings/Page Content.yml`],
    ['Navigation', `${SITE_REL}/Presentation/Available Renderings/Navigation.yml`],
  ]) {
    const filePath = join(ROOT, relPath);
    let content = await readFile(filePath, 'utf8');
    const newGuids = results.filter((r) => r.group === groupName).map((r) => guidUpper(r.ids.renderingId));
    if (!newGuids.length) continue;
    const match = content.match(/Hint: Renderings\r?\n  Value: \|\r?\n([\s\S]*?)(?=\r?\n- ID:)/);
    const existing = match
      ? match[1]
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter((l) => l.startsWith('{'))
      : [];
    const merged = [...new Set([...existing, ...newGuids])];
    const block = merged.map((g) => `    ${g}`).join('\n');
    content = content.replace(
      /Hint: Renderings\r?\n  Value: \|\r?\n[\s\S]*?(?=\r?\n- ID: "dbbbeca1)/,
      `Hint: Renderings\n  Value: |\n${block}\n`,
    );
    await writeFile(filePath, content, 'utf8');
    console.log(`Updated ${groupName} available renderings (+${newGuids.length})`);
  }

  const map = Object.fromEntries(
    results.map((r) => [
      r.comp,
      {
        renderingId: r.ids.renderingId,
        templateId: r.ids.templateId,
        datasourceId: r.ids.datasourceId,
        fieldIds: r.ids.fieldIds,
      },
    ]),
  );

  const idsPath = join(__dirname, 'jm2-component-ids.json');
  await writeFile(idsPath, JSON.stringify(map, null, 2));
  console.log(`Wrote ${idsPath}`);

  dedupeSerializationPaths(ROOT);
  assertTemplatesSerialized(results);

  try {
    execSync(`dotnet sitecore serialization validate --fix -i ${MODULE_NAMESPACE}`, {
      cwd: COLLECTION_FOLDER,
      stdio: 'inherit',
    });
  } catch {
    console.warn('Validation reported issues — review output above.');
  }

  console.log(`\nGenerated ${results.length} components:`);
  for (const r of results) console.log(`  - ${r.comp}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
