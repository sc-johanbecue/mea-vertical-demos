import { clearIdentifiedUser } from '@/lib/cdp/cdp-identified-user';
import { clearSessionTracker, clearVisitHistory } from '@/lib/cdp/cdp-session-tracker';

/**
 * Expire Sitecore Cloud SDK cookies across domain scopes so "Restart as anonymous" works.
 * @see https://doc.sitecore.com/sdk/en/developers/006/cloud-sdk/cloud-sdk-cookies.html
 */
export function resetSitecoreAnonymousCookies(): void {
  if (typeof document === 'undefined') {
    return;
  }

  const expireCookie = (name: string) => {
    const expiry = 'expires=Thu, 01 Jan 1970 00:00:00 GMT';
    const hostParts = window.location.hostname.split('.');
    const domainVariants = [''];
    for (let i = 0; i < hostParts.length - 1; i++) {
      const domain = hostParts.slice(i).join('.');
      domainVariants.push(domain, `.${domain}`);
    }
    domainVariants.forEach((domain) => {
      document.cookie = `${name}=; ${expiry}; path=/;${domain ? ` domain=${domain};` : ''}`;
    });
  };

  document.cookie
    .split(';')
    .map((c) => c.split('=')[0].trim())
    .filter((name) => name.startsWith('sc_'))
    .forEach(expireCookie);

  clearIdentifiedUser();
  clearSessionTracker();
  clearVisitHistory();
}

export function resetSitecoreVisitorSession(): void {
  resetSitecoreAnonymousCookies();
  if (typeof window !== 'undefined') {
    setTimeout(() => window.location.reload(), 600);
  }
}
