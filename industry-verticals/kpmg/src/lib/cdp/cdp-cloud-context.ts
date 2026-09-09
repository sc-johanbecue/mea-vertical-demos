import { readIdentifiedUser } from '@/lib/cdp/cdp-identified-user';
import {
  deriveAffinityFromEvents,
  getSessionEvents,
  getSessionRef,
  getVisitCount,
  recordVisitOnce,
  type CdpTrackedEvent,
} from '@/lib/cdp/cdp-session-tracker';

export type CdpGuestProfile = {
  guestId: string | null;
  guestRef: string | null;
  browserId: string | null;
  edgeCookieName: string | null;
  email?: string;
  firstName?: string;
  lastName?: string;
  isIdentified: boolean;
  identifiers: Array<{ provider: string; id: string }>;
  sessions: Array<{
    ref: string;
    channel: string;
    status: string;
    referrer?: string;
    events: CdpTrackedEvent[];
  }>;
  visitCount: number;
  ext: Record<string, Record<string, string>>;
};

export async function fetchGuestId(): Promise<string | null> {
  try {
    const { getGuestId } = await import('@sitecore-cloudsdk/core/browser');
    return (await getGuestId()) || null;
  } catch {
    return null;
  }
}

export function getSitecoreSdkCookies(): {
  browserId: string | null;
  guestCookieName: string | null;
} {
  if (typeof document === 'undefined') {
    return { browserId: null, guestCookieName: null };
  }
  const cookieMap = Object.fromEntries(
    document.cookie.split(';').map((c) => {
      const [key, ...rest] = c.trim().split('=');
      return [key, rest.join('=')];
    })
  );
  const scKeys = Object.keys(cookieMap).filter((k) => k.startsWith('sc_'));
  const guestCookieName = scKeys.find((k) => k.endsWith('_personalize')) ?? null;
  const browserKey = scKeys.find((k) => !k.endsWith('_personalize')) ?? null;
  return {
    browserId: browserKey ? (cookieMap[browserKey] ?? null) : null,
    guestCookieName,
  };
}

export async function loadCdpGuestProfile(): Promise<CdpGuestProfile> {
  const guestId = await fetchGuestId();
  const { browserId, guestCookieName } = getSitecoreSdkCookies();
  const identified = readIdentifiedUser();
  const events = getSessionEvents();
  const visitCount = recordVisitOnce() || getVisitCount();
  const sessionRef = getSessionRef();

  const identifiers: Array<{ provider: string; id: string }> = [];
  if (browserId) identifiers.push({ provider: 'browser_id', id: browserId });
  if (guestId) identifiers.push({ provider: 'guest_id', id: guestId });
  if (identified?.email) identifiers.push({ provider: 'email', id: identified.email });

  const referrer =
    typeof document !== 'undefined' && document.referrer ? document.referrer : undefined;

  return {
    guestId,
    guestRef: guestId || browserId,
    browserId,
    edgeCookieName: guestCookieName,
    email: identified?.email,
    firstName: identified?.firstName,
    lastName: identified?.lastName,
    isIdentified: Boolean(identified?.email),
    identifiers,
    sessions: [
      {
        ref: sessionRef,
        channel: 'WEB',
        status: 'OPEN',
        referrer,
        events,
      },
    ],
    visitCount,
    ext: deriveAffinityFromEvents(events),
  };
}
