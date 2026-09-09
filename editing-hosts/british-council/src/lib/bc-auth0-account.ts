import type { User } from '@auth0/nextjs-auth0/types';

export type BcAuth0MarketingPrefs = {
  subscribeEmails: boolean;
  marketingEmails: boolean;
};

export type BcAuth0AccountProfile = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  sector: string;
  jobRole: string;
  businessPostcode: string;
  annualTurnover: string;
  topicPreferences: string[];
  marketing: BcAuth0MarketingPrefs;
};

export const defaultBcAuth0MarketingPrefs: BcAuth0MarketingPrefs = {
  subscribeEmails: false,
  marketingEmails: false,
};

/** Sample values for Pages editor when no Auth0 session is present. */
export const dummyBcAuth0AccountProfile: BcAuth0AccountProfile = {
  firstName: 'Alex',
  lastName: 'Taylor',
  email: 'alex.taylor@example.com',
  company: 'British Council Partner School',
  sector: 'Secondary education',
  jobRole: 'Teacher',
  businessPostcode: 'SW1A 1AA',
  annualTurnover: 'Not applicable',
  topicPreferences: ['English learning', 'Fiction', 'Teaching resources'],
  marketing: {
    subscribeEmails: true,
    marketingEmails: true,
  },
};

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function asString(value: unknown, fallback = ''): string {
  if (value === null || value === undefined) {
    return fallback;
  }
  const text = String(value).trim();
  return text || fallback;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((entry) => String(entry).trim()).filter(Boolean);
}

function asPrefBoolean(value: unknown): boolean {
  return value === true;
}

function splitDisplayName(name: string): { first: string; last: string } {
  const trimmed = name.trim();
  if (!trimmed || trimmed.includes('@')) {
    return { first: '', last: '' };
  }
  const [first = '', ...rest] = trimmed.split(/\s+/);
  return { first, last: rest.join(' ') };
}

function readMetadataString(metadata: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const value = asString(metadata[key]);
    if (value) {
      return value;
    }
  }
  return '';
}

function readMarketingPrefs(metadata: Record<string, unknown>): BcAuth0MarketingPrefs {
  const marketing = asRecord(metadata.marketing) ?? asRecord(metadata.marketing_preferences);
  return {
    subscribeEmails: asPrefBoolean(marketing?.subscribeEmails ?? marketing?.subscribe_emails),
    marketingEmails: asPrefBoolean(marketing?.marketingEmails ?? marketing?.marketing_emails),
  };
}

export function buildBcAuth0AccountProfile(user: User | null | undefined): BcAuth0AccountProfile | null {
  if (!user) {
    return null;
  }

  const record = user as Record<string, unknown>;
  const metadata = asRecord(record.user_metadata) ?? {};
  const givenName =
    asString(record.given_name) ||
    readMetadataString(metadata, 'first_name', 'firstName', 'firstname');
  const familyName =
    asString(record.family_name) ||
    readMetadataString(metadata, 'last_name', 'lastName', 'lastname');
  const { first: nameFirst, last: nameLast } = splitDisplayName(asString(user.name));

  return {
    firstName: givenName || nameFirst,
    lastName: familyName || nameLast,
    email: asString(user.email),
    company: asString(metadata.company),
    sector: asString(metadata.sector),
    jobRole: asString(metadata.job_role ?? metadata.jobRole ?? metadata.role),
    businessPostcode: asString(metadata.business_postcode ?? metadata.businessPostcode),
    annualTurnover: asString(metadata.annual_turnover ?? metadata.annualTurnover),
    topicPreferences: asStringArray(metadata.topic_preferences ?? metadata.topicPreferences),
    marketing: readMarketingPrefs(metadata),
  };
}
