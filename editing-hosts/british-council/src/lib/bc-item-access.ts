import client from '@/lib/sitecore-client';
import {
  normalizeBcAccessFields,
  type BcAccessFields,
  type BcAccessRef,
} from '@/lib/bc-access';

type GraphQlField = {
  value?: string;
};

type GraphQlMultilistField = {
  targetItems?: Array<{
    id?: string;
    name?: string;
    auth0?: GraphQlField;
  }>;
};

type GraphQlLookupField = {
  targetItem?: {
    name?: string;
  };
};

type ItemAccessQueryResult = {
  item?: {
    entitlements?: GraphQlMultilistField | null;
    roles?: GraphQlMultilistField | null;
    entitlementsOperator?: GraphQlLookupField | null;
    rolesOperator?: GraphQlLookupField | null;
  } | null;
};

const ITEM_ACCESS_QUERY = `
query BcItemAccess($path: String, $language: String!) {
  item(path: $path, language: $language) {
    entitlements: field(name: "Entitlements") {
      ... on MultilistField {
        targetItems {
          id
          name
          auth0: field(name: "Auth0") {
            value
          }
        }
      }
    }
    roles: field(name: "Roles") {
      ... on MultilistField {
        targetItems {
          id
          name
          auth0: field(name: "Auth0") {
            value
          }
        }
      }
    }
    entitlementsOperator: field(name: "EntitlementsOperator") {
      ... on LookupField {
        targetItem {
          name
        }
      }
    }
    rolesOperator: field(name: "RolesOperator") {
      ... on LookupField {
        targetItem {
          name
        }
      }
    }
  }
}
`;

function mapTargets(
  field: GraphQlMultilistField | null | undefined
): BcAccessRef[] {
  return (field?.targetItems ?? []).map((item) => ({
    id: item.id,
    name: item.name,
    fields: {
      Auth0: { value: item.auth0?.value ?? '' },
    },
  }));
}

/** Normalize app routes like /portal/comics → /Portal/Comics for item lookup. */
export function normalizeSitecoreRoutePath(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) {
    return '';
  }

  if (trimmed.startsWith('{') || /^[0-9a-f-]{36}$/i.test(trimmed.replace(/[{}]/g, ''))) {
    return trimmed.startsWith('{') ? trimmed : `{${trimmed}}`;
  }

  let path = trimmed;
  try {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      path = new URL(path).pathname;
    }
  } catch {
    // keep as-is
  }

  path = path.split('?')[0].split('#')[0];
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }

    // Prefer Sitecore-style casing under Portal for common collection routes.
  const parts = path.split('/').filter(Boolean);
  if (parts.length === 0) {
    return '/';
  }

  const normalized = parts.map((part, index) => {
    if (index === 0 && part.toLowerCase() === 'portal') {
      return 'Portal';
    }
    return part
      .split('-')
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(' ');
  });

  // Artist Showcase style paths use spaces in Sitecore item names; hrefs often use encoded spaces or hyphens.
  return `/${normalized.join('/')}`.replace(/%20/gi, ' ');
}

function siteHomeItemPath(): string {
  // Content tree: /sitecore/content/<tenant>/<site>/Home/...
  return '/sitecore/content/british-council/british-council/Home';
}

export async function fetchItemAccessFields(options: {
  path?: string;
  id?: string;
  language?: string;
}): Promise<BcAccessFields> {
  const language = options.language || process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en';

  const pathCandidates: string[] = [];
  if (options.id) {
    const bare = options.id.replace(/[{}]/g, '');
    pathCandidates.push(`{${bare}}`, bare);
  } else if (options.path) {
    const original = options.path.trim();
    const normalized = normalizeSitecoreRoutePath(original);
    pathCandidates.push(normalized);
    if (normalized.startsWith('/') && !normalized.toLowerCase().startsWith('/sitecore/')) {
      pathCandidates.push(`${siteHomeItemPath()}${normalized}`);
    }
    if (original && original !== normalized) {
      pathCandidates.push(original.startsWith('/') ? original : `/${original}`);
    }
    try {
      const rawPath =
        original.startsWith('http://') || original.startsWith('https://')
          ? new URL(original).pathname
          : original;
      const decoded = decodeURIComponent(rawPath.split('?')[0].split('#')[0]);
      if (decoded && !pathCandidates.includes(decoded)) {
        pathCandidates.push(decoded);
        if (decoded.startsWith('/') && !decoded.toLowerCase().startsWith('/sitecore/')) {
          pathCandidates.push(`${siteHomeItemPath()}${decoded}`);
        }
      }
    } catch {
      // ignore
    }
  }

  for (const path of pathCandidates.filter(Boolean)) {
    try {
      const result = await client.getData<ItemAccessQueryResult>(ITEM_ACCESS_QUERY, {
        path,
        language,
      });

      const item = result?.item;
      if (!item) {
        continue;
      }

      return normalizeBcAccessFields({
        Entitlements: mapTargets(item.entitlements),
        Roles: mapTargets(item.roles),
        EntitlementsOperator: item.entitlementsOperator?.targetItem
          ? { name: item.entitlementsOperator.targetItem.name }
          : null,
        RolesOperator: item.rolesOperator?.targetItem
          ? { name: item.rolesOperator.targetItem.name }
          : null,
      });
    } catch {
      // try next candidate
    }
  }

  return {};
}
