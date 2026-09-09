import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import https from 'https';
import http from 'http';
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

const IMAGES_PARENT = '88b15d38-82b0-443b-847c-4e93c77baf07';
const MEDIA_TEMPLATE = 'f1828a2c-7e5d-4bbd-98ca-320474871548';
const CREATED = '20260803T160000Z';

const BOOK_FIELD = {
  CoverImage: 'c7d49b5b-2d4b-4fae-a6d0-2c881037d540',
  Title: '290ad408-f96e-4f8c-85cc-8b28ca84ac0e',
  Link: '8ca190ea-9781-4f8e-bcfc-14ee20a86fa6',
};

const ids = JSON.parse(fs.readFileSync(path.join(__dirname, 'generated-ids.json'), 'utf8'));
const collectionImageId = ids.collectionImageId;
const collectionNavTitleId = ids.collectionNavTitleId;

// Real English-language books (ISBN → Open Library covers)
const BOOKS = {
  Newspapers: [
    { title: 'All the President\'s Men', isbn: '9781416291570', author: 'Bernstein & Woodward' },
    { title: 'Manufacturing Consent', isbn: '9780375714498', author: 'Herman & Chomsky' },
    { title: 'The Journalist and the Murderer', isbn: '9780679731832', author: 'Janet Malcolm' },
    { title: 'Homage to Catalonia', isbn: '9780156421171', author: 'George Orwell' },
    { title: 'In Cold Blood', isbn: '9780679745587', author: 'Truman Capote' },
    { title: 'The Soft City', isbn: '9781784700706', author: 'Jonathan Raban' },
    { title: 'Everybody Loves a Good Drought', isbn: '9780140259841', author: 'P. Sainath' },
    { title: 'Bad Blood', isbn: '9781524731656', author: 'John Carreyrou' },
    { title: 'Empire of Pain', isbn: '9780385545686', author: 'Patrick Radden Keefe' },
    { title: 'Say Nothing', isbn: '9780385521314', author: 'Patrick Radden Keefe' },
  ],
  Magazines: [
    { title: 'The Economist Style Guide', isbn: '9781861970466', author: 'The Economist' },
    { title: 'On Writing Well', isbn: '9780060891541', author: 'William Zinsser' },
    { title: 'Bird by Bird', isbn: '9780385480017', author: 'Anne Lamott' },
    { title: 'The Elements of Style', isbn: '9780205309023', author: 'Strunk & White' },
    { title: 'Thinking, Fast and Slow', isbn: '9780374533557', author: 'Daniel Kahneman' },
    { title: 'Sapiens', isbn: '9780062316097', author: 'Yuval Noah Harari' },
    { title: 'Factfulness', isbn: '9781250107817', author: 'Hans Rosling' },
    { title: 'The Tipping Point', isbn: '9780316346625', author: 'Malcolm Gladwell' },
    { title: 'Outliers', isbn: '9780316017930', author: 'Malcolm Gladwell' },
    { title: 'Freakonomics', isbn: '9780060731335', author: 'Levitt & Dubner' },
  ],
  Audiobooks: [
    { title: 'Becoming', isbn: '9781524763138', author: 'Michelle Obama' },
    { title: 'Educated', isbn: '9780399590504', author: 'Tara Westover' },
    { title: 'Born a Crime', isbn: '9780399588198', author: 'Trevor Noah' },
    { title: 'Atomic Habits', isbn: '9780735211292', author: 'James Clear' },
    { title: 'The Power of Habit', isbn: '9780812981605', author: 'Charles Duhigg' },
    { title: 'Quiet', isbn: '9780307352156', author: 'Susan Cain' },
    { title: 'Grit', isbn: '9781501111105', author: 'Angela Duckworth' },
    { title: 'Daring Greatly', isbn: '9781592408412', author: 'Brené Brown' },
    { title: 'The Subtle Art of Not Giving a F*ck', isbn: '9780062457714', author: 'Mark Manson' },
    { title: 'Maybe You Should Talk to Someone', isbn: '9781328662057', author: 'Lori Gottlieb' },
  ],
  Fiction: [
    { title: 'Pride and Prejudice', isbn: '9780141439518', author: 'Jane Austen' },
    { title: '1984', isbn: '9780451524935', author: 'George Orwell' },
    { title: 'To Kill a Mockingbird', isbn: '9780061120084', author: 'Harper Lee' },
    { title: 'The Great Gatsby', isbn: '9780743273565', author: 'F. Scott Fitzgerald' },
    { title: 'Jane Eyre', isbn: '9780141441146', author: 'Charlotte Brontë' },
    { title: 'Wuthering Heights', isbn: '9780141439556', author: 'Emily Brontë' },
    { title: 'Brave New World', isbn: '9780060850524', author: 'Aldous Huxley' },
    { title: 'Animal Farm', isbn: '9780451526342', author: 'George Orwell' },
    { title: 'Frankenstein', isbn: '9780486282114', author: 'Mary Shelley' },
    { title: 'Dracula', isbn: '9780486411095', author: 'Bram Stoker' },
  ],
  Comics: [
    { title: 'Watchmen', isbn: '9780930289232', author: 'Alan Moore' },
    { title: 'V for Vendetta', isbn: '9781401208417', author: 'Alan Moore' },
    { title: 'Maus I', isbn: '9780394747231', author: 'Art Spiegelman' },
    { title: 'Persepolis', isbn: '9780375714573', author: 'Marjane Satrapi' },
    { title: 'Sandman Vol. 1', isbn: '9781401225759', author: 'Neil Gaiman' },
    { title: 'Saga Vol. 1', isbn: '9781607066019', author: 'Vaughn & Staples' },
    { title: 'Bone: Out from Boneville', isbn: '9780439706407', author: 'Jeff Smith' },
    { title: 'Understanding Comics', isbn: '9780060976255', author: 'Scott McCloud' },
    { title: 'Blankets', isbn: '9781891830433', author: 'Craig Thompson' },
    { title: 'Fun Home', isbn: '9780618871711', author: 'Alison Bechdel' },
  ],
  Movies: [
    { title: 'Adventures in the Screen Trade', isbn: '9780446391177', author: 'William Goldman' },
    { title: 'Story', isbn: '9780060391683', author: 'Robert McKee' },
    { title: 'Save the Cat!', isbn: '9781932907001', author: 'Blake Snyder' },
    { title: 'Making Movies', isbn: '9780679756606', author: 'Sidney Lumet' },
    { title: 'Rebel Without a Crew', isbn: '9780571193783', author: 'Robert Rodriguez' },
    { title: 'In the Blink of an Eye', isbn: '9781879505629', author: 'Walter Murch' },
    { title: 'The Filmmaker\'s Handbook', isbn: '9780452297289', author: 'Ascher & Pincus' },
    { title: 'Directing: Film Techniques and Aesthetics', isbn: '9780240818450', author: 'Michael Rabiger' },
    { title: 'The Visual Story', isbn: '9780240807799', author: 'Bruce Block' },
    { title: 'Cinematic Storytelling', isbn: '9781932907056', author: 'Jennifer Van Sijll' },
  ],
};

// Collection hero images (Unsplash — freely usable)
const COLLECTIONS = {
  Newspapers: {
    url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=900&q=80',
    alt: 'Stack of newspapers',
  },
  Magazines: {
    url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=80',
    alt: 'Open book and reading',
  },
  Audiobooks: {
    url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80',
    alt: 'Headphones for listening',
  },
  Fiction: {
    url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80',
    alt: 'Stack of fiction books',
  },
  Comics: {
    url: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&w=900&q=80',
    alt: 'Comic books and graphic novels',
  },
  Movies: {
    url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80',
    alt: 'Cinema seats and screen',
  },
};

function uuid() {
  return crypto.randomUUID();
}

function download(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(
      url,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; BC-Demo/1.0)',
          Accept: 'image/*,*/*',
        },
        timeout: 30000,
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          download(res.headers.location).then(resolve, reject);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          res.resume();
          return;
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks)));
      }
    );
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('timeout ' + url));
    });
  });
}

function slug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

function mediaYaml({ id, name, itemPath, blobId, b64, mime, ext, width, height, size, alt }) {
  return `---
ID: "${id}"
Parent: "${IMAGES_PARENT}"
Template: "${MEDIA_TEMPLATE}"
Path: "${itemPath}"
SharedFields:
- ID: "22eac599-f13b-4607-a89d-c091763a467d"
  Hint: Width
  Value: ${width}
- ID: "40e50ed9-ba07-4702-992e-a912738d32dc"
  Hint: Blob
  BlobID: "${blobId}"
  Value: ${b64}
- ID: "6954b7c7-2487-423f-8600-436cb3b6dc0e"
  Hint: Size
  Value: ${size}
- ID: "6f47a0a5-9c94-4b48-abeb-42d38def6054"
  Hint: Mime Type
  Value: ${mime}
- ID: "c06867fe-9a43-4c7d-b739-48780492d06f"
  Hint: Extension
  Value: ${ext}
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
}

function readJpegSize(buf) {
  // Soft defaults if parse fails
  let width = 300;
  let height = 450;
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
    } else if (buf[0] === 0x89 && buf[1] === 0x50) {
      width = buf.readUInt32BE(16);
      height = buf.readUInt32BE(20);
    }
  } catch {
    /* keep defaults */
  }
  return { width, height };
}

async function saveMedia(fileBase, url, alt) {
  const buf = await download(url);
  if (buf.length < 500) throw new Error(`Tiny response for ${url} (${buf.length}b)`);
  const isPng = buf[0] === 0x89;
  const mime = isPng ? 'image/png' : 'image/jpeg';
  const ext = isPng ? 'png' : 'jpg';
  const { width, height } = readJpegSize(buf);
  const id = uuid();
  const blobId = uuid();
  const name = fileBase;
  const itemPath = `/sitecore/media library/Project/british-council/british-council/images/${name}`;
  const yml = mediaYaml({
    id,
    name,
    itemPath,
    blobId,
    b64: buf.toString('base64'),
    mime,
    ext,
    width,
    height,
    size: buf.length,
    alt,
  });
  const out = path.join(MEDIA_DIR, `${name}.yml`);
  fs.writeFileSync(out, yml);
  console.log(`media ${name} (${Math.round(buf.length / 1024)}KB)`);
  return id;
}

function updateBookItem(file, mediaId, title) {
  let t = fs.readFileSync(file, 'utf8');
  // CoverImage
  t = t.replace(
    /Hint: CoverImage\n      Value: \|\n\s*<image mediaid="[^"]*" \/>/,
    `Hint: CoverImage\n      Value: |\n        <image mediaid="${mediaId}" />`
  );
  // Title
  t = t.replace(/Hint: Title\n      Value: "[^"]*"/, `Hint: Title\n      Value: ${JSON.stringify(title)}`);
  // Link text
  t = t.replace(
    /Hint: Link\n      Value: \|\n\s*<link text="[^"]*"/,
    `Hint: Link\n      Value: |\n        <link text="${title.replace(/"/g, '')}"`
  );
  fs.writeFileSync(file, t);
}

function updateCollectionPageImage(file, mediaId) {
  let t = fs.readFileSync(file, 'utf8');
  t = t.replace(
    new RegExp(`ID: "${collectionImageId}"\\n      Hint: Image\\n      Value: \\|\\n\\s*<image mediaid="[^"]*" />`),
    `ID: "${collectionImageId}"\n      Hint: Image\n      Value: |\n        <image mediaid="${mediaId}" />`
  );
  fs.writeFileSync(file, t);
}

function updateCollectionCard(file, mediaId, title) {
  let t = fs.readFileSync(file, 'utf8');
  t = t.replace(
    /Hint: Image\n      Value: \|\n\s*<image mediaid="[^"]*" \/>/,
    `Hint: Image\n      Value: |\n        <image mediaid="${mediaId}" />`
  );
  t = t.replace(/Hint: Title\n      Value: "[^"]*"/, `Hint: Title\n      Value: ${JSON.stringify(title)}`);
  fs.writeFileSync(file, t);
}

function updateBookCardDs(file, mediaId, title, url) {
  let t = fs.readFileSync(file, 'utf8');
  t = t.replace(
    /Hint: CoverImage\n      Value: \|\n\s*<image mediaid="[^"]*" \/>/,
    `Hint: CoverImage\n      Value: |\n        <image mediaid="${mediaId}" />`
  );
  t = t.replace(/Hint: Title\n      Value: "[^"]*"/, `Hint: Title\n      Value: ${JSON.stringify(title)}`);
  t = t.replace(
    /Hint: Link\n      Value: \|\n\s*<link text="[^"]*" linktype="external" url="[^"]*"/,
    `Hint: Link\n      Value: |\n        <link text="${title.replace(/"/g, '')}" linktype="external" url="${url}"`
  );
  fs.writeFileSync(file, t);
}

async function main() {
  const collectionMedia = {};
  for (const [name, meta] of Object.entries(COLLECTIONS)) {
    try {
      collectionMedia[name] = await saveMedia(`dl-collection-${slug(name)}`, meta.url, meta.alt);
    } catch (e) {
      console.warn('collection image failed', name, e.message);
    }
  }

  const bookMediaByKey = {}; // collection|index → mediaId
  for (const [collection, books] of Object.entries(BOOKS)) {
    for (let i = 0; i < books.length; i++) {
      const b = books[i];
      const url = `https://covers.openlibrary.org/b/isbn/${b.isbn}-L.jpg`;
      const key = `${collection}|${i}`;
      try {
        bookMediaByKey[key] = await saveMedia(
          `dl-book-${slug(b.title)}-${b.isbn.slice(-4)}`,
          url,
          `${b.title} by ${b.author}`
        );
      } catch (e) {
        console.warn('cover failed', b.title, e.message);
        // fallback M
        try {
          bookMediaByKey[key] = await saveMedia(
            `dl-book-${slug(b.title)}-${b.isbn.slice(-4)}`,
            `https://covers.openlibrary.org/b/isbn/${b.isbn}-M.jpg`,
            `${b.title} by ${b.author}`
          );
        } catch (e2) {
          console.warn('cover M failed', b.title, e2.message);
        }
      }
    }
  }

  // Rewrite collection book folders: delete old book yml, write new with correct parents from page files
  for (const [collection, books] of Object.entries(BOOKS)) {
    const pageFile = path.join(CONTENT, `Home/Portal/${collection}.yml`);
    if (!fs.existsSync(pageFile)) {
      console.warn('missing page', collection);
      continue;
    }
    const pageId = fs.readFileSync(pageFile, 'utf8').match(/^ID: "([^"]+)"/m)[1];
    const folder = path.join(CONTENT, `Home/Portal/${collection}`);
    if (fs.existsSync(folder)) fs.rmSync(folder, { recursive: true, force: true });
    fs.mkdirSync(folder, { recursive: true });

    const bookIds = [];
    books.forEach((b, i) => {
      const mediaId = bookMediaByKey[`${collection}|${i}`];
      if (!mediaId) return;
      const bid = uuid();
      bookIds.push(bid);
      const safeName = b.title.replace(/[\\/:*?"<>|]/g, '');
      const itemPath = `/sitecore/content/british-council/british-council/Home/Portal/${collection}/${safeName}`;
      const yml = `---
ID: "${bid}"
Parent: "${pageId}"
Template: "${ids.bookTplId}"
Path: "${itemPath}"
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
      Value: ${JSON.stringify(b.title)}
    - ID: "${BOOK_FIELD.Link}"
      Hint: Link
      Value: |
        <link text="${b.title.replace(/"/g, '')}" linktype="external" url="/portal/${collection.toLowerCase()}" anchor="" target="" />
`;
      fs.writeFileSync(path.join(folder, `${safeName}.yml`), yml);
    });

    // Update CollectionBookList BookCard ds refs in page renderings
    let page = fs.readFileSync(pageFile, 'utf8');
    // Replace each BookCard s:ds=... under collection-books in order
    const dsRegex = /s:ds="[a-f0-9-]{36}"\n(\s*)s:id="\{C81D5B00-A2BC-490F-9136-1F2FA5587EF5\}"/gi;
    let idx = 0;
    page = page.replace(dsRegex, () => {
      const ds = bookIds[idx++] || bookIds[0];
      return `s:ds="${ds}"\n          s:id="{C81D5B00-A2BC-490F-9136-1F2FA5587EF5}"`;
    });
    if (collectionMedia[collection]) {
      page = page.replace(
        new RegExp(
          `ID: "${collectionImageId}"\\r?\\n      Hint: Image\\r?\\n      Value: \\|\\r?\\n\\s*<image mediaid="[^"]*" />`
        ),
        `ID: "${collectionImageId}"\n      Hint: Image\n      Value: |\n        <image mediaid="${collectionMedia[collection]}" />`
      );
    }
    fs.writeFileSync(pageFile, page);
    console.log(`updated ${collection}: ${bookIds.length} books`);
  }

  // Collection cards
  for (const name of Object.keys(COLLECTIONS)) {
    const card = path.join(CONTENT, `Data/CollectionCards/${name} Card.yml`);
    if (fs.existsSync(card) && collectionMedia[name]) {
      updateCollectionCard(card, collectionMedia[name], name);
      console.log('card', name);
    }
  }

  // Monthly picks → 4 fiction classics
  const monthly = [
    { file: 'The Guardian Weekly.yml', book: BOOKS.Fiction[0], key: 'Fiction|0', url: '/portal/fiction' },
    { file: 'National Geographic.yml', book: BOOKS.Fiction[1], key: 'Fiction|1', url: '/portal/fiction' },
    { file: 'BBC History.yml', book: BOOKS.Fiction[2], key: 'Fiction|2', url: '/portal/fiction' },
    { file: 'Scientific American.yml', book: BOOKS.Fiction[3], key: 'Fiction|3', url: '/portal/fiction' },
  ];
  const bookCardsDir = path.join(CONTENT, 'Data/BookCards');
  for (const m of monthly) {
    const old = path.join(bookCardsDir, m.file);
    const mediaId = bookMediaByKey[m.key];
    if (!mediaId || !fs.existsSync(old)) continue;
    const newName = `${m.book.title.replace(/[\\/:*?"<>|]/g, '')}.yml`;
    updateBookCardDs(old, mediaId, m.book.title, m.url);
    const neu = path.join(bookCardsDir, newName);
    if (neu !== old) {
      fs.renameSync(old, neu);
      // keep same ID inside file - Path field update
      let t = fs.readFileSync(neu, 'utf8');
      t = t.replace(/Path: "[^"]*"/, `Path: "/sitecore/content/british-council/british-council/Data/BookCards/${m.book.title.replace(/[\\/:*?"<>|]/g, '')}"`);
      fs.writeFileSync(neu, t);
    }
    console.log('monthly', m.book.title);
  }

  // Persist map for debug
  fs.writeFileSync(
    path.join(__dirname, 'media-map.json'),
    JSON.stringify({ collectionMedia, bookMediaByKey, BOOKS }, null, 2)
  );
  console.log('DONE');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
