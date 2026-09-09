export type CdpTrackedEvent = {
  type: string;
  createdAt: string;
  arbitraryData?: Record<string, unknown>;
};

const SESSION_ID_KEY = 'versele-cdp-session-id';
const SESSION_EVENTS_KEY = 'versele-cdp-session-events';
const VISIT_COUNT_KEY = 'versele-cdp-visit-count';
const VISIT_FLAG_KEY = 'versele-cdp-visit-recorded';

function readEvents(): CdpTrackedEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.sessionStorage.getItem(SESSION_EVENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CdpTrackedEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeEvents(events: CdpTrackedEvent[]): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(SESSION_EVENTS_KEY, JSON.stringify(events.slice(-50)));
}

export function getSessionRef(): string {
  if (typeof window === 'undefined') return 'session_unknown';
  let id = window.sessionStorage.getItem(SESSION_ID_KEY);
  if (!id) {
    id = `web_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    window.sessionStorage.setItem(SESSION_ID_KEY, id);
  }
  return id;
}

export function recordVisitOnce(): number {
  if (typeof window === 'undefined') return 1;
  const already = window.sessionStorage.getItem(VISIT_FLAG_KEY);
  let count = Number.parseInt(window.localStorage.getItem(VISIT_COUNT_KEY) || '0', 10) || 0;
  if (!already) {
    count += 1;
    window.localStorage.setItem(VISIT_COUNT_KEY, String(count));
    window.sessionStorage.setItem(VISIT_FLAG_KEY, '1');
  }
  return count;
}

export function getVisitCount(): number {
  if (typeof window === 'undefined') return 0;
  return Number.parseInt(window.localStorage.getItem(VISIT_COUNT_KEY) || '0', 10) || 0;
}

export function appendCdpEvent(event: CdpTrackedEvent): void {
  writeEvents([...readEvents(), event]);
}

function derivePageContext(path: string): Record<string, string> {
  const normalized = path.toLowerCase();
  const segments = path.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1] || 'Home';
  const context: Record<string, string> = {
    page: path,
    pageName: lastSegment,
  };

  if (normalized.includes('puppy')) context.course = 'Puppy';
  if (normalized.includes('puber')) context.course = 'Puber';
  if (normalized.includes('volwassene') || normalized.includes('adult')) context.course = 'Adult';
  if (normalized.includes('senior')) context.course = 'Senior';
  if (normalized.includes('welcome-home-buddy') || normalized.includes('/whb'))
    context.site = 'Welcome Home Buddy';
  if (normalized.includes('opti-life') || normalized.includes('products'))
    context.brand = 'Opti Life';

  return context;
}

export function recordPageView(path: string, pageName?: string): void {
  const context = derivePageContext(path);
  if (pageName) context.pageName = pageName;

  appendCdpEvent({
    type: 'VIEW',
    createdAt: new Date().toISOString(),
    arbitraryData: context,
  });
}

export function recordIdentityEvent(email: string): void {
  appendCdpEvent({
    type: 'IDENTITY',
    createdAt: new Date().toISOString(),
    arbitraryData: { email, channel: 'WEB' },
  });
}

export function getSessionEvents(): CdpTrackedEvent[] {
  return readEvents();
}

export function clearSessionTracker(): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(SESSION_ID_KEY);
  window.sessionStorage.removeItem(SESSION_EVENTS_KEY);
  window.sessionStorage.removeItem(VISIT_FLAG_KEY);
}

export function clearVisitHistory(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(VISIT_COUNT_KEY);
}

export function deriveAffinityFromEvents(
  events: CdpTrackedEvent[]
): Record<string, Record<string, string>> {
  const scores: Record<string, number> = {};
  for (const event of events) {
    if (event.type !== 'VIEW') continue;
    const page = String(event.arbitraryData?.page ?? '').toLowerCase();
    const course = String(event.arbitraryData?.course ?? '');
    const brand = String(event.arbitraryData?.brand ?? '');
    const site = String(event.arbitraryData?.site ?? '');

    if (course) scores[course] = (scores[course] || 0) + 1;
    if (brand) scores[brand] = (scores[brand] || 0) + 1;
    if (site) scores[site] = (scores[site] || 0) + 1;

    if (page.includes('puppy')) scores.Puppy = (scores.Puppy || 0) + 1;
    if (page.includes('puber')) scores.Puber = (scores.Puber || 0) + 1;
    if (page.includes('volwassene') || page.includes('adult'))
      scores.Adult = (scores.Adult || 0) + 1;
    if (page.includes('senior')) scores.Senior = (scores.Senior || 0) + 1;
    if (page.includes('whb') || page.includes('welcome-home-buddy')) {
      scores['Welcome Home Buddy'] = (scores['Welcome Home Buddy'] || 0) + 1;
    }
    if (page.includes('dog') || page.includes('hond')) scores.Dogs = (scores.Dogs || 0) + 1;
  }
  const max = Math.max(1, ...Object.values(scores));
  const lifeStage: Record<string, string> = {};
  for (const [key, val] of Object.entries(scores)) {
    if (['Puppy', 'Puber', 'Adult', 'Senior'].includes(key)) {
      lifeStage[key] = (val / max).toFixed(3);
    }
  }
  const topics: Record<string, string> = {};
  for (const [key, val] of Object.entries(scores)) {
    if (!['Puppy', 'Puber', 'Adult', 'Senior'].includes(key)) {
      topics[key] = (val / max).toFixed(3);
    }
  }
  const ext: Record<string, Record<string, string>> = {};
  if (Object.keys(lifeStage).length) ext.life_stage = lifeStage;
  if (Object.keys(topics).length) ext.topics = topics;
  return ext;
}
