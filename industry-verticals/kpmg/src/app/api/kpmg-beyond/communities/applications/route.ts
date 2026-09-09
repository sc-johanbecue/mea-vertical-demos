import { NextRequest, NextResponse } from 'next/server';
import { getKpmgAuth0Session } from '@/lib/kpmg-auth0-session';
import { canSessionUserReviewCommunityApplications } from '@/lib/kpmg-beyond/community-application-access';
import { readCommunityJoinRequests } from '@/lib/kpmg-beyond/community-join-requests-sitecore';
import { fetchCommunityJoinContextById } from '@/lib/kpmg-beyond/fetch-community-content';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await getKpmgAuth0Session();
  const domain = process.env.AUTH0_DOMAIN;
  if (!session?.user || !domain) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const communityId = request.nextUrl.searchParams.get('communityId');
  const language = request.nextUrl.searchParams.get('language') || 'en';
  if (!communityId) {
    return NextResponse.json({ error: 'communityId is required' }, { status: 400 });
  }

  const community = await fetchCommunityJoinContextById(communityId, language);
  if (!community) {
    return NextResponse.json({ error: 'Community not found' }, { status: 404 });
  }

  const communityTitle = community.fields.Title?.value?.toString().trim();
  const canReview = await canSessionUserReviewCommunityApplications(
    session.user,
    domain,
    communityId,
    communityTitle
  );
  if (!canReview) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const applications = await readCommunityJoinRequests(communityId, language);
  return NextResponse.json({ applications, source: 'sitecore' });
}
