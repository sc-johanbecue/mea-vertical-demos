import { GraphQLRequestClient } from '@sitecore-content-sdk/core';

type AuthoringTokenResponse = {
  access_token?: string;
};

type UpdateItemFieldResponse = {
  updateItem?: {
    item?: { itemId?: string; path?: string };
  };
};

let cachedToken: { value: string; expiresAt: number } | null = null;

function getAuthoringGraphqlUrl(): string | null {
  return (
    process.env.SITECORE_AUTHORING_GRAPHQL_URL ||
    process.env.SITECORE_XMC_AUTHORING_GRAPHQL_URL ||
    null
  );
}

async function getAuthoringAccessToken(): Promise<string | null> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 30_000) {
    return cachedToken.value;
  }

  const clientId = process.env.SITECORE_AUTH_CLIENT_ID;
  const clientSecret = process.env.SITECORE_AUTH_CLIENT_SECRET;
  const tokenUrl =
    process.env.SITECORE_AUTH_TOKEN_URL ||
    process.env.SITECORE_OAUTH_TOKEN_URL ||
    null;

  if (!clientId || !clientSecret || !tokenUrl) {
    return null;
  }

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
    audience: process.env.SITECORE_AUTH_AUDIENCE || 'https://api.sitecorecloud.io',
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as AuthoringTokenResponse & { expires_in?: number };
  if (!payload.access_token) {
    return null;
  }

  cachedToken = {
    value: payload.access_token,
    expiresAt: now + (payload.expires_in ?? 3600) * 1000,
  };
  return payload.access_token;
}

function formatItemPath(identifier: string): string {
  const clean = identifier.replace(/[{}-]/g, '').toUpperCase();
  if (!/^[0-9A-F]{32}$/.test(clean)) {
    return identifier.trim();
  }
  return `{${clean.slice(0, 8)}-${clean.slice(8, 12)}-${clean.slice(12, 16)}-${clean.slice(16, 20)}-${clean.slice(20)}}`;
}

export const DISCUSSION_COMMENT_TEMPLATE_ID = 'd5000003-0001-4000-8000-000000000002';

export type SitecoreItemFieldInput = {
  name: string;
  value: string;
};

type CreateItemResponse = {
  createItem?: {
    item?: { itemId?: string; id?: string; path?: string };
  };
};

async function getAuthoringClient(): Promise<
  { client: GraphQLRequestClient } | { error: string }
> {
  const graphqlUrl = getAuthoringGraphqlUrl();
  const token = await getAuthoringAccessToken();

  if (!graphqlUrl || !token) {
    return {
      error:
        'Sitecore authoring API is not configured (SITECORE_AUTHORING_GRAPHQL_URL, SITECORE_AUTH_*).',
    };
  }

  return {
    client: new GraphQLRequestClient(graphqlUrl, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  };
}

export async function createSitecoreChildItem(
  parentItemId: string,
  templateId: string,
  itemName: string,
  fields: SitecoreItemFieldInput[],
  language: string = 'en'
): Promise<{ ok: true; itemId: string } | { ok: false; message: string }> {
  const authoring = await getAuthoringClient();
  if ('error' in authoring) {
    return { ok: false, message: authoring.error };
  }

  const mutation = `
    mutation CreateItem($input: CreateItemInput!) {
      createItem(input: $input) {
        item {
          itemId
          path
        }
      }
    }
  `;

  try {
    const data = await authoring.client.request<CreateItemResponse>(mutation, {
      input: {
        parent: formatItemPath(parentItemId),
        name: itemName,
        templateId: formatItemPath(templateId),
        language,
        fields,
      },
    });
    const itemId = data.createItem?.item?.itemId ?? data.createItem?.item?.id;
    if (!itemId) {
      return { ok: false, message: 'Sitecore did not return the new item id.' };
    }
    return { ok: true, itemId };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create Sitecore item.';
    return { ok: false, message };
  }
}

type ReadItemFieldResponse = {
  item?: {
    field?: { value?: string | null } | null;
  } | null;
};

export async function readSitecoreItemField(
  itemId: string,
  fieldName: string,
  language: string = 'en'
): Promise<{ ok: true; value: string } | { ok: false; message: string }> {
  const authoring = await getAuthoringClient();
  if ('error' in authoring) {
    return { ok: false, message: authoring.error };
  }

  const query = `
    query ReadItemField($path: String!, $language: String!, $fieldName: String!) {
      item(path: $path, language: $language) {
        field(name: $fieldName) {
          value
        }
      }
    }
  `;

  try {
    const data = await authoring.client.request<ReadItemFieldResponse>(query, {
      path: formatItemPath(itemId),
      language,
      fieldName,
    });
    const value = data.item?.field?.value;
    if (value === undefined || value === null) {
      return { ok: true, value: '' };
    }
    return { ok: true, value: String(value) };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to read Sitecore item field.';
    return { ok: false, message };
  }
}

export async function updateSitecoreItemField(
  itemId: string,
  fieldName: string,
  value: string,
  language: string = 'en'
): Promise<{ ok: true } | { ok: false; message: string }> {
  const authoring = await getAuthoringClient();
  if ('error' in authoring) {
    return { ok: false, message: authoring.error };
  }

  const mutation = `
    mutation UpdateItemField($input: UpdateItemInput!) {
      updateItem(input: $input) {
        item {
          itemId
          path
        }
      }
    }
  `;

  try {
    const data = await authoring.client.request<UpdateItemFieldResponse>(mutation, {
      input: {
        path: formatItemPath(itemId),
        language,
        fields: [{ name: fieldName, value }],
      },
    });
    const updatedItem = data.updateItem?.item;
    if (!updatedItem?.itemId && !updatedItem?.path) {
      return { ok: false, message: 'Sitecore did not confirm the field update.' };
    }
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update Sitecore item.';
    return { ok: false, message };
  }
}

type PublishItemResponse = {
  publishItem?: {
    operationId?: string | null;
  } | null;
};

/**
 * Publishes an item (and optionally descendants) from master to Experience Edge
 * so Delivery/Edge GraphQL on Vercel can read it.
 *
 * `publishItemMode` must be an inline enum — Authoring GraphQL rejects it as a variable.
 */
export async function publishSitecoreItem(
  itemId: string,
  language: string = 'en',
  options?: { publishSubItems?: boolean }
): Promise<{ ok: true; operationId?: string } | { ok: false; message: string }> {
  const authoring = await getAuthoringClient();
  if ('error' in authoring) {
    return { ok: false, message: authoring.error };
  }

  const publishSubItems = options?.publishSubItems ?? false;
  const mutation = `
    mutation PublishItem(
      $rootItemIds: [ID]
      $languages: [String!]!
      $targetDatabases: [String!]!
      $publishSubItems: Boolean
    ) {
      publishItem(input: {
        sourceDatabase: "master"
        rootItemIds: $rootItemIds
        languages: $languages
        targetDatabases: $targetDatabases
        publishItemMode: SMART
        publishRelatedItems: false
        publishSubItems: $publishSubItems
      }) {
        operationId
      }
    }
  `;

  try {
    const data = await authoring.client.request<PublishItemResponse>(mutation, {
      rootItemIds: [formatItemPath(itemId)],
      languages: [language || 'en'],
      targetDatabases: ['experienceedge'],
      publishSubItems,
    });
    const operationId = data.publishItem?.operationId ?? undefined;
    if (!operationId) {
      return { ok: false, message: 'Sitecore did not return a publish operation id.' };
    }
    return { ok: true, operationId };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to publish Sitecore item.';
    return { ok: false, message };
  }
}
