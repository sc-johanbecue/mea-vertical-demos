import { NextRequest, NextResponse, after } from 'next/server';
import { isCommunityJoined } from '@/lib/kpmg-auth0-communities';
import { canModerateSitecoreItemComments } from '@/lib/kpmg-beyond/community-comment-moderation';
import { createDiscussionCommentItem } from '@/lib/kpmg-beyond/discussion-comment-authoring';
import { validateDiscussionCommentWithAi } from '@/lib/kpmg-beyond/discussion-comment-ai-moderation';
import { filterDiscussionCommentsForViewer } from '@/lib/kpmg-beyond/discussion-comment-visibility';
import {
  fetchCommunityGuidelinesById,
  fetchDiscussionComments,
  isSitecoreItemDescendantOf,
  resolveCommunityContextForSitecoreItem,
} from '@/lib/kpmg-beyond/fetch-community-content';
import { getKpmgAuth0Session } from '@/lib/kpmg-auth0-session';
import { publishSitecoreItem } from '@/lib/sitecore-authoring-client';

export const dynamic = 'force-dynamic';

type CreateCommentRequest = {
  discussionId?: string;
  parentCommentId?: string;
  body?: string;
  language?: string;
};

export async function GET(request: NextRequest): Promise<NextResponse> {
  const discussionId = request.nextUrl.searchParams.get('discussionId');
  const language = request.nextUrl.searchParams.get('language') || 'en';
  if (!discussionId) {
    return NextResponse.json({ error: 'discussionId is required' }, { status: 400 });
  }

  const session = await getKpmgAuth0Session();
  const canModerate = await canModerateSitecoreItemComments(
    session?.user,
    discussionId,
    language
  );
  const includeUnapproved = canModerate || Boolean(session?.user);
  const rawComments = await fetchDiscussionComments(discussionId, language, includeUnapproved);
  const comments = filterDiscussionCommentsForViewer(rawComments, session?.user, canModerate);
  return NextResponse.json(
    { comments },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  );
}

export async function POST(request: Request): Promise<NextResponse> {
  const session = await getKpmgAuth0Session();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: CreateCommentRequest;
  try {
    body = (await request.json()) as CreateCommentRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const discussionId = body.discussionId?.trim();
  const commentBody = body.body?.trim();
  const language = body.language?.trim() || 'en';
  const parentCommentId = body.parentCommentId?.trim() || undefined;

  if (!discussionId || !commentBody) {
    return NextResponse.json({ error: 'discussionId and body are required' }, { status: 400 });
  }

  const communityContext = await resolveCommunityContextForSitecoreItem(discussionId, language);
  if (!communityContext) {
    return NextResponse.json({ error: 'Discussion community not found' }, { status: 404 });
  }

  if (!isCommunityJoined(session.user, communityContext.id, communityContext.title)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const parentItemId = parentCommentId ?? discussionId;
  if (parentCommentId) {
    const validParent = await isSitecoreItemDescendantOf(
      parentCommentId,
      discussionId,
      language
    );
    if (!validParent) {
      return NextResponse.json({ error: 'Invalid parent comment' }, { status: 400 });
    }
  }

  const guidelinesHtml = await fetchCommunityGuidelinesById(communityContext.id, language);
  const moderation = await validateDiscussionCommentWithAi(commentBody, guidelinesHtml ?? undefined);
  if (!moderation.allowed) {
    return NextResponse.json({ error: moderation.reason }, { status: 422 });
  }

  const result = await createDiscussionCommentItem(
    parentItemId,
    commentBody,
    session.user,
    language
  );

  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: 500 });
  }

  // Publish to Edge after the response so the UI can show the comment immediately.
  after(() => {
    void publishSitecoreItem(result.itemId, language).catch(() => undefined);
  });

  return NextResponse.json({
    ok: true,
    itemId: result.itemId,
    pendingModeration: true,
    comment: result.comment,
    parentCommentId: parentCommentId ?? null,
  });
}
