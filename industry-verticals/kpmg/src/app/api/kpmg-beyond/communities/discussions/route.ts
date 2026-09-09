import { NextRequest, NextResponse } from 'next/server';
import { canModerateCommunityComments, isCommunityAdmin } from '@/lib/kpmg-auth0-communities';
import { getKpmgAuth0Session } from '@/lib/kpmg-auth0-session';
import { fetchCommunityDiscussions } from '@/lib/kpmg-beyond/fetch-community-content';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const communityId = request.nextUrl.searchParams.get('communityId');
  const language = request.nextUrl.searchParams.get('language') || 'en';
  if (!communityId) {
    return NextResponse.json({ error: 'communityId is required' }, { status: 400 });
  }

  try {
    const session = await getKpmgAuth0Session();
    const includeUnapproved =
      isCommunityAdmin(session?.user) ||
      canModerateCommunityComments(session?.user, communityId);
    const discussions = await fetchCommunityDiscussions(communityId, language, includeUnapproved);
    return NextResponse.json({ discussions });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load discussions';
    return NextResponse.json({ error: message, discussions: [] }, { status: 500 });
  }
}
