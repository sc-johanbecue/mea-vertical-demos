import type { User } from '@auth0/nextjs-auth0/types';
import { getAuth0ManagementUser } from '@/lib/auth0-management';
import {
  getCommunityMembershipFromRecord,
  isCommunityAdmin,
  isCommunityOwner,
  readRawCommunitiesRecord,
} from '@/lib/kpmg-auth0-communities';

/** Resolves owner/admin access using Auth0 Management API (JWT alone may be stale). */
export async function canSessionUserReviewCommunityApplications(
  user: User,
  domain: string,
  communityId: string,
  communityTitle?: string
): Promise<boolean> {
  if (isCommunityAdmin(user) || isCommunityOwner(user, communityId, communityTitle)) {
    return true;
  }

  const userId = user.sub?.trim();
  if (!userId) {
    return false;
  }

  const managementUser = await getAuth0ManagementUser(domain, userId);
  if (!managementUser.ok) {
    return false;
  }

  return (
    getCommunityMembershipFromRecord(
      readRawCommunitiesRecord(managementUser.user),
      communityId,
      communityTitle
    ) === 'owner'
  );
}
