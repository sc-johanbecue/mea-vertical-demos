import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '../..');
const ROOT = path.join(REPO, 'authoring/items/British Council/serialized-content');
const CONTENT = path.join(ROOT, 'british-council/british-council');

const uuid = () => crypto.randomUUID();
const brace = (id) => `{${id.toUpperCase()}}`;
const CREATED = '20260803T140000Z';

const PORTAL_ID = '7cb976a4-3312-4cce-b769-d5fb7003ae00';
const PORTAL_PATH = '/sitecore/content/british-council/british-council/Home/Portal';
const PAGE_TEMPLATE = '260c909c-1442-4b41-a40c-3cad22fc98a9';
const DEVICE = '{FE5D7FDF-89C0-4D99-9AA3-B5FBD009C9F3}';

const ids = JSON.parse(fs.readFileSync(path.join(__dirname, 'generated-ids.json'), 'utf8'));
const R = ids.RENDERINGS;
const collectionTpl = ids.collectionId;
const bookTpl = ids.bookTplId;
const collectionImageId = ids.collectionImageId;
const collectionNavTitleId = ids.collectionNavTitleId;

const DS = {
  leftNav: '15dda3ee-7e6e-4529-b6d9-4ec74f999056',
  navHome: '32501f60-c585-4679-81e4-5c12f293de29',
  navEres: '9e5e3053-9338-4f1c-840f-d587d3133f61',
  navFav: '0b7f608b-3171-4b17-9845-8b205aa57c23',
  navColl: '123b7a80-81ec-4a97-bb4b-e2c3ba5e15d3',
  nav: {
    Newspapers: '8d2fd3b0-e54a-426b-bded-57dcb9cca333',
    Magazines: 'a1c6999b-1df2-4293-99b9-589e4823ea44',
    Audiobooks: 'ac9b6546-0126-46e2-8c41-31608e819cef',
    Fiction: '67bf7ae6-71aa-4fd5-9d5f-99a22821258f',
    Comics: 'd20f0873-d7e9-4c2c-986c-1a1360acfbb9',
    Movies: '766e1a78-ab3e-4d0f-a909-c1346893de67',
  },
  search: 'e83c20d5-b42b-415b-aa05-403bbe47aeef',
  carousel: '0476a724-3380-4325-970e-7d7fb4360eeb',
  slide: 'ce2334c5-11a9-4eaa-824b-314e6b8ec7ec',
  pill1: 'f6edeb16-bb90-42ec-82a1-ca9f62bce41e',
  pill2: 'ff5e0474-ce2d-4be2-97e5-a20cfd8e2968',
  monthly: '06cc6dfe-95e7-4d69-97ee-bf86097db55b',
  books: [
    '760c0a48-15ea-4edd-a006-256c5a686a91',
    'bcaf5ebe-470e-4f57-8395-d3f70792bb24',
    'edf763ea-bf97-47f2-91a0-eb3028568bb1',
    '7ad77c42-d29e-428c-98b6-86f48e074cae',
  ],
  explore: '8d151f04-5208-43ea-a674-c99cc177bfad',
  cards: {
    Newspapers: '957677eb-6d40-4d3d-bb02-55540c4184df',
    Magazines: 'd3801d8e-29e8-4be6-a654-e2eb925f132d',
    Audiobooks: '03bbd150-bd34-4eb1-9e34-29feab0ff421',
    Fiction: 'f7407a78-6e7e-44e4-ae96-8a2ae2a4c3a3',
    Comics: '054072b0-d74d-4ecc-b4d1-861f0de43e9a',
    Movies: '0f26c1fa-4a4a-45bf-8861-ff11ad80b2df',
  },
  bookList: 'e43a99dc-339d-4c7d-8af4-6b86f144c319',
};

const MEDIA = [
  '9a9eaaf9-91b8-4b79-b8b5-d1cd408bef65',
  'f92030bd-68ee-44d9-abbb-1a2647eaef95',
  'a72f234c-c372-4d82-89af-75612376fe5d',
  '0c891675-e0af-4932-ab5b-c73f0ea3b9ac',
  '4fa494ae-0ea7-42b0-87a8-c66b3eada9a2',
  '7822ad88-8a2e-4382-9536-b180ff460579',
  '74f1e9cd-643d-4868-bde6-06f791cb7243',
  '86032eff-9d4f-472f-8b40-0e9633c040aa',
  '208e508a-7f97-4809-bf44-f5c254e8f48d',
  '6a09e0ee-bc7c-45b3-bc13-d5d8cc27de06',
];

const BOOK_FIELD = {
  CoverImage: 'c7d49b5b-2d4b-4fae-a6d0-2c881037d540',
  Title: '290ad408-f96e-4f8c-85cc-8b28ca84ac0e',
  Link: '8ca190ea-9781-4f8e-bcfc-14ee20a86fa6',
};

const COLLECTIONS = ['Newspapers', 'Magazines', 'Audiobooks', 'Fiction', 'Comics', 'Movies'];

const BOOK_TITLES = {
  Newspapers: [
    'The Times',
    'Financial Times',
    'The Guardian',
    'The Independent',
    'Daily Telegraph',
    'The Observer',
    'Evening Standard',
    'The Scotsman',
    'Irish Times',
    'Washington Post International',
  ],
  Magazines: [
    'The Economist',
    'Nature',
    'National Geographic',
    'Scientific American',
    'New Scientist',
    'BBC History',
    'Time Magazine',
    'Wired UK',
    'Prospect',
    'Spectator',
  ],
  Audiobooks: [
    'Spoken English Stories',
    'British Voices',
    'Learn with Podcasts',
    'Classic Tales Audio',
    'Business English Listen',
    'Travel Conversations',
    'Short Stories Aloud',
    'News in Slow English',
    'Poetry Readings',
    'Interview Masterclass',
  ],
  Fiction: [
    'Modern Short Stories',
    'Contemporary British Novel',
    'Young Adult Reads',
    'Mystery Collection',
    'Romance Classics',
    'Science Fiction Anthology',
    'Historical Fiction',
    'Literary Essays',
    'Travel Narratives',
    'Coming of Age Tales',
  ],
  Comics: [
    'British Comics Anthology',
    'Graphic Novel Spotlight',
    'Manga & Beyond',
    'Superhero Classics',
    'Indie Comics Week',
    'Comic Strip History',
    'Illustrated Adventures',
    'Satire in Panels',
    'Kids Comics Club',
    'Artist Showcase',
  ],
  Movies: [
    'British Cinema Classics',
    'Documentary Corner',
    'World Film Festival',
    'Short Film Night',
    'Animation Showcase',
    'Drama Favourites',
    'Comedy Collection',
    'Film Studies Pack',
    'Behind the Scenes',
    'Director Spotlights',
  ],
};

function write(rel, content) {
  const p = path.join(CONTENT, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content, 'utf8');
  console.log('wrote', rel);
}

function yamlItem({ id, parent, template, itemPath, shared = [], versionFields = [] }) {
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
  const vf = [
    { id: '25bed78c-4957-4165-998a-ca1b52f67497', hint: '__Created', value: CREATED },
    { id: '5dd74568-4d4b-44c1-b513-0af5f4cda34f', hint: '__Created by', value: 'sitecore\\Admin', raw: true },
    ...versionFields,
  ];
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

function r(uid, ds, rid, ph, dynId) {
  const dsAttr = ds ? `\n          s:ds="${ds}"` : '';
  return `        <r
          uid="${brace(uid)}"
          p:before="*"${dsAttr}
          s:id="${brace(rid)}"
          s:par="CSSStyles&amp;DynamicPlaceholderId=${dynId}"
          s:ph="${ph}" />`;
}

function img(mediaid) {
  return `<image mediaid="${mediaid}" />`;
}

function extLink(text, url) {
  return `<link text="${text}" linktype="external" url="${url}" anchor="" target="" />`;
}

function sharedNavXml() {
  const lines = [
    r(uuid(), DS.leftNav, R.PortalLeftNav, '/headless-main/portal-sidebar-1', 2),
    r(uuid(), DS.navHome, R.PortalNavItem, '/headless-main/portal-sidebar-1/portal-nav-items-2', 10),
    r(uuid(), DS.navEres, R.PortalNavItem, '/headless-main/portal-sidebar-1/portal-nav-items-2', 11),
    r(uuid(), DS.navFav, R.PortalNavItem, '/headless-main/portal-sidebar-1/portal-nav-items-2', 12),
    r(uuid(), DS.navColl, R.PortalNavItem, '/headless-main/portal-sidebar-1/portal-nav-items-2', 13),
  ];
  COLLECTIONS.forEach((c, i) => {
    lines.push(
      r(
        uuid(),
        DS.nav[c],
        R.PortalNavItem,
        '/headless-main/portal-sidebar-1/portal-nav-items-2/portal-nav-children-13',
        20 + i
      )
    );
  });
  return lines.join('\n');
}

function discoverXml() {
  const lines = [
    r(uuid(), '', R.PortalShell, 'headless-main', 1),
    sharedNavXml(),
    r(uuid(), DS.search, R.PortalSearchHeader, '/headless-main/portal-main-1', 3),
    r(uuid(), DS.carousel, R.PortalCarousel, '/headless-main/portal-main-1', 4),
    r(uuid(), DS.slide, R.PortalCarouselSlide, '/headless-main/portal-main-1/carousel-slides-4', 5),
    r(uuid(), DS.pill1, R.PortalCarouselPill, '/headless-main/portal-main-1/carousel-slides-4/carousel-slide-pills-5', 50),
    r(uuid(), DS.pill2, R.PortalCarouselPill, '/headless-main/portal-main-1/carousel-slides-4/carousel-slide-pills-5', 51),
    r(uuid(), DS.monthly, R.MonthlyPicks, '/headless-main/portal-main-1', 6),
  ];
  DS.books.forEach((bid, i) => {
    lines.push(r(uuid(), bid, R.BookCard, '/headless-main/portal-main-1/monthly-pick-books-6', 30 + i));
  });
  lines.push(r(uuid(), DS.explore, R.ExploreSection, '/headless-main/portal-main-1', 7));
  COLLECTIONS.forEach((c, i) => {
    lines.push(r(uuid(), DS.cards[c], R.CollectionCard, '/headless-main/portal-main-1/explore-collections-7', 40 + i));
  });
  return `<r xmlns:p="p" xmlns:s="s" p:p="1">
  <d
    id="${DEVICE}">
${lines.join('\n')}
  </d>
</r>`;
}

function collectionXml(bookIds) {
  const lines = [
    r(uuid(), '', R.PortalShell, 'headless-main', 1),
    sharedNavXml(),
    r(uuid(), DS.bookList, R.CollectionBookList, '/headless-main/portal-main-1', 3),
  ];
  bookIds.forEach((bid, i) => {
    lines.push(r(uuid(), bid, R.BookCard, '/headless-main/portal-main-1/collection-books-3', 40 + i));
  });
  return `<r xmlns:p="p" xmlns:s="s" p:p="1">
  <d
    id="${DEVICE}">
${lines.join('\n')}
  </d>
</r>`;
}

// --- Update link URLs in datasources from /digital-library to /portal ---
function rewriteLinksInFile(file) {
  if (!fs.existsSync(file)) return;
  let t = fs.readFileSync(file, 'utf8');
  const next = t.replaceAll('/digital-library', '/portal');
  if (next !== t) {
    fs.writeFileSync(file, next);
    console.log('rewrote links', path.relative(CONTENT, file));
  }
}

function walk(dir, fn) {
  if (!fs.existsSync(dir)) return;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, fn);
    else if (ent.name.endsWith('.yml')) fn(full);
  }
}

walk(path.join(CONTENT, 'Data'), rewriteLinksInFile);

// Left nav title link
rewriteLinksInFile(path.join(CONTENT, 'Data/PortalLeftNavs/Digital Library Nav.yml'));

// --- Update Portal.yml as Discover home ---
const portalFile = path.join(CONTENT, 'Home/Portal.yml');
let portal = fs.readFileSync(portalFile, 'utf8');

// Replace __Renderings block
portal = portal.replace(
  /- ID: "f1a1fe9e-a60c-4ddb-a3a0-bb5b29fe732e"\n  Hint: __Renderings\n  Value: \|[\s\S]*?(?=\nLanguages:)/,
  `- ID: "f1a1fe9e-a60c-4ddb-a3a0-bb5b29fe732e"
  Hint: __Renderings
  Value: |
${discoverXml()
  .split('\n')
  .map((l) => `    ${l}`)
  .join('\n')}
`
);

// Update Title / NavigationTitle
portal = portal.replace(/Hint: Title\n      Value: English/, 'Hint: Title\n      Value: Discover');
portal = portal.replace(/Hint: NavigationTitle\n      Value: English/, 'Hint: NavigationTitle\n      Value: Digital Library');

fs.writeFileSync(portalFile, portal);
console.log('updated Home/Portal.yml as Discover');

// --- Remove old Digital Library tree ---
const oldDl = path.join(CONTENT, 'Home/Digital Library');
const oldDlYml = path.join(CONTENT, 'Home/Digital Library.yml');
if (fs.existsSync(oldDl)) {
  fs.rmSync(oldDl, { recursive: true, force: true });
  console.log('removed Home/Digital Library/');
}
if (fs.existsSync(oldDlYml)) {
  fs.unlinkSync(oldDlYml);
  console.log('removed Home/Digital Library.yml');
}

// --- Create collection pages with 10 books each ---
COLLECTIONS.forEach((name, ci) => {
  const slug = name.toLowerCase();
  const pageId = uuid();
  const bookIds = [];

  BOOK_TITLES[name].forEach((title, bi) => {
    const bid = uuid();
    bookIds.push(bid);
    write(
      `Home/Portal/${name}/${title}.yml`,
      yamlItem({
        id: bid,
        parent: pageId,
        template: bookTpl,
        itemPath: `${PORTAL_PATH}/${name}/${title}`,
        versionFields: [
          { id: BOOK_FIELD.CoverImage, hint: 'CoverImage', value: img(MEDIA[bi % MEDIA.length]) },
          { id: BOOK_FIELD.Title, hint: 'Title', value: title, raw: false },
          { id: BOOK_FIELD.Link, hint: 'Link', value: extLink(title, `/portal/${slug}`) },
        ],
      })
    );
  });

  write(
    `Home/Portal/${name}.yml`,
    yamlItem({
      id: pageId,
      parent: PORTAL_ID,
      template: collectionTpl,
      itemPath: `${PORTAL_PATH}/${name}`,
      shared: [
        {
          id: 'f1a1fe9e-a60c-4ddb-a3a0-bb5b29fe732e',
          hint: '__Renderings',
          value: collectionXml(bookIds),
          raw: true,
        },
      ],
      versionFields: [
        { id: 'f79f80ba-3870-41f5-9527-a12d54644f69', hint: 'Title', value: name, raw: false },
        { id: '4e0720e9-9d50-4ddc-87cf-ecd65e8e94c8', hint: 'NavigationTitle', value: name, raw: false },
        { id: collectionNavTitleId, hint: 'NavigationTitle', value: name, raw: false },
        { id: collectionImageId, hint: 'Image', value: img(MEDIA[ci % MEDIA.length]) },
      ],
    })
  );
});

console.log('DONE');
