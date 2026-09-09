import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const TEMPLATES = join(ROOT, 'authoring/items/kpmg/kpmg/templatesProject/kpmg/KPMG Beyond');
const RENDERINGS = join(ROOT, 'authoring/items/kpmg/kpmg/projectRenderings/kpmg');
const DATA = join(ROOT, 'authoring/items/kpmg/kpmg/site/kpmgbeyond/Data');
const HOME = join(ROOT, 'authoring/items/kpmg/kpmg/site/kpmgbeyond/Home');

const KPMG_BEYOND = '0b63eb74-c589-47c2-b3ba-9a10a3deb16f';
const DATA_ROOT = '5ffbaddc-e2df-4ddf-b264-4fd8c60a42c7';
const HOME_ROOT = 'ddd121d2-a119-4784-963b-f9394f31c24a';
const PAGE_TEMPLATE = '393412d8-5a94-4581-b7c8-0ee2342617c2';
const RENDERING_TEMPLATE = '04646a89-996f-4ee7-878a-ffdbf1f0ef0d';
const RENDERING_PARENT = 'f3f768a4-11a6-4314-94f6-40889e43c0c9';
const FIELD_TEMPLATE = '455a3e98-a627-4b40-8035-e683a0331ac7';
const DATA_SECTION = 'e269fbb5-3750-427a-9149-7aa950b49301';
const SECTION_TEMPLATE = 'ab86861a-6030-46c5-b394-e8f99e8b87db';
const FOLDER_ROOT = '0437fee2-44c9-46a6-abe9-28858d9fee8c';
const FOLDER_BASE = '{A87A00B1-E6DB-45AB-8B54-636FEC3B5523}';
const SECTION_BASE = `{1930BBEB-7805-471A-A3BE-4858AC7CF696}\n    {44A022DB-56D3-419A-B43B-E27E4D8E9C41}`;

const OWNER = 'sitecore\\johan.becue@sitecore.com';
const TS = '20260606T120000Z';

function link(url, text) {
  return `<link linktype="external" url="${url}" text="${text}" anchor="" target="" class="" />`;
}

function image(src, alt) {
  return `<image mediaid="" src="${src}" alt="${alt.replace(/"/g, '&quot;')}" />`;
}

function yamlQuote(value) {
  if (!value) return '""';
  if (!/[\n:"\\]/.test(value) && value.length < 100) {
    return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  }
  return `|\n        ${value.split('\n').join('\n        ')}`;
}

function metaFields(revision = '00000000-0000-0000-0000-000000000001') {
  return `    - ID: "25bed78c-4957-4165-998a-ca1b52f67497"
      Hint: __Created
      Value: ${TS}
    - ID: "52807595-0f8f-4b20-8d2a-cb71d28c6103"
      Hint: __Owner
      Value: |
        ${OWNER}
    - ID: "5dd74568-4d4b-44c1-b513-0af5f4cda34f"
      Hint: __Created by
      Value: |
        ${OWNER}
    - ID: "8cdc337e-a112-42fb-bbb4-4143751e123f"
      Hint: __Revision
      Value: "${revision}"
    - ID: "badd9cf9-53e0-4d0c-bcc0-2d784c282f6a"
      Hint: __Updated by
      Value: |
        ${OWNER}
    - ID: "d9cf14b1-fa16-4ba6-9288-e8a174d4d522"
      Hint: __Updated
      Value: ${TS}`;
}

function write(path, content) {
  mkdirSync(join(path, '..'), { recursive: true });
  writeFileSync(path, content, 'utf8');
}

function fieldYaml({ id, parent, name, hint, title, type, sortorder }) {
  return `---
ID: "${id}"
Parent: "${parent}"
Template: "${FIELD_TEMPLATE}"
Path: /sitecore/templates/Project/kpmg/KPMG Beyond/${name}/${name}/Data/${hint}
SharedFields:
- ID: "ab162cc0-dc80-4abf-8871-998ee5d7ba32"
  Hint: Type
  Value: ${type}
- ID: "ba3f86a2-4a1c-4d78-b63d-91c2779c1b5e"
  Hint: __Sortorder
  Value: ${sortorder}
Languages:
- Language: en
  Fields:
  - ID: "19a69332-a23e-4e70-8d16-b2640cb24cc8"
    Hint: Title
    Value: ${title}
  Versions:
  - Version: 1
    Fields:
${metaFields()}
`;
}

function sectionTemplate({ rootId, sectionId, dataId, stdId, folderId, folderStdId, folderDataId, name }) {
  write(join(TEMPLATES, `${name}.yml`), `---
ID: "${rootId}"
Parent: "${KPMG_BEYOND}"
Template: "${FOLDER_ROOT}"
Path: /sitecore/templates/Project/kpmg/KPMG Beyond/${name}
Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
${metaFields()}
`);

  write(join(TEMPLATES, `${name}/${name}.yml`), `---
ID: "${sectionId}"
Parent: "${rootId}"
Template: "${SECTION_TEMPLATE}"
Path: /sitecore/templates/Project/kpmg/KPMG Beyond/${name}/${name}
SharedFields:
- ID: "12c33f3f-86c5-43a5-aeb4-5598cec45116"
  Hint: __Base template
  Value: |
    ${SECTION_BASE}
- ID: "f7d48a55-2158-4f02-9356-756654404f73"
  Hint: __Standard values
  Value: "{${stdId.toUpperCase()}}"
Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
${metaFields()}
`);

  write(join(TEMPLATES, `${name}/${name}/Data.yml`), `---
ID: "${dataId}"
Parent: "${sectionId}"
Template: "${DATA_SECTION}"
Path: /sitecore/templates/Project/kpmg/KPMG Beyond/${name}/${name}/Data
Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
${metaFields()}
`);

  write(join(TEMPLATES, `${name}/${name} Folder.yml`), `---
ID: "${folderId}"
Parent: "${rootId}"
Template: "${SECTION_TEMPLATE}"
Path: /sitecore/templates/Project/kpmg/KPMG Beyond/${name}/${name} Folder
SharedFields:
- ID: "12c33f3f-86c5-43a5-aeb4-5598cec45116"
  Hint: __Base template
  Value: "${FOLDER_BASE}"
- ID: "f7d48a55-2158-4f02-9356-756654404f73"
  Hint: __Standard values
  Value: "{${folderStdId.toUpperCase()}}"
Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
${metaFields()}
`);
}

function renderingYaml({ id, name, component, datasourceTemplate, folderTemplateName }) {
  write(join(RENDERINGS, `${name}.yml`), `---
ID: "${id}"
Parent: "${RENDERING_PARENT}"
Template: "${RENDERING_TEMPLATE}"
Path: /sitecore/layout/Renderings/Project/kpmg/${name}
SharedFields:
- ID: "037fe404-dd19-4bf7-8e30-4dadf68b27b0"
  Hint: componentName
  Value: ${component}
- ID: "1a7c85e5-dc0b-490d-9187-bb1dbcb4c72f"
  Hint: Datasource Template
  Value: /sitecore/templates/Project/kpmg/KPMG Beyond/${datasourceTemplate}/${datasourceTemplate}
- ID: "b5b27af1-25ef-405c-87ce-369b3a004016"
  Hint: Datasource Location
  Value: "query:$site/*[@@name='Data']/*[@@templatename='${folderTemplateName}']|query:$sharedSites/*[@@name='Data']/*[@@templatename='${folderTemplateName}']"
Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
${metaFields()}
`);
}

function dataFolderYaml({ id, parentId, templateId, path, folderName }) {
  write(join(DATA, `${folderName}.yml`), `---
ID: "${id}"
Parent: "${parentId}"
Template: "${templateId}"
Path: /sitecore/content/kpmg/kpmgbeyond/Data/${folderName}
Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
${metaFields()}
`);
}

function datasourceYaml({ id, parentId, templateId, itemName, path, fields }) {
  const fieldLines = fields
    .map(
      (f) => `    - ID: "${f.id}"
      Hint: ${f.hint}
      Value: ${f.value}`
    )
    .join('\n');

  write(join(DATA, `${path}/${itemName}.yml`), `---
ID: "${id}"
Parent: "${parentId}"
Template: "${templateId}"
Path: /sitecore/content/kpmg/kpmgbeyond/Data/${path}/${itemName}
Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
${metaFields()}
${fieldLines}
`);
}

function pageYaml({ id, name, title, renderings }) {
  const renderingBlocks = renderings
    .map((r, index) => {
      const after =
        index === 0
          ? 'p:before="*"'
          : index === renderings.length - 1
            ? 'p:after="*[1=2]"'
            : `p:after="r[@uid='{${renderings[index - 1].uid}}']"`;
      return `        <r
          uid="{${r.uid}}"
          ${after}
          s:ds="${r.ds}"
          s:id="{${r.renderingId.toUpperCase()}}"
          s:par="CSSStyles"
          s:ph="${r.ph}" />`;
    })
    .join('\n');

  write(join(HOME, `${name}.yml`), `---
ID: "${id}"
Parent: "${HOME_ROOT}"
Template: "${PAGE_TEMPLATE}"
Path: /sitecore/content/kpmg/kpmgbeyond/Home/${name}
SharedFields:
- ID: "f1a1fe9e-a60c-4ddb-a3a0-bb5b29fe732e"
  Hint: __Renderings
  Value: |
    <r xmlns:p="p" xmlns:s="s"
      p:p="1">
      <d
        id="{FE5D7FDF-89C0-4D99-9AA3-B5FBD009C9F3}">
${renderingBlocks}
      </d>
    </r>
Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
    - ID: "25bed78c-4957-4165-998a-ca1b52f67497"
      Hint: __Created
      Value: ${TS}
    - ID: "4dd74161-877f-4099-8553-e20e3a72a783"
      Hint: Title
      Value: ${title}
    - ID: "4e0720e9-9d50-4ddc-87cf-ecd65e8e94c8"
      Hint: NavigationTitle
      Value: ${title}
    - ID: "52807595-0f8f-4b20-8d2a-cb71d28c6103"
      Hint: __Owner
      Value: |
        ${OWNER}
    - ID: "5dd74568-4d4b-44c1-b513-0af5f4cda34f"
      Hint: __Created by
      Value: |
        ${OWNER}
    - ID: "8cdc337e-a112-42fb-bbb4-4143751e123f"
      Hint: __Revision
      Value: "00000000-0000-0000-0000-000000000501"
    - ID: "badd9cf9-53e0-4d0c-bcc0-2d784c282f6a"
      Hint: __Updated by
      Value: |
        ${OWNER}
    - ID: "d9cf14b1-fa16-4ba6-9288-e8a174d4d522"
      Hint: __Updated
      Value: ${TS}
`);
}

const sections = [
  {
    name: 'Generic Header Section',
    rootId: 'a5000001-0001-4000-8000-000000000001',
    sectionId: 'a5000001-0001-4000-8000-000000000002',
    dataId: 'a5000001-0001-4000-8000-000000000003',
    stdId: 'a5000001-0001-4000-8000-000000000004',
    folderId: 'a5000001-0001-4000-8000-000000000005',
    folderStdId: 'a5000001-0001-4000-8000-000000000006',
    dataFolderId: 'a5000001-0001-4000-8000-000000000007',
    dataFolderName: 'KpmgBeyondGenericHeaderSections',
    renderingId: 'a5000010-0001-4000-8000-000000000001',
    component: 'KpmgBeyondGenericHeader',
    fields: [
      { id: 'a5000001-0001-4000-8000-000000000010', hint: 'Logo', title: 'Logo', type: 'Image', sort: 100 },
      { id: 'a5000001-0001-4000-8000-000000000011', hint: 'LoginLink', title: 'Login link', type: 'General Link', sort: 200 },
      { id: 'a5000001-0001-4000-8000-000000000012', hint: 'JoinLink', title: 'Join link', type: 'General Link', sort: 300 },
    ],
    defaults: [
      { id: 'a5000001-0001-4000-8000-000000000011', hint: 'LoginLink', value: `|\n        ${link('/auth/login', 'Login')}` },
      { id: 'a5000001-0001-4000-8000-000000000012', hint: 'JoinLink', value: `|\n        ${link('/join', 'Join Beyond')}` },
    ],
    dsId: 'a5000201-0001-4000-8000-000000000001',
    dsName: 'Default Generic Header',
  },
  {
    name: 'Generic CTA Section',
    rootId: 'a5000008-0001-4000-8000-000000000001',
    sectionId: 'a5000008-0001-4000-8000-000000000002',
    dataId: 'a5000008-0001-4000-8000-000000000003',
    stdId: 'a5000008-0001-4000-8000-000000000004',
    folderId: 'a5000008-0001-4000-8000-000000000005',
    folderStdId: 'a5000008-0001-4000-8000-000000000006',
    dataFolderId: 'a5000008-0001-4000-8000-000000000007',
    dataFolderName: 'KpmgBeyondGenericCtaSections',
    renderingId: 'a5000017-0001-4000-8000-000000000001',
    component: 'KpmgBeyondGenericCta',
    fields: [
      { id: 'a5000008-0001-4000-8000-000000000010', hint: 'Title', title: 'Title', type: '"Single-Line Text"', sort: 100 },
      { id: 'a5000008-0001-4000-8000-000000000011', hint: 'Description', title: 'Description', type: '"Multi-Line Text"', sort: 200 },
      { id: 'a5000008-0001-4000-8000-000000000012', hint: 'PrimaryJoinLink', title: 'Primary join link', type: 'General Link', sort: 300 },
      { id: 'a5000008-0001-4000-8000-000000000013', hint: 'BackgroundImage', title: 'Background image', type: 'Image', sort: 400 },
    ],
    defaults: [
      { id: 'a5000008-0001-4000-8000-000000000010', hint: 'Title', value: 'Beyond' },
      { id: 'a5000008-0001-4000-8000-000000000011', hint: 'Description', value: yamlQuote('24/7 access to free expertise, solutions, networking and personal growth at your fingertips. Welcome to Beyond, where leaders belong.') },
      { id: 'a5000008-0001-4000-8000-000000000012', hint: 'PrimaryJoinLink', value: `|\n        ${link('/join', 'Join Beyond')}` },
    ],
    dsId: 'a5000208-0001-4000-8000-000000000001',
    dsName: 'Default Generic CTA',
  },
  {
    name: 'Generic Hero Section',
    rootId: 'a5000002-0001-4000-8000-000000000001',
    sectionId: 'a5000002-0001-4000-8000-000000000002',
    dataId: 'a5000002-0001-4000-8000-000000000003',
    stdId: 'a5000002-0001-4000-8000-000000000004',
    folderId: 'a5000002-0001-4000-8000-000000000005',
    folderStdId: 'a5000002-0001-4000-8000-000000000006',
    dataFolderId: 'a5000002-0001-4000-8000-000000000007',
    dataFolderName: 'KpmgBeyondGenericHeroSections',
    renderingId: 'a5000011-0001-4000-8000-000000000001',
    component: 'KpmgBeyondGenericHero',
    fields: [
      { id: 'a5000002-0001-4000-8000-000000000013', hint: 'HeroImage', title: 'Hero image', type: 'Image', sort: 100 },
      { id: 'a5000002-0001-4000-8000-000000000017', hint: 'HeroVideo', title: 'Hero video', type: 'File', sort: 200 },
      { id: 'a5000002-0001-4000-8000-000000000014', hint: 'SocialProofText', title: 'Social proof text', type: '"Single-Line Text"', sort: 300 },
      { id: 'a5000002-0001-4000-8000-000000000015', hint: 'SecondaryJoinLink', title: 'Secondary join link', type: 'General Link', sort: 400 },
      { id: 'a5000002-0001-4000-8000-000000000016', hint: 'SecondaryLoginLink', title: 'Secondary login link', type: 'General Link', sort: 500 },
    ],
    defaults: [
      { id: 'a5000002-0001-4000-8000-000000000014', hint: 'SocialProofText', value: 'Sign up and join 4,000+ business leaders.' },
      { id: 'a5000002-0001-4000-8000-000000000015', hint: 'SecondaryJoinLink', value: `|\n        ${link('/join', 'Join Beyond')}` },
      { id: 'a5000002-0001-4000-8000-000000000016', hint: 'SecondaryLoginLink', value: `|\n        ${link('/auth/login', 'Login')}` },
    ],
    dsId: 'a5000202-0001-4000-8000-000000000001',
    dsName: 'Default Generic Hero',
  },
  {
    name: 'Generic Feature Section',
    rootId: 'a5000003-0001-4000-8000-000000000001',
    sectionId: 'a5000003-0001-4000-8000-000000000002',
    dataId: 'a5000003-0001-4000-8000-000000000003',
    stdId: 'a5000003-0001-4000-8000-000000000004',
    folderId: 'a5000003-0001-4000-8000-000000000005',
    folderStdId: 'a5000003-0001-4000-8000-000000000006',
    dataFolderId: 'a5000003-0001-4000-8000-000000000007',
    dataFolderName: 'KpmgBeyondGenericFeatureSections',
    renderingId: 'a5000012-0001-4000-8000-000000000001',
    component: 'KpmgBeyondGenericFeatureSection',
    fields: [
      { id: 'a5000003-0001-4000-8000-000000000010', hint: 'Heading', title: 'Heading', type: '"Single-Line Text"', sort: 100 },
      { id: 'a5000003-0001-4000-8000-000000000011', hint: 'Body', title: 'Body', type: '"Multi-Line Text"', sort: 200 },
      { id: 'a5000003-0001-4000-8000-000000000012', hint: 'JoinLink', title: 'Join link', type: 'General Link', sort: 300 },
      { id: 'a5000003-0001-4000-8000-000000000013', hint: 'FeatureImage', title: 'Feature image', type: 'Image', sort: 400 },
      { id: 'a5000003-0001-4000-8000-000000000014', hint: 'ImagePosition', title: 'Image position', type: '"Single-Line Text"', sort: 500 },
    ],
    featureItems: [
      {
        dsId: 'a5000203-0001-4000-8000-000000000001',
        dsName: 'Feature Events',
        defaults: [
          { id: 'a5000003-0001-4000-8000-000000000010', hint: 'Heading', value: 'Experience exclusive upcoming and on demand events' },
          { id: 'a5000003-0001-4000-8000-000000000011', hint: 'Body', value: yamlQuote('Hear from influential leaders and speakers as they explore some of the biggest challenges facing the modern business world.') },
          { id: 'a5000003-0001-4000-8000-000000000012', hint: 'JoinLink', value: `|\n        ${link('/join', 'Join Beyond')}` },
          { id: 'a5000003-0001-4000-8000-000000000014', hint: 'ImagePosition', value: 'right' },
        ],
      },
      {
        dsId: 'a5000203-0001-4000-8000-000000000002',
        dsName: 'Feature Connections',
        defaults: [
          { id: 'a5000003-0001-4000-8000-000000000010', hint: 'Heading', value: 'Build powerful connections' },
          { id: 'a5000003-0001-4000-8000-000000000011', hint: 'Body', value: yamlQuote('Join the conversation, build powerful connections, network with your industry peers and share ideas and experiences through carefully selected communities.') },
          { id: 'a5000003-0001-4000-8000-000000000012', hint: 'JoinLink', value: `|\n        ${link('/join', 'Join Beyond')}` },
          { id: 'a5000003-0001-4000-8000-000000000014', hint: 'ImagePosition', value: 'left' },
        ],
      },
      {
        dsId: 'a5000203-0001-4000-8000-000000000003',
        dsName: 'Feature Content',
        defaults: [
          { id: 'a5000003-0001-4000-8000-000000000010', hint: 'Heading', value: 'Discover personalised content' },
          { id: 'a5000003-0001-4000-8000-000000000011', hint: 'Body', value: yamlQuote('Access a world of opportunity and elevate your professional growth through powerful insights to become a stronger leader and start turning your ideas into action.') },
          { id: 'a5000003-0001-4000-8000-000000000012', hint: 'JoinLink', value: `|\n        ${link('/join', 'Join Beyond')}` },
          { id: 'a5000003-0001-4000-8000-000000000014', hint: 'ImagePosition', value: 'right' },
        ],
      },
    ],
  },
  {
    name: 'Generic Testimonials Section',
    rootId: 'a5000004-0001-4000-8000-000000000001',
    sectionId: 'a5000004-0001-4000-8000-000000000002',
    dataId: 'a5000004-0001-4000-8000-000000000003',
    stdId: 'a5000004-0001-4000-8000-000000000004',
    folderId: 'a5000004-0001-4000-8000-000000000005',
    folderStdId: 'a5000004-0001-4000-8000-000000000006',
    dataFolderId: 'a5000004-0001-4000-8000-000000000007',
    dataFolderName: 'KpmgBeyondGenericTestimonialsSections',
    renderingId: 'a5000013-0001-4000-8000-000000000001',
    component: 'KpmgBeyondGenericTestimonials',
    fields: [
      { id: 'a5000004-0001-4000-8000-000000000010', hint: 'Title', title: 'Title', type: '"Single-Line Text"', sort: 100 },
      { id: 'a5000004-0001-4000-8000-000000000011', hint: 'Quote1Text', title: 'Quote 1 text', type: '"Multi-Line Text"', sort: 200 },
      { id: 'a5000004-0001-4000-8000-000000000012', hint: 'Quote1Attribution', title: 'Quote 1 attribution', type: '"Single-Line Text"', sort: 300 },
      { id: 'a5000004-0001-4000-8000-000000000013', hint: 'Quote2Text', title: 'Quote 2 text', type: '"Multi-Line Text"', sort: 400 },
      { id: 'a5000004-0001-4000-8000-000000000014', hint: 'Quote2Attribution', title: 'Quote 2 attribution', type: '"Single-Line Text"', sort: 500 },
    ],
    defaults: [
      { id: 'a5000004-0001-4000-8000-000000000010', hint: 'Title', value: 'What our clients say' },
      { id: 'a5000004-0001-4000-8000-000000000011', hint: 'Quote1Text', value: yamlQuote("The articles are great. I've referred a friend already because I think it's so fantastic. I feel like it has been made for me!") },
      { id: 'a5000004-0001-4000-8000-000000000012', hint: 'Quote1Attribution', value: 'Community Member' },
      { id: 'a5000004-0001-4000-8000-000000000013', hint: 'Quote2Text', value: yamlQuote("I have certainly found Beyond very enlightening and it's particularly helpful to get it on catch-up when schedules collide.") },
      { id: 'a5000004-0001-4000-8000-000000000014', hint: 'Quote2Attribution', value: 'Member of the Beyond Lounge' },
    ],
    dsId: 'a5000204-0001-4000-8000-000000000001',
    dsName: 'Default Generic Testimonials',
  },
  {
    name: 'Generic Footer CTA Section',
    rootId: 'a5000005-0001-4000-8000-000000000001',
    sectionId: 'a5000005-0001-4000-8000-000000000002',
    dataId: 'a5000005-0001-4000-8000-000000000003',
    stdId: 'a5000005-0001-4000-8000-000000000004',
    folderId: 'a5000005-0001-4000-8000-000000000005',
    folderStdId: 'a5000005-0001-4000-8000-000000000006',
    dataFolderId: 'a5000005-0001-4000-8000-000000000007',
    dataFolderName: 'KpmgBeyondGenericFooterCtaSections',
    renderingId: 'a5000014-0001-4000-8000-000000000001',
    component: 'KpmgBeyondGenericFooterCta',
    fields: [
      { id: 'a5000005-0001-4000-8000-000000000010', hint: 'LeftHeading', title: 'Left heading', type: '"Single-Line Text"', sort: 100 },
      { id: 'a5000005-0001-4000-8000-000000000011', hint: 'RightText', title: 'Right text', type: '"Multi-Line Text"', sort: 200 },
      { id: 'a5000005-0001-4000-8000-000000000012', hint: 'JoinLink', title: 'Join link', type: 'General Link', sort: 300 },
    ],
    defaults: [
      { id: 'a5000005-0001-4000-8000-000000000010', hint: 'LeftHeading', value: 'Be a part of Beyond. Where leaders belong.' },
      { id: 'a5000005-0001-4000-8000-000000000011', hint: 'RightText', value: yamlQuote('Sign up to Beyond and unleash the full potential of your business.') },
      { id: 'a5000005-0001-4000-8000-000000000012', hint: 'JoinLink', value: `|\n        ${link('/join', 'Join Beyond')}` },
    ],
    dsId: 'a5000205-0001-4000-8000-000000000001',
    dsName: 'Default Generic Footer CTA',
  },
  {
    name: 'Generic Footer Section',
    rootId: 'a5000006-0001-4000-8000-000000000001',
    sectionId: 'a5000006-0001-4000-8000-000000000002',
    dataId: 'a5000006-0001-4000-8000-000000000003',
    stdId: 'a5000006-0001-4000-8000-000000000004',
    folderId: 'a5000006-0001-4000-8000-000000000005',
    folderStdId: 'a5000006-0001-4000-8000-000000000006',
    dataFolderId: 'a5000006-0001-4000-8000-000000000007',
    dataFolderName: 'KpmgBeyondGenericFooterSections',
    renderingId: 'a5000015-0001-4000-8000-000000000001',
    component: 'KpmgBeyondGenericFooter',
    fields: [
      { id: 'a5000006-0001-4000-8000-000000000010', hint: 'PrivacyLink', title: 'Privacy link', type: 'General Link', sort: 100 },
      { id: 'a5000006-0001-4000-8000-000000000011', hint: 'LegalLink', title: 'Legal link', type: 'General Link', sort: 200 },
      { id: 'a5000006-0001-4000-8000-000000000012', hint: 'LegalText', title: 'Legal text', type: '"Multi-Line Text"', sort: 300 },
      { id: 'a5000006-0001-4000-8000-000000000013', hint: 'Logo', title: 'Logo', type: 'Image', sort: 400 },
    ],
    defaults: [
      { id: 'a5000006-0001-4000-8000-000000000010', hint: 'PrivacyLink', value: `|\n        ${link('/privacy', 'Privacy')}` },
      { id: 'a5000006-0001-4000-8000-000000000011', hint: 'LegalLink', value: `|\n        ${link('/legal', 'Legal')}` },
      { id: 'a5000006-0001-4000-8000-000000000012', hint: 'LegalText', value: yamlQuote('© 2026 KPMG LLP, a UK limited liability partnership and a member firm of the KPMG global organisation of independent member firms affiliated with KPMG International Limited, a private English company limited by guarantee. All rights reserved.') },
    ],
    dsId: 'a5000206-0001-4000-8000-000000000001',
    dsName: 'Default Generic Footer',
  },
];

const registerSection = {
  name: 'Register Section',
  rootId: 'a5000007-0001-4000-8000-000000000001',
  sectionId: 'a5000007-0001-4000-8000-000000000002',
  dataId: 'a5000007-0001-4000-8000-000000000003',
  stdId: 'a5000007-0001-4000-8000-000000000004',
  folderId: 'a5000007-0001-4000-8000-000000000005',
  folderStdId: 'a5000007-0001-4000-8000-000000000006',
  dataFolderId: 'a5000007-0001-4000-8000-000000000007',
  dataFolderName: 'KpmgBeyondRegisterSections',
  renderingId: 'a5000016-0001-4000-8000-000000000001',
  component: 'KpmgBeyondRegister',
  fields: [
    ['PageTitle', 'Page title', '"Single-Line Text"', 'a5000007-0001-4000-8000-000000000010', 100],
    ['PageIntro', 'Page intro', '"Multi-Line Text"', 'a5000007-0001-4000-8000-000000000011', 110],
    ['LoginPrompt', 'Login prompt', '"Single-Line Text"', 'a5000007-0001-4000-8000-000000000012', 120],
    ['LoginLink', 'Login link', 'General Link', 'a5000007-0001-4000-8000-000000000013', 130],
    ['FirstNameLabel', 'First name label', '"Single-Line Text"', 'a5000007-0001-4000-8000-000000000014', 140],
    ['LastNameLabel', 'Last name label', '"Single-Line Text"', 'a5000007-0001-4000-8000-000000000015', 150],
    ['EmailLabel', 'Email label', '"Single-Line Text"', 'a5000007-0001-4000-8000-000000000016', 160],
    ['PasswordLabel', 'Password label', '"Single-Line Text"', 'a5000007-0001-4000-8000-000000000017', 170],
    ['ConfirmPasswordLabel', 'Confirm password label', '"Single-Line Text"', 'a5000007-0001-4000-8000-000000000018', 180],
    ['CompanyLabel', 'Company label', '"Single-Line Text"', 'a5000007-0001-4000-8000-000000000019', 190],
    ['SectorLabel', 'Sector label', '"Single-Line Text"', 'a5000007-0001-4000-8000-00000000001a', 200],
    ['JobRoleLabel', 'Job role label', '"Single-Line Text"', 'a5000007-0001-4000-8000-00000000001b', 210],
    ['BusinessPostcodeLabel', 'Business postcode label', '"Single-Line Text"', 'a5000007-0001-4000-8000-00000000001c', 220],
    ['AnnualTurnoverLabel', 'Annual turnover label', '"Single-Line Text"', 'a5000007-0001-4000-8000-00000000001d', 230],
    ['TopicsSectionTitle', 'Topics section title', '"Single-Line Text"', 'a5000007-0001-4000-8000-00000000001e', 240],
    ['TopicsIntro', 'Topics intro', '"Multi-Line Text"', 'a5000007-0001-4000-8000-00000000001f', 250],
    ['TopicOptions', 'Topic options', '"Multi-Line Text"', 'a5000007-0001-4000-8000-000000000020', 260],
    ['TermsLabel', 'Terms label', '"Multi-Line Text"', 'a5000007-0001-4000-8000-000000000021', 270],
    ['MarketingLabel', 'Marketing label', '"Multi-Line Text"', 'a5000007-0001-4000-8000-000000000022', 280],
    ['CaptchaImage', 'Captcha image', 'Image', 'a5000007-0001-4000-8000-000000000023', 290],
    ['SubmitButtonLabel', 'Submit button label', '"Single-Line Text"', 'a5000007-0001-4000-8000-000000000024', 300],
    ['SubmittingLabel', 'Submitting label', '"Single-Line Text"', 'a5000007-0001-4000-8000-000000000025', 310],
    ['ErrorMessage', 'Error message', '"Multi-Line Text"', 'a5000007-0001-4000-8000-000000000026', 320],
    ['SuccessMessage', 'Success message', '"Multi-Line Text"', 'a5000007-0001-4000-8000-000000000027', 330],
    ['SectorOptions', 'Sector options', '"Multi-Line Text"', 'a5000007-0001-4000-8000-000000000028', 340],
    ['JobRoleOptions', 'Job role options', '"Multi-Line Text"', 'a5000007-0001-4000-8000-000000000029', 350],
    ['AnnualTurnoverOptions', 'Annual turnover options', '"Multi-Line Text"', 'a5000007-0001-4000-8000-00000000002a', 360],
  ],
};

for (const section of sections) {
  sectionTemplate(section);
  for (const field of section.fields) {
    write(
      join(TEMPLATES, `${section.name}/${section.name}/Data/${field.hint}.yml`),
      fieldYaml({
        id: field.id,
        parent: section.dataId,
        name: section.name,
        hint: field.hint,
        title: field.title,
        type: field.type,
        sortorder: field.sort,
      })
    );
  }
  renderingYaml({
    id: section.renderingId,
    name: section.name.replace(' Section', ''),
    component: section.component,
    datasourceTemplate: section.name,
    folderTemplateName: `${section.name} Folder`,
  });
  dataFolderYaml({
    id: section.dataFolderId,
    parentId: DATA_ROOT,
    templateId: section.folderId,
    path: section.dataFolderName,
    folderName: section.dataFolderName,
  });

  if (section.featureItems) {
    for (const item of section.featureItems) {
      datasourceYaml({
        id: item.dsId,
        parentId: section.dataFolderId,
        templateId: section.sectionId,
        itemName: item.dsName,
        path: section.dataFolderName,
        fields: item.defaults,
      });
    }
  } else if (section.defaults) {
    datasourceYaml({
      id: section.dsId,
      parentId: section.dataFolderId,
      templateId: section.sectionId,
      itemName: section.dsName,
      path: section.dataFolderName,
      fields: section.defaults,
    });
  }
}

sectionTemplate(registerSection);
for (const [hint, title, type, id, sort] of registerSection.fields) {
  write(
    join(TEMPLATES, `${registerSection.name}/${registerSection.name}/Data/${hint}.yml`),
    fieldYaml({ id, parent: registerSection.dataId, name: registerSection.name, hint, title, type, sortorder: sort })
  );
}
renderingYaml({
  id: registerSection.renderingId,
  name: 'Register Section',
  component: registerSection.component,
  datasourceTemplate: registerSection.name,
  folderTemplateName: `${registerSection.name} Folder`,
});
dataFolderYaml({
  id: registerSection.dataFolderId,
  parentId: DATA_ROOT,
  templateId: registerSection.folderId,
  path: registerSection.dataFolderName,
  folderName: registerSection.dataFolderName,
});

const sectorOptions = `Accountancy Practice\nAgriculture\nBanking\nCharity / Not for profit\nConstruction\nEducation\nEnergy and Natural Resources\nFinancial Services\nFood and Beverage\nGovernment and Public Sector\nHealthcare\nInsurance\nLegal\nLife Sciences\nManufacturing\nMedia\nProfessional Services\nReal Estate\nRetail\nTechnology\nTelecommunications\nTransport and Logistics\nTravel and Leisure\nOther`;
const jobRoleOptions = `Accountant\nAccounts Director\nAnalyst\nAssistant\nAssistant Manager\nAssociate\nAudit Manager\nAuditor\nBoard Member\nBusiness Analyst\nBusiness Development Manager\nBusiness Owner\nCEO\nCFO\nChair\nChief Executive\nChief Financial Officer\nChief Operating Officer\nChief Technology Officer\nConsultant\nDirector\nEngineer\nExecutive\nFinance Director\nFinance Manager\nFounder\nGeneral Manager\nHead of Department\nHR Director\nHR Manager\nIT Director\nIT Manager\nManager\nManaging Director\nNon-Executive Director\nOperations Director\nOperations Manager\nOwner\nPartner\nPresident\nProject Manager\nSenior Manager\nSolicitor\nSupervisor\nTeam Leader\nTrustee\nVice President\nOther`;
const turnoverOptions = `Less than £1m\n£1m - £5m\n£5m - £10m\n£10m - £50m\n£50m - £100m\n£100m - £500m\n£500m - £1bn\nMore than £1bn`;
const topicOptions = `Cyber Security\nDigital Transformation\nLeadership and Personal Development\nLegal\nOperational Resilience\nPublic Service and Policy\nFunding Investment and Acquisitions\nGrowth and Internationalisation\nStrategy and Planning\nTax\nWorkforce\nSustainability`;

datasourceYaml({
  id: 'a5000207-0001-4000-8000-000000000001',
  parentId: registerSection.dataFolderId,
  templateId: registerSection.sectionId,
  itemName: 'Default Register Section',
  path: registerSection.dataFolderName,
  fields: [
    { id: 'a5000007-0001-4000-8000-000000000010', hint: 'PageTitle', value: 'Create an account' },
    { id: 'a5000007-0001-4000-8000-000000000011', hint: 'PageIntro', value: yamlQuote('Join Beyond for free access to expertise, events, and personalised content.') },
    { id: 'a5000007-0001-4000-8000-000000000012', hint: 'LoginPrompt', value: 'Already have an account?' },
    { id: 'a5000007-0001-4000-8000-000000000013', hint: 'LoginLink', value: `|\n        ${link('/auth/login', 'Login')}` },
    { id: 'a5000007-0001-4000-8000-000000000014', hint: 'FirstNameLabel', value: 'First name' },
    { id: 'a5000007-0001-4000-8000-000000000015', hint: 'LastNameLabel', value: 'Last name' },
    { id: 'a5000007-0001-4000-8000-000000000016', hint: 'EmailLabel', value: 'Business email address' },
    { id: 'a5000007-0001-4000-8000-000000000017', hint: 'PasswordLabel', value: 'Password' },
    { id: 'a5000007-0001-4000-8000-000000000018', hint: 'ConfirmPasswordLabel', value: 'Confirm password' },
    { id: 'a5000007-0001-4000-8000-000000000019', hint: 'CompanyLabel', value: 'Company' },
    { id: 'a5000007-0001-4000-8000-00000000001a', hint: 'SectorLabel', value: 'Sector' },
    { id: 'a5000007-0001-4000-8000-00000000001b', hint: 'JobRoleLabel', value: 'Role' },
    { id: 'a5000007-0001-4000-8000-00000000001c', hint: 'BusinessPostcodeLabel', value: 'Business postcode' },
    { id: 'a5000007-0001-4000-8000-00000000001d', hint: 'AnnualTurnoverLabel', value: 'Annual turnover' },
    { id: 'a5000007-0001-4000-8000-00000000001e', hint: 'TopicsSectionTitle', value: 'Topic preferences' },
    { id: 'a5000007-0001-4000-8000-00000000001f', hint: 'TopicsIntro', value: yamlQuote('Select three or more topics to personalise your Beyond experience.') },
    { id: 'a5000007-0001-4000-8000-000000000020', hint: 'TopicOptions', value: yamlQuote(topicOptions) },
    { id: 'a5000007-0001-4000-8000-000000000021', hint: 'TermsLabel', value: yamlQuote('I agree to the Terms of Use and Privacy Policy.') },
    { id: 'a5000007-0001-4000-8000-000000000022', hint: 'MarketingLabel', value: yamlQuote('I would like to receive marketing communications from KPMG.') },
    { id: 'a5000007-0001-4000-8000-000000000023', hint: 'CaptchaImage', value: `|\n        ${image('https://cd-prod-horizon.azureedge.net/-/media/captcha-placeholder.png', 'Captcha placeholder')}` },
    { id: 'a5000007-0001-4000-8000-000000000024', hint: 'SubmitButtonLabel', value: 'Create an account' },
    { id: 'a5000007-0001-4000-8000-000000000025', hint: 'SubmittingLabel', value: 'Creating account…' },
    { id: 'a5000007-0001-4000-8000-000000000026', hint: 'ErrorMessage', value: yamlQuote('We could not create your account. Please check your details and try again.') },
    { id: 'a5000007-0001-4000-8000-000000000027', hint: 'SuccessMessage', value: yamlQuote('Your account has been created. You can now sign in.') },
    { id: 'a5000007-0001-4000-8000-000000000028', hint: 'SectorOptions', value: yamlQuote(sectorOptions) },
    { id: 'a5000007-0001-4000-8000-000000000029', hint: 'JobRoleOptions', value: yamlQuote(jobRoleOptions) },
    { id: 'a5000007-0001-4000-8000-00000000002a', hint: 'AnnualTurnoverOptions', value: yamlQuote(turnoverOptions) },
  ],
});

pageYaml({
  id: 'a5000100-0001-4000-8000-000000000001',
  name: 'Beyond Landing',
  title: 'Beyond Landing',
  renderings: [
    { uid: 'a5000101-0001-4000-8000-000000000001', ds: 'a5000201-0001-4000-8000-000000000001', renderingId: 'a5000010-0001-4000-8000-000000000001', ph: 'headless-header' },
    { uid: 'a5000101-0001-4000-8000-000000000009', ds: 'a5000208-0001-4000-8000-000000000001', renderingId: 'a5000017-0001-4000-8000-000000000001', ph: 'headless-main' },
    { uid: 'a5000101-0001-4000-8000-000000000002', ds: 'a5000202-0001-4000-8000-000000000001', renderingId: 'a5000011-0001-4000-8000-000000000001', ph: 'headless-main' },
    { uid: 'a5000101-0001-4000-8000-000000000003', ds: 'a5000203-0001-4000-8000-000000000001', renderingId: 'a5000012-0001-4000-8000-000000000001', ph: 'headless-main' },
    { uid: 'a5000101-0001-4000-8000-000000000004', ds: 'a5000203-0001-4000-8000-000000000002', renderingId: 'a5000012-0001-4000-8000-000000000001', ph: 'headless-main' },
    { uid: 'a5000101-0001-4000-8000-000000000005', ds: 'a5000203-0001-4000-8000-000000000003', renderingId: 'a5000012-0001-4000-8000-000000000001', ph: 'headless-main' },
    { uid: 'a5000101-0001-4000-8000-000000000006', ds: 'a5000204-0001-4000-8000-000000000001', renderingId: 'a5000013-0001-4000-8000-000000000001', ph: 'headless-main' },
    { uid: 'a5000101-0001-4000-8000-000000000007', ds: 'a5000205-0001-4000-8000-000000000001', renderingId: 'a5000014-0001-4000-8000-000000000001', ph: 'headless-main' },
    { uid: 'a5000101-0001-4000-8000-000000000008', ds: 'a5000206-0001-4000-8000-000000000001', renderingId: 'a5000015-0001-4000-8000-000000000001', ph: 'headless-footer' },
  ],
});

pageYaml({
  id: 'a5000100-0001-4000-8000-000000000002',
  name: 'Join',
  title: 'Join',
  renderings: [
    { uid: 'a5000102-0001-4000-8000-000000000001', ds: 'a5000201-0001-4000-8000-000000000001', renderingId: 'a5000010-0001-4000-8000-000000000001', ph: 'headless-header' },
    { uid: 'a5000102-0001-4000-8000-000000000002', ds: 'a5000207-0001-4000-8000-000000000001', renderingId: 'a5000016-0001-4000-8000-000000000001', ph: 'headless-main' },
    { uid: 'a5000102-0001-4000-8000-000000000003', ds: 'a5000206-0001-4000-8000-000000000001', renderingId: 'a5000015-0001-4000-8000-000000000001', ph: 'headless-footer' },
  ],
});

console.log('Generated KPMG Beyond generic marketing YAML.');
