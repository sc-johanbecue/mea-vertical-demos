import type { CommunityCardFields } from '@/lib/kpmg-beyond/fetch-community-content';

function readPrivacyStatus(fields: Pick<CommunityCardFields, 'PrivacyStatus'>): string {
  return fields.PrivacyStatus?.value?.toString().trim().toLowerCase() ?? '';
}

export function isCommunityClosedFromFields(
  fields: Pick<CommunityCardFields, 'PrivacyStatus'>
): boolean {
  return readPrivacyStatus(fields) === 'closed';
}

export function isCommunityPrivateFromFields(
  fields: Pick<CommunityCardFields, 'PrivacyStatus'>
): boolean {
  return readPrivacyStatus(fields) === 'private';
}

/** Open communities accept join applications (owner approval required). */
export function isCommunityOpenFromFields(
  fields: Pick<CommunityCardFields, 'PrivacyStatus'>
): boolean {
  const status = readPrivacyStatus(fields);
  return status === 'public' || status === 'open';
}

/** Only open communities allow users to submit a join request. */
export function isJoinRequestAllowedFromFields(
  fields: Pick<CommunityCardFields, 'PrivacyStatus'>
): boolean {
  return isCommunityOpenFromFields(fields);
}

/** Open communities always go through owner approval (Auth0 status: requested → joined). */
export function communityRequiresJoinApproval(
  fields: Pick<CommunityCardFields, 'PrivacyStatus'>
): boolean {
  return isCommunityOpenFromFields(fields);
}
