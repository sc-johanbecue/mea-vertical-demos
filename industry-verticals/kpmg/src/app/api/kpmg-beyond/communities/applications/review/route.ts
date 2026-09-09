import { NextResponse, after } from 'next/server';
import { getAuth0ManagementUser, patchAuth0ManagementUser } from '@/lib/auth0-management';
import {
  COMMUNITIES_METADATA_KEY,
  mergeCommunityMembershipInMetadata,
  readRawCommunitiesRecord,
  type CommunityJoinRequest,
} from '@/lib/kpmg-auth0-communities';
import { getKpmgAuth0Session } from '@/lib/kpmg-auth0-session';
import { canSessionUserReviewCommunityApplications } from '@/lib/kpmg-beyond/community-application-access';
import { removeCommunityJoinRequestInSitecore } from '@/lib/kpmg-beyond/community-join-requests-sitecore';
import { fetchCommunityJoinContextById } from '@/lib/kpmg-beyond/fetch-community-content';
import { publishSitecoreItem } from '@/lib/sitecore-authoring-client';

export const dynamic = 'force-dynamic';

type ReviewRequest = {
  communityId?: string;
  userId?: string;
  approve?: boolean;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export async function POST(request: Request) {
  const session = await getKpmgAuth0Session();
  const domain = process.env.AUTH0_DOMAIN;
  if (!session?.user || !domain) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: ReviewRequest;
  try {
    body = (await request.json()) as ReviewRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const communityId = body.communityId?.trim();
  const userId = body.userId?.trim();
  const language = 'en';
  if (!communityId || !userId) {
    return NextResponse.json({ error: 'communityId and userId are required' }, { status: 400 });
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

  const sitecoreResult = await removeCommunityJoinRequestInSitecore(communityId, userId, language);
  if (!sitecoreResult.ok) {
    return NextResponse.json({ error: sitecoreResult.message }, { status: 502 });
  }

  const targetUser = await getAuth0ManagementUser(domain, userId);
  if (!targetUser.ok) {
    return NextResponse.json({ error: targetUser.message }, { status: targetUser.status });
  }

  const existingAppMetadata = asRecord(targetUser.user.app_metadata);
  const existingCommunities = readRawCommunitiesRecord(targetUser.user);
  const nextCommunities = mergeCommunityMembershipInMetadata(
    existingCommunities,
    communityId,
    communityTitle,
    body.approve ? true : false
  );

  const result = await patchAuth0ManagementUser(domain, userId, {
    app_metadata: {
      ...existingAppMetadata,
      [COMMUNITIES_METADATA_KEY]: nextCommunities,
    },
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: result.status });
  }

  // Keep Edge in sync without blocking the admin UI.
  after(() => {
    void publishSitecoreItem(communityId, language).catch(() => undefined);
  });

  return NextResponse.json({
    ok: true,
    approve: Boolean(body.approve),
    applications: sitecoreResult.requests as CommunityJoinRequest[],
    communities: nextCommunities,
  });
}
