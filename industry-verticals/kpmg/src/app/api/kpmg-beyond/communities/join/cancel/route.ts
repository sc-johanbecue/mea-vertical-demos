import { NextResponse, after } from 'next/server';
import { getAuth0ManagementUser, patchAuth0ManagementUser } from '@/lib/auth0-management';
import {
  COMMUNITIES_METADATA_KEY,
  getCommunityMembershipFromRecord,
  mergeCommunityMembershipInMetadata,
  readRawCommunitiesRecord,
} from '@/lib/kpmg-auth0-communities';
import { getKpmgAuth0Session } from '@/lib/kpmg-auth0-session';
import { removeCommunityJoinRequestInSitecore } from '@/lib/kpmg-beyond/community-join-requests-sitecore';
import { fetchCommunityByIdHelper } from '@/lib/kpmg-beyond/community-api-helpers';
import { publishSitecoreItem } from '@/lib/sitecore-authoring-client';

export const dynamic = 'force-dynamic';

type CancelJoinRequest = { communityId?: string };

export async function POST(request: Request) {
  const session = await getKpmgAuth0Session();
  const user = session?.user;
  const domain = process.env.AUTH0_DOMAIN;

  if (!user?.sub || !domain) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: CancelJoinRequest;
  try {
    body = (await request.json()) as CancelJoinRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const communityId = body.communityId?.trim();
  if (!communityId) {
    return NextResponse.json({ error: 'Missing communityId' }, { status: 400 });
  }

  let community;
  try {
    community = await fetchCommunityByIdHelper(communityId, 'en');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load community';
    return NextResponse.json({ error: message }, { status: 502 });
  }
  if (!community) {
    return NextResponse.json({ error: 'Community not found' }, { status: 404 });
  }

  const communityTitle = community.fields.Title?.value?.toString().trim();
  const managementUser = await getAuth0ManagementUser(domain, user.sub);
  if (!managementUser.ok) {
    return NextResponse.json({ error: managementUser.message }, { status: managementUser.status });
  }

  const existingCommunities = readRawCommunitiesRecord(managementUser.user);
  const existingMembership = getCommunityMembershipFromRecord(
    existingCommunities,
    communityId,
    communityTitle
  );

  if (existingMembership !== 'requested') {
    return NextResponse.json(
      { error: 'No pending application to cancel for this community' },
      { status: 400 }
    );
  }

  const sitecoreResult = await removeCommunityJoinRequestInSitecore(communityId, user.sub, 'en');
  if (!sitecoreResult.ok) {
    return NextResponse.json({ error: sitecoreResult.message }, { status: 502 });
  }

  after(() => {
    void publishSitecoreItem(communityId, 'en').catch(() => undefined);
  });

  const nextCommunities = mergeCommunityMembershipInMetadata(
    existingCommunities,
    communityId,
    communityTitle,
    false
  );

  const result = await patchAuth0ManagementUser(domain, user.sub, {
    app_metadata: {
      [COMMUNITIES_METADATA_KEY]: nextCommunities,
    },
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: result.status });
  }

  return NextResponse.json({
    ok: true,
    communities: nextCommunities,
  });
}
