/**
 * Wire BC mediaids onto datasources and create missing leaf content items.
 * Run: node design-screenshots/british-council/_wire-media-and-items.mjs
 */
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

const repo = 'c:/Projects/SE12/SE12-JBE-DM';
const dataRoot = path.join(
  repo,
  'authoring/items/British Council/serialized-content/british-council/british-council/Data'
);
const templatesRoot = path.join(
  repo,
  'authoring/items/British Council/serialized-content/templates/british-council'
);
const map = JSON.parse(
  fs
    .readFileSync(path.join(repo, 'design-screenshots/british-council/media-id-map.json'), 'utf8')
    .replace(/^\uFEFF/, '')
);

const mid = (k) => map[k];
const img = (id) => `<image mediaid="${id}" />`;

function write(file, contents) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, contents.replace(/\n/g, '\r\n'), 'utf8');
}

function upsertImageField(file, fieldId, hint, mediaId) {
  let text = fs.readFileSync(file, 'utf8');
  const block = `    - ID: "${fieldId}"
      Hint: ${hint}
      Value: |
        ${img(mediaId)}`;
  const hintRe = new RegExp(
    `    - ID: "${fieldId}"[\\s\\S]*?Hint: ${hint}[\\s\\S]*?Value: \\|[\\s\\S]*?(?=\\n    - ID:|\\nLanguages:|$)`
  );
  if (text.includes(`ID: "${fieldId}"`)) {
    text = text.replace(
      new RegExp(
        `(    - ID: "${fieldId}"\\r?\\n      Hint: ${hint}\\r?\\n      Value: \\|\\r?\\n)[^\\n]*`
      ),
      `$1        ${img(mediaId)}`
    );
  } else {
    // insert before end of version fields (after last field block)
    const marker = '      Hint: __Created by';
    const idx = text.lastIndexOf(marker);
    if (idx === -1) throw new Error(`No insert point in ${file}`);
    // find end of that field value block
    const after = text.indexOf('\n    - ID:', idx + 1);
    const insertAt = after === -1 ? text.length : after;
    text = text.slice(0, insertAt) + '\n' + block + text.slice(insertAt);
  }
  fs.writeFileSync(file, text, 'utf8');
  console.log('wired', path.basename(file), hint, mediaId);
}

function leafYml({ id, parent, template, itemPath, fields }) {
  const fieldYaml = fields
    .map(
      (f) => `    - ID: "${f.id}"
      Hint: ${f.hint}
      Value: ${f.multiline ? '|\n        ' + f.value : JSON.stringify(f.value)}`
    )
    .join('\n');
  return `---
ID: "${id}"
Parent: "${parent}"
Template: "${template}"
Path: "${itemPath}"
Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
    - ID: "25bed78c-4957-4165-998a-ca1b52f67497"
      Hint: __Created
      Value: 20260730T120000Z
    - ID: "5dd74568-4d4b-44c1-b513-0af5f4cda34f"
      Hint: __Created by
      Value: |
        sitecore\\Admin
${fieldYaml}
`;
}

function fieldDefYml({ id, parent, name, type, sort }) {
  return `---
ID: "${id}"
Parent: "${parent}"
Template: "455a3e98-a627-4b40-8035-e683a0331ac7"
Path: "/sitecore/templates/Project/british-council/FeaturedContentSection Templates/FeaturedContentSection/Data/${name}"
SharedFields:
- ID: "ab162cc0-dc80-4abf-8871-998ee5d7ba32"
  Hint: Type
  Value: "${type}"
- ID: "ba3f86a2-4a1c-4d78-b63d-91c2779c1b5e"
  Hint: __Sortorder
  Value: ${sort}
Languages:
- Language: en
  Fields:
  - ID: "19a69332-a23e-4e70-8d16-b2640cb24cc8"
    Hint: Title
    Value: ${name}
  Versions:
  - Version: 1
    Fields:
    - ID: "25bed78c-4957-4165-998a-ca1b52f67497"
      Hint: __Created
      Value: 20260730T120000Z
    - ID: "5dd74568-4d4b-44c1-b513-0af5f4cda34f"
      Hint: __Created by
      Value: |
        sitecore\\Admin
`;
}

// --- FeaturedContentSection missing template fields ---
const fcsDataParent = 'b82720c4-02e8-4b89-bd91-5e10fce0c76e';
const fcsFields = {
  ExploreLink: { id: randomUUID(), type: 'General Link', sort: 300 },
  FeaturedEyebrow: { id: randomUUID(), type: 'Single-Line Text', sort: 400 },
  FeaturedTitle: { id: randomUUID(), type: 'Single-Line Text', sort: 500 },
  FeaturedBody: { id: randomUUID(), type: 'Multi-Line Text', sort: 600 },
  FeaturedLink: { id: randomUUID(), type: 'General Link', sort: 700 },
  FeaturedImage: { id: randomUUID(), type: 'Image', sort: 800 },
};
const fcsDir = path.join(
  templatesRoot,
  'FeaturedContentSection Templates/FeaturedContentSection/Data'
);
for (const [name, meta] of Object.entries(fcsFields)) {
  write(path.join(fcsDir, `${name}.yml`), fieldDefYml({ id: meta.id, parent: fcsDataParent, name, type: meta.type, sort: meta.sort }));
}
fs.writeFileSync(
  path.join(repo, 'design-screenshots/british-council/fcs-field-ids.json'),
  JSON.stringify(fcsFields, null, 2)
);

// --- Wire images on existing datasources ---
upsertImageField(path.join(dataRoot, 'Headers/Site Header.yml'), 'bf844626-515f-46d6-94d9-405c5b784a5d', 'Logo', mid('logo'));
upsertImageField(path.join(dataRoot, 'HeroBanners/Home Hero.yml'), 'cf4af20a-9a49-4b1d-865a-4aafd4872ec4', 'Image', mid('hero'));
upsertImageField(path.join(dataRoot, 'ImageTextBlocks/Learn Online Intro.yml'), 'c2d03cd7-ee38-4708-89ae-fe30c280d762', 'Image', mid('learn-online'));
upsertImageField(path.join(dataRoot, 'VerticalTeaserCards/Voices Card 1.yml'), '106dd7cc-06ac-4aa2-89c9-801aeec66255', 'Image', mid('voices1'));
upsertImageField(path.join(dataRoot, 'VerticalTeaserCards/Research Report 1.yml'), '106dd7cc-06ac-4aa2-89c9-801aeec66255', 'Image', mid('teaser1'));
upsertImageField(path.join(dataRoot, 'PromoTeaserCards/Corporate Training Promo.yml'), 'fc8a3719-efd9-4b69-86e2-e2f2ab4853c0', 'Image', mid('promo1'));
upsertImageField(path.join(dataRoot, 'PromoTeaserCards/EnglishScore Promo.yml'), 'fc8a3719-efd9-4b69-86e2-e2f2ab4853c0', 'Image', mid('promo2'));
upsertImageField(path.join(dataRoot, 'PromoTeaserCards/Teachers Promo.yml'), 'fc8a3719-efd9-4b69-86e2-e2f2ab4853c0', 'Image', mid('promo3'));
upsertImageField(path.join(dataRoot, 'PromoTeaserCards/Learners Promo.yml'), 'fc8a3719-efd9-4b69-86e2-e2f2ab4853c0', 'Image', mid('promo4'));

// Featured section content + image
{
  const file = path.join(dataRoot, 'FeaturedContentSections/Research and Insight.yml');
  let text = fs.readFileSync(file, 'utf8');
  const extra = `
    - ID: "${fcsFields.ExploreLink.id}"
      Hint: ExploreLink
      Value: |
        <link text="Explore" linktype="external" url="/" anchor="" target="" />
    - ID: "${fcsFields.FeaturedEyebrow.id}"
      Hint: FeaturedEyebrow
      Value: "Podcast episode"
    - ID: "${fcsFields.FeaturedTitle.id}"
      Hint: FeaturedTitle
      Value: "English Online: Learning in a changing world"
    - ID: "${fcsFields.FeaturedBody.id}"
      Hint: FeaturedBody
      Value: "Listen to our latest research podcast."
    - ID: "${fcsFields.FeaturedLink.id}"
      Hint: FeaturedLink
      Value: |
        <link text="Listen now" linktype="external" url="/" anchor="" target="" />
    - ID: "${fcsFields.FeaturedImage.id}"
      Hint: FeaturedImage
      Value: |
        ${img(mid('featured'))}`;
  if (!text.includes('Hint: FeaturedImage')) {
    text = text.replace(
      /(Hint: Intro\r?\n      Value: ""\r?\n)/,
      `$1${extra}\n`
    );
    fs.writeFileSync(file, text, 'utf8');
    console.log('wired FeaturedContentSection fields');
  }
}

// --- Create missing VerticalTeaserCards ---
const teaserParent = 'de8c9bbb-e3f6-451a-b5d6-2b5b5b0f3f98';
const teaserTpl = 'd76b94f4-229b-4ef0-95e2-35547ec86c6f';
const newTeasers = [
  { file: 'Research Report 2.yml', title: 'Language for Resilience', eyebrow: 'Research report', media: 'teaser2', id: 'a11e1002-0002-4002-8002-000000000001' },
  { file: 'Research Report 3.yml', title: 'Culture and soft power', eyebrow: 'Research report', media: 'teaser3', id: 'a11e1002-0002-4002-8002-000000000002' },
  { file: 'Voices Card 2.yml', title: 'How English shapes opportunity', eyebrow: 'Voices Magazine', media: 'voices2', id: 'a11e1002-0002-4002-8002-000000000003' },
  { file: 'Voices Card 3.yml', title: 'Arts education across borders', eyebrow: 'Voices Magazine', media: 'voices3', id: 'a11e1002-0002-4002-8002-000000000004' },
];
for (const t of newTeasers) {
  write(
    path.join(dataRoot, 'VerticalTeaserCards', t.file),
    leafYml({
      id: t.id,
      parent: teaserParent,
      template: teaserTpl,
      itemPath: `/sitecore/content/british-council/british-council/Data/VerticalTeaserCards/${t.file.replace(/\.yml$/, '')}`,
      fields: [
        { id: 'cab5e530-9b85-49ed-a83b-f5989c8f86aa', hint: 'Eyebrow', value: t.eyebrow },
        { id: 'ffeb24bd-9780-42ed-87bd-9291162e6d3f', hint: 'Title', value: t.title },
        { id: '8e43b7b8-41fe-4c59-9d96-1b90523c82d3', hint: 'Body', value: '' },
        { id: '106dd7cc-06ac-4aa2-89c9-801aeec66255', hint: 'Image', value: img(mid(t.media)), multiline: true },
        { id: '4674f4c1-9774-4cc5-9d67-8677a39e551c', hint: 'Link', value: '<link text="Read more" linktype="external" url="/" />', multiline: true },
      ],
    })
  );
}

// --- Missing HighlightLinkItems ---
const hlParent = 'd11a069a-8410-48a5-9af4-05cfaa3f81ca';
const hlTpl = 'aa1eec4c-67e5-4066-8f7c-3fe5f9c72f50';
const highlights = [
  { id: 'a11e1003-0003-4003-8003-000000000001', name: 'Study UK', title: 'Study UK', body: 'Find courses and scholarships.' },
  { id: 'a11e1003-0003-4003-8003-000000000002', name: 'Arts and culture', title: 'Arts and culture', body: 'Explore creative programmes worldwide.' },
];
for (const h of highlights) {
  write(
    path.join(dataRoot, 'HighlightLinkItems', `${h.name}.yml`),
    leafYml({
      id: h.id,
      parent: hlParent,
      template: hlTpl,
      itemPath: `/sitecore/content/british-council/british-council/Data/HighlightLinkItems/${h.name}`,
      fields: [
        { id: 'ea05e2dc-09d8-4fbb-a4b9-4027dc820c4d', hint: 'Title', value: h.title },
        { id: '96ce6470-943f-4fa7-beec-6a273881ddcc', hint: 'Body', value: h.body },
        { id: 'ab60f2c8-6793-4c70-8896-cdc34b4588b6', hint: 'Link', value: `<link text="${h.title}" linktype="external" url="/" />`, multiline: true },
      ],
    })
  );
}

// --- Missing ColorLinkCards ---
const colorParent = '56906560-2731-4e1d-8591-fea44e83edbb';
const colorTpl = 'b0a73e98-b130-4e8d-9fd8-c3db50cd09bb';
const colors = [
  { id: 'a11e1004-0004-4004-8004-000000000001', name: 'Take an exam', title: 'Take an exam', color: '#861a5e' },
  { id: 'a11e1004-0004-4004-8004-000000000002', name: 'Study in the UK', title: 'Study in the UK', color: '#e87722' },
  { id: 'a11e1004-0004-4004-8004-000000000003', name: 'Arts', title: 'Arts', color: '#9b2d70' },
  { id: 'a11e1004-0004-4004-8004-000000000004', name: 'Education', title: 'Education', color: '#005eb8' },
  { id: 'a11e1004-0004-4004-8004-000000000005', name: 'Society', title: 'Society', color: '#1d4289' },
  { id: 'a11e1004-0004-4004-8004-000000000006', name: 'EnglishScore', title: 'EnglishScore', color: '#00a9e0' },
];
for (const c of colors) {
  write(
    path.join(dataRoot, 'ColorLinkCards', `${c.name}.yml`),
    leafYml({
      id: c.id,
      parent: colorParent,
      template: colorTpl,
      itemPath: `/sitecore/content/british-council/british-council/Data/ColorLinkCards/${c.name}`,
      fields: [
        { id: 'dd584ffa-40f2-4fde-af40-52aaeb0c2416', hint: 'Title', value: c.title },
        { id: '55c345a8-9205-4b04-b90b-c4392fa5eaaa', hint: 'Link', value: `<link text="${c.title}" linktype="external" url="/" />`, multiline: true },
        { id: 'c5b52410-48a1-4e55-9885-075ead8e9181', hint: 'BackgroundColor', value: c.color },
      ],
    })
  );
}

// --- Missing CourseLinkCards ---
const courseParent = 'c49f9f26-f493-4476-9bd1-8eeadb033a87';
const courseTpl = fs
  .readdirSync(path.join(dataRoot, 'CourseLinkCards'))
  .filter((f) => f.endsWith('.yml'))
  .map((f) => fs.readFileSync(path.join(dataRoot, 'CourseLinkCards', f), 'utf8'))[0]
  .match(/Template: "([^"]+)"/)[1];
const courseTitleId = '7c2f8b0e-1a2b-4c3d-9e0f-111111111101'; // may need real IDs from template
// read Adult Course 1 for real field IDs
const adult1 = fs.readFileSync(path.join(dataRoot, 'CourseLinkCards/Adult Course 1.yml'), 'utf8');
const courseField = (hint) => {
  const m = adult1.match(new RegExp(`ID: "([^"]+)"\\r?\\n      Hint: ${hint}`));
  if (!m) throw new Error(`Course field ${hint} not found`);
  return m[1];
};
const courses = [
  { id: 'a11e1005-0005-4005-8005-000000000001', name: 'Adult Course 2', title: 'English for work', body: 'Build workplace communication skills.' },
  { id: 'a11e1005-0005-4005-8005-000000000002', name: 'Kids Course 1', title: 'English for kids', body: 'Fun lessons for young learners.' },
  { id: 'a11e1005-0005-4005-8005-000000000003', name: 'Kids Course 2', title: 'English for teens', body: 'Courses designed for teenagers.' },
  { id: 'a11e1005-0005-4005-8005-000000000004', name: 'Self Study 1', title: 'LearnEnglish website', body: 'Free resources for self-study.' },
  { id: 'a11e1005-0005-4005-8005-000000000005', name: 'Self Study 2', title: 'EnglishScore', body: 'Test your level on your phone.' },
];
for (const c of courses) {
  write(
    path.join(dataRoot, 'CourseLinkCards', `${c.name}.yml`),
    leafYml({
      id: c.id,
      parent: courseParent,
      template: courseTpl,
      itemPath: `/sitecore/content/british-council/british-council/Data/CourseLinkCards/${c.name}`,
      fields: [
        { id: courseField('Title'), hint: 'Title', value: c.title },
        { id: courseField('Body'), hint: 'Body', value: c.body },
        { id: courseField('Link'), hint: 'Link', value: `<link text="Find out more" linktype="external" url="/" />`, multiline: true },
      ],
    })
  );
}

// --- Missing NavItems ---
const navParent = fs.readFileSync(path.join(dataRoot, 'NavItems/Learn English.yml'), 'utf8').match(/Parent: "([^"]+)"/)[1];
const navTpl = fs.readFileSync(path.join(dataRoot, 'NavItems/Learn English.yml'), 'utf8').match(/Template: "([^"]+)"/)[1];
const navLinkId = fs.readFileSync(path.join(dataRoot, 'NavItems/Learn English.yml'), 'utf8').match(/ID: "([^"]+)"\r?\n      Hint: Link/)[1];
const navActiveId = fs.readFileSync(path.join(dataRoot, 'NavItems/Learn English.yml'), 'utf8').match(/ID: "([^"]+)"\r?\n      Hint: IsActive/)[1];
const navs = [
  { id: 'a11e1006-0006-4006-8006-000000000001', name: 'Arts', text: 'Arts', url: '/arts' },
  { id: 'a11e1006-0006-4006-8006-000000000002', name: 'Education', text: 'Education', url: '/education' },
  { id: 'a11e1006-0006-4006-8006-000000000003', name: 'Society', text: 'Society', url: '/society' },
];
for (const n of navs) {
  write(
    path.join(dataRoot, 'NavItems', `${n.name}.yml`),
    leafYml({
      id: n.id,
      parent: navParent,
      template: navTpl,
      itemPath: `/sitecore/content/british-council/british-council/Data/NavItems/${n.name}`,
      fields: [
        { id: navLinkId, hint: 'Link', value: `<link text="${n.text}" linktype="external" url="${n.url}" />`, multiline: true },
        { id: navActiveId, hint: 'IsActive', value: '' },
      ],
    })
  );
}

// --- Missing FooterLinkItems ---
const flParent = fs.readFileSync(path.join(dataRoot, 'FooterLinkItems/Our organisation.yml'), 'utf8').match(/Parent: "([^"]+)"/)[1];
const flTpl = fs.readFileSync(path.join(dataRoot, 'FooterLinkItems/Our organisation.yml'), 'utf8').match(/Template: "([^"]+)"/)[1];
const flLinkId = fs.readFileSync(path.join(dataRoot, 'FooterLinkItems/Our organisation.yml'), 'utf8').match(/ID: "([^"]+)"\r?\n      Hint: Link/)[1];
const footerLinks = [
  { id: 'a11e1007-0007-4007-8007-000000000001', name: 'Our history', text: 'Our history' },
  { id: 'a11e1007-0007-4007-8007-000000000002', name: 'Jobs', text: 'Jobs' },
  { id: 'a11e1007-0007-4007-8007-000000000003', name: 'Privacy policy', text: 'Privacy and cookies' },
  { id: 'a11e1007-0007-4007-8007-000000000004', name: 'Terms of use', text: 'Terms of use' },
];
for (const f of footerLinks) {
  write(
    path.join(dataRoot, 'FooterLinkItems', `${f.name}.yml`),
    leafYml({
      id: f.id,
      parent: flParent,
      template: flTpl,
      itemPath: `/sitecore/content/british-council/british-council/Data/FooterLinkItems/${f.name}`,
      fields: [
        { id: flLinkId, hint: 'Link', value: `<link text="${f.text}" linktype="external" url="/" />`, multiline: true },
      ],
    })
  );
}

// --- Missing SocialLinkItems (text links; icons optional) ---
const socParent = fs.readFileSync(path.join(dataRoot, 'SocialLinkItems/Facebook.yml'), 'utf8').match(/Parent: "([^"]+)"/)[1];
const socTpl = fs.readFileSync(path.join(dataRoot, 'SocialLinkItems/Facebook.yml'), 'utf8').match(/Template: "([^"]+)"/)[1];
const socLinkId = fs.readFileSync(path.join(dataRoot, 'SocialLinkItems/Facebook.yml'), 'utf8').match(/ID: "([^"]+)"\r?\n      Hint: Link/)[1];
const socials = [
  { id: 'a11e1008-0008-4008-8008-000000000001', name: 'Twitter', text: 'Twitter', url: 'https://twitter.com/britishcouncil' },
  { id: 'a11e1008-0008-4008-8008-000000000002', name: 'YouTube', text: 'YouTube', url: 'https://www.youtube.com/user/britishcouncil' },
  { id: 'a11e1008-0008-4008-8008-000000000003', name: 'Instagram', text: 'Instagram', url: 'https://www.instagram.com/britishcouncil' },
];
for (const s of socials) {
  write(
    path.join(dataRoot, 'SocialLinkItems', `${s.name}.yml`),
    leafYml({
      id: s.id,
      parent: socParent,
      template: socTpl,
      itemPath: `/sitecore/content/british-council/british-council/Data/SocialLinkItems/${s.name}`,
      fields: [
        { id: socLinkId, hint: 'Link', value: `<link text="${s.text}" linktype="external" url="${s.url}" />`, multiline: true },
      ],
    })
  );
}

console.log('Done wiring media + creating leaf items.');
