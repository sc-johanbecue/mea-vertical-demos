export type MegaMenuLink = {
  href: string;
  text: string;
  children?: MegaMenuLink[];
};

export type MegaMenuSection = {
  href: string;
  text: string;
  children: MegaMenuLink[];
};

/** Primary nav submenus aligned with the British Council mega-menu. */
export const bcMegaMenu: MegaMenuSection[] = [
  {
    href: '/english',
    text: 'Learn English',
    children: [
      { href: '/english/learn-online', text: 'Learn English Online' },
      { href: '/english/adults', text: 'English for adults' },
      { href: '/english/kids-teens', text: 'English for kids and teens' },
      { href: '/online-corporate-english-solutions', text: 'Corporate English Solutions' },
      { href: '/english/learn-online/teachers', text: 'Website for teachers' },
      { href: '/english/study-english-uk', text: 'Study English in the UK' },
    ],
  },
  {
    href: '/exam',
    text: 'Exams',
    children: [
      { href: 'https://takeielts.britishcouncil.org/', text: 'IELTS' },
      { href: '/exam/english/aptis', text: 'Aptis' },
      { href: '/exam/english', text: 'English Exams' },
      { href: '/exam/international-schools', text: 'UK International School Qualifications' },
      { href: '/exam/global-exams-services', text: 'Global Exams Services' },
    ],
  },
  {
    href: '/study-work-abroad',
    text: 'Study and work abroad',
    children: [
      { href: '/study-work-abroad/in-uk', text: 'Study and train in the UK' },
      { href: '/study-work-abroad/outside-uk', text: 'Study and work outside the UK' },
      { href: '/study-work-abroad/alumni-uk', text: 'Alumni UK' },
    ],
  },
  {
    href: '/school-resources',
    text: 'School and teacher resources',
    children: [
      { href: '/school-resources/erasmusplus', text: 'Erasmus+' },
      { href: '/school-resources/find', text: 'Find classroom resources' },
      { href: '/school-resources/world-classroom', text: 'The world in your classroom' },
      { href: '/school-resources/partner', text: 'Partner with a school' },
      { href: '/school-resources/languages', text: 'Support for language teaching' },
      { href: '/school-resources/learningsectors', text: 'Learning Sectors' },
      { href: '/school-resources/uk-ukraine-partnerships', text: 'UK-Ukraine school partnerships' },
      {
        href: '/school-resources/employ-language-assistant',
        text: 'Employ a language assistant at your school, college or university',
      },
      { href: '/school-resources/accreditation', text: 'Get accreditation for your school' },
      { href: '/school-resources/develop-skills', text: 'Develop your skills' },
      { href: '/school-resources/international-education-week', text: 'International Education Week' },
      { href: '/school-resources/stories-classroom', text: 'Stories from the classroom' },
      { href: '/school-resources/schools-connect', text: 'Schools Connect' },
      {
        href: '/school-resources/cop-climate-negotiation-simulation-events',
        text: 'COP climate negotiation simulation events',
      },
      { href: '/school-resources/plan-ahead', text: 'Plan ahead' },
    ],
  },
  {
    href: '/programmes',
    text: 'English, education and arts',
    children: [
      { href: '/arts', text: 'Our work in arts' },
      { href: '/education', text: 'Our work in education' },
      { href: '/our-work-in-english', text: 'Our work in English and assessment' },
      {
        href: '/library',
        text: 'Our libraries',
        children: [
          { href: '/library/digital-library-guidance', text: 'Guide to the Digital Library' },
          { href: '/library/events', text: 'Library events' },
        ],
      },
    ],
  },
];

function normalizeHref(href?: string): string {
  if (!href) return '';
  try {
    if (href.startsWith('http://') || href.startsWith('https://')) return href.replace(/\/$/, '');
  } catch {
    /* ignore */
  }
  const path = href.split('?')[0].split('#')[0];
  if (!path || path === '/') return path || '/';
  return path.replace(/\/$/, '') || '/';
}

export function getMegaMenuChildren(href?: string, text?: string): MegaMenuLink[] {
  const normalized = normalizeHref(href);
  const byHref = bcMegaMenu.find((section) => normalizeHref(section.href) === normalized);
  if (byHref) return byHref.children;

  const label = (text || '').trim().toLowerCase();
  if (!label) return [];
  const byText = bcMegaMenu.find((section) => section.text.toLowerCase() === label);
  return byText?.children ?? [];
}
