import { fetchCommunityJoinContextById } from '@/lib/kpmg-beyond/fetch-community-content';

export async function fetchCommunityByIdHelper(communityId: string, language: string) {
  return fetchCommunityJoinContextById(communityId, language);
}
