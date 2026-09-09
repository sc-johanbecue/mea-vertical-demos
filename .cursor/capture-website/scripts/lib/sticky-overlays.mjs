/**
 * Detect, capture, and hide sticky/fixed overlay UI (cookie, nav, chat, side buttons, …).
 * All browser-side functions must be self-contained for page.evaluate().
 */

/** Browser-side: detect sticky overlay components worth capturing separately. */
export function detectAllStickyOverlaysInPage() {
  function isVisible(el, minW = 40, minH = 24) {
    if (!el || !(el instanceof Element)) return false;
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
    const rect = el.getBoundingClientRect();
    return rect.width >= minW && rect.height >= minH;
  }

  function isInPageNav(el) {
    if (!(el instanceof Element)) return false;
    if (el.getAttribute('role') === 'tablist') return true;
    if (el.closest('[role="tablist"], [aria-label*="Slide navigation" i], [aria-label*="slide navigation" i]')) {
      return true;
    }
    // Content inside the main landmark — not site chrome.
    if (el.closest('main, [role="main"], #main-content, #main')) return true;
    if (el.closest('footer, [class*="footer" i]')) return true;
    return false;
  }

  function buildSelector(el) {
    if (!(el instanceof Element)) return null;
    if (el.id) return `#${CSS.escape(el.id)}`;

    const stableClasses = [...el.classList].filter(
      (c) =>
        c &&
        !c.startsWith('lfr-layout-structure-item-') &&
        !/^js-/.test(c) &&
        !/^is-/.test(c) &&
        !/^col-/.test(c) &&
        !c.includes('module__') &&
        c.length < 64
    );
    if (stableClasses.length) {
      const sel = `${el.tagName.toLowerCase()}.${stableClasses.slice(0, 2).map((c) => CSS.escape(c)).join('.')}`;
      if (document.querySelectorAll(sel).length === 1) return sel;
    }

    const parts = [];
    let node = el;
    while (node && node.nodeType === Node.ELEMENT_NODE && parts.length < 6) {
      let part = node.tagName.toLowerCase();
      if (node.id) {
        parts.unshift(`#${CSS.escape(node.id)}`);
        break;
      }
      const parent = node.parentElement;
      if (parent) {
        const siblings = [...parent.children].filter((s) => s.tagName === node.tagName);
        if (siblings.length > 1) {
          part += `:nth-of-type(${siblings.indexOf(node) + 1})`;
        }
      }
      parts.unshift(part);
      node = parent;
    }
    return parts.join(' > ');
  }

  function tryAdd(found, claimed, selector, cmsName, type, folderName, minW, minH) {
    const el = document.querySelector(selector);
    if (!el || claimed.has(el) || !isVisible(el, minW, minH) || isInPageNav(el)) return;
    claimed.add(el);
    found.push({ selector, cmsName, type, folderName });
  }

  function tryAddElement(found, claimed, el, cmsName, type, folderName) {
    if (!el || claimed.has(el) || !isVisible(el) || isInPageNav(el)) return false;
    const selector = buildSelector(el);
    if (!selector) return false;
    try {
      if (document.querySelector(selector) !== el) return false;
    } catch {
      return false;
    }
    claimed.add(el);
    found.push({ selector, cmsName, type, folderName });
    return true;
  }

  function detectFixedSiteChrome(found, claimed) {
    const explicit = [
      'section.main-nav',
      'section.nav.main-nav',
      '[class*="MainNavigation"]',
      'header[role="banner"]',
      'header#banner',
      '#banner',
      '[class*="GlobalHeader"]',
      '[class*="global-header"]',
      '[class*="site-header"]',
      '[data-component-name="Header"]',
      '[data-component-name="GlobalHeader"]',
      'header',
    ];
    for (const selector of explicit) {
      tryAdd(found, claimed, selector, 'Header', 'header', 'header', 200, 32);
      if (found.some((f) => f.cmsName === 'Header')) return;
    }

    const skipLink = document.querySelector(
      'a[href="#main-content"], a[href="#main"], a[href="#content"], a[class*="skip" i]'
    );
    if (skipLink) {
      let node = skipLink.parentElement;
      for (let depth = 0; node && depth < 5; depth++) {
        if (tryAddElement(found, claimed, node, 'Header', 'header', 'header')) return;
        node = node.parentElement;
      }
    }

    const candidates = [...document.querySelectorAll('header, nav, [role="banner"], [class*="header" i]')];
    for (const el of candidates) {
      if (claimed.has(el) || !isVisible(el, 200, 32) || isInPageNav(el)) continue;
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      const fixedTop =
        (style.position === 'fixed' || style.position === 'sticky') &&
        rect.top <= 120 &&
        rect.width >= window.innerWidth * 0.4;
      const landmark =
        el.tagName === 'HEADER' || el.getAttribute('role') === 'banner' || /header/i.test(el.className);
      if (fixedTop || (landmark && rect.top <= 160)) {
        tryAddElement(found, claimed, el, 'Header', 'header', 'header');
        if (found.some((f) => f.cmsName === 'Header')) break;
      }
    }
  }

  const found = [];
  const claimed = new Set();

  const cookieSelectors = [
    '#onetrust-banner-sdk',
    '#onetrust-consent-sdk',
    '#tc-privacy-wrapper',
    '.tc-privacy-wrapper',
    '[class*="tc-privacy-wrapper"]',
    '[class*="tc-privacy-banner"]',
    '#didomi-host',
    '#didomi-popup',
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
  for (const selector of cookieSelectors) {
    tryAdd(found, claimed, selector, 'CookieBanner', 'cookie-banner', 'cookie-banner', 100, 40);
    if (found.some((f) => f.cmsName === 'CookieBanner')) break;
  }

  if (!found.some((f) => f.cmsName === 'CookieBanner')) {
    const heuristic = detectCookieBannerHeuristic();
    if (heuristic) {
      const el = document.querySelector(heuristic.selector);
      if (el && !claimed.has(el)) {
        claimed.add(el);
        found.unshift(heuristic);
      }
    }
  }

  function detectCookieBannerHeuristic() {
    function nameLooksLikeConsent(el) {
      const id = (el.id || '').toLowerCase();
      const cls = (el.className?.toString?.() || '').toLowerCase();
      const aria = (el.getAttribute('aria-label') || '').toLowerCase();
      const role = (el.getAttribute('role') || '').toLowerCase();
      return /cookie|consent|privacy|gdpr|didomi|quantcast|usercentrics|onetrust|osano|cookiebot|trustcommander|tc-privacy|sp-cc|cmp-/.test(
        `${id} ${cls} ${aria} ${role}`
      );
    }

    function looksLikeOverlayBanner(el) {
      if (!isVisible(el) || !nameLooksLikeConsent(el)) return false;
      if (el.closest('footer, [class*="footer" i], main, [role="main"], #main-content')) return false;
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      const zIndex = parseInt(style.zIndex, 10);
      const highStack = !Number.isNaN(zIndex) && zIndex >= 100;
      const fixedLike = style.position === 'fixed' || style.position === 'sticky' || style.position === 'absolute';
      const wide = rect.width >= window.innerWidth * 0.25;
      const atEdge =
        rect.bottom >= window.innerHeight - 80 ||
        rect.top <= 120 ||
        (rect.top >= 0 && rect.top <= window.innerHeight * 0.15);
      return (
        fixedLike &&
        wide &&
        rect.height >= 40 &&
        atEdge &&
        (highStack || style.position === 'fixed' || style.position === 'sticky')
      );
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
      const area = el.getBoundingClientRect().width * el.getBoundingClientRect().height;
      if (area > bestArea) {
        best = el;
        bestArea = area;
      }
    }
    if (!best) return null;
    const selector = buildSelector(best);
    if (!selector || document.querySelector(selector) !== best) return null;
    return { selector, cmsName: 'CookieBanner', type: 'cookie-banner', folderName: 'cookie-banner' };
  }

  const topBarSelectors = [
    '[class*="top-bar"]',
    '[class*="topbar"]',
    '[class*="TopBar"]',
    '.jmheader__utility',
    '[class*="utility-bar"]',
    '[class*="announcement-bar"]',
    'aside[class*="announcement"]',
    '[class*="site-utility"]',
  ];
  for (const selector of topBarSelectors) {
    tryAdd(found, claimed, selector, 'TopBar', 'topbar', 'top-bar', 120, 14);
    if (found.some((f) => f.cmsName === 'TopBar')) break;
  }

  detectFixedSiteChrome(found, claimed);

  const navSelectors = [
    'nav#navigation[role="navigation"]',
    'nav#navigation',
    'nav.jmheader__navbar',
    '.jmheader__navbar',
    '[class*="primary-nav"]',
    '[class*="main-nav"]',
    '[class*="MainNav"]',
    'nav[role="navigation"]',
  ];
  for (const selector of navSelectors) {
    const el = document.querySelector(selector);
    if (!el || claimed.has(el) || !isVisible(el, 200, 24) || isInPageNav(el)) continue;
    const headerEl = document.querySelector('header#banner, #banner, header[role="banner"], header');
    if (headerEl && headerEl.contains(el)) continue;
    claimed.add(el);
    found.push({ selector, cmsName: 'Navigation', type: 'nav', folderName: 'navigation' });
    break;
  }

  const chatSelectors = [
    '#hubspot-messages-iframe-container',
    '#drift-widget',
    '#intercom-container',
    '.intercom-lightweight-app',
    '[class*="intercom"]',
    '[id*="live-chat"]',
    '[class*="chat-widget"]',
    '[class*="chat-button"]',
    '[aria-label*="chat" i]',
    '[data-testid*="chat"]',
    '#qualified-chat',
    '[class*="qualified"]',
  ];
  for (const selector of chatSelectors) {
    tryAdd(found, claimed, selector, 'ChatWidget', 'chat-widget', 'chat-widget', 32, 32);
    if (found.some((f) => f.cmsName === 'ChatWidget')) break;
  }

  const sideButtonSelectors = [
    '[class*="back-to-top"]',
    '[class*="scroll-to-top"]',
    '[class*="scroll-top"]',
    'button[class*="floating"]',
    '[class*="sticky-cta"]',
    '[class*="side-tab"]',
    '[class*="feedback-button"]',
    '[aria-label*="back to top" i]',
  ];
  for (const selector of sideButtonSelectors) {
    tryAdd(found, claimed, selector, 'FloatingActionButton', 'floating-action', 'floating-action-button', 24, 24);
    if (found.some((f) => f.cmsName === 'FloatingActionButton')) break;
  }

  return found;
}

/** Browser-side: hide cookie/consent UI and dimming backdrops only (not header/nav). */
export function hideCookieBannerAndBackdropInPage() {
  function hideElement(el) {
    if (!(el instanceof HTMLElement)) return;
    el.style.setProperty('display', 'none', 'important');
    el.style.setProperty('visibility', 'hidden', 'important');
    el.style.setProperty('opacity', '0', 'important');
    el.style.setProperty('pointer-events', 'none', 'important');
    el.setAttribute('aria-hidden', 'true');
    el.setAttribute('data-screenshot-hidden', 'cookie');
  }

  const cookieSelectors = [
    '#onetrust-banner-sdk',
    '#onetrust-consent-sdk',
    '.onetrust-pc-dark-filter',
    '#onetrust-pc-sdk',
    '#tc-privacy-wrapper',
    '.tc-privacy-wrapper',
    '[class*="tc-privacy-wrapper"]',
    '[class*="tc-privacy-banner"]',
    '[class*="tc-privacy-overlay"]',
    '#tc-privacy-overlay',
    '#didomi-host',
    '#didomi-popup',
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
    '[class*="privacy-overlay"]',
    '[class*="consent-overlay"]',
    '[id*="privacy-wrapper"]',
    '[id*="cookie-banner"]',
    '.osano-cm-window',
  ];

  for (const selector of cookieSelectors) {
    document.querySelectorAll(selector).forEach(hideElement);
  }

  for (const el of document.querySelectorAll(
    '[id*="privacy" i], [class*="privacy" i], [id*="cookie" i], [class*="cookie" i], [class*="consent" i], [role="dialog"], [role="alertdialog"]'
  )) {
    if (!(el instanceof HTMLElement)) continue;
    if (el.getAttribute('data-screenshot-hidden') === 'cookie') continue;
    if (el.closest('main, [role="main"], #main-content, footer, [class*="footer" i]')) continue;
    const id = (el.id || '').toLowerCase();
    const cls = (el.className?.toString?.() || '').toLowerCase();
    if (!/cookie|consent|privacy|gdpr|didomi|tc-privacy|onetrust|osano|cookiebot|cmp-/.test(`${id} ${cls}`)) {
      continue;
    }
    hideElement(el);
  }

  // Full-viewport dim layers commonly paired with CMP modals.
  for (const el of document.querySelectorAll('body > div, body > aside')) {
    if (!(el instanceof HTMLElement)) continue;
    if (el.getAttribute('data-screenshot-hidden') === 'cookie') continue;
    const style = window.getComputedStyle(el);
    if (!['fixed', 'absolute'].includes(style.position)) continue;
    const rect = el.getBoundingClientRect();
    if (rect.width < window.innerWidth * 0.9 || rect.height < window.innerHeight * 0.9) continue;
    const bg = style.backgroundColor;
    const opacity = parseFloat(style.opacity);
    const isDim =
      (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') ||
      (style.backdropFilter && style.backdropFilter !== 'none') ||
      (opacity > 0 && opacity < 1);
    const id = (el.id || '').toLowerCase();
    const cls = (el.className?.toString?.() || '').toLowerCase();
    const looksLikeOverlay =
      isDim ||
      /overlay|backdrop|modal|privacy|consent|cookie|tc-privacy|onetrust|didomi/.test(`${id} ${cls}`);
    if (looksLikeOverlay) hideElement(el);
  }

  document.body.style.setProperty('overflow', '', 'important');
  document.documentElement.style.setProperty('overflow', '', 'important');
  for (const cls of [...document.body.classList, ...document.documentElement.classList]) {
    if (/modal|overlay|privacy|consent|no-scroll|noscroll|overflow-hidden|cmp-/.test(cls)) {
      document.body.classList.remove(cls);
      document.documentElement.classList.remove(cls);
    }
  }
}

/** Browser-side: hide all sticky/fixed overlays so content bands are unobstructed. */
export function hideAllStickyOverlaysInPage() {
  function hideElement(el, tag = 'true') {
    if (!(el instanceof HTMLElement)) return;
    el.style.setProperty('display', 'none', 'important');
    el.style.setProperty('visibility', 'hidden', 'important');
    el.style.setProperty('position', 'static', 'important');
    el.style.setProperty('height', '0', 'important');
    el.style.setProperty('overflow', 'hidden', 'important');
    el.setAttribute('aria-hidden', 'true');
    el.setAttribute('data-screenshot-hidden', tag);
  }

  function hideCookieOnly(el) {
    if (!(el instanceof HTMLElement)) return;
    el.style.setProperty('display', 'none', 'important');
    el.style.setProperty('visibility', 'hidden', 'important');
    el.style.setProperty('opacity', '0', 'important');
    el.style.setProperty('pointer-events', 'none', 'important');
    el.setAttribute('aria-hidden', 'true');
    el.setAttribute('data-screenshot-hidden', 'cookie');
  }

  const cookieSelectors = [
    '#onetrust-banner-sdk',
    '#onetrust-consent-sdk',
    '.onetrust-pc-dark-filter',
    '#onetrust-pc-sdk',
    '#tc-privacy-wrapper',
    '.tc-privacy-wrapper',
    '[class*="tc-privacy-wrapper"]',
    '[class*="tc-privacy-banner"]',
    '[class*="tc-privacy-overlay"]',
    '#tc-privacy-overlay',
    '#didomi-host',
    '#didomi-popup',
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
    '[class*="privacy-overlay"]',
    '[class*="consent-overlay"]',
    '[id*="privacy-wrapper"]',
    '[id*="cookie-banner"]',
    '.osano-cm-window',
  ];
  for (const selector of cookieSelectors) {
    document.querySelectorAll(selector).forEach(hideCookieOnly);
  }

  for (const el of document.querySelectorAll(
    '[id*="privacy" i], [class*="privacy" i], [id*="cookie" i], [class*="cookie" i], [class*="consent" i], [role="dialog"], [role="alertdialog"]'
  )) {
    if (!(el instanceof HTMLElement)) continue;
    if (el.getAttribute('data-screenshot-hidden') === 'cookie') continue;
    if (el.closest('main, [role="main"], #main-content, footer, [class*="footer" i]')) continue;
    const id = (el.id || '').toLowerCase();
    const cls = (el.className?.toString?.() || '').toLowerCase();
    if (!/cookie|consent|privacy|gdpr|didomi|tc-privacy|onetrust|osano|cookiebot|cmp-/.test(`${id} ${cls}`)) {
      continue;
    }
    hideCookieOnly(el);
  }

  for (const el of document.querySelectorAll('body > div, body > aside')) {
    if (!(el instanceof HTMLElement)) continue;
    if (el.getAttribute('data-screenshot-hidden') === 'cookie') continue;
    const style = window.getComputedStyle(el);
    if (!['fixed', 'absolute'].includes(style.position)) continue;
    const rect = el.getBoundingClientRect();
    if (rect.width < window.innerWidth * 0.9 || rect.height < window.innerHeight * 0.9) continue;
    const bg = style.backgroundColor;
    const opacity = parseFloat(style.opacity);
    const isDim =
      (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') ||
      (style.backdropFilter && style.backdropFilter !== 'none') ||
      (opacity > 0 && opacity < 1);
    const id = (el.id || '').toLowerCase();
    const cls = (el.className?.toString?.() || '').toLowerCase();
    const looksLikeOverlay =
      isDim ||
      /overlay|backdrop|modal|privacy|consent|cookie|tc-privacy|onetrust|didomi/.test(`${id} ${cls}`);
    if (looksLikeOverlay) hideCookieOnly(el);
  }

  document.body.style.setProperty('overflow', '', 'important');
  document.documentElement.style.setProperty('overflow', '', 'important');
  for (const cls of [...document.body.classList, ...document.documentElement.classList]) {
    if (/modal|overlay|privacy|consent|no-scroll|noscroll|overflow-hidden|cmp-/.test(cls)) {
      document.body.classList.remove(cls);
      document.documentElement.classList.remove(cls);
    }
  }

  function isInPageNav(el) {
    if (!(el instanceof Element)) return false;
    if (el.getAttribute('role') === 'tablist') return true;
    if (el.closest('[role="tablist"], [aria-label*="Slide navigation" i], [aria-label*="slide navigation" i]')) {
      return true;
    }
    // Content inside the main landmark — not site chrome.
    if (el.closest('main, [role="main"], #main-content, #main')) return true;
    if (el.closest('footer, [class*="footer" i]')) return true;
    return false;
  }

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
    '[id*="uc-central-banner"]',
    '#sp-cc',
    '.qc-cmp2-container',
    '[class*="cookie-banner"]',
    '[class*="cookie-consent"]',
    '[class*="cookie-notice"]',
    '[class*="consent-banner"]',
    '[class*="privacy-banner"]',
    '[class*="privacy-wrapper"]',
    '[id*="privacy-wrapper"]',
    '[id*="cookie-banner"]',
    '.osano-cm-window',
    '[class*="top-bar"]',
    '[class*="topbar"]',
    '[class*="TopBar"]',
    '.jmheader__utility',
    '[class*="utility-bar"]',
    '[class*="announcement-bar"]',
    'aside[class*="announcement"]',
    '[class*="site-utility"]',
    'header#banner',
    '#banner',
    'header[role="banner"]',
    'header',
    '[class*="GlobalHeader"]',
    '[class*="global-header"]',
    '[class*="site-header"]',
    '[class*="MainNavigation"]',
    'section.main-nav',
    'section.nav.main-nav',
    '[data-component-name="Header"]',
    '[data-component-name="GlobalHeader"]',
    'nav#navigation',
    'nav.jmheader__navbar',
    '.jmheader__navbar',
    '.jmheader__navlinks',
    '[class*="primary-nav"]',
    '[class*="main-nav"]',
    '[class*="MainNav"]',
    'nav[role="navigation"]',
    '[class*="sticky-header"]',
    '[class*="fixed-top"]',
    '.product-navigation',
    '#hubspot-messages-iframe-container',
    '#drift-widget',
    '#intercom-container',
    '.intercom-lightweight-app',
    '[class*="intercom"]',
    '[id*="live-chat"]',
    '[class*="chat-widget"]',
    '[class*="chat-button"]',
    '#qualified-chat',
    '[class*="qualified"]',
    '[class*="back-to-top"]',
    '[class*="scroll-to-top"]',
    '[class*="scroll-top"]',
    'button[class*="floating"]',
    '[class*="sticky-cta"]',
    '[class*="side-tab"]',
    '[class*="feedback-button"]',
  ];

  for (const selector of selectors) {
    document.querySelectorAll(selector).forEach((el) => {
      if (isInPageNav(el)) return;
      hideElement(el);
    });
  }

  // Hide any remaining fixed/sticky top chrome (e.g. Next.js header wrappers).
  for (const el of document.querySelectorAll('*')) {
    if (!(el instanceof HTMLElement)) continue;
    if (el.getAttribute('data-screenshot-hidden') === 'true') continue;
    if (isInPageNav(el)) continue;
    if (el.closest('[class*="modal" i], .osano-cm-window')) continue;
    if (el.closest('section.sc-section:not(.main-nav):not(.nav)')) {
      const inMain = el.closest('main, [role="main"], #main-content, #main');
      if (inMain) continue;
    }

    const style = window.getComputedStyle(el);
    if (!['fixed', 'sticky'].includes(style.position)) continue;

    const rect = el.getBoundingClientRect();
    if (rect.top > 120 || rect.height < 20 || rect.width < window.innerWidth * 0.35) continue;
    if (rect.bottom < 0) continue;

    hideElement(el);
  }

  document.body.style.setProperty('padding-top', '0', 'important');
  document.documentElement.style.setProperty('scroll-padding-top', '0', 'important');
}
