import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '../..');
const MEDIA_DIR = path.join(
  REPO,
  'authoring/items/British Council/serialized-content/media-library/british-council/british-council/images'
);
const CONTENT = path.join(
  REPO,
  'authoring/items/British Council/serialized-content/british-council/british-council'
);
const ids = JSON.parse(fs.readFileSync(path.join(__dirname, 'generated-ids.json'), 'utf8'));
const IMAGES_PARENT = '88b15d38-82b0-443b-847c-4e93c77baf07';
const MEDIA_TEMPLATE = 'f1828a2c-7e5d-4bbd-98ca-320474871548';
const CREATED = '20260803T160000Z';
const BOOK_FIELD = {
  CoverImage: 'c7d49b5b-2d4b-4fae-a6d0-2c881037d540',
  Title: '290ad408-f96e-4f8c-85cc-8b28ca84ac0e',
  Link: '8ca190ea-9781-4f8e-bcfc-14ee20a86fa6',
};

const MISSING = [
  {
    collection: 'Newspapers',
    title: "All the President's Men",
    isbn: '9780671894412',
    author: 'Bernstein & Woodward',
  },
  {
    collection: 'Magazines',
    title: 'The Tipping Point',
    isbn: '0316346624',
    author: 'Malcolm Gladwell',
  },
  {
    collection: 'Movies',
    title: 'Directing: Film Techniques and Aesthetics',
    isbn: '9780240808826',
    author: 'Michael Rabiger',
  },
];

function uuid() {
  return crypto.randomUUID();
}
function slug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}
function download(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': 'BC-Demo/1.0' }, timeout: 30000 }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          download(res.headers.location).then(resolve, reject);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error('HTTP ' + res.statusCode));
          res.resume();
          return;
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks)));
      })
      .on('error', reject);
  });
}

function readSize(buf) {
  let width = 300,
    height = 450;
  try {
    if (buf[0] === 0xff && buf[1] === 0xd8) {
      let i = 2;
      while (i < buf.length) {
        if (buf[i] !== 0xff) break;
        const marker = buf[i + 1];
        const len = buf.readUInt16BE(i + 2);
        if (marker === 0xc0 || marker === 0xc2) {
          height = buf.readUInt16BE(i + 5);
          width = buf.readUInt16BE(i + 7);
          break;
        }
        i += 2 + len;
      }
    }
  } catch {}
  return { width, height };
}

async function saveMedia(name, url, alt) {
  const buf = await download(url);
  if (buf.length < 500) throw new Error('tiny ' + buf.length);
  const { width, height } = readSize(buf);
  const id = uuid();
  const blobId = uuid();
  const yml = `---
ID: "${id}"
Parent: "${IMAGES_PARENT}"
Template: "${MEDIA_TEMPLATE}"
Path: "/sitecore/media library/Project/british-council/british-council/images/${name}"
SharedFields:
- ID: "22eac599-f13b-4607-a89d-c091763a467d"
  Hint: Width
  Value: ${width}
- ID: "40e50ed9-ba07-4702-992e-a912738d32dc"
  Hint: Blob
  BlobID: "${blobId}"
  Value: ${buf.toString('base64')}
- ID: "6954b7c7-2487-423f-8600-436cb3b6dc0e"
  Hint: Size
  Value: ${buf.length}
- ID: "6f47a0a5-9c94-4b48-abeb-42d38def6054"
  Hint: Mime Type
  Value: image/jpeg
- ID: "c06867fe-9a43-4c7d-b739-48780492d06f"
  Hint: Extension
  Value: jpg
- ID: "cb09946f-3218-4823-87d2-d5007c199a96"
  Hint: Dimensions
  Value: ${width} x ${height}
- ID: "de2ca9e4-c117-4c8a-a139-1ff4b199d15a"
  Hint: Height
  Value: ${height}
Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
    - ID: "25bed78c-4957-4165-998a-ca1b52f67497"
      Hint: __Created
      Value: ${CREATED}
    - ID: "65885c44-8fcd-4a7f-94f1-ee63703fe193"
      Hint: Alt
      Value: ${JSON.stringify(alt)}
    - ID: "5dd74568-4d4b-44c1-b513-0af5f4cda34f"
      Hint: __Created by
      Value: |
        sitecore\\Admin
`;
  fs.writeFileSync(path.join(MEDIA_DIR, `${name}.yml`), yml);
  console.log('saved', name, buf.length);
  return id;
}

for (const m of MISSING) {
  const mediaId = await saveMedia(
    `dl-book-${slug(m.title)}-${m.isbn.slice(-4)}`,
    `https://covers.openlibrary.org/b/isbn/${m.isbn}-L.jpg`,
    `${m.title} by ${m.author}`
  );
  const pageFile = path.join(CONTENT, `Home/Portal/${m.collection}.yml`);
  const pageId = fs.readFileSync(pageFile, 'utf8').match(/^ID: "([^"]+)"/m)[1];
  const bid = uuid();
  const safe = m.title.replace(/[\\/:*?"<>|]/g, '');
  const bookYml = `---
ID: "${bid}"
Parent: "${pageId}"
Template: "${ids.bookTplId}"
Path: "/sitecore/content/british-council/british-council/Home/Portal/${m.collection}/${safe}"
Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
    - ID: "25bed78c-4957-4165-998a-ca1b52f67497"
      Hint: __Created
      Value: "${CREATED}"
    - ID: "5dd74568-4d4b-44c1-b513-0af5f4cda34f"
      Hint: __Created by
      Value: |
        sitecore\\Admin
    - ID: "${BOOK_FIELD.CoverImage}"
      Hint: CoverImage
      Value: |
        <image mediaid="${mediaId}" />
    - ID: "${BOOK_FIELD.Title}"
      Hint: Title
      Value: ${JSON.stringify(m.title)}
    - ID: "${BOOK_FIELD.Link}"
      Hint: Link
      Value: |
        <link text="${safe}" linktype="external" url="/portal/${m.collection.toLowerCase()}" anchor="" target="" />
`;
  fs.writeFileSync(path.join(CONTENT, `Home/Portal/${m.collection}/${safe}.yml`), bookYml);

  // Append a BookCard rendering if fewer than 10
  let page = fs.readFileSync(pageFile, 'utf8');
  const count = (page.match(/C81D5B00-A2BC-490F-9136-1F2FA5587EF5/g) || []).length;
  if (count < 10) {
    const insert = `        <r
          uid="{${uuid().toUpperCase()}}"
          p:before="*"
          s:ds="${bid}"
          s:id="{C81D5B00-A2BC-490F-9136-1F2FA5587EF5}"
          s:par="CSSStyles&amp;DynamicPlaceholderId=${40 + count}"
          s:ph="/headless-main/portal-main-1/collection-books-3" />
`;
    page = page.replace('      </d>\n    </r>', insert + '      </d>\n    </r>');
    fs.writeFileSync(pageFile, page);
  }
  console.log('added', m.collection, m.title, 'cards=', count + (count < 10 ? 1 : 0));
}

console.log('DONE');
