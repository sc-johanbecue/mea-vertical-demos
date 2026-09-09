import type { DiscussionCommentItem } from '@/lib/kpmg-beyond/fetch-community-content';

export function normalizeSitecoreItemId(id: string): string {
  return id.replace(/[{}-]/g, '').toLowerCase();
}

export function findDiscussionCommentById(
  comments: DiscussionCommentItem[],
  commentId: string
): DiscussionCommentItem | null {
  const normalizedTarget = normalizeSitecoreItemId(commentId);
  for (const comment of comments) {
    if (normalizeSitecoreItemId(comment.id) === normalizedTarget) {
      return comment;
    }
    const nested = findDiscussionCommentById(comment.replies, commentId);
    if (nested) {
      return nested;
    }
  }
  return null;
}

/** Insert a new top-level comment or reply while preserving optimistic UI. */
export function insertDiscussionComment(
  comments: DiscussionCommentItem[],
  comment: DiscussionCommentItem,
  parentCommentId?: string
): DiscussionCommentItem[] {
  if (!parentCommentId) {
    if (findDiscussionCommentById(comments, comment.id)) {
      return comments;
    }
    return [comment, ...comments];
  }

  const normalizedParent = normalizeSitecoreItemId(parentCommentId);
  return comments.map((existing) => {
    if (normalizeSitecoreItemId(existing.id) === normalizedParent) {
      if (findDiscussionCommentById(existing.replies, comment.id)) {
        return existing;
      }
      return {
        ...existing,
        replies: [...existing.replies, comment],
      };
    }
    if (existing.replies.length === 0) {
      return existing;
    }
    return {
      ...existing,
      replies: insertDiscussionComment(existing.replies, comment, parentCommentId),
    };
  });
}

/**
 * Prefer Edge/server data when ready, but keep any optimistic comments that
 * have not appeared in the live payload yet (Edge lag after publish).
 */
export function mergeDiscussionCommentsPreferServer(
  optimistic: DiscussionCommentItem[],
  server: DiscussionCommentItem[]
): DiscussionCommentItem[] {
  const missingOptimistic = optimistic.filter(
    (comment) => !findDiscussionCommentById(server, comment.id)
  );
  if (missingOptimistic.length === 0) {
    return server;
  }
  return [...missingOptimistic, ...server];
}

export function updateDiscussionCommentApproval(
  comments: DiscussionCommentItem[],
  commentId: string,
  approved: boolean
): DiscussionCommentItem[] {
  const normalizedTarget = normalizeSitecoreItemId(commentId);
  return comments.map((comment) => {
    const matches = normalizeSitecoreItemId(comment.id) === normalizedTarget;
    const nextComment = matches
      ? {
          ...comment,
          fields: {
            ...comment.fields,
            AdminApproved: { value: approved ? '1' : '0' },
          },
        }
      : comment;

    if (nextComment.replies.length === 0) {
      return nextComment;
    }

    return {
      ...nextComment,
      replies: updateDiscussionCommentApproval(nextComment.replies, commentId, approved),
    };
  });
}
