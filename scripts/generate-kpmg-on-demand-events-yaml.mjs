import { writeFileSync, mkdirSync } from 'fs';
import { randomUUID } from 'crypto';
import { join } from 'path';

const EVENTS_DIR = join(
  process.cwd(),
  'authoring/items/kpmg/kpmg/site/kpmgbeyond/Home/Events'
);
const PARENT_ID = '23e30bae-367c-48c4-87d6-ab86b55580d7';
const TEMPLATE_ID = '08185eef-cacb-44b4-81cb-231122a7b3b5';

const FIELDS = {
  CategoryLabel: '5ad8bac9-0735-40c4-b7eb-cc97b53ac9dc',
  Image: '5b6410ea-1c15-42da-9ee6-2cede6f972be',
  EventMonth: '89a5f0a6-05e6-4206-99ae-3dc22e4ccdb5',
  Time: 'a07c92d1-fc66-4639-8e07-74dd019527a6',
  Title: 'a91f3d80-4fa2-4bab-9f01-d40ab9cc6890',
  EventDay: 'e4946d4a-538c-4a84-bdfd-dc2626b93982',
  Summary: 'ad74afd6-ca80-4eb4-ad01-26ed711d6e7d',
  Link: 'abdf1a78-5a74-4c3f-bd07-982f87126c87',
  NavigationTitle: '4e0720e9-9d50-4ddc-87cf-ecd65e8e94c8',
  IsOnDemandEvent: 'e4113907-276a-49c5-85e8-119d7066aa7d',
  Location: 'f5113907-276a-49c5-85e8-119d7066aa7e',
  Duration: 'a6113907-276a-49c5-85e8-119d7066aa7f',
  DateDisplay: 'fa113907-276a-49c5-85e8-119d7066aa84',
  Body: 'b6113907-276a-49c5-85e8-119d7066aa80',
  JoinLink: 'd8113907-276a-49c5-85e8-119d7066aa82',
  CancelRegistrationLabel: 'f7113907-276a-49c5-85e8-119d7066aa87',
  RegisteredMessage: 'e9113907-276a-49c5-85e8-119d7066aa83',
  SpeakersBody: 'fc113907-276a-49c5-85e8-119d7066aa86',
};

const RENDERINGS = `<r xmlns:p="p" xmlns:s="s"
  p:p="1">
  <d
    id="{FE5D7FDF-89C0-4D99-9AA3-B5FBD009C9F3}">
    <r
      uid="{5C246E6D-9807-437E-9C4F-9A0A728D34A4}"
      p:before="*"
      s:id="{A3000001-0001-4000-8000-000000000001}"
      s:par="CSSStyles"
      s:ph="headless-main" />
    <r
      uid="{19DAFF86-D056-4612-8740-D12F540596B6}"
      p:after="r[@uid='{5C246E6D-9807-437E-9C4F-9A0A728D34A4}']"
      s:id="{A3000001-0002-4000-8000-000000000002}"
      s:par="CSSStyles"
      s:ph="headless-main" />
    <r
      uid="{D53DAA1F-CC90-4102-9724-E94548838505}"
      p:after="r[@uid='{19DAFF86-D056-4612-8740-D12F540596B6}']"
      s:id="{A3000001-0003-4000-8000-000000000003}"
      s:par="CSSStyles"
      s:ph="headless-main" />
    <r
      uid="{158FE13D-57D4-46A4-B9BE-88B46FCB3C90}"
      p:after="r[@uid='{D53DAA1F-CC90-4102-9724-E94548838505}']"
      s:id="{A3000001-0004-4000-8000-000000000004}"
      s:par="CSSStyles"
      s:ph="headless-main" />
    <r
      uid="{B4C3B682-DD58-46CC-B394-7A11A98B298C}"
      p:after="r[@uid='{158FE13D-57D4-46A4-B9BE-88B46FCB3C90}']"
      s:id="{A3000001-0005-4000-8000-000000000005}"
      s:par="CSSStyles"
      s:ph="headless-main" />
    <r
      uid="{C4D5E6F7-A8B9-4012-C456-789012345DEF}"
      p:after="*[1=2]"
      s:id="{A3000001-0006-4000-8000-000000000006}"
      s:par="CSSStyles"
      s:ph="headless-main" />
  </d>
</r>`;

function yamlQuote(value) {
  if (!value) return '""';
  const normalized = String(value).replace(/\r\n/g, '\n');
  if (!/[\n:"\\]/.test(normalized) && normalized.length < 120) {
    return `"${normalized.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  }
  return `|\n        ${normalized.split('\n').join('\n        ')}`;
}

function toBodyHtml(text) {
  const paragraphs = text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      if (p.startsWith('- ')) {
        const items = p
          .split('\n')
          .map((line) => line.replace(/^-\s*/, '').trim())
          .filter(Boolean)
          .map((line) => `<li>${escapeHtml(line)}</li>`)
          .join('');
        return `<ul>${items}</ul>`;
      }
      return `<p>${escapeHtml(p).replace(/\n/g, '<br />')}</p>`;
    });
  return paragraphs.join('\n');
}

function toSpeakersHtml(speakers) {
  if (!speakers?.length) return '';
  const items = speakers
    .map((s) => `<li><strong>${escapeHtml(s.name)}</strong> — ${escapeHtml(s.title)}</li>`)
    .join('');
  return `<ul>${items}</ul>`;
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildYaml(event) {
  const revision = randomUUID();
  const bodyHtml = toBodyHtml(event.about || event.summary);
  const speakersHtml = toSpeakersHtml(event.speakers);
  const imageAlt = escapeHtml(event.title).replace(/"/g, '');

  return `---
ID: "${event.id}"
Parent: "${PARENT_ID}"
Template: "${TEMPLATE_ID}"
Path: "/sitecore/content/kpmg/kpmgbeyond/Home/Events/${event.itemName}"
SharedFields:
- ID: "f1a1fe9e-a60c-4ddb-a3a0-bb5b29fe732e"
  Hint: __Renderings
  Value: |
    ${RENDERINGS.split('\n').join('\n    ')}
Languages:
- Language: en
  Versions:
  - Version: 1
    Fields:
    - ID: "001dd393-96c5-490b-924a-b0f25cd9efd8"
      Hint: __Lock
      Value: <r />
    - ID: "25bed78c-4957-4165-998a-ca1b52f67497"
      Hint: __Created
      Value: 20260606T120000Z
    - ID: "52807595-0f8f-4b20-8d2a-cb71d28c6103"
      Hint: __Owner
      Value: |
        sitecore\\johan.becue@sitecore.com
    - ID: "5dd74568-4d4b-44c1-b513-0af5f4cda34f"
      Hint: __Created by
      Value: |
        sitecore\\johan.becue@sitecore.com
    - ID: "8cdc337e-a112-42fb-bbb4-4143751e123f"
      Hint: __Revision
      Value: "${revision}"
    - ID: "badd9cf9-53e0-4d0c-bcc0-2d784c282f6a"
      Hint: __Updated by
      Value: |
        sitecore\\johan.becue@sitecore.com
    - ID: "d9cf14b1-fa16-4ba6-9288-e8a174d4d522"
      Hint: __Updated
      Value: 20260606T120000Z
    - ID: "${FIELDS.CategoryLabel}"
      Hint: CategoryLabel
      Value: ${yamlQuote(event.category)}
    - ID: "${FIELDS.EventDay}"
      Hint: EventDay
      Value: ${yamlQuote(event.day)}
    - ID: "${FIELDS.EventMonth}"
      Hint: EventMonth
      Value: ${yamlQuote(event.month)}
    - ID: "${FIELDS.Time}"
      Hint: Time
      Value: ${yamlQuote(event.time)}
    - ID: "${FIELDS.Title}"
      Hint: Title
      Value: ${yamlQuote(event.title)}
    - ID: "${FIELDS.NavigationTitle}"
      Hint: NavigationTitle
      Value: ${yamlQuote(event.navTitle || event.title)}
    - ID: "${FIELDS.Summary}"
      Hint: Summary
      Value: ${yamlQuote(event.summary)}
    - ID: "${FIELDS.Image}"
      Hint: Image
      Value: |
        <image mediaid="" src="${event.imageUrl}" alt="${imageAlt}" />
    - ID: "${FIELDS.Link}"
      Hint: Link
      Value: |
        <link linktype="external" url="${event.linkPath}" anchor="" target="" class="" />
    - ID: "${FIELDS.IsOnDemandEvent}"
      Hint: IsOnDemandEvent
      Value: 1
    - ID: "${FIELDS.Location}"
      Hint: Location
      Value: ${yamlQuote(event.location)}
    - ID: "${FIELDS.Duration}"
      Hint: Duration
      Value: ${yamlQuote(event.duration)}
    - ID: "${FIELDS.DateDisplay}"
      Hint: DateDisplay
      Value: ${yamlQuote(event.dateDisplay)}
    - ID: "${FIELDS.Body}"
      Hint: Body
      Value: |
        ${bodyHtml.split('\n').join('\n        ')}
    - ID: "${FIELDS.JoinLink}"
      Hint: JoinLink
      Value: |
        <link linktype="external" url="${event.linkPath}" text="Watch now" anchor="" target="" class="" />
    - ID: "${FIELDS.CancelRegistrationLabel}"
      Hint: CancelRegistrationLabel
      Value: ${yamlQuote('Cancel registration')}
    - ID: "${FIELDS.RegisteredMessage}"
      Hint: RegisteredMessage
      Value: ${yamlQuote('Log in to watch this on-demand event.')}
    - ID: "${FIELDS.SpeakersBody}"
      Hint: SpeakersBody
      Value: |
        ${speakersHtml ? speakersHtml.split('\n').join('\n        ') : '<p></p>'}
`;
}

const events = [
  {
    id: 'e2000001-0001-4000-8000-000000000001',
    itemName: 'Temporary 5 reduced VAT rate May26',
    slug: 'Temporary-5-reduced-VAT-rate-May26',
    category: 'Tax',
    day: '22',
    month: 'MAY',
    time: 'Recorded: May 22nd, 2026',
    title: 'Temporary 5% reduced VAT rate on children’s meals, tickets and family attractions',
    summary:
      'This webinar explores the new temporary 5% VAT rate applying to certain hospitality and leisure supplies between 25 June and 1 September 2026.',
    about:
      'This webinar explores the new temporary 5% VAT rate applying to certain hospitality and leisure supplies between 25 June and 1 September 2026. It covers the types of qualifying supplies, including children’s meals, admissions to selected attractions, and family-oriented leisure activities as well as key exclusions such as sporting events and pay-per-ride attractions. The session also highlights areas of uncertainty in HMRC’s guidance, the practical implications for businesses, and the steps organisations should be taking now, from assessing system readiness to managing pricing, bookings, and VAT risk.\n\nIf you would like to speak on any of the above with one of our KPMG specialists, please reach out via email (beyond@kpmg.co.uk).\n\n*Please be aware that the subtitles for this recording have been automatically generated and may contain inaccuracies.*',
    location: 'On demand',
    duration: '48m',
    dateDisplay: 'Recorded: May 22nd, 2026',
    imageUrl:
      'https://cd-prod-horizon.azureedge.net/-/media/children-holding-hands-1280x720.jpg?rev=ade4b3f7e9c546e3b480f807c331fb9f&hash=512FD8B5454C6A5A9BEFC97E60FC71F8',
    speakers: [
      { name: 'Jamie Freed', title: 'Partner, Head of Indirect Tax Leisure & Hospitality, KPMG' },
      { name: 'Shannon Davenport', title: 'Director, Indirect Tax, KPMG' },
    ],
  },
  {
    id: 'e2000001-0001-4000-8000-000000000002',
    itemName: 'Accelerating people performance May26',
    slug: 'Accelerating-people-performance-May26',
    category: 'Workforce',
    day: '19',
    month: 'MAY',
    time: 'Recorded: May 19th, 2026',
    title: 'Accelerating people performance',
    summary:
      'This session focused on why organisational growth often stalls despite strong ambition, highlighting that the core issue is not people but a “growth execution problem” driven by low clarity and low energy.',
    about:
      'This session focused on why organisational growth often stalls despite strong ambition, highlighting that the core issue is not people but a “growth execution problem” driven by low clarity and low energy. Guest chair Anne-Marie Boden, Senior Manager - KPMG in the UK, was joined by Kelly Wakeman, CEO and Founder of Start Inspiring, for an insightful conversation. Kelly introduced a simple framework – Clarity × Energy = Velocity – sharing that organisations achieve meaningful progress only when direction, alignment and momentum are all strong.\n\nIf you would like to speak on any of the above with one of our KPMG specialists, please reach out via email (beyond@kpmg.co.uk).\n\n*Please be aware that the subtitles for this recording have been automatically generated and may contain inaccuracies.*',
    location: 'On demand',
    duration: '21m',
    dateDisplay: 'Recorded: May 19th, 2026',
    imageUrl:
      'https://cd-prod-horizon.azureedge.net/-/media/Accelerating-people-performance.jpg?rev=0da0f0b778384db0a178466a53eb7983&hash=96870C619B336E7657B1D0DDA7F0C15B',
    speakers: [
      { name: 'Anne-Marie Boden', title: 'Senior Manager, KPMG' },
      { name: 'Kelly Wakeman', title: 'CEO & Founder, Start Inspiring' },
    ],
  },
  {
    id: 'e2000001-0001-4000-8000-000000000003',
    itemName: 'Internal Audit Risk Data Privacy May26',
    slug: 'Internal-Audit-Risk-Data-Privacy-and-Employee-Data-May26',
    category: 'Risk',
    day: '7',
    month: 'MAY',
    time: 'Recorded: May 7th, 2026',
    title: 'Internal Audit and Risk Leaders Forum: Data Privacy and Employee Data',
    summary:
      'Data breaches remain one of the most costly and damaging risks for organisations in 2026. The Data (Use and Access) Act was approved last year and has gradually become effective.',
    about:
      'Data breaches remain one of the most costly and damaging risks for organisations in 2026. The Data (Use and Access) Act was approved last year and has gradually become effective. It has introduced significant changes to the controller’s obligations, raised Privacy and Electronic Communications Regulations (PECR) penalties in line with UK General Data Protection Regulation (GDPR), and changed the rules around data subject rights. There are much widely publicised incidents where data breaches and fraud have disrupted business and organisations have incurred large financial impacts.\n\nDuring this session, Anand Shah, Partner, was joined by James Cassidy, Director in Legal Data Protection, and Sandra Hurley, Senior Manager in Employment Solutions, will outline how organisations are responding to employee information data breach risks, from compliance with UK GDPR, the Data Protection Act 2018 (and equivalent local legislation), to the operational processes, control behaviours and human vulnerabilities that drive most incidents.\n\nIf you would like to speak on any of the above with one of our KPMG specialists, please reach out via email (beyond@kpmg.co.uk).\n\n*Please be aware that the subtitles for this recording have been automatically generated and may contain inaccuracies.*',
    location: 'On demand',
    duration: '56m',
    dateDisplay: 'Recorded: May 7th, 2026',
    imageUrl:
      'https://cd-prod-horizon.azureedge.net/-/media/Internal-Audit-and-Risk-Leaders-Forum-Data-Privacy-and-Employee-Data.jpg?rev=a5b76a668ead4d5fac91142ee4ceeb6c&hash=553703AED7ADC5D7BF4714AA6E178F30',
    speakers: [
      { name: 'Anand Shah', title: 'Partner, Governance, Risk and Compliance, KPMG' },
      { name: 'James Cassidy', title: 'Director, Data Protection Lead, KPMG Law' },
      { name: 'Sandra Hurley', title: 'Senior Manager - Employment Solutions, KPMG' },
    ],
  },
  {
    id: 'e2000001-0001-4000-8000-000000000004',
    itemName: 'Global employment mobility payroll Apr26',
    slug: 'Global-employment-mobility-and-payroll-complexities-Apr26',
    category: 'Workforce',
    day: '23',
    month: 'APR',
    time: 'Recorded: April 23rd, 2026',
    title: 'Global employment, mobility, and payroll complexities',
    summary:
      'During this session, Colin Purdue was joined by his KPMG UK colleagues Ashish Majithia, Iain McCluskey, Joshua Winfield, and John Docherty. They provided insights and actionable steps on navigating global employment taxes, aligning global mobility with talent strategies, and managing National Insurance Contributions (NIC) on deferred compensation.',
    about:
      'During this session, Colin Purdue was joined by his KPMG UK colleagues Ashish Majithia, Iain McCluskey, Joshua Winfield, and John Docherty. They provided insights and actionable steps on navigating global employment taxes, aligning global mobility with talent strategies, and managing National Insurance Contributions (NIC) on deferred compensation.\n\nIf you would like to speak on any of the above with one of our KPMG specialists, please reach out via email (beyond@kpmg.co.uk).\n\n*Please be aware that the subtitles for this recording have been automatically generated and may contain inaccuracies.*',
    location: 'On demand',
    duration: '58m',
    dateDisplay: 'Recorded: April 23rd, 2026',
    imageUrl:
      'https://cd-prod-horizon.azureedge.net/-/media/GMS.jpg?rev=fa9e5706cd694c4097dbd396ce64cf57&hash=98CC79A30D3599BDA4C5C0BA1E76CD28',
    speakers: [
      { name: 'Colin Purdue', title: 'Senior Manager, Employment Solutions, KPMG' },
      { name: 'Ashish Majithia', title: 'Partner, KPMG UK' },
      { name: 'Iain McCluskey', title: 'Partner, KPMG in the UK' },
    ],
  },
  {
    id: 'e2000001-0001-4000-8000-000000000005',
    itemName: 'Mandatory Payrolling BiK CIPP Apr26',
    slug: 'Mandatory-Payrolling-of-Benefits-in-Kind-CIPP-session-Apr26',
    category: 'Workforce',
    day: '15',
    month: 'APR',
    time: 'Recorded: April 15th, 2026',
    title: 'Mandatory Payrolling of Benefits in Kind (CIPP session)',
    summary:
      'From April 2027, the mandatory payrolling of benefits in kind will fundamentally change how employers report, track and manage employee benefits.',
    about:
      'From April 2027, the mandatory payrolling of benefits in kind will fundamentally change how employers report, track and manage employee benefits. This session will walk you through what the changes mean and how you can prepare. During the session, you gained access to practical checklists, step-by-step guidance, and real-world learnings to help you to assess your current process and identify where changes are needed across Payroll, HR, Finance and Reward teams. We also shared some insights on upcoming technology that can help to streamline the transition, including tracking monthly changes in employee circumstances, automate reporting, and help to ensure ongoing compliance. Whether you’re just beginning to prepare or are deep into planning, this session equips you with the insights, tools and confidence to implement mandatory payrolling smoothly and compliantly.\n\nIf you would like to speak on any of the above with one of our KPMG specialists, please reach out via email (beyond@kpmg.co.uk).',
    location: 'On demand',
    duration: '59m',
    dateDisplay: 'Recorded: April 15th, 2026',
    imageUrl:
      'https://cd-prod-horizon.azureedge.net/-/media/pbiks-ode.jpg?rev=58c3e6c53eab438e8ab62caa67a88325&hash=5A68BA8C322E2AF5F77B5DF67F3D1410',
    speakers: [
      { name: 'Colin Purdue', title: 'Senior Manager, Employment Solutions, KPMG' },
      { name: 'Shaun Tetley', title: 'Chair, Chartered Institute of Payroll Professionals' },
      { name: 'Christian Verri', title: 'Director, Employment Taxes, KPMG' },
    ],
  },
  {
    id: 'e2000001-0001-4000-8000-000000000006',
    itemName: 'Accounting Reporting Quarterly Perspectives Mar26',
    slug: 'Accounting-and-Reporting-Quarterly-Perspectives-Mar26',
    category: 'Financial Structures',
    day: '24',
    month: 'MAR',
    time: 'Recorded: March 24th, 2026',
    title: 'Accounting & Reporting: Quarterly Perspectives',
    summary:
      'This session focussed on accounting and regulatory updates, capital market trends, sustainability and AI.',
    about:
      'During this Accounting & Reporting update, our KPMG specialists shared practical insights, discussed what we’re seeing and hearing from regulators and clients, and highlighted the implications for organisations navigating an evolving reporting landscape.\n\n- Regulatory update\n- Accounting hot topics, including IFRS 18 issues on IFRIC’s agenda\n- Capital markets and transactions trends, and reporting impacts\n- Sustainability, AI and reporting operating models\n\nIf you would like to speak on any of the above with one of our KPMG specialists, please reach out via email (beyond@kpmg.co.uk).',
    location: 'On demand',
    duration: '1h',
    dateDisplay: 'Recorded: March 24th, 2026',
    imageUrl:
      'https://cd-prod-horizon.azureedge.net/-/media/Accounting--Reporting-Quarterly-Perspectives-ODE.jpg?rev=d6b695f8239a43da997819d4744a13d5&hash=E30ABB272C71A0B007977478A172E2E7',
    speakers: [
      { name: 'Greg Stinson', title: 'Partner and Head of Accounting Advisory Services, KPMG' },
      { name: 'Silvan Jurt', title: 'Head of Corporate Sustainability Services, KPMG Switzerland' },
      { name: 'Manisha Santchurn', title: 'Director, Accounting Advisory, KPMG' },
    ],
  },
];

mkdirSync(EVENTS_DIR, { recursive: true });

for (const event of events) {
  event.linkPath = `/on-demand-events/${event.slug}`;
  const fileName = `${event.itemName}.yml`;
  const filePath = join(EVENTS_DIR, fileName);
  writeFileSync(filePath, buildYaml(event), 'utf8');
  console.log(`Wrote ${fileName}`);
}

console.log(`Generated ${events.length} on-demand event YAML files.`);
