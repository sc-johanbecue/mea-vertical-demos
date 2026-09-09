/** Known Sitecore entitlement / role item IDs → Auth0 claim keys. */
export const BC_ACCESS_ID_TO_AUTH0: Record<string, string> = {
  // Entitlements
  '55d0f57183624b9e97bc4295ff1faa7f': 'british_council_books',
  '153ff9dd5c4a4997a6f7f73b098a7f6f': 'british_council_free_books',
  '41d5f52dbb504a51b45c57626062986c': 'british_council_audio',
  'c5386aae4de249058719ed2a8ca95d80': 'british_council_free_audio',
  // Roles
  '08343d1719154be6add265e6ded441b2': 'british_council_subscriber',
  '40e6e80659e04e638be3773dc4d1c048': 'British Council Reader',
  'bfe02ab815af42f7874abbdbc2ecf61e': 'british_council_partner',
  '1ca6b531b0954897aab8e268e8ff15b0': 'british_council_portal_owner',
};

/** Display names → Auth0 claim keys (case-insensitive). */
export const BC_ACCESS_NAME_TO_AUTH0: Record<string, string> = {
  books: 'british_council_books',
  'free books': 'british_council_free_books',
  audio: 'british_council_audio',
  'free audio': 'british_council_free_audio',
  subscriber: 'british_council_subscriber',
  reader: 'British Council Reader',
  'british council reader': 'British Council Reader',
  partner: 'british_council_partner',
  'british council partner': 'british_council_partner',
  'portal owner': 'british_council_portal_owner',
  'british council portal owner': 'british_council_portal_owner',
};

export function normalizeAccessId(id: string | undefined | null): string {
  return String(id ?? '')
    .replace(/[{}-]/g, '')
    .trim()
    .toLowerCase();
}

export function resolveAuth0KeyFromIdOrName(id?: string, name?: string): string {
  const fromId = BC_ACCESS_ID_TO_AUTH0[normalizeAccessId(id)];
  if (fromId) {
    return fromId;
  }

  const fromName = BC_ACCESS_NAME_TO_AUTH0[String(name ?? '').trim().toLowerCase()];
  return fromName || '';
}
