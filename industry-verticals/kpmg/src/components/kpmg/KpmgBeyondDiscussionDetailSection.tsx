'use client';

import type { JSX } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import type { User } from '@auth0/nextjs-auth0/types';
import { Image as SitecoreImage, Link as SitecoreLink, RichText, Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import type { DiscussionCommentItem } from '@/lib/kpmg-beyond/fetch-community-content';
import {
  isDiscussionCommentApproved,
  isDiscussionCommentAuthoredByUser,
} from '@/lib/kpmg-beyond/discussion-comment-visibility';
import {
  findDiscussionCommentById,
  insertDiscussionComment,
  mergeDiscussionCommentsPreferServer,
  updateDiscussionCommentApproval,
} from '@/lib/kpmg-beyond/discussion-comment-state';
import { formatDiscussionCommentPublishedDateForDisplay } from '@/lib/kpmg-beyond/discussion-comment-authoring';
import { useEditingHydrationProps } from './kpmg-editing-hydration';
import {
  useKpmgBeyondDiscussionCommunityContext,
  useKpmgBeyondDiscussionPageFields,
  useKpmgBeyondDiscussionRouteItemId,
} from './kpmg-beyond-community-route-fields';
import { useKpmgBeyondCommunityMembership } from './kpmg-beyond-community-membership';

function CommentComposer({
  placeholder,
  submitLabel,
  onSubmit,
  onCancel,
  onTextChange,
}: {
  placeholder: string;
  submitLabel: string;
  onSubmit: (text: string) => Promise<string | void>;
  onCancel?: () => void;
  onTextChange?: () => void;
}): JSX.Element {
  const [text, setText] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const value = text.trim();
    if (!value || pending) {
      return;
    }
    setPending(true);
    setError(null);
    try {
      const message = await onSubmit(value);
      if (message) {
        setError(message);
        return;
      }
      setText('');
      onCancel?.();
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="mt-3 space-y-2">
      <textarea
        value={text}
        onChange={(event) => {
          setText(event.target.value);
          setError(null);
          onTextChange?.();
        }}
        placeholder={placeholder}
        rows={3}
        className="w-full rounded-2xl border border-white/20 bg-transparent px-4 py-3 text-sm text-white outline-none focus:border-kpmg-purple"
      />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={pending || !text.trim()}
          onClick={() => void handleSubmit()}
          className="rounded-full bg-kpmg-purple px-4 py-2 text-xs font-medium text-white disabled:opacity-60"
        >
          {pending ? 'Posting…' : submitLabel}
        </button>
        {onCancel ? (
          <button
            type="button"
            disabled={pending}
            onClick={onCancel}
            className="rounded-full border border-white/30 px-4 py-2 text-xs text-white"
          >
            Cancel
          </button>
        ) : null}
      </div>
      {error ? <p className="text-sm text-amber-300">{error}</p> : null}
    </div>
  );
}

function CommentNode({
  comment,
  canModerate,
  canReply,
  currentUser,
  replyingToId,
  onStartReply,
  onCancelReply,
  onSubmitReply,
  onApprove,
  onUnapprove,
}: {
  comment: DiscussionCommentItem;
  canModerate: boolean;
  canReply: boolean;
  currentUser: User | undefined;
  replyingToId: string | null;
  onStartReply: (commentId: string) => void;
  onCancelReply: () => void;
  onSubmitReply: (commentId: string, text: string) => Promise<string | void>;
  onApprove: (commentId: string) => void;
  onUnapprove: (commentId: string) => void;
}): JSX.Element {
  const approved = isDiscussionCommentApproved(comment);
  const isOwnPending = !approved && isDiscussionCommentAuthoredByUser(comment, currentUser);
  const isReplying = replyingToId === comment.id;

  return (
    <div className="border-t border-white/10 py-4 pl-0 md:pl-4">
      <div className="flex gap-3">
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-kpmg-elevated">
          {comment.fields.AuthorImage?.value?.src ? (
            <SitecoreImage field={comment.fields.AuthorImage} className="h-full w-full object-cover" />
          ) : null}
        </div>
        <div className="flex-1">
          <p className="m-0 text-sm text-white/70">
            {comment.fields.AuthorName?.value?.toString()} • {comment.fields.AuthorTitle?.value?.toString()} •{' '}
            {formatDiscussionCommentPublishedDateForDisplay(comment.fields.PublishedDate?.value)}
            {canModerate ? (
              <span className={approved ? ' text-emerald-300' : ' text-amber-300'}>
                {' '}
                • {approved ? 'Approved' : 'Pending moderation'}
              </span>
            ) : isOwnPending ? (
              <span className=" text-amber-300"> • Pending approval</span>
            ) : null}
          </p>
          <RichText field={comment.fields.Body} className="mt-2 text-sm text-white/90" />
          <div className="mt-2 flex flex-wrap gap-2">
            {canReply ? (
              <button
                type="button"
                onClick={() => onStartReply(comment.id)}
                className="text-xs text-kpmg-purple underline"
              >
                Reply
              </button>
            ) : null}
            {canModerate ? (
              !approved ? (
                <button
                  type="button"
                  onClick={() => onApprove(comment.id)}
                  className="rounded-full bg-kpmg-purple px-4 py-1 text-xs text-white"
                >
                  Approve comment
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onUnapprove(comment.id)}
                  className="rounded-full border border-white/30 px-4 py-1 text-xs text-white"
                >
                  Unapprove comment
                </button>
              )
            ) : null}
          </div>
          {isReplying ? (
            <CommentComposer
              placeholder="Write a reply..."
              submitLabel="Post reply"
              onCancel={onCancelReply}
              onSubmit={(text) => onSubmitReply(comment.id, text)}
            />
          ) : null}
        </div>
      </div>
      {comment.replies.map((reply) => (
        <div key={reply.id} className="ml-6 mt-2 border-l border-white/10 pl-4">
          <CommentNode
            comment={reply}
            canModerate={canModerate}
            canReply={canReply}
            currentUser={currentUser}
            replyingToId={replyingToId}
            onStartReply={onStartReply}
            onCancelReply={onCancelReply}
            onSubmitReply={onSubmitReply}
            onApprove={onApprove}
            onUnapprove={onUnapprove}
          />
        </div>
      ))}
    </div>
  );
}

export type KpmgBeyondDiscussionDetailSectionProps = ComponentProps;

export const Default = (props: KpmgBeyondDiscussionDetailSectionProps): JSX.Element => {
  const fields = useKpmgBeyondDiscussionPageFields(props);
  const discussionId = useKpmgBeyondDiscussionRouteItemId();
  const { user } = useUser();
  const { communityId, communityTitle, contextLoading } = useKpmgBeyondDiscussionCommunityContext(
    discussionId
  );
  const { joined, canModerateComments, isLoading: membershipLoading } = useKpmgBeyondCommunityMembership(
    communityId,
    communityTitle
  );
  const editingHydration = useEditingHydrationProps();
  const [comments, setComments] = useState<DiscussionCommentItem[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [postMessage, setPostMessage] = useState<string | null>(null);
  const [moderationMessage, setModerationMessage] = useState<string | null>(null);

  const fetchComments = useCallback(async (): Promise<DiscussionCommentItem[]> => {
    if (!discussionId || !joined) {
      return [];
    }
    const response = await fetch(
      `/api/kpmg-beyond/discussions/comments?discussionId=${encodeURIComponent(discussionId)}&_=${Date.now()}`,
      { cache: 'no-store' }
    );
    const data = (await response.json()) as { comments?: DiscussionCommentItem[] };
    return data.comments ?? [];
  }, [discussionId, joined]);

  /** Quiet background sync — keeps optimistic UI until Edge has the change. */
  const syncCommentsInBackground = useCallback(
    async (isReady: (next: DiscussionCommentItem[]) => boolean) => {
      const attempts = 10;
      const delayMs = 1200;
      for (let attempt = 0; attempt < attempts; attempt += 1) {
        if (attempt > 0) {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
        try {
          const latest = await fetchComments();
          if (!isReady(latest)) {
            continue;
          }
          setComments((current) => mergeDiscussionCommentsPreferServer(current, latest));
          return;
        } catch {
          // Keep trying through Edge lag.
        }
      }
    },
    [fetchComments]
  );

  useEffect(() => {
    let cancelled = false;
    setCommentsLoading(true);
    void fetchComments()
      .then((nextComments) => {
        if (!cancelled) {
          setComments(nextComments);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setComments([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setCommentsLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [fetchComments]);

  const submitComment = useCallback(
    async (body: string, parentCommentId?: string): Promise<string | void> => {
      if (!discussionId) {
        return;
      }
      setPostMessage(null);
      const response = await fetch('/api/kpmg-beyond/discussions/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          discussionId,
          parentCommentId,
          body,
        }),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        return data?.error || 'Failed to post comment.';
      }
      const data = (await response.json()) as {
        pendingModeration?: boolean;
        itemId?: string;
        comment?: DiscussionCommentItem;
        parentCommentId?: string | null;
      };

      if (data.comment) {
        setComments((current) =>
          insertDiscussionComment(
            current,
            data.comment!,
            data.parentCommentId ?? parentCommentId
          )
        );
      }

      if (!parentCommentId && data.pendingModeration) {
        setPostMessage(
          'Comment posted, but still pending approval from the community owner.'
        );
      }
      setReplyingToId(null);

      const postedItemId = data.itemId?.trim() || data.comment?.id;
      if (postedItemId) {
        void syncCommentsInBackground((next) =>
          Boolean(findDiscussionCommentById(next, postedItemId))
        );
      }
    },
    [discussionId, syncCommentsInBackground]
  );

  const setCommentApproval = useCallback(
    async (commentId: string, approved: boolean) => {
      if (!discussionId) {
        return;
      }
      setModerationMessage(null);

      let snapshot: DiscussionCommentItem[] = [];
      setComments((current) => {
        snapshot = current;
        return updateDiscussionCommentApproval(current, commentId, approved);
      });

      const endpoint = approved
        ? '/api/kpmg-beyond/discussions/comments/approve'
        : '/api/kpmg-beyond/discussions/comments/unapprove';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId, discussionId }),
      });

      if (!response.ok) {
        setComments(snapshot);
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        setModerationMessage(
          data?.error ||
            (approved ? 'Could not approve this comment.' : 'Could not unapprove this comment.')
        );
        return;
      }

      // Optimistic UI already shows Approved/Pending; reload from Edge when publish lands.
      void syncCommentsInBackground((next) => {
        const comment = findDiscussionCommentById(next, commentId);
        if (!comment) {
          return false;
        }
        return isDiscussionCommentApproved(comment) === approved;
      });
    },
    [discussionId, syncCommentsInBackground]
  );

  const approveComment = useCallback(
    (commentId: string) => void setCommentApproval(commentId, true),
    [setCommentApproval]
  );

  const unapproveComment = useCallback(
    (commentId: string) => void setCommentApproval(commentId, false),
    [setCommentApproval]
  );

  if (contextLoading || membershipLoading) {
    return (
      <section className="component kpmg-beyond-discussion-detail w-full px-5 py-8 xl:px-[60px]">
        <div className="mx-auto w-full max-w-[800px] py-10 text-center text-sm text-white/70">
          Loading discussion…
        </div>
      </section>
    );
  }

  if (!joined) {
    return (
      <section className="component kpmg-beyond-discussion-detail w-full px-5 py-8 xl:px-[60px]">
        <div className="mx-auto w-full max-w-[800px] py-10 text-center">
          <p className="text-lg font-semibold text-white">Members only</p>
          <p className="text-sm text-white/70">Join this community to view and join the discussion.</p>
        </div>
      </section>
    );
  }

  return (
    <section
      {...editingHydration}
      data-cy="discussion-detail"
      className="component kpmg-beyond-discussion-detail w-full px-5 py-8 xl:px-[60px]"
    >
      <div className="mx-auto w-full max-w-[800px]">
        <div className="mb-6 flex gap-3">
          <div className="h-12 w-12 overflow-hidden rounded-full bg-kpmg-elevated">
            {fields.AuthorImage?.value?.src ? (
              <SitecoreImage field={fields.AuthorImage} className="h-full w-full object-cover" />
            ) : null}
          </div>
          <div>
            <Text tag="p" field={fields.AuthorName} className="m-0 font-semibold text-white" />
            <p className="m-0 text-sm text-white/70">
              {fields.AuthorTitle?.value?.toString()} • {fields.AuthorCompany?.value?.toString()} •{' '}
              {fields.PublishedDate?.value?.toString()}
            </p>
          </div>
        </div>

        <RichText field={fields.Body} className="prose prose-invert max-w-none text-white/90" />

        {fields.LinkPreviewTitle?.value ? (
          <article className="mt-6 flex gap-4 bg-kpmg-card p-4">
            <SitecoreImage field={fields.LinkPreviewImage} className="h-24 w-32 object-cover" />
            <div>
              <Text tag="h3" field={fields.LinkPreviewTitle} className="text-lg font-semibold text-white" />
              <Text tag="p" field={fields.LinkPreviewSummary} className="mt-2 text-sm text-white/80" />
              <SitecoreLink field={fields.LinkPreviewUrl} className="mt-2 inline-block text-sm text-kpmg-purple underline" />
            </div>
          </article>
        ) : null}

        <div className="mt-6 flex gap-6 text-sm text-white/70">
          <span>♥ {fields.LikeCount?.value?.toString() || '0'}</span>
          <span>💬 {fields.CommentCount?.value?.toString() || '0'}</span>
          <span>👁 {fields.ViewCount?.value?.toString() || '0'}</span>
        </div>

        <div className="mt-10">
          <h3 className="mb-3 text-sm font-semibold text-white">Add a comment</h3>
          <CommentComposer
            placeholder="Write your comment..."
            submitLabel="Post comment"
            onSubmit={(text) => submitComment(text)}
            onTextChange={() => setPostMessage(null)}
          />
          {postMessage ? <p className="mt-3 text-sm text-white/70">{postMessage}</p> : null}
        </div>

        <div className="mt-8">
          {moderationMessage ? (
            <p className="mb-4 text-sm text-amber-300">{moderationMessage}</p>
          ) : null}
          {commentsLoading ? (
            <div className="py-10 text-center text-sm text-white/70">Loading comments…</div>
          ) : comments.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-lg font-semibold text-white">No comments yet</p>
              <p className="text-sm text-white/70">Be the first to comment!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <CommentNode
                key={comment.id}
                comment={comment}
                canModerate={canModerateComments}
                canReply={joined}
                currentUser={user ?? undefined}
                replyingToId={replyingToId}
                onStartReply={setReplyingToId}
                onCancelReply={() => setReplyingToId(null)}
                onSubmitReply={(commentId, text) => submitComment(text, commentId)}
                onApprove={approveComment}
                onUnapprove={unapproveComment}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
};
