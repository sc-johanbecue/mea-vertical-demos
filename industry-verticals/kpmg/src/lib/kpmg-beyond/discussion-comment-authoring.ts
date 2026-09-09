import type { User } from '@auth0/nextjs-auth0/types';
import {
  createSitecoreChildItem,
  DISCUSSION_COMMENT_TEMPLATE_ID,
  type SitecoreItemFieldInput,
} from '@/lib/sitecore-authoring-client';
import type { DiscussionCommentItem } from '@/lib/kpmg-beyond/fetch-community-content';

export function formatDiscussionCommentBody(text: string): string {
  const escaped = text
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return `<div class="ck-content"><p>${escaped}</p></div>`;
}

export function buildDiscussionCommentItemName(): string {
  return `Comment ${Date.now()}`;
}

export function formatDiscussionCommentPublishedDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

const ONE_HOUR_MS = 60 * 60 * 1000;

function parseStoredDiscussionCommentPublishedDate(value: string): Date | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  if (trimmed.toLowerCase() === 'just now') {
    return new Date();
  }
  if (/\bago$/i.test(trimmed)) {
    return null;
  }

  const timestamp = Date.parse(trimmed.replace(',', ''));
  if (!Number.isNaN(timestamp)) {
    return new Date(timestamp);
  }
  return null;
}

/** Shows "Just now" for comments posted within the last hour; stored value stays unchanged. */
export function formatDiscussionCommentPublishedDateForDisplay(
  rawValue: unknown,
  now: Date = new Date()
): string {
  const value = rawValue?.toString().trim() ?? '';
  if (!value) {
    return '';
  }
  if (value.toLowerCase() === 'just now') {
    return 'Just now';
  }

  const parsed = parseStoredDiscussionCommentPublishedDate(value);
  if (!parsed) {
    return value;
  }

  const ageMs = now.getTime() - parsed.getTime();
  if (ageMs >= 0 && ageMs < ONE_HOUR_MS) {
    return 'Just now';
  }

  return value;
}

export function resolveCommentAuthorFields(user: User): SitecoreItemFieldInput[] {
  const name = user.name?.toString().trim() || user.nickname?.toString().trim() || 'Member';
  const email = user.email?.toString().trim() || '';
  return [
    { name: 'AuthorName', value: name },
    { name: 'AuthorTitle', value: 'Community member' },
    { name: 'AuthorCompany', value: email },
    { name: 'PublishedDate', value: formatDiscussionCommentPublishedDate() },
    { name: 'AdminApproved', value: '0' },
  ];
}

export function buildOptimisticDiscussionComment(
  itemId: string,
  body: string,
  user: User
): DiscussionCommentItem {
  const name = user.name?.toString().trim() || user.nickname?.toString().trim() || 'Member';
  const email = user.email?.toString().trim() || '';
  return {
    id: itemId,
    fields: {
      Body: { value: formatDiscussionCommentBody(body) },
      AuthorName: { value: name },
      AuthorTitle: { value: 'Community member' },
      AuthorCompany: { value: email },
      AuthorImage: { value: {} },
      PublishedDate: { value: formatDiscussionCommentPublishedDate() },
      AdminApproved: { value: '0' },
    },
    replies: [],
  };
}

export async function createDiscussionCommentItem(
  parentItemId: string,
  body: string,
  user: User,
  language: string = 'en'
): Promise<
  { ok: true; itemId: string; comment: DiscussionCommentItem } | { ok: false; message: string }
> {
  const fields: SitecoreItemFieldInput[] = [
    { name: 'Body', value: formatDiscussionCommentBody(body) },
    ...resolveCommentAuthorFields(user),
  ];

  const created = await createSitecoreChildItem(
    parentItemId,
    DISCUSSION_COMMENT_TEMPLATE_ID,
    buildDiscussionCommentItemName(),
    fields,
    language
  );
  if (!created.ok) {
    return created;
  }

  // Publish is kicked off by the API route after the response (background).
  return {
    ok: true,
    itemId: created.itemId,
    comment: buildOptimisticDiscussionComment(created.itemId, body, user),
  };
}
