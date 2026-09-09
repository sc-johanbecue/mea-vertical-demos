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
        <link linktype="external" url="${event.linkPath}" text="Join now" anchor="" target="" class="" />
    - ID: "${FIELDS.CancelRegistrationLabel}"
      Hint: CancelRegistrationLabel
      Value: ${yamlQuote('Cancel registration')}
    - ID: "${FIELDS.RegisteredMessage}"
      Hint: RegisteredMessage
      Value: ${yamlQuote('Thank you for registering. Please check your email for confirmation.')}
    - ID: "${FIELDS.SpeakersBody}"
      Hint: SpeakersBody
      Value: |
        ${speakersHtml ? speakersHtml.split('\n').join('\n        ') : '<p></p>'}
`;
}

const events = [
  {
    id: 'e1000001-0001-4000-8000-000000000001',
    itemName: 'Sustainability reporting assurance June26',
    slug: 'Sustainability-reporting-assurance-June26',
    category: 'Sustainability',
    day: '10',
    month: 'JUN',
    time: '12.00 PM',
    title: 'Sustainability reporting & assurance webinar: what should be on your radar?',
    summary:
      'Sustainability expectations are evolving at pace, with new reporting frameworks, increasing assurance scrutiny and a growing focus on technology.',
    about:
      'Sustainability expectations are evolving at pace, with new reporting frameworks, increasing assurance scrutiny and a growing focus on technology.\n\nJoin our sustainability reporting and assurance webinar on Wednesday 10 June, 12:00–13:00, where our specialists will share clear perspectives on what organisations should prioritise as requirements continue to evolve, covering:\n\n- UK SRS: The latest UK SRS developments, what’s becoming clearer, what’s still evolving and what UK organisations should be thinking about now.\n- Sustainability assurance in practice: Learnings from Australia’s first year of sustainability assurance, what we’re seeing across client engagements, and how assurance expectations are developing.\n- Technology and sustainability: Sustainability reporting and assurance questions organisations are asking and how technology can support more robust data, controls and reporting.',
    location: 'Virtual',
    duration: '1h',
    dateDisplay: 'June 10, 2026 at 12.00 PM',
    imageUrl:
      'https://cd-prod-horizon.azureedge.net/-/media/My-Post1-(16).png?rev=a71a34a6c04d4986b3afa8bf54ce3f13&hash=A3BE9ED5A220C7A8AB993ABDEBE9D1BF',
    speakers: [
      { name: 'George Richards', title: 'Associate Partner, Head of ESG Reporting and Assurance, KPMG' },
      { name: 'Skye He', title: 'Senior Manager, Finance Transformation, KPMG' },
      { name: 'Daria Yudina', title: 'Director, ESG Assurance, KPMG UK' },
    ],
  },
  {
    id: 'ce706026-84d0-49aa-8dca-76c0401c7fee',
    itemName: 'Non-Executive Directors Forum - Birmingham',
    slug: 'Non-Executive-Directors-Forum-Birmingham-June26',
    category: 'Strategy and Planning',
    day: '16',
    month: 'JUN',
    time: '9.00 AM',
    title: 'Non-Executive Directors Forum (Birmingham)',
    summary:
      'We’re delighted to invite you to our upcoming NED forum at our Birmingham office on 16 June at 9:00 am.',
    about:
      'We’re delighted to invite you to our upcoming NED forum at our Birmingham office on 16 June at 9:00 am.\n\nWe’re inviting all aspiring, new and experienced NEDs to an exclusive event, a morning of insights and networking as we explore some of today’s pertinent issues.\n\nWe’ll be delving into the three topics noted below:\n- Trusted AI: AI is increasingly shaping core business decisions and creates material risks relating to bias, data privacy, regulation and reputation. Boards remain accountable for how AI is governed, and ineffective oversight can expose organisations to legal, ethical and stakeholder trust issues. A trusted AI approach enables boards to balance innovation with control, supporting resilience, compliance and long term value creation.\n- Board Inclusion Diversity and Equity: Building inclusive and resilient boards through socio-economic diversity. We will discuss practical and proportionate measures for embedding socio-economic insight into governance and appointments—an emerging area that strengthens Board resilience and future-readiness. Through effective challenge and accountability, boards can help embed inclusive practices that align workforce behaviour with the organisation’s values and long term objectives.\n- Sustainability: Boards can play a key, proactive role in assessing the opportunities and risks which sustainability presents to long term value creation and organisational resilience. These issues influence strategy, regulatory compliance, investor confidence and reputation, and therefore require effective board level oversight and challenge. Through informed scrutiny, boards can help ensure sustainability is embedded in decision making and aligned with the organisation’s long term interests.',
    location: 'KPMG Birmingham Office, 1 Snow Hill Queensway, Birmingham B4 6GH',
    duration: '2h',
    dateDisplay: 'June 16, 2026 at 9.00 AM',
    imageUrl:
      'https://cd-prod-horizon.azureedge.net/-/media/Birmingham-City.jpg?rev=153331eb76c54ace96224f05230eb98b&hash=FCE9F41FC2CFA3C86C548473AC9DC26B',
    speakers: [
      { name: 'Leanne Allen', title: 'UK Head of AI, KPMG' },
      { name: 'James Dennis', title: 'Climate Strategy Lead, KPMG' },
      { name: 'Bharat Bhushan', title: 'Partner, KPMG UK' },
    ],
  },
  {
    id: '5f903433-d857-4e05-8f16-36e7a123e242',
    itemName: 'Government Departments and Arms Length Bodies',
    slug: 'Government-Departments-and-Arms-Length-Bodies-June26',
    category: 'Tax',
    day: '16',
    month: 'JUN',
    time: '12.30 PM',
    title: 'Government Departments and Arm’s Length Bodies – Tax and Legal Update',
    summary:
      'Government Departments and their Arm’s Length Bodies are among the most complex organisations when it comes to tax and legal compliance.',
    about:
      'Government Departments and their Arm’s Length Bodies are among the most complex organisations when it comes to tax and legal compliance. The interaction of both business and non-business activities, ‘normal’ tax rules, and Government-specific tax rules, creates a landscape that requires careful management and up to date knowledge. This webinar provides a focused update for Government Departments and Arm’s Length Bodies on the latest tax and legal developments affecting the sector. The session will highlight key changes, areas of increasing scrutiny and practical considerations for managing compliance across complex organisational structures.\n\nOur approach for each session has 3 key aims:\n- Addressing specific topics requested by you.\n- Providing updates across all areas of tax using HMRC guidance, case law and our experiences\n- Discussing a number of selected topics where we see the greatest level or scrutiny or uncertainty\n\nWhat we’ll cover:\n- Latest tax developments, including updates to HMRC guidance and recent case law\n- Treasury reform of VAT rules for Government Bodies\n- HMRC’s evolving approach to compliance and what it means in practice\n- National Minimum Wage: key tax and legal considerations\n- Corporation Tax for Arm’s Length Bodies, including trading status and available exemptions\n\nWho should attend?\nFinance, tax, legal and compliance professionals working within Government Departments and ALBs, as well as those responsible for managing tax risk and oversight.\n\nSubmit Your Topics:\n- Attendees are welcome to suggest additional areas of interest in advance, and we will incorporate them where possible. Please submit any queries to: suzannah.belk@kpmg.co.uk',
    location: 'Virtual',
    duration: '1h',
    dateDisplay: 'June 16, 2026 at 12.30 PM',
    imageUrl:
      'https://cd-prod-horizon.azureedge.net/-/media/making-time-for-busines.png?rev=2a12658deb634093a4c9817fb419afa5&hash=7C0CD6F06D213C00DFA6067BBC725497',
    speakers: [
      { name: 'Andrew Pick', title: 'Partner, Indirect Tax, KPMG UK' },
      { name: 'Kathryn Saunders', title: 'Senior Manager, KPMG UK' },
      { name: 'Suzannah Belk', title: 'Assistant Manager, KPMG UK' },
    ],
  },
  {
    id: 'e1000001-0001-4000-8000-000000000004',
    itemName: 'Internal Audit Risk EQA of Internal Audit Functions June2026',
    slug: 'Internal-Audit-Risk-EQA-of-Internal-Audit-Functions-June2026',
    category: 'Strategy and Planning',
    day: '17',
    month: 'JUN',
    time: '10.00 AM',
    title: 'Internal Audit and Risk Leaders Forum: External Quality Assessments (EQA) of IA Functions',
    summary:
      'This session will be focused on External Quality Assessments (EQA) of Internal Audit (IA) Functions and taking place on Wednesday 17 June, 10:00–11:00.',
    about:
      'This session will be focused on External Quality Assessments (EQA) of Internal Audit (IA) Functions and taking place on Wednesday 17 June, 10:00–11:00.\n\nThe Global Institute of Internal Auditors issued its revised Standards in January 2024, with an effective date of 9 January 2025, alongside the introduction of the new Topical Requirements. These updates represent a significant evolution in expectations for some Internal Audit Functions.\n\nIn response to these changes, we have seen a notable increase in demand for EQAs. This session will therefore focus on:\n- How organisations are responding to the revised Standards, including readiness assessments, peer reviews, and full EQAs; and\n- Key thematic insights emerging from EQAs we have performed, including the increased emphasis on Internal Audit strategy, board level profile and influence, effective use of tools and technology, and structured career pathways for internal audit professionals.',
    location: 'Virtual',
    duration: '1h',
    dateDisplay: 'June 17, 2026 at 10.00 AM',
    imageUrl:
      'https://cd-prod-horizon.azureedge.net/-/media/Quality-Management.jpg?rev=a5c4136b129b4e99b794f517e7f27566&hash=C6B4453E78F685D98CD6C278B99C33A7',
    speakers: [
      { name: 'Anand Shah', title: 'Partner, Governance, Risk and Compliance, KPMG' },
      { name: 'Lynn Yallop', title: 'Partner, Governance, Risk and Compliance Services, KPMG' },
      { name: 'Amanda Sefain', title: 'Internal Audit Manager, KPMG UK' },
    ],
  },
  {
    id: 'e1000001-0001-4000-8000-000000000005',
    itemName: 'Accounting Reporting Quarterly Perspectives June26',
    slug: 'Accounting-Reporting-Quarterly-Perspectives-June26',
    category: 'Strategy and Planning',
    day: '24',
    month: 'JUN',
    time: '2.30 PM',
    title: 'Accounting & Reporting: Quarterly Perspectives',
    summary:
      'Navigating evolving financial reporting and sustainability requirements. Join KPMG’s Accounting Advisory Services (AAS) team for our next live digital update on Wednesday 24 June, 2:30 - 3:30 PM.',
    about:
      'Navigating evolving financial reporting and sustainability requirements.\n\nJoin KPMG’s Accounting Advisory Services (AAS) team for our next live digital update on Wednesday 24 June, 2:30 - 3:30 PM.\n\nWhat\'s on the agenda?\n- IFRS 18 – the latest from IFRIC discussions, plus practical insights and implementation considerations.\n- Regulatory round up – the latest IASB and FRC discussions, priority projects and what’s ahead – including IFRS 20 and FRS 102 Revised.\n- Modernisation of corporate reporting – what has been announced and what changes can we expect?\n- Sustainability – key trends shaping the future of reporting and assurance.\n- AI – where is the AI value in accounting and reporting?\n\nThis session qualifies for CPD hours — simply confirm your attendance after the event.',
    location: 'Virtual',
    duration: '1h',
    dateDisplay: 'June 24, 2026 at 2.30 PM',
    imageUrl:
      'https://cd-prod-horizon.azureedge.net/-/media/abstract-event.png?rev=9dece00441a44090a84f3d4f60f42c1c&hash=10CA3028CD31736A511DCFD5A39F1822',
    speakers: [],
  },
  {
    id: 'e1000001-0001-4000-8000-000000000006',
    itemName: 'Global Economic and Geopolitical Outlook June26',
    slug: 'Global-Economic-and-Geopolitical-Outlook-June26',
    category: 'Strategy and Planning',
    day: '25',
    month: 'JUN',
    time: '9.00 AM',
    title: 'Global Economic & Geopolitical Outlook',
    summary:
      'Global economic shifts and geopolitical events are reshaping markets faster than many organizations can react.',
    about:
      'Global economic shifts and geopolitical events are reshaping markets faster than many organizations can react. Business leaders are expected to make critical decisions amid uncertainty, often with incomplete data and limited time.\n\nKPMG’s Global Economic and Geopolitical Outlook quarterly webcast series brings together KPMG firm Regional Chief Economists, KPMG International’s Global Geopolitics Lead, and other senior advisors to provide business-focused insights. These engaging 60-minute sessions are designed for time-constrained senior leaders.\n\nThe conflict in Iran has created ripple effects across energy, supply chains, and global markets. Executives should assess how these second‑ and third‑order effects impact investment timing, supply chain design, capital allocation, and risk posture — not just in theory, but in day‑to‑day operations.\n\nIn this webcast, you’ll gain insight into:\n- The global economic and geopolitical shifts most likely to influence near‑term leadership decisions\n- How these forces can translate into real business implications for supply chains, investment strategies, and market performance\n- The early signals leaders should monitor to anticipate disruption and act before risks crystallize',
    location: 'Virtual',
    duration: '1h',
    dateDisplay: 'June 25, 2026 at 9.00 AM',
    imageUrl:
      'https://cd-prod-horizon.azureedge.net/-/media/Global-Economic--Geopolitical-Outlook.jpg?rev=cc15006895394a8eaed1d26bc7751d62&hash=BD38EE892732A6AD52FB6C620FF5A6CA',
    speakers: [],
  },
  {
    id: 'e1000001-0001-4000-8000-000000000007',
    itemName: 'Non-Executive Directors Forum Manchester June26',
    slug: 'Non-Executive-Directors-Forum-Manchester-June26',
    category: 'Strategy and Planning',
    day: '25',
    month: 'JUN',
    time: '9.00 AM',
    title: 'Non-Executive Directors Forum (Manchester)',
    summary:
      "We're delighted to invite to our upcoming NED forum, taking place at our Manchester office on 25 June at 9 am.",
    about:
      "We're delighted to invite to our upcoming NED forum, taking place at our Manchester office on 25 June at 9 am.\n\nWe’re inviting all aspiring, new and experienced NEDs to an exclusive event, a morning of insights and networking as we explore some of today’s pertinent issues.\n\nWe’ll be delving into the three topics noted below:\n- Trusted AI: AI is increasingly shaping core business decisions and creates material risks relating to bias, data privacy, regulation and reputation. Boards remain accountable for how AI is governed, and ineffective oversight can expose organisations to legal, ethical and stakeholder trust issues. A trusted AI approach enables boards to balance innovation with control, supporting resilience, compliance and long term value creation.\n- Board Inclusion Diversity and Equity: Building inclusive and resilient boards through socio-economic diversity. We will discuss practical and proportionate measures for embedding socio-economic insight into governance and appointments—an emerging area that strengthens Board resilience and future-readiness. Through effective challenge and accountability, boards can help embed inclusive practices that align workforce behaviour with the organisation’s values and long term objectives.\n- Sustainability: Boards can play a key, proactive role in assessing the opportunities and risks which sustainability presents to long term value creation and organisational resilience. These issues influence strategy, regulatory compliance, investor confidence and reputation, and therefore require effective board level oversight and challenge. Through informed scrutiny, boards can help ensure sustainability is embedded in decision making and aligned with the organisation’s long term interests.",
    location: 'KPMG Manchester Office',
    duration: '2h',
    dateDisplay: 'June 25, 2026 at 9.00 AM',
    imageUrl:
      'https://cd-prod-horizon.azureedge.net/-/media/Manchester.png?rev=c092592646784a19a327d15a7a101548&hash=1F7265DA0EC42D40E3F6C8AC9D219C39',
    speakers: [],
  },
  {
    id: 'e1000001-0001-4000-8000-000000000008',
    itemName: 'UK Carbon Border Adjustment Mechanism June26',
    slug: 'UK-Carbon-Border-Adjustment-Mechanism-What-Businesses-Need-to-Know-June26',
    category: 'Sustainability',
    day: '25',
    month: 'JUN',
    time: '11.00 AM',
    title: 'UK Carbon Border Adjustment Mechanism (CBAM): What Businesses Need to Know',
    summary:
      'The UK Government is introducing a UK Carbon Border Adjustment Mechanism (UK CBAM), designed to address carbon leakage risks.',
    about:
      'The UK Government is introducing a UK Carbon Border Adjustment Mechanism (UK CBAM), designed to address carbon leakage risks and ensure that imported goods face a comparable carbon price to domestic production. This new regime represents a significant change for businesses importing certain carbon‑intensive goods into the UK.\n\nJoin our KPMG Indirect Tax team for a practical session exploring what the UK CBAM means for your business, how it compares to the EU model, and the steps organisations should take now to prepare.\n\nSectors affected:\n- Iron & steel\n- Aluminium\n- Fertiliser\n- Hydrogen\n- Cement\n\nWho should attend?\n- Indirect Tax leaders\n- Supply chain, operations and procurement professionals\n- Sustainability, ESG and regulatory leaders\n- Finance and commercial teams involved in import operations\n\nAgenda:\n- What is a CBAM?\n- A comparison between the UK CBAM and the EU CBAM\n- UK CBAM basics\n- Data gathering for UK CBAM\n- Steps to take now\n- Commercial considerations (including contracts)\n\nThe clock is ticking, so now is the time to prepare and plan ahead.',
    location: 'Virtual',
    duration: '1h',
    dateDisplay: 'June 25, 2026 at 11.00 AM',
    imageUrl:
      'https://cd-prod-horizon.azureedge.net/-/media/carbon.jpg?rev=6b2ec6c963a74fba9bc09c393a4c6518&hash=9C5BA823AA753F4CE9037DEB97A14EBA',
    speakers: [],
  },
  {
    id: 'e1000001-0001-4000-8000-000000000009',
    itemName: 'IR35 Employment Status A Practical Payroll Perspective June26',
    slug: 'IR35-Employment-Status-A-Practical-Payroll-Perspective-June26',
    category: 'Workforce',
    day: '30',
    month: 'JUN',
    time: '12.00 PM',
    title: 'IR35 & Employment Status: A practical payroll perspective',
    summary:
      'Join us for a practical and engaging Beyond session, chaired by Anne-Marie Boden, exploring employment status risk, off-payroll working (IR35), and the often-misunderstood concept of contracted-out services.',
    about:
      'Join us for a practical and engaging Beyond session, chaired by Anne-Marie Boden, exploring employment status risk, off-payroll working (IR35), and the often-misunderstood concept of contracted-out services.\n\nAnne-Marie will be joined by Matthew Newbrook (Senior Manager, KPMG UK) and Ben Murphy (Senior Manager, KPMG) for a live, payroll-focused discussion delivered using interactive, realistic workplace scenarios. The session will bring key issues to life and demonstrate how they arise in practice.\n\nDesigned for payroll and HR professionals, the session will examine where risk emerges when contractual wording, working practices, and operational reality do not align. Drawing on the perspectives of different stakeholders, the discussion will highlight how employment status risks are identified, challenged, and managed—focusing on the facts, evidence, and payroll implications that matter most.\n\nAttendees will leave with a clearer understanding of how employment status issues play out in the real world, where the key pressure points sit for payroll and HR teams, and what to look for when assessing potential off-payroll (IR35) exposure.',
    location: 'Virtual',
    duration: '1h',
    dateDisplay: 'June 30, 2026 at 12.00 PM',
    imageUrl:
      'https://cd-prod-horizon.azureedge.net/-/media/offpayroll.png?rev=e5a2b6005eaa4e04aea7ef3e6f389cfc&hash=73D5D1B4B5D6BBB729EF3EF401697A2C',
    speakers: [],
  },
  {
    id: 'e1000001-0001-4000-8000-00000000000a',
    itemName: 'Social mobility conference July26',
    slug: 'Social-mobility-conference-July26',
    category: 'Workforce',
    day: '1',
    month: 'JUL',
    time: '10.30 AM',
    title: 'Social mobility conference 2026',
    summary:
      'Skills shortages are one of the biggest barriers to sustainable growth in the UK. Addressing them requires action — from business, government and education working together.',
    about:
      'Skills shortages are one of the biggest barriers to sustainable growth in the UK. Addressing them requires action — from business, government and education working together.\n\nThis year’s conference marks an evolution in our programme, with a sharper focus on the skills gaps facing the UK economy and the role that business and government must play together in widening access to education, employment and training.\n\nJoin KPMG’s Social Mobility Conference 2026 to explore how organisations can widen access to opportunity, strengthen talent pipelines and embed socio‑economic inclusion at the heart of their growth strategies.\n\nBroadcast live from our studio, this 90‑minute virtual conference will bring together business leaders, policymakers and social mobility experts for a focused, practical discussion on:\n- Tackling the UK’s most pressing skills gaps\n- Expanding access to education, employment and training\n- The business case for socio‑economic inclusion\n- What leaders can do now to drive measurable change\n\nRegister now to secure your place and be part of the conversation shaping a more inclusive, skilled workforce.',
    location: 'Virtual',
    duration: '1h 30m',
    dateDisplay: 'July 1, 2026 at 10.30 AM',
    imageUrl:
      'https://cd-prod-horizon.azureedge.net/-/media/kpmghorizonsitecore/data/media/img/videoThumbnails/economy-people.jpg?rev=a2b421d50b5149ef86c99d0982485da7&hash=9E377FE96BE0F94B4D36AC6F681AD346',
    speakers: [],
  },
  {
    id: 'e1000001-0001-4000-8000-00000000000b',
    itemName: 'FRS 102 amendments webinar Part1 July26',
    slug: 'FRS-102-amendments-webinar-Part1-July26',
    category: 'Business Growth',
    day: '7',
    month: 'JUL',
    time: '11.00 AM',
    title: 'FRS 102 amendments webinar: Post-transition date insights (Part 1)',
    summary:
      'KPMG’s Accounting Advisory Services team invites you to a two-part webinar series on the amendments to FRS 102, now effective for many UK private companies.',
    about:
      'KPMG’s Accounting Advisory Services team invites you to a two-part webinar series on the amendments to FRS 102, now effective for many UK private companies.\n\nAcross these sessions, we will explore the key accounting and reporting changes, share practical insights from supporting clients through transition, and outline the actions businesses should be taking now.\n\n- Part 1 (7 July) focuses on core accounting, reporting and systems challenges.\n- Part 2 (13 October) covers practical considerations, including auditor expectations, tax implications and stakeholder management.\n\nPlease use the link on this page to register for Part 1. To attend Part 2, please use the Register button on the other event page.\n\nDesigned for CFOs, Finance Directors and financial reporting teams implementing the changes.',
    location: 'Virtual',
    duration: '1h',
    dateDisplay: 'July 7, 2026 at 11.00 AM',
    imageUrl:
      'https://cd-prod-horizon.azureedge.net/-/media/Event-Banner-1/Accounting_And_Reporting_Community.png?rev=8e81509a801f4175b09ac5fc2c14b1b2&hash=CB4A76295C055D1D628177899E5E499D',
    speakers: [],
  },
  {
    id: 'e1000001-0001-4000-8000-00000000000c',
    itemName: 'BLC Social Housing Oct26',
    slug: 'BLC-Social-Housing-Oct26',
    category: 'Strategy and Planning',
    day: '6',
    month: 'OCT',
    time: '3.30 PM',
    title: 'BLC Social Housing',
    summary:
      'Please register here for our Autumn Board Leadership Centre (BLC) Social Housing webinar on Tuesday 6 October, 3:30 pm to 5:00 pm.',
    about:
      'Please register here for our Autumn Board Leadership Centre (BLC) Social Housing webinar on Tuesday 6 October, 3:30 pm to 5:00 pm.\n\nTopics will include an economics update and an overview of areas of the new Statement of Recommended Practice (SORP) which are most important for board members.\n\nHarry Mears, KPMG Partner, will host this event. KPMG Directors Gordon Davey and Mark Dawson, as well as Moustafa Ali from KPMG\'s Macroeconomics Team, will be the speakers during this session.\n\nFurther details will follow in due course.',
    location: 'Virtual',
    duration: '1h 30m',
    dateDisplay: 'October 6, 2026 at 3.30 PM',
    imageUrl:
      'https://cd-prod-horizon.azureedge.net/-/media/Modelhouses/UK-Houses-in-the-sun.jpeg?rev=b68898aefe1248f29dcacd09c87d68fd&hash=C116AFF57A7FB694528912E761B0A676',
    speakers: [
      { name: 'Harry Mears', title: 'Partner, KPMG' },
      { name: 'Gordon Davey', title: 'Director, KPMG' },
      { name: 'Mark Dawson', title: 'Director, KPMG' },
      { name: 'Moustafa Ali', title: "KPMG's Macroeconomics Team" },
    ],
  },
  {
    id: 'e1000001-0001-4000-8000-00000000000d',
    itemName: 'FRS 102 amendments webinar Part2 Oct26',
    slug: 'FRS-102-amendments-webinar-Part2-Oct26',
    category: 'Business Growth',
    day: '13',
    month: 'OCT',
    time: '11.00 AM',
    title: 'FRS 102 amendments webinar: Post-transition date insights (Part 2)',
    summary:
      'KPMG’s Accounting Advisory Services team invites you to a two-part webinar series on the amendments to FRS 102, now effective for many UK private companies.',
    about:
      'KPMG’s Accounting Advisory Services team invites you to a two-part webinar series on the amendments to FRS 102, now effective for many UK private companies.\n\nAcross these sessions, we will explore the key accounting and reporting changes, share practical insights from supporting clients through transition, and outline the actions businesses should be taking now.\n\n- Part 1 (7 July) focuses on core accounting, reporting and systems challenges.\n- Part 2 (13 October) covers practical considerations, including auditor expectations, tax implications and stakeholder management.\n\nPlease use the link on this page to register for Part 2. To attend Part 1, please use the Register button on the other event page.\n\nDesigned for CFOs, Finance Directors and financial reporting teams implementing the changes.',
    location: 'Virtual',
    duration: '1h',
    dateDisplay: 'October 13, 2026 at 11.00 AM',
    imageUrl:
      'https://cd-prod-horizon.azureedge.net/-/media/Event-Banner-1/Accounting_And_Reporting_Community.png?rev=8e81509a801f4175b09ac5fc2c14b1b2&hash=CB4A76295C055D1D628177899E5E499D',
    speakers: [],
  },
];

mkdirSync(EVENTS_DIR, { recursive: true });

for (const event of events) {
  event.linkPath = `/events/${event.slug}`;
  const fileName = `${event.itemName}.yml`;
  const filePath = join(EVENTS_DIR, fileName);
  writeFileSync(filePath, buildYaml(event), 'utf8');
  console.log(`Wrote ${fileName}`);
}

console.log(`Generated ${events.length} event YAML files.`);
