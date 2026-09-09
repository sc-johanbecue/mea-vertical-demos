import { NextResponse, after } from 'next/server';
import { getAuth0ManagementUser, patchAuth0ManagementUser } from '@/lib/auth0-management';
import {
  COMMUNITIES_METADATA_KEY,
  getCommunityMembershipFromRecord,
  mergeCommunityMembershipInMetadata,
  normalizeCommunityId,
  readRawCommunitiesRecord,
  serializeCommunityMembershipForMetadata,
} from '@/lib/kpmg-auth0-communities';
import { getKpmgAuth0Session } from '@/lib/kpmg-auth0-session';
import {
  appendCommunityJoinRequestInSitecore,
  readCommunityJoinRequests,
} from '@/lib/kpmg-beyond/community-join-requests-sitecore';
import { fetchCommunityByIdHelper } from '@/lib/kpmg-beyond/community-api-helpers';
import { isJoinRequestAllowedFromFields } from '@/lib/kpmg-beyond/community-join-approval';
import { publishSitecoreItem } from '@/lib/sitecore-authoring-client';

export const dynamic = 'force-dynamic';

type JoinRequest = { communityId?: string };

export async function POST(request: Request) {
  const session = await getKpmgAuth0Session();
  const user = session?.user;
  const domain = process.env.AUTH0_DOMAIN;

  if (!user?.sub || !domain) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: JoinRequest;
  try {
    body = (await request.json()) as JoinRequest;
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

  if (!isJoinRequestAllowedFromFields(community.fields)) {
    return NextResponse.json(
      { error: 'This community does not accept join requests' },
      { status: 403 }
    );
  }

  const communityTitle = community.fields.Title?.value?.toString().trim();
  const nextStatus = 'requested' as const;
  const application = {
    userId: user.sub,
    email: user.email?.toString() || '',
    name: user.name?.toString() || user.email?.toString() || '',
    requestedAt: new Date().toISOString(),
  };

  const managementUser = await getAuth0ManagementUser(domain, user.sub);
  const existingCommunities = managementUser.ok
    ? readRawCommunitiesRecord(managementUser.user)
    : readRawCommunitiesRecord(user);
  const existingMembership = getCommunityMembershipFromRecord(
    existingCommunities,
    communityId,
    communityTitle
  );

  if (existingMembership === true || existingMembership === 'owner') {
    return NextResponse.json({
      ok: true,
      status: serializeCommunityMembershipForMetadata(existingMembership),
      communities: existingCommunities,
    });
  }

  const sitecoreRequests = await readCommunityJoinRequests(communityId, 'en');
  const alreadyInSitecore = sitecoreRequests.some(
    (entry) => normalizeCommunityId(entry.userId) === normalizeCommunityId(user.sub)
  );

  if (existingMembership === 'requested') {
    if (!alreadyInSitecore) {
      const repair = await appendCommunityJoinRequestInSitecore(communityId, application, 'en');
      if (!repair.ok) {
        return NextResponse.json({ error: repair.message }, { status: 502 });
      }
      after(() => {
        void publishSitecoreItem(communityId, 'en').catch(() => undefined);
      });
    }
    return NextResponse.json({
      ok: true,
      status: 'requested',
      communities: existingCommunities,
    });
  }

  const sitecoreResult = await appendCommunityJoinRequestInSitecore(communityId, application, 'en');
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
    nextStatus
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
    status: serializeCommunityMembershipForMetadata(nextStatus),
    communities: nextCommunities,
  });
}
