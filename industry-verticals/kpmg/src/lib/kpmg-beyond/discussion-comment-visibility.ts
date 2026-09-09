import type { User } from '@auth0/nextjs-auth0/types';
import type { DiscussionCommentItem } from '@/lib/kpmg-beyond/fetch-community-content';

export function isDiscussionCommentApproved(
  comment: DiscussionCommentItem
): boolean {
  const value = comment.fields.AdminApproved?.value?.toString().trim().toLowerCase() ?? '';
  return value === '1' || value === 'true' || value === 'yes';
}

export function isDiscussionCommentAuthoredByUser(
  comment: DiscussionCommentItem,
  user: User | undefined
): boolean {
  if (!user) {
    return false;
  }

  const email = user.email?.toString().trim().toLowerCase();
  const authorEmail = comment.fields.AuthorCompany?.value?.toString().trim().toLowerCase();
  if (email && authorEmail && email === authorEmail) {
    return true;
  }

  const name = user.name?.toString().trim().toLowerCase();
  const authorName = comment.fields.AuthorName?.value?.toString().trim().toLowerCase();
  return Boolean(name && authorName && name === authorName);
}

/** Owners/moderators see all; authors see their own pending comments; others see approved only. */
export function filterDiscussionCommentsForViewer(
  comments: DiscussionCommentItem[],
  user: User | undefined,
  canModerate: boolean
): DiscussionCommentItem[] {
  if (canModerate) {
    return comments;
  }

  return comments
    .map((comment) => {
      const approved = isDiscussionCommentApproved(comment);
      const isOwn = isDiscussionCommentAuthoredByUser(comment, user);
      if (!approved && !isOwn) {
        return null;
      }
      return {
        ...comment,
        replies: filterDiscussionCommentsForViewer(comment.replies, user, canModerate),
      };
    })
    .filter((comment): comment is DiscussionCommentItem => Boolean(comment));
}
