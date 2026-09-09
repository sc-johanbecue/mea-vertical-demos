import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '../..');
const ROOT = path.join(REPO, 'authoring/items/British Council/serialized-content');

const uuid = () => crypto.randomUUID();
const brace = (id) => `{${id.toUpperCase()}}`;
const CREATED = '20260803T120000Z';

const PH_PARENT = '1d4dc09d-b568-4e01-a5fd-d4cf3c360a78';
const PH_TEMPLATE = '5c547d4e-7111-4995-95b0-6b561751bf2e';
const TPL_FOLDER = '25afb32e-e69a-4971-9efc-ecf93c6876ca';
const TPL_TEMPLATE = 'ab86861a-6030-46c5-b394-e8f99e8b87db';
const FIELD_TEMPLATE = '455a3e98-a627-4b40-8035-e683a0331ac7';
const SECTION_TEMPLATE = 'e269fbb5-3750-427a-9149-7aa950b49301';
const DATA_PARENT = 'c8082f37-497b-4754-93d4-f78e1c6ea94e';
const HOME_ID = 'eb308cb9-b232-4f7e-a3a6-be8cca865c2d';
const PAGE_TEMPLATE = '260c909c-1442-4b41-a40c-3cad22fc98a9';
const DEVICE = '{FE5D7FDF-89C0-4D99-9AA3-B5FBD009C9F3}';

const RENDERINGS = {
  PortalShell: 'd40394f5-2102-4703-a7bd-6d2f6e71f824',
  PortalLeftNav: '00061435-9527-4541-b3aa-b701abe8c4b6',
  PortalNavItem: '0e0036da-34d2-4785-9f0d-ba0783763bb6',
  PortalSearchHeader: 'cd833173-7937-4236-8c80-a47cf3936525',
  PortalCarousel: 'd6b81d9c-b6c5-42b4-be55-af98571e129e',
  PortalCarouselSlide: 'bccdec30-e879-4d76-b26b-0ac32fa84799',
  PortalCarouselPill: 'c3e45577-d4e6-4b5a-afca-46a6443ef844',
  MonthlyPicks: '48b2ee15-b240-495a-9267-2b72997c3f6b',
  ExploreSection: 'c0e708b9-93f8-438a-91c0-56276d65cbc4',
  BookCard: 'c81d5b00-a2bc-490f-9136-1f2fa5587ef5',
  CollectionCard: 'c941a8ee-cb13-4342-980e-fb4e740dc45c',
  CollectionBookList: 'ee87d5c6-4bee-449a-a066-f9e776839097',
};

const MEDIA = {
  logo: '1b437fa1-88b5-49dd-9e6f-284ab81b34d7',
  hero: '4fa494ae-0ea7-42b0-87a8-c66b3eada9a2',
  promo1: '9a9eaaf9-91b8-4b79-b8b5-d1cd408bef65',
  promo2: 'f92030bd-68ee-44d9-abbb-1a2647eaef95',
  promo3: 'a72f234c-c372-4d82-89af-75612376fe5d',
  promo4: '0c891675-e0af-4932-ab5b-c73f0ea3b9ac',
  featured: '7822ad88-8a2e-4382-9536-b180ff460579',
};

function write(rel, content) {
  const p = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content, 'utf8');
  console.log('wrote', rel);
}

function yamlItem({ id, parent, template, itemPath, shared = [], versionFields = [] }) {
  const lines = [
    '---',
    `ID: "${id}"`,
    `Parent: "${parent}"`,
    `Template: "${template}"`,
    `Path: "${itemPath}"`,
  ];
  if (shared.length) {
    lines.push('SharedFields:');
    for (const f of shared) {
      lines.push(`- ID: "${f.id}"`);
      lines.push(`  Hint: ${f.hint}`);
      if (f.raw) {
        lines.push(`  Value: |`);
        for (const line of String(f.value).split('\n')) lines.push(`    ${line}`);
      } else {
        lines.push(`  Value: ${JSON.stringify(String(f.value))}`);
      }
    }
  }
  lines.push('Languages:');
  lines.push('- Language: en');
  lines.push('  Versions:');
  lines.push('  - Version: 1');
  lines.push('    Fields:');
  lines.push('- ID: "25bed78c-4957-4165-998a-ca1b52f67497"'.replace(/^-/, '    -'));
  // fix indentation manually
  const vf = [
    { id: '25bed78c-4957-4165-998a-ca1b52f67497', hint: '__Created', value: CREATED },
    { id: '5dd74568-4d4b-44c1-b513-0af5f4cda34f', hint: '__Created by', value: 'sitecore\\Admin', raw: true },
    ...versionFields,
  ];
  // rebuild languages block cleanly
  const out = [
    '---',
    `ID: "${id}"`,
    `Parent: "${parent}"`,
    `Template: "${template}"`,
    `Path: "${itemPath}"`,
  ];
  if (shared.length) {
    out.push('SharedFields:');
    for (const f of shared) {
      out.push(`- ID: "${f.id}"`);
      out.push(`  Hint: ${f.hint}`);
      if (f.raw) {
        out.push('  Value: |');
        for (const line of String(f.value).split('\n')) out.push(`    ${line}`);
      } else {
        out.push(`  Value: ${JSON.stringify(String(f.value))}`);
      }
    }
  }
  out.push('Languages:');
  out.push('- Language: en');
  out.push('  Versions:');
  out.push('  - Version: 1');
  out.push('    Fields:');
  for (const f of vf) {
    out.push(`    - ID: "${f.id}"`);
    out.push(`      Hint: ${f.hint}`);
    if (f.raw) {
      out.push('      Value: |');
      for (const line of String(f.value).split('\n')) out.push(`        ${line}`);
    } else {
      out.push(`      Value: ${JSON.stringify(String(f.value))}`);
    }
  }
  return out.join('\n') + '\n';
}

function patchPlaceholders(renderingFile, placeholderIds) {
  const p = path.join(ROOT, 'renderings/british-council', renderingFile);
  let text = fs.readFileSync(p, 'utf8');
  if (text.includes('Hint: Placeholders')) return;
  const block = [
    '- ID: "069a8361-b1cd-437c-8c32-a3be78941446"',
    '  Hint: Placeholders',
    '  Value: |',
    ...placeholderIds.map((id) => `    ${brace(id)}`),
  ].join('\n');
  text = text.replace('SharedFields:\n', `SharedFields:\n${block}\n`);
  fs.writeFileSync(p, text);
  console.log('patched placeholders', renderingFile);
}

// --- Placeholder settings ---
const placeholders = [
  {
    file: 'portal-sidebar.yml',
    key: 'portal-sidebar-{*}',
    allows: [RENDERINGS.PortalLeftNav],
  },
  {
    file: 'portal-main.yml',
    key: 'portal-main-{*}',
    allows: [
      RENDERINGS.PortalSearchHeader,
      RENDERINGS.PortalCarousel,
      RENDERINGS.MonthlyPicks,
      RENDERINGS.ExploreSection,
      RENDERINGS.CollectionBookList,
    ],
  },
  {
    file: 'portal-nav-items.yml',
    key: 'portal-nav-items-{*}',
    allows: [RENDERINGS.PortalNavItem],
  },
  {
    file: 'portal-nav-children.yml',
    key: 'portal-nav-children-{*}',
    allows: [RENDERINGS.PortalNavItem],
  },
  {
    file: 'carousel-slides.yml',
    key: 'carousel-slides-{*}',
    allows: [RENDERINGS.PortalCarouselSlide],
  },
  {
    file: 'carousel-slide-pills.yml',
    key: 'carousel-slide-pills-{*}',
    allows: [RENDERINGS.PortalCarouselPill],
  },
  {
    file: 'monthly-pick-books.yml',
    key: 'monthly-pick-books-{*}',
    allows: [RENDERINGS.BookCard],
  },
  {
    file: 'explore-collections.yml',
    key: 'explore-collections-{*}',
    allows: [RENDERINGS.CollectionCard],
  },
  {
    file: 'collection-books.yml',
    key: 'collection-books-{*}',
    allows: [RENDERINGS.BookCard],
  },
];

const phIds = {};
for (const ph of placeholders) {
  const id = uuid();
  phIds[ph.file] = id;
  write(
    `placeholder-settings/british-council/${ph.file}`,
    yamlItem({
      id,
      parent: PH_PARENT,
      template: PH_TEMPLATE,
      itemPath: `/sitecore/layout/Placeholder Settings/Project/british-council/${ph.file.replace('.yml', '')}`,
      shared: [
        { id: '7256bdab-1fd2-49dd-b205-cb4873d2917c', hint: 'Placeholder Key', value: ph.key },
        {
          id: 'e391b526-d0c5-439d-803e-17512eae6222',
          hint: 'Allowed Controls',
          value: ph.allows.map((a) => brace(a)).join('\n'),
          raw: true,
        },
      ],
    })
  );
}

patchPlaceholders('PortalShell.yml', [phIds['portal-sidebar.yml'], phIds['portal-main.yml']]);
patchPlaceholders('PortalLeftNav.yml', [phIds['portal-nav-items.yml']]);
patchPlaceholders('PortalNavItem.yml', [phIds['portal-nav-children.yml']]);
patchPlaceholders('PortalCarousel.yml', [phIds['carousel-slides.yml']]);
patchPlaceholders('PortalCarouselSlide.yml', [phIds['carousel-slide-pills.yml']]);
patchPlaceholders('MonthlyPicks.yml', [phIds['monthly-pick-books.yml']]);
patchPlaceholders('ExploreSection.yml', [phIds['explore-collections.yml']]);
patchPlaceholders('CollectionBookList.yml', [phIds['collection-books.yml']]);

// --- Collection page template (inherits Page) ---
const collectionId = uuid();
const collectionContentId = uuid();
const collectionImageId = uuid();
const collectionNavTitleId = uuid();
const collectionStdId = uuid();

write(
  'templates/british-council/Collection.yml',
  yamlItem({
    id: collectionId,
    parent: TPL_FOLDER,
    template: TPL_TEMPLATE,
    itemPath: '/sitecore/templates/Project/british-council/Collection',
    shared: [
      { id: '06d5295c-ed2f-4a54-9bf2-26228d113318', hint: '__Icon', value: 'Office/32x32/books.png' },
      {
        id: '12c33f3f-86c5-43a5-aeb4-5598cec45116',
        hint: '__Base template',
        value: brace(PAGE_TEMPLATE),
        raw: true,
      },
      { id: 'f7d48a55-2158-4f02-9356-756654404f73', hint: '__Standard values', value: brace(collectionStdId) },
    ],
  })
);

write(
  'templates/british-council/Collection/Content.yml',
  yamlItem({
    id: collectionContentId,
    parent: collectionId,
    template: SECTION_TEMPLATE,
    itemPath: '/sitecore/templates/Project/british-council/Collection/Content',
    shared: [{ id: '06d5295c-ed2f-4a54-9bf2-26228d113318', hint: '__Icon', value: 'Office/32x32/window_dialog.png' }],
  })
);

write(
  'templates/british-council/Collection/Content/Image.yml',
  yamlItem({
    id: collectionImageId,
    parent: collectionContentId,
    template: FIELD_TEMPLATE,
    itemPath: '/sitecore/templates/Project/british-council/Collection/Content/Image',
    shared: [
      { id: 'ab162cc0-dc80-4abf-8871-998ee5d7ba32', hint: 'Type', value: 'Image' },
      { id: 'ba3f86a2-4a1c-4d78-b63d-91c2779c1b5e', hint: '__Sortorder', value: '100' },
    ],
  })
);

write(
  'templates/british-council/Collection/Content/NavigationTitle.yml',
  yamlItem({
    id: collectionNavTitleId,
    parent: collectionContentId,
    template: FIELD_TEMPLATE,
    itemPath: '/sitecore/templates/Project/british-council/Collection/Content/NavigationTitle',
    shared: [
      { id: 'ab162cc0-dc80-4abf-8871-998ee5d7ba32', hint: 'Type', value: 'Single-Line Text' },
      { id: 'ba3f86a2-4a1c-4d78-b63d-91c2779c1b5e', hint: '__Sortorder', value: '200' },
    ],
  })
);

write(
  'templates/british-council/Collection/__Standard Values.yml',
  yamlItem({
    id: collectionStdId,
    parent: collectionId,
    template: collectionId,
    itemPath: '/sitecore/templates/Project/british-council/Collection/__Standard Values',
  })
);

// --- Book content template (same fields as BookCard for datasource reuse) ---
const bookId = '780d8d31-4274-4a98-98d6-1b94a9102a1b'; // reuse BookCard as Book conceptually via alias note
// Create separate Book that bases on BookCard
const bookTplId = uuid();
const bookDataId = uuid();
const bookStdId = uuid();
const bookCardTplId = '780d8d31-4274-4a98-98d6-1b94a9102a1b';

write(
  'templates/british-council/Book.yml',
  yamlItem({
    id: bookTplId,
    parent: TPL_FOLDER,
    template: TPL_TEMPLATE,
    itemPath: '/sitecore/templates/Project/british-council/Book',
    shared: [
      { id: '06d5295c-ed2f-4a54-9bf2-26228d113318', hint: '__Icon', value: 'Office/32x32/book_open.png' },
      {
        id: '12c33f3f-86c5-43a5-aeb4-5598cec45116',
        hint: '__Base template',
        value: brace(bookCardTplId),
        raw: true,
      },
      { id: 'f7d48a55-2158-4f02-9356-756654404f73', hint: '__Standard values', value: brace(bookStdId) },
    ],
  })
);

write(
  'templates/british-council/Book/__Standard Values.yml',
  yamlItem({
    id: bookStdId,
    parent: bookTplId,
    template: bookTplId,
    itemPath: '/sitecore/templates/Project/british-council/Book/__Standard Values',
  })
);

// Update BookCard Datasource Location to also allow Books under current page
{
  const p = path.join(ROOT, 'renderings/british-council/BookCard.yml');
  let text = fs.readFileSync(p, 'utf8');
  text = text.replace(
    /Hint: Datasource Location\n  Value: ".*"/,
    `Hint: Datasource Location\n  Value: "query:$site/*[@@name='Data']/*[@@templatename='BookCard Folder']|query:$sharedSites/*[@@name='Data']/*[@@templatename='BookCard Folder']|query:$contextItem/*[@@templatename='Book']"`
  );
  fs.writeFileSync(p, text);
  console.log('patched BookCard datasource location');
}

// --- Available Renderings: Digital Library ---
const arParent = '4ea085f4-cdd3-4900-a339-1c4245a28bf7';
const arId = uuid();
const allPortalRids = Object.values(RENDERINGS).map((r) => brace(r)).join('\n');
write(
  'british-council/british-council/Presentation/Available Renderings/Digital Library.yml',
  yamlItem({
    id: arId,
    parent: arParent,
    template: '76da0a8d-fc7e-42b2-af1e-205b49e43f98',
    itemPath: '/sitecore/content/british-council/british-council/Presentation/Available Renderings/Digital Library',
    shared: [
      {
        id: '715ae6c0-71c8-4744-ab4f-65362d20ad65',
        hint: 'Renderings',
        value: allPortalRids,
        raw: true,
      },
    ],
  })
);

// Also add PortalShell to Page Structure
{
  const p = path.join(
    ROOT,
    'british-council/british-council/Presentation/Available Renderings/Page Structure.yml'
  );
  let text = fs.readFileSync(p, 'utf8');
  if (!text.includes(RENDERINGS.PortalShell.toUpperCase()) && !text.includes(RENDERINGS.PortalShell)) {
    text = text.replace(
      'Hint: Renderings\n  Value: |',
      `Hint: Renderings\n  Value: |\n    ${brace(RENDERINGS.PortalShell)}`
    );
    fs.writeFileSync(p, text);
    console.log('added PortalShell to Page Structure');
  }
}

// --- Helper to read folder template IDs from generated templates ---
function folderTemplateId(component) {
  const p = path.join(ROOT, `templates/british-council/${component} Templates/${component} Folder.yml`);
  if (!fs.existsSync(p)) {
    // hashed path?
    const base = path.join(ROOT, `templates/british-council/${component} Templates`);
    const found = findFile(base, `${component} Folder.yml`);
    if (!found) throw new Error('Folder template missing: ' + component);
    return readId(found);
  }
  return readId(p);
}

function componentTemplateId(component) {
  const p = path.join(ROOT, `templates/british-council/${component} Templates/${component}.yml`);
  if (!fs.existsSync(p)) {
    const base = path.join(ROOT, `templates/british-council/${component} Templates`);
    const found = findFile(base, `${component}.yml`);
    if (!found) throw new Error('Component template missing: ' + component);
    return readId(found);
  }
  return readId(p);
}

function findFile(dir, name) {
  if (!fs.existsSync(dir)) return null;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isFile() && ent.name === name) return full;
    if (ent.isDirectory()) {
      const f = findFile(full, name);
      if (f) return f;
    }
  }
  return null;
}

function readId(file) {
  const m = fs.readFileSync(file, 'utf8').match(/^ID: "([^"]+)"/m);
  if (!m) throw new Error('No ID in ' + file);
  return m[1];
}

function dataFolder(name, folderTplId) {
  const id = uuid();
  write(
    `british-council/british-council/Data/${name}.yml`,
    yamlItem({
      id,
      parent: DATA_PARENT,
      template: folderTplId,
      itemPath: `/sitecore/content/british-council/british-council/Data/${name}`,
    })
  );
  return id;
}

function datasource(folderId, folderName, itemName, tplId, fields) {
  const id = uuid();
  const versionFields = fields.map((f) => ({
    id: f.fieldId || f.id,
    hint: f.hint,
    value: f.value,
    raw: f.raw !== false && (String(f.value).includes('<') || String(f.value).includes('\n')),
  }));
  // Field IDs must be real Sitecore field IDs from templates — we'll use Hint-only via Shared? 
  // Sitecore YAML uses field definition IDs. Look up from template field files.
  write(
    `british-council/british-council/Data/${folderName}/${itemName}.yml`,
    yamlItem({
      id,
      parent: folderId,
      template: tplId,
      itemPath: `/sitecore/content/british-council/british-council/Data/${folderName}/${itemName}`,
      versionFields,
    })
  );
  return id;
}

function fieldId(component, fieldName) {
  const base = path.join(ROOT, `templates/british-council/${component} Templates`);
  let found = findFile(base, `${fieldName}.yml`);
  if (!found) {
    // validate --fix may relocate long paths under templates/<hash>/
    const templatesRoot = path.join(ROOT, 'templates');
    const needle = `/british-council/${component} Templates/${component}/Data/${fieldName}`;
    found = findFileByPathHint(templatesRoot, fieldName + '.yml', needle);
  }
  if (!found) throw new Error(`Field ${component}/${fieldName} not found`);
  return readId(found);
}

function findFileByPathHint(dir, fileName, pathHint) {
  if (!fs.existsSync(dir)) return null;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isFile() && ent.name === fileName) {
      const text = fs.readFileSync(full, 'utf8');
      if (text.includes(pathHint) || text.includes(fileName.replace('.yml', ''))) return full;
    }
    if (ent.isDirectory()) {
      const f = findFileByPathHint(full, fileName, pathHint);
      if (f) return f;
    }
  }
  return null;
}

// Create data folders
const folders = {};
const dataComponents = [
  'PortalLeftNav',
  'PortalNavItem',
  'PortalSearchHeader',
  'PortalCarousel',
  'PortalCarouselSlide',
  'PortalCarouselPill',
  'MonthlyPicks',
  'ExploreSection',
  'BookCard',
  'CollectionCard',
  'CollectionBookList',
];

for (const c of dataComponents) {
  const plural =
    c === 'MonthlyPicks'
      ? 'MonthlyPicks'
      : c === 'PortalLeftNav'
        ? 'PortalLeftNavs'
        : c === 'ExploreSection'
          ? 'ExploreSections'
          : c === 'CollectionBookList'
            ? 'CollectionBookLists'
            : c + 's';
  folders[c] = { id: dataFolder(plural, folderTemplateId(c)), name: plural, tpl: componentTemplateId(c) };
}

// Sample datasources
const extLink = (text, url) =>
  `<link text="${text}" linktype="external" url="${url}" anchor="" target="" />`;
const img = (mediaid) => `<image mediaid="${mediaid}" />`;

const leftNavId = datasource(folders.PortalLeftNav.id, folders.PortalLeftNav.name, 'Digital Library Nav', folders.PortalLeftNav.tpl, [
  { id: fieldId('PortalLeftNav', 'Logo'), hint: 'Logo', value: img(MEDIA.logo) },
  { id: fieldId('PortalLeftNav', 'LogoLink'), hint: 'LogoLink', value: extLink('British Council', '/digital-library') },
  { id: fieldId('PortalLeftNav', 'PortalTitle'), hint: 'PortalTitle', value: 'Digital Library', raw: false },
  { id: fieldId('PortalLeftNav', 'MyLoftLogo'), hint: 'MyLoftLogo', value: img(MEDIA.logo) },
]);

const navHome = datasource(folders.PortalNavItem.id, folders.PortalNavItem.name, 'Nav Home', folders.PortalNavItem.tpl, [
  { id: fieldId('PortalNavItem', 'Link'), hint: 'Link', value: extLink('Home', '/digital-library') },
  { id: fieldId('PortalNavItem', 'IsActive'), hint: 'IsActive', value: '1', raw: false },
  { id: fieldId('PortalNavItem', 'HasChildren'), hint: 'HasChildren', value: '', raw: false },
]);

const navEres = datasource(folders.PortalNavItem.id, folders.PortalNavItem.name, 'Nav eResources', folders.PortalNavItem.tpl, [
  { id: fieldId('PortalNavItem', 'Link'), hint: 'Link', value: extLink('eResources', '/digital-library#eresources') },
  { id: fieldId('PortalNavItem', 'HasChildren'), hint: 'HasChildren', value: '', raw: false },
]);

const navFav = datasource(folders.PortalNavItem.id, folders.PortalNavItem.name, 'Nav Favourites', folders.PortalNavItem.tpl, [
  { id: fieldId('PortalNavItem', 'Link'), hint: 'Link', value: extLink('Favourites', '/digital-library#favourites') },
  { id: fieldId('PortalNavItem', 'HasChildren'), hint: 'HasChildren', value: '', raw: false },
]);

const navColl = datasource(folders.PortalNavItem.id, folders.PortalNavItem.name, 'Nav Collections', folders.PortalNavItem.tpl, [
  { id: fieldId('PortalNavItem', 'Link'), hint: 'Link', value: extLink('Collections', '/digital-library') },
  { id: fieldId('PortalNavItem', 'HasChildren'), hint: 'HasChildren', value: '1', raw: false },
]);

const collections = ['Newspapers', 'Magazines', 'Audiobooks', 'Fiction', 'Comics', 'Movies'];
const navChildren = {};
for (const name of collections) {
  const slug = name.toLowerCase();
  navChildren[name] = datasource(
    folders.PortalNavItem.id,
    folders.PortalNavItem.name,
    `Nav ${name}`,
    folders.PortalNavItem.tpl,
    [
      {
        id: fieldId('PortalNavItem', 'Link'),
        hint: 'Link',
        value: extLink(name, `/digital-library/${slug}`),
      },
      { id: fieldId('PortalNavItem', 'HasChildren'), hint: 'HasChildren', value: '', raw: false },
    ]
  );
}

const searchHeaderId = datasource(
  folders.PortalSearchHeader.id,
  folders.PortalSearchHeader.name,
  'Discover Header',
  folders.PortalSearchHeader.tpl,
  [
    { id: fieldId('PortalSearchHeader', 'Title'), hint: 'Title', value: 'Discover', raw: false },
    {
      id: fieldId('PortalSearchHeader', 'SearchPlaceholder'),
      hint: 'SearchPlaceholder',
      value: 'Search titles, authors, topics…',
      raw: false,
    },
    {
      id: fieldId('PortalSearchHeader', 'NotificationLink'),
      hint: 'NotificationLink',
      value: extLink('Notifications', '/digital-library#notifications'),
    },
    {
      id: fieldId('PortalSearchHeader', 'ProfileLink'),
      hint: 'ProfileLink',
      value: extLink('Profile', '/digital-library#profile'),
    },
  ]
);

const carouselId = datasource(folders.PortalCarousel.id, folders.PortalCarousel.name, 'Home Carousel', folders.PortalCarousel.tpl, [
  { id: fieldId('PortalCarousel', 'Title'), hint: 'Title', value: '', raw: false },
]);

const slide1 = datasource(
  folders.PortalCarouselSlide.id,
  folders.PortalCarouselSlide.name,
  'Slide Welcome',
  folders.PortalCarouselSlide.tpl,
  [
    { id: fieldId('PortalCarouselSlide', 'Title'), hint: 'Title', value: 'Welcome to the Digital Library', raw: false },
    {
      id: fieldId('PortalCarouselSlide', 'LeftColumnTitle'),
      hint: 'LeftColumnTitle',
      value: 'Read anywhere',
      raw: false,
    },
    {
      id: fieldId('PortalCarouselSlide', 'RightColumnTitle'),
      hint: 'RightColumnTitle',
      value: 'Learn every day',
      raw: false,
    },
    { id: fieldId('PortalCarouselSlide', 'Image'), hint: 'Image', value: img(MEDIA.hero) },
    {
      id: fieldId('PortalCarouselSlide', 'Link'),
      hint: 'Link',
      value: extLink('Explore', '/digital-library'),
    },
  ]
);

const pill1 = datasource(
  folders.PortalCarouselPill.id,
  folders.PortalCarouselPill.name,
  'Pill Newspapers',
  folders.PortalCarouselPill.tpl,
  [
    { id: fieldId('PortalCarouselPill', 'Text'), hint: 'Text', value: 'Newspapers', raw: false },
    {
      id: fieldId('PortalCarouselPill', 'Link'),
      hint: 'Link',
      value: extLink('Newspapers', '/digital-library/newspapers'),
    },
  ]
);

const pill2 = datasource(
  folders.PortalCarouselPill.id,
  folders.PortalCarouselPill.name,
  'Pill Magazines',
  folders.PortalCarouselPill.tpl,
  [
    { id: fieldId('PortalCarouselPill', 'Text'), hint: 'Text', value: 'Magazines', raw: false },
    {
      id: fieldId('PortalCarouselPill', 'Link'),
      hint: 'Link',
      value: extLink('Magazines', '/digital-library/magazines'),
    },
  ]
);

const monthlyId = datasource(folders.MonthlyPicks.id, folders.MonthlyPicks.name, 'Monthly Picks', folders.MonthlyPicks.tpl, [
  { id: fieldId('MonthlyPicks', 'Title'), hint: 'Title', value: 'Monthly Picks', raw: false },
]);

const bookCovers = [MEDIA.promo1, MEDIA.promo2, MEDIA.promo3, MEDIA.promo4];
const monthlyBooks = ['The Guardian Weekly', 'National Geographic', 'BBC History', 'Scientific American'].map(
  (title, i) =>
    datasource(folders.BookCard.id, folders.BookCard.name, title, folders.BookCard.tpl, [
      { id: fieldId('BookCard', 'CoverImage'), hint: 'CoverImage', value: img(bookCovers[i]) },
      { id: fieldId('BookCard', 'Title'), hint: 'Title', value: title, raw: false },
      {
        id: fieldId('BookCard', 'Link'),
        hint: 'Link',
        value: extLink(title, `/digital-library/newspapers`),
      },
    ])
);

const exploreId = datasource(folders.ExploreSection.id, folders.ExploreSection.name, 'Explore', folders.ExploreSection.tpl, [
  { id: fieldId('ExploreSection', 'Title'), hint: 'Title', value: 'Explore', raw: false },
]);

const exploreImages = [MEDIA.promo1, MEDIA.promo2, MEDIA.promo3, MEDIA.promo4, MEDIA.hero, MEDIA.featured];
const collectionCards = {};
collections.forEach((name, i) => {
  const slug = name.toLowerCase();
  collectionCards[name] = datasource(
    folders.CollectionCard.id,
    folders.CollectionCard.name,
    `${name} Card`,
    folders.CollectionCard.tpl,
    [
      { id: fieldId('CollectionCard', 'Image'), hint: 'Image', value: img(exploreImages[i % exploreImages.length]) },
      { id: fieldId('CollectionCard', 'Title'), hint: 'Title', value: name, raw: false },
      {
        id: fieldId('CollectionCard', 'Link'),
        hint: 'Link',
        value: extLink(name, `/digital-library/${slug}`),
      },
    ]
  );
});

const bookListId = datasource(
  folders.CollectionBookList.id,
  folders.CollectionBookList.name,
  'Collection Books',
  folders.CollectionBookList.tpl,
  [{ id: fieldId('CollectionBookList', 'Title'), hint: 'Title', value: 'Titles', raw: false }]
);

// --- Pages ---
function r(uid, ds, rid, ph, dynId) {
  const dsAttr = ds ? `\n         s:ds="${ds}"` : '';
  return `        <r uid="${brace(uid)}"
         p:before="*"${dsAttr}
         s:id="${brace(rid)}"
         s:par="CSSStyles&amp;DynamicPlaceholderId=${dynId}"
         s:ph="${ph}" />`;
}

function pageYaml({ id, parent, name, itemPath, template, title, image, navTitle, renderingsXml, childrenNote }) {
  const versionFields = [
    { id: 'f79f80ba-3870-41f5-9527-a12d54644f69', hint: 'Title', value: title, raw: false },
  ];
  if (navTitle) {
    versionFields.push({ id: collectionNavTitleId, hint: 'NavigationTitle', value: navTitle, raw: false });
  }
  if (image) {
    versionFields.push({ id: collectionImageId, hint: 'Image', value: img(image), raw: true });
  }
  const shared = [
    {
      id: 'f1a1fe9e-a60c-4ddb-a3a0-bb5b29fe732e',
      hint: '__Renderings',
      value: renderingsXml,
      raw: true,
    },
  ];
  write(
    itemPath.replace('/sitecore/content/british-council/british-council/', 'british-council/british-council/') + '.yml',
    yamlItem({
      id,
      parent,
      template,
      itemPath,
      shared,
      versionFields,
    })
  );
  return id;
}

const dlId = uuid();
const dlPath = '/sitecore/content/british-council/british-council/Home/Digital Library';

// Dynamic placeholder IDs for Digital Library home
const dyn = {
  shell: 1,
  nav: 2,
  search: 3,
  carousel: 4,
  slide: 5,
  monthly: 6,
  explore: 7,
  navHome: 10,
  navEres: 11,
  navFav: 12,
  navColl: 13,
  ...Object.fromEntries(collections.map((c, i) => [`nav${c}`, 20 + i])),
  ...Object.fromEntries(monthlyBooks.map((_, i) => [`book${i}`, 30 + i])),
  ...Object.fromEntries(collections.map((c, i) => [`card${c}`, 40 + i])),
  pill1: 50,
  pill2: 51,
};

const homeRids = {
  shell: uuid(),
  leftNav: uuid(),
  search: uuid(),
  carousel: uuid(),
  slide: uuid(),
  monthly: uuid(),
  explore: uuid(),
  navHome: uuid(),
  navEres: uuid(),
  navFav: uuid(),
  navColl: uuid(),
};

const homeXml = `<r xmlns:p="p" xmlns:s="s" p:p="1">
  <d
    id="${DEVICE}">
${r(homeRids.shell, '', RENDERINGS.PortalShell, 'headless-main', dyn.shell)}
${r(homeRids.leftNav, leftNavId, RENDERINGS.PortalLeftNav, '/headless-main/portal-sidebar-1', dyn.nav)}
${r(homeRids.navHome, navHome, RENDERINGS.PortalNavItem, '/headless-main/portal-sidebar-1/portal-nav-items-2', dyn.navHome)}
${r(homeRids.navEres, navEres, RENDERINGS.PortalNavItem, '/headless-main/portal-sidebar-1/portal-nav-items-2', dyn.navEres)}
${r(homeRids.navFav, navFav, RENDERINGS.PortalNavItem, '/headless-main/portal-sidebar-1/portal-nav-items-2', dyn.navFav)}
${r(homeRids.navColl, navColl, RENDERINGS.PortalNavItem, '/headless-main/portal-sidebar-1/portal-nav-items-2', dyn.navColl)}
${collections
  .map(
    (c) =>
      r(
        uuid(),
        navChildren[c],
        RENDERINGS.PortalNavItem,
        `/headless-main/portal-sidebar-1/portal-nav-items-2/portal-nav-children-${dyn.navColl}`,
        dyn[`nav${c}`]
      )
  )
  .join('\n')}
${r(homeRids.search, searchHeaderId, RENDERINGS.PortalSearchHeader, '/headless-main/portal-main-1', dyn.search)}
${r(homeRids.carousel, carouselId, RENDERINGS.PortalCarousel, '/headless-main/portal-main-1', dyn.carousel)}
${r(homeRids.slide, slide1, RENDERINGS.PortalCarouselSlide, '/headless-main/portal-main-1/carousel-slides-4', dyn.slide)}
${r(uuid(), pill1, RENDERINGS.PortalCarouselPill, '/headless-main/portal-main-1/carousel-slides-4/carousel-slide-pills-5', dyn.pill1)}
${r(uuid(), pill2, RENDERINGS.PortalCarouselPill, '/headless-main/portal-main-1/carousel-slides-4/carousel-slide-pills-5', dyn.pill2)}
${r(homeRids.monthly, monthlyId, RENDERINGS.MonthlyPicks, '/headless-main/portal-main-1', dyn.monthly)}
${monthlyBooks
  .map(
    (bid, i) =>
      r(uuid(), bid, RENDERINGS.BookCard, '/headless-main/portal-main-1/monthly-pick-books-6', dyn[`book${i}`])
  )
  .join('\n')}
${r(homeRids.explore, exploreId, RENDERINGS.ExploreSection, '/headless-main/portal-main-1', dyn.explore)}
${collections
  .map(
    (c) =>
      r(
        uuid(),
        collectionCards[c],
        RENDERINGS.CollectionCard,
        '/headless-main/portal-main-1/explore-collections-7',
        dyn[`card${c}`]
      )
  )
  .join('\n')}
  </d>
</r>`;

pageYaml({
  id: dlId,
  parent: HOME_ID,
  name: 'Digital Library',
  itemPath: dlPath,
  template: PAGE_TEMPLATE,
  title: 'Digital Library',
  renderingsXml: homeXml,
});

// Collection pages + Book children
const sampleBooksByCollection = {
  Newspapers: [
    { title: 'The Times', cover: MEDIA.promo1 },
    { title: 'Financial Times', cover: MEDIA.promo2 },
  ],
  Magazines: [
    { title: 'The Economist', cover: MEDIA.promo3 },
    { title: 'Nature', cover: MEDIA.promo4 },
  ],
  Audiobooks: [{ title: 'Spoken English Stories', cover: MEDIA.hero }],
  Fiction: [{ title: 'Modern Short Stories', cover: MEDIA.featured }],
  Comics: [{ title: 'British Comics Anthology', cover: MEDIA.promo1 }],
  Movies: [{ title: 'British Cinema Classics', cover: MEDIA.promo2 }],
};

for (const name of collections) {
  const slug = name.toLowerCase();
  const pageId = uuid();
  const shellUid = uuid();
  const navUid = uuid();
  const listUid = uuid();
  const books = sampleBooksByCollection[name] || [];

  // Create Book children first to get IDs
  const bookItems = books.map((b) => {
    const bid = uuid();
    write(
      `british-council/british-council/Home/Digital Library/${name}/${b.title}.yml`,
      yamlItem({
        id: bid,
        parent: pageId,
        template: bookTplId,
        itemPath: `${dlPath}/${name}/${b.title}`,
        versionFields: [
          { id: fieldId('BookCard', 'CoverImage'), hint: 'CoverImage', value: img(b.cover) },
          { id: fieldId('BookCard', 'Title'), hint: 'Title', value: b.title, raw: false },
          {
            id: fieldId('BookCard', 'Link'),
            hint: 'Link',
            value: extLink(b.title, `/digital-library/${slug}`),
          },
        ],
      })
    );
    return bid;
  });

  const collXml = `<r xmlns:p="p" xmlns:s="s" p:p="1">
  <d
    id="${DEVICE}">
${r(shellUid, '', RENDERINGS.PortalShell, 'headless-main', 1)}
${r(navUid, leftNavId, RENDERINGS.PortalLeftNav, '/headless-main/portal-sidebar-1', 2)}
${r(uuid(), navHome, RENDERINGS.PortalNavItem, '/headless-main/portal-sidebar-1/portal-nav-items-2', 10)}
${r(uuid(), navEres, RENDERINGS.PortalNavItem, '/headless-main/portal-sidebar-1/portal-nav-items-2', 11)}
${r(uuid(), navFav, RENDERINGS.PortalNavItem, '/headless-main/portal-sidebar-1/portal-nav-items-2', 12)}
${r(uuid(), navColl, RENDERINGS.PortalNavItem, '/headless-main/portal-sidebar-1/portal-nav-items-2', 13)}
${collections
  .map(
    (c, i) =>
      r(
        uuid(),
        navChildren[c],
        RENDERINGS.PortalNavItem,
        '/headless-main/portal-sidebar-1/portal-nav-items-2/portal-nav-children-13',
        20 + i
      )
  )
  .join('\n')}
${r(listUid, bookListId, RENDERINGS.CollectionBookList, '/headless-main/portal-main-1', 3)}
${bookItems
  .map((bid, i) => r(uuid(), bid, RENDERINGS.BookCard, '/headless-main/portal-main-1/collection-books-3', 40 + i))
  .join('\n')}
  </d>
</r>`;

  // Write page (after children files exist — parent must exist; order ok for SCS)
  write(
    `british-council/british-council/Home/Digital Library/${name}.yml`,
    yamlItem({
      id: pageId,
      parent: dlId,
      template: collectionId,
      itemPath: `${dlPath}/${name}`,
      shared: [
        {
          id: 'f1a1fe9e-a60c-4ddb-a3a0-bb5b29fe732e',
          hint: '__Renderings',
          value: collXml,
          raw: true,
        },
      ],
      versionFields: [
        { id: 'f79f80ba-3870-41f5-9527-a12d54644f69', hint: 'Title', value: name, raw: false },
        { id: collectionNavTitleId, hint: 'NavigationTitle', value: name, raw: false },
        {
          id: collectionImageId,
          hint: 'Image',
          value: img(exploreImages[collections.indexOf(name) % exploreImages.length]),
        },
      ],
    })
  );
}

fs.writeFileSync(
  path.join(__dirname, 'generated-ids.json'),
  JSON.stringify(
    {
      collectionId,
      bookTplId,
      collectionImageId,
      collectionNavTitleId,
      leftNavId,
      dlId,
      placeholders: phIds,
      RENDERINGS,
    },
    null,
    2
  )
);

console.log('DONE');
