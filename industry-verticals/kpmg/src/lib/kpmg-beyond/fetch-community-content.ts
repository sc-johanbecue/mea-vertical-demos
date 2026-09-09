import { GraphQLRequestClient } from "@sitecore-content-sdk/core";
import { getEdgeProxyContentUrl } from "@sitecore-content-sdk/content/client";
import type {
  ImageField,
  LinkField,
  RichTextField,
  TextField,
} from "@sitecore-content-sdk/nextjs";
import { parseDroplinkItemId } from "@/lib/kpmg-beyond/parse-droplink";
import {
  getKnownCommunityTitle,
  resolveCommunityContextFromPathname,
  resolveCommunityIdFromMetadataKey,
} from "@/lib/kpmg-auth0-communities";

export type CommunityCardFields = {
  CategoryLabel: TextField;
  Title: TextField;
  Summary: TextField;
  Image: ImageField;
  Link: LinkField;
  BannerImage: ImageField;
  About: RichTextField;
  PrivacyStatus: TextField;
  MemberCount: TextField;
  SupportText: RichTextField;
  SupportEmail: TextField;
  Guidelines: RichTextField;
  JoinRequests: TextField;
  RequiresApproval: TextField;
  ClosedLabel: TextField;
};

export type CommunityHostFields = {
  HostName: TextField;
  HostRole: TextField;
  HostCompany: TextField;
  HostImage: ImageField;
  HostInitials: TextField;
};

export type DiscussionFields = {
  Title: TextField;
  Body: RichTextField;
  AuthorName: TextField;
  AuthorTitle: TextField;
  AuthorCompany: TextField;
  AuthorImage: ImageField;
  PublishedDate: TextField;
  LikeCount: TextField;
  CommentCount: TextField;
  ViewCount: TextField;
  AdminApproved: TextField;
  LinkPreviewTitle: TextField;
  LinkPreviewSummary: TextField;
  LinkPreviewImage: ImageField;
  LinkPreviewUrl: LinkField;
};

export type DiscussionCommentFields = {
  Body: RichTextField;
  AuthorName: TextField;
  AuthorTitle: TextField;
  AuthorCompany: TextField;
  AuthorImage: ImageField;
  PublishedDate: TextField;
  AdminApproved: TextField;
};

export type CommunityListItem = { id: string; fields: CommunityCardFields };
export type CommunityHostItem = { id: string; fields: CommunityHostFields };
export type DiscussionListItem = {
  id: string;
  fields: DiscussionFields;
  url?: string;
};
export type DiscussionCommentItem = {
  id: string;
  fields: DiscussionCommentFields;
  replies: DiscussionCommentItem[];
};

type GraphQLFieldResult = { jsonValue?: unknown };

type GraphQLChildStub = { id: string; name?: string };

type GraphQLCommunityItem = GraphQLChildStub &
  Record<string, GraphQLFieldResult | undefined> & {
    url?: { path?: string };
  };

export function normalizeSitecoreContentUrl(
  path: string | undefined,
): string | undefined {
  const trimmed = path?.trim();
  if (!trimmed) {
    return undefined;
  }
  return trimmed.replace(/^\/Communities\//i, "/communities/");
}

const FOLDER_CHILDREN_PAGE_SIZE = 100;

const LIST_CHILDREN_QUERY = `
  query ListChildren($path: String!, $language: String!) {
    item(path: $path, language: $language) {
      children(first: ${FOLDER_CHILDREN_PAGE_SIZE}) {
        results { id name }
      }
    }
  }
`;

const COMMUNITY_LIST_CARD_QUERY = `
  query CommunityListCard($path: String!, $language: String!) {
    item(path: $path, language: $language) {
      id
      url { path }
      categoryLabel: field(name: "CategoryLabel") { jsonValue }
      title: field(name: "Title") { jsonValue }
      summary: field(name: "Summary") { jsonValue }
      image: field(name: "Image") { jsonValue }
      link: field(name: "Link") { jsonValue }
      privacyStatus: field(name: "PrivacyStatus") { jsonValue }
      closedLabel: field(name: "ClosedLabel") { jsonValue }
    }
  }
`;

/** Join / admin review — only membership fields to stay under Edge GraphQL depth limits. */
const COMMUNITY_JOIN_ITEM_QUERY = `
  query CommunityJoinItem($path: String!, $language: String!) {
    item(path: $path, language: $language) {
      id
      title: field(name: "Title") { jsonValue }
      privacyStatus: field(name: "PrivacyStatus") { jsonValue }
      joinRequests: field(name: "JoinRequests") { jsonValue }
      requiresApproval: field(name: "RequiresApproval") { jsonValue }
    }
  }
`;

/** Comment moderation — guidelines only to stay under Edge GraphQL depth limits. */
const COMMUNITY_GUIDELINES_QUERY = `
  query CommunityGuidelines($path: String!, $language: String!) {
    item(path: $path, language: $language) {
      id
      guidelines: field(name: "Guidelines") { jsonValue }
    }
  }
`;

const COMMUNITY_ITEM_QUERY = `
  query CommunityItem($path: String!, $language: String!) {
    item(path: $path, language: $language) {
      id
      categoryLabel: field(name: "CategoryLabel") { jsonValue }
      title: field(name: "Title") { jsonValue }
      summary: field(name: "Summary") { jsonValue }
      image: field(name: "Image") { jsonValue }
      link: field(name: "Link") { jsonValue }
      bannerImage: field(name: "BannerImage") { jsonValue }
      about: field(name: "About") { jsonValue }
      privacyStatus: field(name: "PrivacyStatus") { jsonValue }
      memberCount: field(name: "MemberCount") { jsonValue }
      supportText: field(name: "SupportText") { jsonValue }
      supportEmail: field(name: "SupportEmail") { jsonValue }
      guidelines: field(name: "Guidelines") { jsonValue }
      joinRequests: field(name: "JoinRequests") { jsonValue }
      requiresApproval: field(name: "RequiresApproval") { jsonValue }
      closedLabel: field(name: "ClosedLabel") { jsonValue }
    }
  }
`;

/** Community listing cards — fewer fields to stay under Edge GraphQL depth limits. */
const DISCUSSION_LIST_ITEM_QUERY = `
  query DiscussionListItem($path: String!, $language: String!) {
    item(path: $path, language: $language) {
      id
      url { path }
      title: field(name: "Title") { jsonValue }
      body: field(name: "Body") { jsonValue }
      authorName: field(name: "AuthorName") { jsonValue }
      authorCompany: field(name: "AuthorCompany") { jsonValue }
      publishedDate: field(name: "PublishedDate") { jsonValue }
      likeCount: field(name: "LikeCount") { jsonValue }
      commentCount: field(name: "CommentCount") { jsonValue }
      viewCount: field(name: "ViewCount") { jsonValue }
      adminApproved: field(name: "AdminApproved") { jsonValue }
    }
  }
`;

const COMMENT_ITEM_QUERY = `
  query CommentItem($path: String!, $language: String!) {
    item(path: $path, language: $language) {
      id
      body: field(name: "Body") { jsonValue }
      authorName: field(name: "AuthorName") { jsonValue }
      authorTitle: field(name: "AuthorTitle") { jsonValue }
      authorCompany: field(name: "AuthorCompany") { jsonValue }
      authorImage: field(name: "AuthorImage") { jsonValue }
      publishedDate: field(name: "PublishedDate") { jsonValue }
      adminApproved: field(name: "AdminApproved") { jsonValue }
    }
  }
`;

const ITEM_PARENT_QUERY = `
  query ItemParent($path: String!, $language: String!) {
    item(path: $path, language: $language) {
      id
      parent { id }
    }
  }
`;

const ITEM_URL_QUERY = `
  query ItemUrl($path: String!, $language: String!) {
    item(path: $path, language: $language) {
      id
      url { path }
    }
  }
`;

function formatItemPath(identifier: string): string {
  const clean = identifier.replace(/[{}-]/g, "").toUpperCase();
  if (!/^[0-9A-F]{32}$/.test(clean)) {
    return identifier.trim();
  }
  return `{${clean.slice(0, 8)}-${clean.slice(8, 12)}-${clean.slice(12, 16)}-${clean.slice(16, 20)}-${clean.slice(20)}}`;
}

function asTextField(jsonValue: unknown): TextField {
  if (
    jsonValue &&
    typeof jsonValue === "object" &&
    "value" in (jsonValue as object)
  ) {
    return jsonValue as TextField;
  }
  return { value: typeof jsonValue === "string" ? jsonValue : "" };
}

function asRichTextField(jsonValue: unknown): RichTextField {
  if (jsonValue && typeof jsonValue === "object") {
    return jsonValue as RichTextField;
  }
  return { value: typeof jsonValue === "string" ? jsonValue : "" };
}

function asImageField(jsonValue: unknown): ImageField {
  if (jsonValue && typeof jsonValue === "object") {
    return jsonValue as ImageField;
  }
  return { value: { src: "", alt: "" } };
}

function asLinkField(jsonValue: unknown): LinkField {
  if (jsonValue && typeof jsonValue === "object") {
    return jsonValue as LinkField;
  }
  return { value: { href: "#" } };
}

function isApproved(jsonValue: unknown): boolean {
  const value = asTextField(jsonValue).value?.toString().trim().toLowerCase();
  return value === "1" || value === "true" || value === "yes";
}

function createGraphQLClient(): GraphQLRequestClient {
  const contextId = process.env.SITECORE_EDGE_CONTEXT_ID;
  if (!contextId) {
    throw new Error("SITECORE_EDGE_CONTEXT_ID is not configured");
  }
  const edgeHost =
    process.env.SITECORE_EDGE_URL ||
    process.env.NEXT_PUBLIC_SITECORE_EDGE_PLATFORM_HOSTNAME ||
    undefined;
  return new GraphQLRequestClient(getEdgeProxyContentUrl(edgeHost), {
    contextId,
  });
}

async function listChildIds(
  client: GraphQLRequestClient,
  parentId: string,
  language: string,
): Promise<GraphQLChildStub[]> {
  const data = await client.request<{
    item?: { children?: { results?: GraphQLChildStub[] } };
  }>(LIST_CHILDREN_QUERY, {
    path: formatItemPath(parentId),
    language: language || "en",
  });
  return data.item?.children?.results ?? [];
}

export type CommunityJoinContext = {
  id: string;
  fields: Pick<
    CommunityCardFields,
    "Title" | "PrivacyStatus" | "JoinRequests" | "RequiresApproval"
  >;
};

async function fetchCommunityListCardById(
  client: GraphQLRequestClient,
  itemId: string,
  language: string,
): Promise<CommunityListItem | null> {
  const data = await client.request<{ item?: GraphQLCommunityItem | null }>(
    COMMUNITY_LIST_CARD_QUERY,
    {
      path: formatItemPath(itemId),
      language: language || "en",
    },
  );
  const item = data.item;
  if (!item?.id) {
    return null;
  }
  return {
    id: item.id,
    fields: {
      CategoryLabel: asTextField(item.categoryLabel?.jsonValue),
      Title: asTextField(item.title?.jsonValue),
      Summary: asTextField(item.summary?.jsonValue),
      Image: asImageField(item.image?.jsonValue),
      Link: asLinkField(item.link?.jsonValue),
      BannerImage: asImageField(undefined),
      About: asRichTextField(undefined),
      PrivacyStatus: asTextField(item.privacyStatus?.jsonValue),
      MemberCount: asTextField(undefined),
      SupportText: asRichTextField(undefined),
      SupportEmail: asTextField(undefined),
      Guidelines: asRichTextField(undefined),
      JoinRequests: asTextField(undefined),
      RequiresApproval: asTextField(undefined),
      ClosedLabel: asTextField(item.closedLabel?.jsonValue),
    },
  };
}

async function fetchCommunityJoinContextByIdInternal(
  client: GraphQLRequestClient,
  itemId: string,
  language: string,
): Promise<CommunityJoinContext | null> {
  const data = await client.request<{ item?: GraphQLCommunityItem | null }>(
    COMMUNITY_JOIN_ITEM_QUERY,
    {
      path: formatItemPath(itemId),
      language: language || "en",
    },
  );
  const item = data.item;
  if (!item?.id) {
    return null;
  }
  return {
    id: item.id,
    fields: {
      Title: asTextField(item.title?.jsonValue),
      PrivacyStatus: asTextField(item.privacyStatus?.jsonValue),
      JoinRequests: asTextField(item.joinRequests?.jsonValue),
      RequiresApproval: asTextField(item.requiresApproval?.jsonValue),
    },
  };
}

export type CommunityContext = {
  id: string;
  title?: string;
};

export async function isSitecoreItemDescendantOf(
  itemId: string,
  ancestorId: string,
  language: string = "en",
): Promise<boolean> {
  const client = createGraphQLClient();
  let currentId = itemId.trim();
  const normalizedAncestor = ancestorId.replace(/[{}-]/g, "").toLowerCase();

  for (let depth = 0; depth < 20 && currentId; depth++) {
    if (currentId.replace(/[{}-]/g, "").toLowerCase() === normalizedAncestor) {
      return true;
    }
    try {
      const parentId = await fetchSitecoreItemParentId(client, currentId, language);
      if (!parentId) {
        break;
      }
      currentId = parentId;
    } catch {
      break;
    }
  }
  return false;
}

async function fetchSitecoreItemParentId(
  client: GraphQLRequestClient,
  itemId: string,
  language: string,
): Promise<string | null> {
  const data = await client.request<{
    item?: { parent?: { id?: string } | null } | null;
  }>(ITEM_PARENT_QUERY, {
    path: formatItemPath(itemId),
    language: language || "en",
  });
  const parentId = data.item?.parent?.id?.trim();
  return parentId || null;
}

async function fetchSitecoreItemUrlPath(
  client: GraphQLRequestClient,
  itemId: string,
  language: string,
): Promise<string | null> {
  const data = await client.request<{
    item?: { url?: { path?: string } | null } | null;
  }>(ITEM_URL_QUERY, {
    path: formatItemPath(itemId),
    language: language || "en",
  });
  const path = data.item?.url?.path?.trim();
  return path || null;
}

/** Walks Sitecore parents until a known community item is found (discussion, comment, etc.). */
export async function resolveCommunityContextForSitecoreItem(
  itemId: string,
  language: string = "en",
): Promise<CommunityContext | null> {
  const client = createGraphQLClient();

  try {
    const urlPath = await fetchSitecoreItemUrlPath(client, itemId, language);
    const fromUrl = resolveCommunityContextFromPathname(urlPath);
    if (fromUrl) {
      return { id: fromUrl.id, title: fromUrl.title };
    }
  } catch {
    // Fall back to parent walk below.
  }

  let currentId = itemId.trim();
  for (let depth = 0; depth < 12 && currentId; depth++) {
    const resolved = resolveCommunityIdFromMetadataKey(currentId);
    if (resolved) {
      return { id: resolved, title: getKnownCommunityTitle(resolved) };
    }
    try {
      const parentId = await fetchSitecoreItemParentId(client, currentId, language);
      if (!parentId) {
        break;
      }
      currentId = parentId;
    } catch {
      break;
    }
  }
  return null;
}

async function fetchCommunityById(
  client: GraphQLRequestClient,
  itemId: string,
  language: string,
): Promise<CommunityListItem | null> {
  const data = await client.request<{ item?: GraphQLCommunityItem | null }>(
    COMMUNITY_ITEM_QUERY,
    {
      path: formatItemPath(itemId),
      language: language || "en",
    },
  );
  const item = data.item;
  if (!item?.id) {
    return null;
  }
  return {
    id: item.id,
    fields: {
      CategoryLabel: asTextField(item.categoryLabel?.jsonValue),
      Title: asTextField(item.title?.jsonValue),
      Summary: asTextField(item.summary?.jsonValue),
      Image: asImageField(item.image?.jsonValue),
      Link: asLinkField(item.link?.jsonValue),
      BannerImage: asImageField(item.bannerImage?.jsonValue),
      About: asRichTextField(item.about?.jsonValue),
      PrivacyStatus: asTextField(item.privacyStatus?.jsonValue),
      MemberCount: asTextField(item.memberCount?.jsonValue),
      SupportText: asRichTextField(item.supportText?.jsonValue),
      SupportEmail: asTextField(item.supportEmail?.jsonValue),
      Guidelines: asRichTextField(item.guidelines?.jsonValue),
      JoinRequests: asTextField(item.joinRequests?.jsonValue),
      RequiresApproval: asTextField(item.requiresApproval?.jsonValue),
      ClosedLabel: asTextField(item.closedLabel?.jsonValue),
    },
  };
}

export async function fetchCommunityListItems(
  folderItemId: string,
  language: string,
): Promise<CommunityListItem[]> {
  const client = createGraphQLClient();
  const childIds = await listChildIds(client, folderItemId, language);
  const items = await Promise.all(
    childIds.map(async (child) =>
      fetchCommunityListCardById(client, child.id, language),
    ),
  );
  return items.filter((item): item is CommunityListItem =>
    Boolean(item?.fields.Title?.value),
  );
}

export async function fetchCommunityHosts(
  communityItemId: string,
  language: string,
): Promise<CommunityHostItem[]> {
  const client = createGraphQLClient();
  const children = await listChildIds(client, communityItemId, language);
  const hosts: CommunityHostItem[] = [];
  for (const child of children) {
    const data = await client.request<{ item?: GraphQLCommunityItem | null }>(
      `query HostItem($path: String!, $language: String!) {
        item(path: $path, language: $language) {
          id
          hostName: field(name: "HostName") { jsonValue }
          hostRole: field(name: "HostRole") { jsonValue }
          hostCompany: field(name: "HostCompany") { jsonValue }
          hostImage: field(name: "HostImage") { jsonValue }
          hostInitials: field(name: "HostInitials") { jsonValue }
        }
      }`,
      { path: formatItemPath(child.id), language: language || "en" },
    );
    const item = data.item;
    if (!item?.id || !asTextField(item.hostName?.jsonValue).value) {
      continue;
    }
    hosts.push({
      id: item.id,
      fields: {
        HostName: asTextField(item.hostName?.jsonValue),
        HostRole: asTextField(item.hostRole?.jsonValue),
        HostCompany: asTextField(item.hostCompany?.jsonValue),
        HostImage: asImageField(item.hostImage?.jsonValue),
        HostInitials: asTextField(item.hostInitials?.jsonValue),
      },
    });
  }
  return hosts;
}

async function fetchDiscussionListItemById(
  client: GraphQLRequestClient,
  itemId: string,
  language: string,
  includeUnapproved: boolean,
): Promise<DiscussionListItem | null> {
  const data = await client.request<{ item?: GraphQLCommunityItem | null }>(
    DISCUSSION_LIST_ITEM_QUERY,
    {
      path: formatItemPath(itemId),
      language: language || "en",
    },
  );
  const item = data.item;
  if (!item?.id) {
    return null;
  }
  const title = asTextField(item.title?.jsonValue).value?.toString().trim();
  if (!title) {
    return null;
  }
  if (!includeUnapproved && !isApproved(item.adminApproved?.jsonValue)) {
    return null;
  }
  return {
    id: item.id,
    url: normalizeSitecoreContentUrl(item.url?.path),
    fields: {
      Title: asTextField(item.title?.jsonValue),
      Body: asRichTextField(item.body?.jsonValue),
      AuthorName: asTextField(item.authorName?.jsonValue),
      AuthorTitle: asTextField(undefined),
      AuthorCompany: asTextField(item.authorCompany?.jsonValue),
      AuthorImage: asImageField(undefined),
      PublishedDate: asTextField(item.publishedDate?.jsonValue),
      LikeCount: asTextField(item.likeCount?.jsonValue),
      CommentCount: asTextField(item.commentCount?.jsonValue),
      ViewCount: asTextField(item.viewCount?.jsonValue),
      AdminApproved: asTextField(item.adminApproved?.jsonValue),
      LinkPreviewTitle: asTextField(undefined),
      LinkPreviewSummary: asTextField(undefined),
      LinkPreviewImage: asImageField(undefined),
      LinkPreviewUrl: asLinkField(undefined),
    },
  };
}

export async function fetchCommunityDiscussions(
  communityItemId: string,
  language: string,
  includeUnapproved: boolean = false,
): Promise<DiscussionListItem[]> {
  const client = createGraphQLClient();
  const children = await listChildIds(client, communityItemId, language);
  const discussions = await Promise.all(
    children.map(async (child) => {
      try {
        return await fetchDiscussionListItemById(
          client,
          child.id,
          language,
          includeUnapproved,
        );
      } catch {
        return null;
      }
    }),
  );
  return discussions.filter((item): item is DiscussionListItem =>
    Boolean(item?.fields.Title?.value?.toString().trim()),
  );
}

async function fetchCommentTree(
  client: GraphQLRequestClient,
  parentId: string,
  language: string,
  includeUnapproved: boolean,
): Promise<DiscussionCommentItem[]> {
  const children = await listChildIds(client, parentId, language);
  const comments: DiscussionCommentItem[] = [];
  for (const child of children) {
    const data = await client.request<{ item?: GraphQLCommunityItem | null }>(
      COMMENT_ITEM_QUERY,
      {
        path: formatItemPath(child.id),
        language: language || "en",
      },
    );
    const item = data.item;
    if (!item?.id) {
      continue;
    }
    const hasBody = Boolean(
      asRichTextField(item.body?.jsonValue).value?.toString().trim(),
    );
    if (!hasBody) {
      const nested = await fetchCommentTree(
        client,
        child.id,
        language,
        includeUnapproved,
      );
      comments.push(...nested);
      continue;
    }
    if (!includeUnapproved && !isApproved(item.adminApproved?.jsonValue)) {
      continue;
    }
    const replies = await fetchCommentTree(
      client,
      child.id,
      language,
      includeUnapproved,
    );
    comments.push({
      id: item.id,
      fields: {
        Body: asRichTextField(item.body?.jsonValue),
        AuthorName: asTextField(item.authorName?.jsonValue),
        AuthorTitle: asTextField(item.authorTitle?.jsonValue),
        AuthorCompany: asTextField(item.authorCompany?.jsonValue),
        AuthorImage: asImageField(item.authorImage?.jsonValue),
        PublishedDate: asTextField(item.publishedDate?.jsonValue),
        AdminApproved: asTextField(item.adminApproved?.jsonValue),
      },
      replies,
    });
  }
  return comments;
}

export async function fetchDiscussionComments(
  discussionItemId: string,
  language: string,
  includeUnapproved: boolean = false,
): Promise<DiscussionCommentItem[]> {
  const client = createGraphQLClient();
  return fetchCommentTree(
    client,
    discussionItemId,
    language,
    includeUnapproved,
  );
}

export async function fetchRecentDiscussionsForCommunities(
  communityIds: string[],
  language: string,
  limit: number = 2,
): Promise<Array<DiscussionListItem & { communityId: string }>> {
  const collected: Array<
    DiscussionListItem & { communityId: string; sortKey: number }
  > = [];
  for (const communityId of communityIds) {
    const discussions = await fetchCommunityDiscussions(
      communityId,
      language,
      false,
    );
    for (const discussion of discussions) {
      const sortKey =
        Date.parse(discussion.fields.PublishedDate?.value?.toString() ?? "") ||
        0;
      collected.push({ ...discussion, communityId, sortKey });
    }
  }
  return collected
    .sort((left, right) => right.sortKey - left.sortKey)
    .slice(0, limit)
    .map(({ sortKey: _sortKey, ...rest }) => rest);
}

export function resolveCommunitiesFolderId(
  cardsFolderValue: unknown,
): string | null {
  return (
    parseDroplinkItemId(cardsFolderValue) ??
    parseDroplinkItemId({ value: cardsFolderValue })
  );
}

export async function fetchCommunityItemById(
  communityItemId: string,
  language: string,
): Promise<CommunityListItem | null> {
  const client = createGraphQLClient();
  return fetchCommunityById(client, communityItemId, language);
}

export async function fetchCommunityJoinContextById(
  communityItemId: string,
  language: string,
): Promise<CommunityJoinContext | null> {
  const client = createGraphQLClient();
  return fetchCommunityJoinContextByIdInternal(
    client,
    communityItemId,
    language,
  );
}

export async function fetchCommunityGuidelinesById(
  communityItemId: string,
  language: string,
): Promise<string | null> {
  const client = createGraphQLClient();
  const data = await client.request<{ item?: GraphQLCommunityItem | null }>(
    COMMUNITY_GUIDELINES_QUERY,
    {
      path: formatItemPath(communityItemId),
      language: language || "en",
    },
  );
  const item = data.item;
  if (!item?.id) {
    return null;
  }
  const guidelines = asRichTextField(item.guidelines?.jsonValue).value?.toString().trim();
  return guidelines || null;
}
