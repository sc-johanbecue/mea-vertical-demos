import {
  appendCommunityJoinRequest,
  parseCommunityJoinRequests,
  removeCommunityJoinRequest,
  type CommunityJoinRequest,
} from '@/lib/kpmg-auth0-communities';
import { fetchCommunityJoinContextById } from '@/lib/kpmg-beyond/fetch-community-content';
import { readSitecoreItemField, updateSitecoreItemField } from '@/lib/sitecore-authoring-client';

/** Reads JoinRequests from Sitecore Authoring (source of truth), Edge as fallback. */
export async function readCommunityJoinRequests(
  communityId: string,
  language: string = 'en'
): Promise<CommunityJoinRequest[]> {
  const authoringField = await readSitecoreItemField(communityId, 'JoinRequests', language);
  if (authoringField.ok) {
    return parseCommunityJoinRequests(authoringField.value);
  }

  const community = await fetchCommunityJoinContextById(communityId, language);
  return parseCommunityJoinRequests(community?.fields.JoinRequests?.value);
}

export async function saveCommunityJoinRequests(
  communityId: string,
  requests: CommunityJoinRequest[],
  language: string = 'en'
): Promise<{ ok: true } | { ok: false; message: string }> {
  return updateSitecoreItemField(communityId, 'JoinRequests', JSON.stringify(requests), language);
}

export async function appendCommunityJoinRequestInSitecore(
  communityId: string,
  request: CommunityJoinRequest,
  language: string = 'en'
): Promise<{ ok: true; requests: CommunityJoinRequest[] } | { ok: false; message: string }> {
  const existing = await readCommunityJoinRequests(communityId, language);
  const next = appendCommunityJoinRequest(existing, request);
  const result = await saveCommunityJoinRequests(communityId, next, language);
  if (!result.ok) {
    return result;
  }
  return { ok: true, requests: next };
}

export async function removeCommunityJoinRequestInSitecore(
  communityId: string,
  userId: string,
  language: string = 'en'
): Promise<{ ok: true; requests: CommunityJoinRequest[] } | { ok: false; message: string }> {
  const existing = await readCommunityJoinRequests(communityId, language);
  const next = removeCommunityJoinRequest(existing, userId);
  const result = await saveCommunityJoinRequests(communityId, next, language);
  if (!result.ok) {
    return result;
  }
  return { ok: true, requests: next };
}
