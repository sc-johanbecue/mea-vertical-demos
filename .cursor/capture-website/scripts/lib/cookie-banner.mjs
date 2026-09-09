/** Cookie banner selectors (OneTrust, TrustCommander, Didomi, and common patterns). */
export const COOKIE_BANNER_SELECTORS = [
  '#onetrust-banner-sdk',
  '#onetrust-consent-sdk',
  '#tc-privacy-wrapper',
  '.tc-privacy-wrapper',
  '[class*="tc-privacy-wrapper"]',
  '[class*="tc-privacy-banner"]',
  '#didomi-host',
  '#didomi-popup',
  '.didomi-popup-container',
  '#CybotCookiebotDialog',
  '#usercentrics-root',
  '[id*="uc-central-banner"]',
  '#sp-cc',
  '.qc-cmp2-container',
  '[class*="cookie-banner"]',
  '[class*="cookie-consent"]',
  '[class*="cookie-notice"]',
  '[class*="consent-banner"]',
  '[class*="privacy-banner"]',
  '[class*="privacy-wrapper"]',
  '[id*="cookie-banner"]',
  '[id*="privacy-wrapper"]',
  '[aria-label*="cookie" i]',
  '[aria-label*="consent" i]',
  '.osano-cm-window',
];

export const COOKIE_ACCEPT_SELECTORS = [
  '#onetrust-accept-btn-handler',
  '#accept-recommended-btn-handler',
  '#tc-privacy-button',
  '.tc-privacy-button',
  '[class*="tc-privacy"] button[class*="accept" i]',
  'button:has-text("Accept All Cookies")',
  'button:has-text("Accept All")',
  'button:has-text("Accept all")',
  'button:has-text("Allow all")',
  'button:has-text("I agree")',
  'button:has-text("Agree")',
  'button:has-text("Alles accepteren")',
  'button:has-text("Accepteren")',
  'button:has-text("Akkoord")',
];

/** Browser-side: detect visible cookie banner element. */
export function detectCookieBannerInPage() {
  function isVisible(el, minW = 100, minH = 40) {
    if (!el || !(el instanceof Element)) return false;
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
    const rect = el.getBoundingClientRect();
    return rect.width >= minW && rect.height >= minH;
  }

  const selectors = [
    '#onetrust-banner-sdk',
    '#onetrust-consent-sdk',
    '#tc-privacy-wrapper',
    '.tc-privacy-wrapper',
    '[class*="tc-privacy-wrapper"]',
    '#didomi-host',
    '#CybotCookiebotDialog',
    '#usercentrics-root',
    '[class*="cookie-banner"]',
    '[class*="cookie-consent"]',
    '[id*="cookie-banner"]',
    '[id*="privacy-wrapper"]',
    '[aria-label*="cookie" i]',
    '.osano-cm-window',
  ];

  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (!el || !isVisible(el)) continue;
    return { visible: true, selector };
  }

  const heuristic = detectCookieBannerHeuristicInPage();
  if (heuristic) return { visible: true, selector: heuristic.selector };
  return { visible: false, selector: null };
}

/** Browser-side heuristic when explicit selectors miss. */
export function detectCookieBannerHeuristicInPage() {
  function isVisible(el, minW = 100, minH = 40) {
    if (!el || !(el instanceof Element)) return false;
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
    const rect = el.getBoundingClientRect();
    return rect.width >= minW && rect.height >= minH;
  }

  function nameLooksLikeConsent(el) {
    const id = (el.id || '').toLowerCase();
    const cls = (el.className?.toString?.() || '').toLowerCase();
    const aria = (el.getAttribute('aria-label') || '').toLowerCase();
    const role = (el.getAttribute('role') || '').toLowerCase();
    const haystack = `${id} ${cls} ${aria} ${role}`;
    return /cookie|consent|privacy|gdpr|didomi|quantcast|usercentrics|onetrust|osano|cookiebot|trustcommander|tc-privacy|sp-cc|cmp-/.test(
      haystack
    );
  }

  function looksLikeOverlayBanner(el) {
    if (!isVisible(el)) return false;
    if (!nameLooksLikeConsent(el)) return false;
    if (el.closest('footer, [class*="footer" i], main, [role="main"], #main-content')) return false;

    const style = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const zIndex = parseInt(style.zIndex, 10);
    const highStack = !Number.isNaN(zIndex) && zIndex >= 100;
    const fixedLike = style.position === 'fixed' || style.position === 'sticky' || style.position === 'absolute';
    const wide = rect.width >= window.innerWidth * 0.25;
    const tallEnough = rect.height >= 40;
    const atViewportEdge =
      rect.bottom >= window.innerHeight - 80 ||
      rect.top <= 120 ||
      (rect.top >= 0 && rect.top <= window.innerHeight * 0.15);

    return (
      fixedLike &&
      wide &&
      tallEnough &&
      atViewportEdge &&
      (highStack || style.position === 'fixed' || style.position === 'sticky')
    );
  }

  function buildSelector(el) {
    if (!(el instanceof Element)) return null;
    if (el.id) return `#${CSS.escape(el.id)}`;
    const stableClasses = [...el.classList].filter((c) => c && !c.includes('module__') && c.length < 64);
    if (stableClasses.length) {
      const sel = `${el.tagName.toLowerCase()}.${stableClasses.slice(0, 2).map((c) => CSS.escape(c)).join('.')}`;
      if (document.querySelectorAll(sel).length === 1) return sel;
    }
    return null;
  }

  const candidates = [
    ...document.querySelectorAll(
      '[id*="privacy" i], [class*="privacy" i], [id*="cookie" i], [class*="cookie" i], [class*="consent" i], [role="dialog"], [role="alertdialog"]'
    ),
  ];

  let best = null;
  let bestArea = 0;
  for (const el of candidates) {
    if (!looksLikeOverlayBanner(el)) continue;
    const rect = el.getBoundingClientRect();
    const area = rect.width * rect.height;
    if (area > bestArea) {
      best = el;
      bestArea = area;
    }
  }

  if (!best) return null;
  const selector = buildSelector(best);
  if (!selector) return null;
  try {
    if (document.querySelector(selector) !== best) return null;
  } catch {
    return null;
  }
  return { selector, cmsName: 'CookieBanner', type: 'cookie-banner', folderName: 'cookie-banner' };
}

/** Browser-side: hide cookie UI after capture (fallback if accept click fails). */
export function hideCookieBannerInPage() {
  const selectors = [
    '#onetrust-banner-sdk',
    '#onetrust-consent-sdk',
    '.onetrust-pc-dark-filter',
    '#onetrust-pc-sdk',
    '#tc-privacy-wrapper',
    '.tc-privacy-wrapper',
    '[class*="tc-privacy"]',
    '#didomi-host',
    '#didomi-popup',
    '#CybotCookiebotDialog',
    '#usercentrics-root',
    '[class*="cookie-banner"]',
    '[class*="cookie-consent"]',
    '[class*="privacy-wrapper"]',
    '[id*="privacy-wrapper"]',
    '.osano-cm-window',
  ];
  for (const selector of selectors) {
    document.querySelectorAll(selector).forEach((el) => {
      if (el instanceof HTMLElement) {
        el.style.setProperty('display', 'none', 'important');
        el.style.setProperty('visibility', 'hidden', 'important');
        el.setAttribute('aria-hidden', 'true');
      }
    });
  }
}
