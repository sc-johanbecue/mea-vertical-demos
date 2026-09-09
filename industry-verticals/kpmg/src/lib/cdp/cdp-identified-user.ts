const IDENTIFIED_USER_KEY = 'versele-cdp-identified-user';

export type CdpIdentifiedUser = {
  email: string;
  firstName: string;
  lastName: string;
  identifiedAt: string;
};

export function readIdentifiedUser(): CdpIdentifiedUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(IDENTIFIED_USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CdpIdentifiedUser;
    if (parsed?.email) return parsed;
  } catch {
    /* ignore */
  }
  return null;
}

export function persistIdentifiedUser(
  user: Omit<CdpIdentifiedUser, 'identifiedAt'>
): CdpIdentifiedUser {
  const next: CdpIdentifiedUser = { ...user, identifiedAt: new Date().toISOString() };
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(IDENTIFIED_USER_KEY, JSON.stringify(next));
  }
  return next;
}

export function clearIdentifiedUser(): void {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(IDENTIFIED_USER_KEY);
  }
}
