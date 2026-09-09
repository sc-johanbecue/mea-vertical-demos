import type { User } from '@auth0/nextjs-auth0/types';
import { canModerateCommunityComments } from '@/lib/kpmg-auth0-communities';
import { resolveCommunityContextForSitecoreItem } from '@/lib/kpmg-beyond/fetch-community-content';

export async function canModerateSitecoreItemComments(
  user: User | undefined,
  itemId: string,
  language: string = 'en'
): Promise<boolean> {
  if (!user) {
    return false;
  }
  const community = await resolveCommunityContextForSitecoreItem(itemId, language);
  if (!community) {
    return false;
  }
  return canModerateCommunityComments(user, community.id, community.title);
}

export async function canModerateDiscussionComment(
  user: User | undefined,
  commentId: string,
  discussionId: string | undefined,
  language: string = 'en'
): Promise<boolean> {
  if (await canModerateSitecoreItemComments(user, commentId, language)) {
    return true;
  }
  if (discussionId) {
    return canModerateSitecoreItemComments(user, discussionId, language);
  }
  return false;
}
