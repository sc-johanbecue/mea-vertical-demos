import type { User } from '@auth0/nextjs-auth0/types';

export type KpmgAuth0NotificationPrefs = {
  emailEnabled: boolean;
  mentionedInPost: boolean;
  replyToMessage: boolean;
  newDiscussion: boolean;
  messageLiked: boolean;
  applicationDeclined: boolean;
};

export type KpmgAuth0MarketingPrefs = {
  subscribeEmails: boolean;
  marketingEmails: boolean;
  newsletters: boolean;
  notificationEmails: boolean;
};

export type KpmgAuth0AccountProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  company: string;
  sector: string;
  jobRole: string;
  businessPostcode: string;
  annualTurnover: string;
  topicPreferences: string[];
  notifications: KpmgAuth0NotificationPrefs;
  marketing: KpmgAuth0MarketingPrefs;
  picture?: string;
};

export const defaultKpmgAuth0NotificationPrefs: KpmgAuth0NotificationPrefs = {
  emailEnabled: false,
  mentionedInPost: false,
  replyToMessage: false,
  newDiscussion: false,
  messageLiked: false,
  applicationDeclined: false,
};

export const defaultKpmgAuth0MarketingPrefs: KpmgAuth0MarketingPrefs = {
  subscribeEmails: false,
  marketingEmails: false,
  newsletters: false,
  notificationEmails: false,
};

export const dummyKpmgAuth0AccountProfile: KpmgAuth0AccountProfile = {
  firstName: 'Johan',
  lastName: 'Becue',
  email: 'jbe@sitecore.net',
  phoneNumber: 'N/A',
  company: 'Sitecore',
  sector: 'Technology',
  jobRole: 'Chief Engineer',
  businessPostcode: '1910',
  annualTurnover: 'Less than £5 million',
  topicPreferences: [
    'Cyber Security',
    'Digital Transformation',
    'Leadership and Personal Development',
  ],
  notifications: {
    emailEnabled: true,
    mentionedInPost: true,
    replyToMessage: false,
    newDiscussion: true,
    messageLiked: false,
    applicationDeclined: false,
  },
  marketing: {
    subscribeEmails: true,
    marketingEmails: true,
    newsletters: false,
    notificationEmails: true,
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

function readNotificationPrefs(metadata: Record<string, unknown>): KpmgAuth0NotificationPrefs {
  const notifications = asRecord(metadata.notifications) ?? asRecord(metadata.notification_settings);
  return {
    emailEnabled: asPrefBoolean(notifications?.emailEnabled ?? notifications?.email_enabled),
    mentionedInPost: asPrefBoolean(notifications?.mentionedInPost ?? notifications?.mentioned_in_post),
    replyToMessage: asPrefBoolean(notifications?.replyToMessage ?? notifications?.reply_to_message),
    newDiscussion: asPrefBoolean(notifications?.newDiscussion ?? notifications?.new_discussion),
    messageLiked: asPrefBoolean(notifications?.messageLiked ?? notifications?.message_liked),
    applicationDeclined: asPrefBoolean(
      notifications?.applicationDeclined ?? notifications?.application_declined
    ),
  };
}

function readMarketingPrefs(metadata: Record<string, unknown>): KpmgAuth0MarketingPrefs {
  const marketing = asRecord(metadata.marketing) ?? asRecord(metadata.marketing_preferences);
  return {
    subscribeEmails: asPrefBoolean(marketing?.subscribeEmails ?? marketing?.subscribe_emails),
    marketingEmails: asPrefBoolean(marketing?.marketingEmails ?? marketing?.marketing_emails),
    newsletters: asPrefBoolean(marketing?.newsletters),
    notificationEmails: asPrefBoolean(marketing?.notificationEmails ?? marketing?.notification_emails),
  };
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

export function buildKpmgAuth0AccountProfile(user: User | null | undefined): KpmgAuth0AccountProfile | null {
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
    phoneNumber: asString(
      record.phone_number ||
        readMetadataString(metadata, 'phone_number', 'phoneNumber', 'phonenumber'),
      'N/A'
    ),
    company: asString(metadata.company),
    sector: asString(metadata.sector),
    jobRole: asString(metadata.job_role ?? metadata.jobRole ?? metadata.role),
    businessPostcode: asString(metadata.business_postcode ?? metadata.businessPostcode),
    annualTurnover: asString(metadata.annual_turnover ?? metadata.annualTurnover),
    topicPreferences: asStringArray(metadata.topic_preferences ?? metadata.topicPreferences),
    notifications: readNotificationPrefs(metadata),
    marketing: readMarketingPrefs(metadata),
    picture: asString(record.picture ?? user.picture, undefined),
  };
}

export function resolveKpmgAuth0DisplayName(user: User | null | undefined): string {
  const profile = buildKpmgAuth0AccountProfile(user);
  if (!profile) {
    return '';
  }

  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ');
  if (fullName) {
    return fullName;
  }

  return user?.name?.toString() || user?.nickname?.toString() || '';
}

export function parseMultilineOptions(value: string | undefined): string[] {
  if (!value) {
    return [];
  }
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}
