import { NextResponse, after } from 'next/server';
import { getKpmgAuth0Session } from '@/lib/kpmg-auth0-session';
import { canModerateDiscussionComment } from '@/lib/kpmg-beyond/community-comment-moderation';
import { publishSitecoreItem, updateSitecoreItemField } from '@/lib/sitecore-authoring-client';

export const dynamic = 'force-dynamic';

type ApproveRequest = {
  commentId?: string;
  discussionId?: string;
  language?: string;
};

export async function POST(request: Request) {
  const session = await getKpmgAuth0Session();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: ApproveRequest;
  try {
    body = (await request.json()) as ApproveRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const commentId = body.commentId?.trim();
  const discussionId = body.discussionId?.trim() || undefined;
  const language = body.language?.trim() || 'en';
  if (!commentId) {
    return NextResponse.json({ error: 'commentId is required' }, { status: 400 });
  }

  const allowed = await canModerateDiscussionComment(
    session.user,
    commentId,
    discussionId,
    language
  );
  if (!allowed) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const result = await updateSitecoreItemField(commentId, 'AdminApproved', '1', language);
  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: 500 });
  }

  after(() => {
    void publishSitecoreItem(commentId, language).catch(() => undefined);
  });

  return NextResponse.json({ ok: true, approved: true });
}
