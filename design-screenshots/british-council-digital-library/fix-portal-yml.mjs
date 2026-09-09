import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT = path.resolve(
  __dirname,
  '../../authoring/items/British Council/serialized-content/british-council/british-council'
);
const ids = JSON.parse(fs.readFileSync(path.join(__dirname, 'generated-ids.json'), 'utf8'));
const R = ids.RENDERINGS;
const uuid = () => crypto.randomUUID();
const brace = (id) => `{${id.toUpperCase()}}`;
const DEVICE = '{FE5D7FDF-89C0-4D99-9AA3-B5FBD009C9F3}';

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
};
const COLLECTIONS = Object.keys(DS.cards);

function r(uid, ds, rid, ph, dynId) {
  const dsAttr = ds ? `\n          s:ds="${ds}"` : '';
  return `        <r
          uid="${brace(uid)}"
          p:before="*"${dsAttr}
          s:id="${brace(rid)}"
          s:par="CSSStyles&amp;DynamicPlaceholderId=${dynId}"
          s:ph="${ph}" />`;
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
DS.books.forEach((bid, i) =>
  lines.push(r(uuid(), bid, R.BookCard, '/headless-main/portal-main-1/monthly-pick-books-6', 30 + i))
);
lines.push(r(uuid(), DS.explore, R.ExploreSection, '/headless-main/portal-main-1', 7));
COLLECTIONS.forEach((c, i) =>
  lines.push(r(uuid(), DS.cards[c], R.CollectionCard, '/headless-main/portal-main-1/explore-collections-7', 40 + i))
);

const xml = `<r xmlns:p="p" xmlns:s="s" p:p="1">
  <d
    id="${DEVICE}">
${lines.join('\n')}
  </d>
</r>`;

const portalFile = path.join(CONTENT, 'Home/Portal.yml');
let portal = fs.readFileSync(portalFile, 'utf8');
const marker = '- ID: "f1a1fe9e-a60c-4ddb-a3a0-bb5b29fe732e"';
const start = portal.indexOf(marker);
const lang = portal.indexOf('\nLanguages:');
if (start < 0 || lang < 0) throw new Error('markers not found');
const indented = xml.split('\n').map((l) => `    ${l}`).join('\n');
const renderingsBlock = `${marker}
  Hint: __Renderings
  Value: |
${indented}
`;
portal = portal.slice(0, start) + renderingsBlock + portal.slice(lang);
portal = portal.replace(/Hint: Title\n      Value: English/, 'Hint: Title\n      Value: Discover');
portal = portal.replace(
  /Hint: NavigationTitle\n      Value: English/,
  'Hint: NavigationTitle\n      Value: Digital Library'
);
fs.writeFileSync(portalFile, portal);
console.log('ok PortalShell', portal.includes('D40394F5'));
console.log('ok Discover', /Hint: Title\n      Value: Discover/.test(portal));
