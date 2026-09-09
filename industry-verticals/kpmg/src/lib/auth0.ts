import { Auth0Client } from "@auth0/nextjs-auth0/server";
import { enrichAuth0SessionUser } from "./auth0-enrich-user";

const allowInsecureTls =
  process.env.NODE_ENV === "development" &&
  (process.env.AUTH0_INSECURE_TLS === "true" ||
    process.env.AUTH0_INSECURE_TLS === "1" ||
    process.env.NODE_TLS_REJECT_UNAUTHORIZED === "0");

// Corporate proxies (e.g. SSL inspection) can break Node's fetch to Auth0.
// Prefer NODE_EXTRA_CA_CERTS with your org root CA. This flag is dev-only fallback.
if (allowInsecureTls) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export const auth0 = new Auth0Client({
  allowInsecureRequests:
    allowInsecureTls || process.env.NODE_ENV === "development",
  async beforeSessionSaved(session, idToken) {
    return enrichAuth0SessionUser(session, idToken);
  },
});
