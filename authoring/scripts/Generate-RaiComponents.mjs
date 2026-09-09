#!/usr/bin/env node
/**
 * Generates Sitecore serialization YAML for RAI (rai-amsterdam) components.
 * Usage: node authoring/scripts/Generate-RaiComponents.mjs
 */
import { createHash } from 'node:crypto';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { readFileSync, readdirSync, statSync, unlinkSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', 'items', 'RAI', 'serialized-content');
const COLLECTION_FOLDER = join(__dirname, '..', 'items', 'RAI');
const PROJECT = 'rai';
const SITE_PATH = '/sitecore/content/rai/rai-amsterdam';
const SITE_REL = 'rai-amsterdam/rai-amsterdam';
const MODULE_NAMESPACE = 'rai-scs';
const OWNER = 'sitecore\\johan.becue@sitecore.com';
const NOW = '20260612T120000Z';

const PARENTS = {
  templates: 'a2bebe4b-faa4-4772-995c-00bd30b508e0',
  renderings: '13bbefd1-bda2-4673-af98-06e8b6172a1b',
  placeholders: '4f7fd0bf-31c3-41d5-84e4-70d9d20d2209',
  presentation: 'e532706f-0712-4068-84ac-70dc1707ec14',
  headlessVariantsRoot: '6e277d84-7582-47ff-affd-a5fe535639f5',
  branches: '6dd74a70-b7e0-4b76-99b9-8b9daf6ccf9d',
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
  navParamsBase: 'e6d98f24-d01c-419e-871a-4617125a49ed',
  navParamsExtended: '3db3eb10-f8d0-4cc9-be26-18ce7b139ec8',
  navContentsResolver: 'b28b1b20-953b-4bff-925a-9ae48ca00cdc',
  navLevelFrom: '1bb88840-5fb3-4353-ad8d-81136f6ff75a',
  navLevelTo: 'a59325bb-5a27-46f9-b8110-9d499715f3be',
};

const VARIANT_SORT = {
  Default: 100,
  Inversed: 200,
  ImageTop: 300,
  ImageBottom: 350,
  Animated: 400,
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
    variants: ['Default', 'Inversed', 'Animated'],
    defaults: {
      Message: 'We use cookies to improve your experience on our site.',
      AcceptLabel: 'Accept all cookies',
      PrivacyLink: '<link text="Privacy policy" linktype="external" url="https://www.rai.nl/en/privacy" />',
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
    placeholders: [
      { key: 'header-nav', allowed: ['Navigation'] },
      { key: 'header-utility', allowed: ['HeaderIconLink'] },
    ],
    variants: ['Default', 'Inversed', 'ImageTop', 'ImageBottom', 'Animated'],
    defaults: {
      LogoText: 'RAI Amsterdam',
      LogoLink: '<link linktype="external" url="https://www.rai.nl" />',
    },
  },
  {
    name: 'HeaderIconLink',
    dataFolder: 'HeaderIconLinks',
    group: 'Navigation',
    fields: [
      { name: 'Link', type: 'General Link' },
      { name: 'IconClass', type: 'Single-Line Text' },
      { name: 'DropdownLink1', type: 'General Link' },
      { name: 'DropdownLink2', type: 'General Link' },
    ],
    variants: ['Default', 'Animated'],
    defaults: {
      Link: '<link text="FAQ" linktype="external" url="https://www.rai.nl/en/faq" />',
      IconClass: 'fa-duotone fa-light fa-messages-question',
    },
  },
  {
    name: 'Navigation',
    dataFolder: 'Navigations',
    group: 'Navigation',
    siteNav: true,
    fields: [],
    variants: ['Default', 'Animated'],
  },
  {
    name: 'Footer',
    dataFolder: 'Footers',
    group: 'Page Structure',
    fields: [
      { name: 'EventsTitle', type: 'Single-Line Text' },
      { name: 'EventLink1', type: 'General Link' },
      { name: 'EventLink2', type: 'General Link' },
      { name: 'EventLink3', type: 'General Link' },
      { name: 'NewsletterTitle', type: 'Single-Line Text' },
      { name: 'NewsletterCta', type: 'General Link' },
      { name: 'ContactTitle', type: 'Single-Line Text' },
      { name: 'ContactBody', type: 'Multi-Line Text' },
      { name: 'ContactPhone', type: 'Single-Line Text' },
      { name: 'ContactLink', type: 'General Link' },
      { name: 'DirectionsLink', type: 'General Link' },
      { name: 'Logo', type: 'Image' },
      { name: 'PartnerLogo', type: 'Image' },
      { name: 'LegalLink1', type: 'General Link' },
      { name: 'LegalLink2', type: 'General Link' },
      { name: 'LegalLink3', type: 'General Link' },
      { name: 'SocialLink1', type: 'General Link' },
      { name: 'SocialLink2', type: 'General Link' },
      { name: 'SocialLink3', type: 'General Link' },
      { name: 'CopyrightYear', type: 'Single-Line Text' },
      { name: 'CopyrightText', type: 'Single-Line Text' },
    ],
    variants: ['Default', 'Inversed', 'ImageTop', 'ImageBottom', 'Animated'],
    defaults: {
      EventsTitle: 'Events at RAI Amsterdam',
      EventLink1: '<link text="Check out all events" linktype="external" url="https://www.rai.nl/en/calendar" />',
      EventLink2: '<link text="Organise your event" linktype="external" url="https://www.rai.nl/en/organising" />',
      EventLink3: '<link text="Become an exhibitor" linktype="external" url="https://www.rai.nl/en/exhibiting" />',
      NewsletterTitle: 'Subscribe for newsletter',
      NewsletterCta: '<link text="Subscribe" linktype="external" url="https://www.rai.nl/en/newsletter" />',
      ContactTitle: 'Contact us',
      ContactBody: `RAI Amsterdam
P.O. Box 77777, 1070 MS Amsterdam
Europaplein 24, 1078 GZ Amsterdam
The Netherlands`,
      ContactPhone: '+31 (0)20 549 12 12',
      ContactLink: '<link text="Contact" linktype="external" url="https://www.rai.nl/en/contact" />',
      DirectionsLink: '<link text="Get directions" linktype="external" url="https://www.rai.nl/en/route" />',
      LegalLink1: '<link text="Privacyverklaring" linktype="external" url="https://www.rai.nl/en/privacy-statement" />',
      LegalLink2: '<link text="Cookie settings" linktype="external" url="#" />',
      LegalLink3: '<link text="Terms of use" linktype="external" url="https://www.rai.nl/en/terms-of-use" />',
      SocialLink1: '<link text="LinkedIn" linktype="external" url="https://www.linkedin.com/company/raiamsterdam" />',
      SocialLink2: '<link text="Instagram" linktype="external" url="https://www.instagram.com/raiamsterdam/" />',
      SocialLink3: '<link text="Youtube" linktype="external" url="http://www.youtube.com/user/amsterdamrai" />',
      CopyrightYear: '2026',
      CopyrightText: 'Copyright',
    },
  },
  {
    name: 'LinkList',
    dataFolder: 'LinkLists',
    group: 'Navigation',
    fields: Array.from({ length: 6 }, (_, i) => ({ name: `Link${i + 1}`, type: 'General Link' })),
    variants: ['Default', 'Animated'],
    defaults: {
      Link1: '<link text="Events" linktype="external" url="https://www.rai.nl/en/events" />',
      Link2: '<link text="Venues" linktype="external" url="https://www.rai.nl/en/venues" />',
      Link3: '<link text="About RAI" linktype="external" url="https://www.rai.nl/en/about-rai" />',
      Link4: '<link text="Visit" linktype="external" url="https://www.rai.nl/en/visit" />',
      Link5: '<link text="Contact" linktype="external" url="https://www.rai.nl/en/contact" />',
      Link6: '<link text="Careers" linktype="external" url="https://www.rai.nl/en/careers" />',
    },
  },
  {
    name: 'Breadcrumb',
    dataFolder: 'Breadcrumbs',
    group: 'Navigation',
    fields: [{ name: 'Separator', type: 'Single-Line Text' }],
    variants: ['Default', 'Animated'],
    defaults: { Separator: '/' },
  },
  {
    name: 'FullBleedHeroBannerSection',
    dataFolder: 'FullBleedHeroBannerSections',
    group: 'Page Content',
    fields: [
      { name: 'BackgroundImage', type: 'Image' },
      { name: 'BrandImage', type: 'Image' },
      { name: 'Title', type: 'Single-Line Text' },
    ],
    variants: ['Default', 'Inversed', 'ImageTop', 'Animated'],
    defaults: {
      Title: 'RAI Amsterdam',
    },
  },
  {
    name: 'HomeHeroEventsSection',
    dataFolder: 'HomeHeroEventsSections',
    group: 'Page Content',
    fields: [
      { name: 'Title', type: 'Single-Line Text' },
      { name: 'AllEventsLink', type: 'General Link' },
    ],
    placeholders: [{ key: 'event-cards', allowed: ['EventListCard'] }],
    variants: ['Default', 'Inversed', 'Animated'],
    defaults: {
      Title: 'These events will be at RAI Amsterdam soon',
      AllEventsLink: '<link text="ALL EVENTS" linktype="external" url="https://www.rai.nl/en/calendar" />',
    },
  },
  {
    name: 'EventListCard',
    dataFolder: 'EventListCards',
    group: 'Page Content',
    fields: [
      { name: 'Title', type: 'Single-Line Text' },
      { name: 'DateRange', type: 'Single-Line Text' },
      { name: 'Image', type: 'Image' },
      { name: 'Link', type: 'General Link' },
    ],
    variants: ['Default', 'Inversed', 'ImageTop', 'ImageBottom', 'Animated'],
    defaults: {
      Title: 'Event title',
      DateRange: '1 – 3 June 2026',
      Link: '<link text="View event" linktype="external" url="/" />',
    },
  },
  {
    name: 'NewsArticlesSection',
    dataFolder: 'NewsArticlesSections',
    group: 'Page Content',
    fields: [{ name: 'Title', type: 'Single-Line Text' }],
    placeholders: [{ key: 'news-cards', allowed: ['NewsArticleCard'] }],
    variants: ['Default', 'Animated', 'Carousel'],
    defaults: { Title: 'Latest news' },
  },
  {
    name: 'NewsArticleCard',
    dataFolder: 'NewsArticleCards',
    group: 'Page Content',
    fields: [
      { name: 'Title', type: 'Single-Line Text' },
      { name: 'Date', type: 'Single-Line Text' },
      { name: 'Category', type: 'Single-Line Text' },
      { name: 'Image', type: 'Image' },
      { name: 'Link', type: 'General Link' },
    ],
    variants: ['Default', 'Inversed', 'ImageTop', 'ImageBottom', 'Animated'],
    defaults: {
      Title: 'News article title',
      Date: '12 June 2026',
      Category: 'News',
      Link: '<link text="Read more" linktype="external" url="/" />',
    },
  },
  {
    name: 'CalendarListingSection',
    dataFolder: 'CalendarListingSections',
    group: 'Page Content',
    fields: [{ name: 'Title', type: 'Single-Line Text' }],
    placeholders: [{ key: 'calendar-events', allowed: ['EventListCard'] }],
    variants: ['Default', 'Animated'],
    defaults: { Title: 'Event calendar' },
  },
  {
    name: 'EventDetailHeroSection',
    dataFolder: 'EventDetailHeroSections',
    group: 'Page Content',
    fields: [
      { name: 'Title', type: 'Single-Line Text' },
      { name: 'DateRange', type: 'Single-Line Text' },
      { name: 'Description', type: 'Rich Text' },
      { name: 'PrimaryCta', type: 'General Link' },
      { name: 'SecondaryCta', type: 'General Link' },
      { name: 'Image', type: 'Image' },
    ],
    variants: ['Default', 'Inversed', 'ImageTop', 'ImageBottom', 'Animated'],
    defaults: {
      Title: 'Event title',
      DateRange: '1 – 3 June 2026',
      Description: '<p>Event description goes here.</p>',
      PrimaryCta: '<link text="Register" linktype="external" url="/" />',
      SecondaryCta: '<link text="Add to calendar" linktype="external" url="/" />',
    },
  },
  {
    name: 'EventDetailInfoSection',
    dataFolder: 'EventDetailInfoSections',
    group: 'Page Content',
    fields: [
      { name: 'OpeningHoursTitle', type: 'Single-Line Text' },
      { name: 'OpeningHours', type: 'Rich Text' },
      { name: 'LocationTitle', type: 'Single-Line Text' },
      { name: 'Location', type: 'Rich Text' },
      { name: 'TicketTitle', type: 'Single-Line Text' },
      { name: 'TicketInfo', type: 'Rich Text' },
      { name: 'OrganisationName', type: 'Single-Line Text' },
      { name: 'OrganisationLink', type: 'General Link' },
    ],
    variants: ['Default', 'Inversed', 'Animated'],
    defaults: {
      OpeningHoursTitle: 'Opening hours',
      OpeningHours: '<p>Monday – Friday: 09:00 – 18:00</p>',
      LocationTitle: 'Location',
      Location: '<p>Entrance K</p>',
      TicketTitle: 'Ticket info',
      TicketInfo: '<p>2795</p>',
      OrganisationName: 'HLTH 2026',
      OrganisationLink: '<link text="HLTH 2026" linktype="external" url="https://hlth.com/events/europe/" />',
    },
  },
];

function stableGuid(seed) {
  const hash = createHash('md5').update(`rai-${seed}`, 'utf8').digest();
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
        f.type === 'Multi-Line Text' || f.type === 'Rich Text'
          ? `      Value: |\n${val
              .split('\n')
              .map((line) => `        ${line}`)
              .join('\n')}`
          : `      Value: ${val}`;
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

  const paramsBaseBlock = comp.siteNav
    ? `  Value: |
    ${guidUpper(TPL.renderingParamsBase)}
    ${guidUpper(TPL.navParamsBase)}
    ${guidUpper(TPL.standardValues)}
    ${guidUpper(TPL.navParamsExtended)}`
    : `  Value: "${guidUpper(TPL.renderingParamsBase)}"`;

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
${paramsBaseBlock}
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

  const paramsStdFields = comp.siteNav
    ? `- ID: "b20124b2-820e-4f89-a310-a260656f1a55"
  Hint: LevelFrom
  Value: "${guidUpper(TPL.navLevelFrom)}"
- ID: "d3ae28e6-b489-4ab9-8c28-5b2bd0161228"
  Hint: LevelTo
  Value: "${guidUpper(TPL.navLevelTo)}"
`
    : '';

  files.push(
    await writeYaml(
      `templates/${PROJECT}/${comp.name}/${comp.name} Rendering Parameters/__Standard Values.yml`,
      `---
ID: "${ids.paramsStdId}"
Parent: "${ids.paramsId}"
Template: "${ids.paramsId}"
Path: "${base}/${comp.name} Rendering Parameters/__Standard Values"
SharedFields:
${paramsStdFields}Languages:
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

  const datasourceBlock = comp.siteNav
    ? ''
    : `- ID: "1a7c85e5-dc0b-490d-9187-bb1dbcb4c72f"
  Hint: Datasource Template
  Value: "${guidUpper(ids.templateId)}"
- ID: "b5b27af1-25ef-405c-87ce-369b3a004016"
  Hint: Datasource Location
  Value: "${dsQuery}"
`;
  const resolverBlock = comp.siteNav
    ? `- ID: "b0b15510-b138-470e-8f33-8da2e228aafe"
  Hint: Rendering Contents Resolver
  Value: "${guidUpper(TPL.navContentsResolver)}"
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
${placeholderField}${resolverBlock}- ID: "a77e8568-1ab3-44f1-a664-b7c37ec7810d"
  Hint: Parameters Template
  Value: "${guidUpper(ids.paramsId)}"
${datasourceBlock}Languages:
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
  let dataParentId = 'e6359cf8-0989-424c-b5c4-802e21e0beca';
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

  const idsPath = join(__dirname, 'rai-component-ids.json');
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
