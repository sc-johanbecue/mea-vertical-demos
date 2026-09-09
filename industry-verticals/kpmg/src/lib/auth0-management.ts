import { logAuth0ClaimsDebug } from './auth0-debug';

export type Auth0ManagementUserPatch = {
  given_name?: string;
  family_name?: string;
  name?: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
};

type CachedToken = {
  token: string;
  expiresAt: number;
};

type CachedManagementUser = {
  user: Record<string, unknown>;
  expiresAt: number;
};

const tokenCache = new Map<string, CachedToken>();
const userCache = new Map<string, CachedManagementUser>();

const TOKEN_REFRESH_BUFFER_MS = 60_000;
const USER_CACHE_TTL_MS = 30_000;

export function formatAuth0ManagementError(status: number, body: string): string {
  if (status === 429) {
    return 'Auth0 is temporarily busy. Please wait a moment and try again.';
  }

  try {
    const parsed = JSON.parse(body) as { message?: string; error?: string };
    if (parsed.message) {
      return parsed.message;
    }
    if (parsed.error) {
      return parsed.error;
    }
  } catch {
    // fall through
  }

  return body || 'Auth0 request failed.';
}

function cacheKey(domain: string, suffix: string): string {
  return `${domain}:${suffix}`;
}

function invalidateCachedManagementUser(domain: string, userId: string): void {
  userCache.delete(cacheKey(domain, userId));
}

export async function getAuth0ManagementApiToken(domain: string): Promise<string | null> {
  const clientId = process.env.AUTH0_MGMT_CLIENT_ID || process.env.AUTH0_CLIENT_ID;
  const clientSecret = process.env.AUTH0_MGMT_CLIENT_SECRET || process.env.AUTH0_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return null;
  }

  const key = cacheKey(domain, clientId);
  const cached = tokenCache.get(key);
  if (cached && cached.expiresAt > Date.now() + TOKEN_REFRESH_BUFFER_MS) {
    return cached.token;
  }

  const response = await fetch(`https://${domain}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      audience: `https://${domain}/api/v2/`,
      grant_type: 'client_credentials',
    }),
  });

  if (!response.ok) {
    logAuth0ClaimsDebug('management-api/token', {
      ok: false,
      status: response.status,
      statusText: response.statusText,
      hint:
        'Authorize a Machine-to-Machine app for Auth0 Management API with read:users, read:roles, update:users, update:users_app_metadata.',
    });
    return null;
  }

  const body = (await response.json()) as { access_token?: string; expires_in?: number };
  const token = body.access_token ?? null;
  if (!token) {
    return null;
  }

  const expiresInMs = (body.expires_in ?? 86_400) * 1000;
  tokenCache.set(key, {
    token,
    expiresAt: Date.now() + expiresInMs,
  });

  return token;
}

async function fetchWithManagementToken(
  domain: string,
  url: string,
  init?: RequestInit
): Promise<Response> {
  const token = await getAuth0ManagementApiToken(domain);
  if (!token) {
    throw new Error('Management API is not configured.');
  }

  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
  });

  if (response.status !== 429) {
    return response;
  }

  const retryAfterHeader = response.headers.get('retry-after');
  const retryAfterMs = retryAfterHeader ? Number(retryAfterHeader) * 1000 : 1500;
  if (!Number.isFinite(retryAfterMs) || retryAfterMs <= 0) {
    return response;
  }

  await new Promise((resolve) => setTimeout(resolve, Math.min(retryAfterMs, 5000)));

  const retryToken = await getAuth0ManagementApiToken(domain);
  if (!retryToken) {
    return response;
  }

  return fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${retryToken}`,
      ...(init?.headers ?? {}),
    },
  });
}

export async function patchAuth0ManagementUser(
  domain: string,
  userId: string,
  patch: Auth0ManagementUserPatch
): Promise<{ ok: true } | { ok: false; status: number; message: string }> {
  try {
    const response = await fetchWithManagementToken(
      domain,
      `https://${domain}/api/v2/users/${encodeURIComponent(userId)}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      }
    );

    if (!response.ok) {
      const body = (await response.text()) || response.statusText;
      logAuth0ClaimsDebug('management-api/patch-user', {
        ok: false,
        status: response.status,
        userId,
        body,
      });
      return {
        ok: false,
        status: response.status,
        message: formatAuth0ManagementError(response.status, body),
      };
    }

    invalidateCachedManagementUser(domain, userId);
    logAuth0ClaimsDebug('management-api/patch-user', { ok: true, userId, patchKeys: Object.keys(patch) });
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update Auth0 profile.';
    return { ok: false, status: 503, message };
  }
}

export async function getAuth0ManagementUser(
  domain: string,
  userId: string,
  options?: { bypassCache?: boolean }
): Promise<{ ok: true; user: Record<string, unknown> } | { ok: false; status: number; message: string }> {
  const key = cacheKey(domain, userId);
  if (!options?.bypassCache) {
    const cached = userCache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      return { ok: true, user: cached.user };
    }
  }

  try {
    const response = await fetchWithManagementToken(
      domain,
      `https://${domain}/api/v2/users/${encodeURIComponent(userId)}`
    );

    if (!response.ok) {
      const body = (await response.text()) || response.statusText;
      return {
        ok: false,
        status: response.status,
        message: formatAuth0ManagementError(response.status, body),
      };
    }

    const user = (await response.json()) as Record<string, unknown>;
    userCache.set(key, {
      user,
      expiresAt: Date.now() + USER_CACHE_TTL_MS,
    });
    return { ok: true, user };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load Auth0 user.';
    return { ok: false, status: 503, message };
  }
}

export async function searchAuth0Users(
  domain: string,
  query: string
): Promise<{ ok: true; users: Record<string, unknown>[] } | { ok: false; status: number; message: string }> {
  try {
    const response = await fetchWithManagementToken(
      domain,
      `https://${domain}/api/v2/users?q=${encodeURIComponent(query)}&search_engine=v3&per_page=100&page=0`
    );

    if (!response.ok) {
      const body = (await response.text()) || response.statusText;
      return {
        ok: false,
        status: response.status,
        message: formatAuth0ManagementError(response.status, body),
      };
    }

    const users = (await response.json()) as Record<string, unknown>[];
    return { ok: true, users: Array.isArray(users) ? users : [] };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to search Auth0 users.';
    return { ok: false, status: 503, message };
  }
}

export async function listAuth0UsersPage(
  domain: string,
  page: number,
  perPage: number = 100
): Promise<{ ok: true; users: Record<string, unknown>[] } | { ok: false; status: number; message: string }> {
  try {
    const response = await fetchWithManagementToken(
      domain,
      `https://${domain}/api/v2/users?per_page=${perPage}&page=${page}&include_totals=false`
    );

    if (!response.ok) {
      const body = (await response.text()) || response.statusText;
      return {
        ok: false,
        status: response.status,
        message: formatAuth0ManagementError(response.status, body),
      };
    }

    const users = (await response.json()) as Record<string, unknown>[];
    return { ok: true, users: Array.isArray(users) ? users : [] };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to list Auth0 users.';
    return { ok: false, status: 503, message };
  }
}

export async function listAuth0UsersPaged(
  domain: string,
  maxPages: number = 5,
  perPage: number = 100
): Promise<{ ok: true; users: Record<string, unknown>[] } | { ok: false; status: number; message: string }> {
  const users: Record<string, unknown>[] = [];

  for (let page = 0; page < maxPages; page++) {
    const result = await listAuth0UsersPage(domain, page, perPage);
    if (!result.ok) {
      return page === 0 ? result : { ok: true, users };
    }
    users.push(...result.users);
    if (result.users.length < perPage) {
      break;
    }
  }

  return { ok: true, users };
}

export type Auth0CreateUserPayload = {
  email: string;
  password: string;
  given_name: string;
  family_name: string;
  name: string;
  connection?: string;
  user_metadata?: Record<string, unknown>;
};

export async function createAuth0User(
  domain: string,
  payload: Auth0CreateUserPayload
): Promise<{ ok: true; userId: string } | { ok: false; status: number; message: string }> {
  try {
    const response = await fetchWithManagementToken(domain, `https://${domain}/api/v2/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
        given_name: payload.given_name,
        family_name: payload.family_name,
        name: payload.name,
        connection:
          payload.connection ||
          process.env.AUTH0_DB_CONNECTION ||
          process.env.AUTH0_CONNECTION ||
          'Username-Password-Authentication',
        email_verified: false,
        user_metadata: payload.user_metadata ?? {},
      }),
    });

    if (!response.ok) {
      const body = (await response.text()) || response.statusText;
      logAuth0ClaimsDebug('management-api/create-user', {
        ok: false,
        status: response.status,
        body,
      });
      return {
        ok: false,
        status: response.status,
        message: formatAuth0ManagementError(response.status, body),
      };
    }

    const created = (await response.json()) as { user_id?: string };
    logAuth0ClaimsDebug('management-api/create-user', { ok: true, userId: created.user_id });
    return { ok: true, userId: created.user_id ?? '' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create Auth0 user.';
    return { ok: false, status: 503, message };
  }
}
