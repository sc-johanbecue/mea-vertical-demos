type GraphQlResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getContentHubEndpoint(): string {
  const endpoint = requireEnv('CONTENT_HUB_ENDPOINT').replace(/\/$/, '');
  return endpoint.endsWith('/v1') ? endpoint : `${endpoint}/v1`;
}

export async function contentHubGraphql<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const endpoint = getContentHubEndpoint();
  const apiKey = requireEnv('CONTENT_HUB_API_KEY');

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-GQL-Token': apiKey,
    },
    body: JSON.stringify({ query, variables }),
  });

  const payload = (await response.json()) as GraphQlResponse<T>;

  if (!response.ok) {
    const detail = payload.errors?.map((error) => error.message).join('; ') || response.statusText;
    throw new Error(`Content Hub GraphQL HTTP ${response.status}: ${detail}`);
  }

  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join('; '));
  }

  if (!payload.data) {
    throw new Error('Content Hub GraphQL returned no data');
  }

  return payload.data;
}
