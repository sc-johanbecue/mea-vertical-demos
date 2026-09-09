import type { User } from "@auth0/nextjs-auth0/types";
import { identity } from "@sitecore-cloudsdk/events/browser";
import config from "sitecore.config";
import { buildKpmgAuth0AccountProfile } from "@/lib/kpmg-auth0-account";
import { ensureCloudSdkInitialized } from "@/lib/cdp/cdp-cloud-sdk-init";
import { persistIdentifiedUser } from "@/lib/cdp/cdp-identified-user";
import { recordIdentityEvent } from "@/lib/cdp/cdp-session-tracker";

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AUTH0_IDENTITY_SUB_KEY = "versele-cdp-auth0-identity-sub";

function capitalize(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
}

export function displayNameFromEmail(email: string): string {
  const value = email.trim();
  const [localPart] = value.split("@");
  const [firstPart, ...rest] = localPart.split(/[._-]+/).filter(Boolean);
  const first = capitalize(firstPart) || "Subscriber";
  const last = rest.map(capitalize).join(" ");
  return last ? `${first} ${last}` : first;
}

export async function identifyVisitorByEmail(email: string): Promise<void> {
  const value = email.trim();
  if (!EMAIL_REGEX.test(value)) {
    throw new Error("Please enter a valid email address.");
  }

  const [localPart] = value.split("@");
  const [firstPart, ...rest] = localPart.split(/[._-]+/).filter(Boolean);
  const firstName = capitalize(firstPart) || "Subscriber";
  const lastName = rest.map(capitalize).join(" ");

  await ensureCloudSdkInitialized(config.defaultSite);
  await identity({
    channel: "WEB",
    currency: "EUR",
    identifiers: [{ id: value, provider: "email" }],
    email: value,
    firstName,
    lastName,
  });

  persistIdentifiedUser({ email: value, firstName, lastName });
  recordIdentityEvent(value);
}

export function clearAuth0IdentityMarker(): void {
  if (typeof window === "undefined") {
    return;
  }
  sessionStorage.removeItem(AUTH0_IDENTITY_SUB_KEY);
}

function hasAuth0IdentityMarker(sub: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return sessionStorage.getItem(AUTH0_IDENTITY_SUB_KEY) === sub;
}

function markAuth0IdentitySent(sub: string): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(AUTH0_IDENTITY_SUB_KEY, sub);
  }
}

export async function identifyAuth0User(user: User): Promise<boolean> {
  const sub = user.sub?.trim();
  if (!sub || hasAuth0IdentityMarker(sub)) {
    return false;
  }

  const profile = buildKpmgAuth0AccountProfile(user);
  const email = profile?.email.trim() ?? "";
  if (!email || !EMAIL_REGEX.test(email)) {
    return false;
  }

  const derivedName = displayNameFromEmail(email);
  const [derivedFirst = "", ...derivedRest] = derivedName.split(/\s+/);
  const firstName = profile?.firstName || derivedFirst || "Member";
  const lastName = profile?.lastName || derivedRest.join(" ");
  const fullName = `${firstName} ${lastName}`;

  await ensureCloudSdkInitialized(config.defaultSite);
  await identity({
    channel: "WEB",
    currency: "EUR",
    language: "EN",
    identifiers: [
      { id: email, provider: "email" },
      { id: fullName, provider: "auth0" },
    ],
    email,
    firstName,
    lastName,
    extensionData: { AuthenticationProvider: "Auth0" },
  });

  persistIdentifiedUser({ email, firstName, lastName });
  recordIdentityEvent(email);
  markAuth0IdentitySent(sub);
  return true;
}
