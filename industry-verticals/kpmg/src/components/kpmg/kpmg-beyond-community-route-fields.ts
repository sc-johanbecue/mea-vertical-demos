'use client';

import type {
  ImageField,
  LinkField,
  RichTextField,
  TextField,
} from '@sitecore-content-sdk/nextjs';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { useEffect, useMemo, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import type { ComponentProps } from '@/lib/component-props';
import {
  getKnownCommunityTitle,
  resolveCommunityContextFromPathname,
} from '@/lib/kpmg-auth0-communities';
import { resolveSitecoreRouteItemId } from '@/lib/kpmg-auth0-events';
import type { CommunityCardFields } from '@/lib/kpmg-beyond/fetch-community-content';
import {
  communityRequiresJoinApproval,
  isCommunityClosedFromFields,
  isCommunityPrivateFromFields,
  isJoinRequestAllowedFromFields,
} from '@/lib/kpmg-beyond/community-join-approval';

export type KpmgBeyondCommunityPageFields = CommunityCardFields;

export const defaultCommunityPageFields: KpmgBeyondCommunityPageFields = {
  CategoryLabel: { value: 'COMMUNITY' },
  Title: { value: 'Community' },
  Summary: { value: '' },
  Image: { value: { src: '', alt: '' } },
  Link: { value: { href: '#' } },
  BannerImage: { value: { src: '', alt: '' } },
  About: { value: '' },
  PrivacyStatus: { value: 'Public' },
  MemberCount: { value: '0' },
  SupportText: { value: '' },
  SupportEmail: { value: '' },
  Guidelines: { value: '' },
  JoinRequests: { value: '[]' },
  RequiresApproval: { value: '' },
  ClosedLabel: { value: 'Closed' },
};

function resolveCommunityRouteFields(
  routeFields?: Partial<KpmgBeyondCommunityPageFields>
): KpmgBeyondCommunityPageFields {
  return { ...defaultCommunityPageFields, ...routeFields };
}

export function useKpmgBeyondCommunityPageFields(
  props: ComponentProps & { fields?: Partial<KpmgBeyondCommunityPageFields> }
): KpmgBeyondCommunityPageFields {
  const { page } = useSitecore();
  const routeFields = page.layout?.sitecore?.route?.fields as
    | Partial<KpmgBeyondCommunityPageFields>
    | undefined;
  return resolveCommunityRouteFields({
    ...routeFields,
    ...props.fields,
    ...(props.rendering?.fields as Partial<KpmgBeyondCommunityPageFields> | undefined),
  });
}

export function useKpmgBeyondCommunityRouteItemId(): string | null {
  const { page } = useSitecore();
  return resolveSitecoreRouteItemId(page) ?? null;
}

export function isCommunityPrivate(fields: KpmgBeyondCommunityPageFields): boolean {
  return isCommunityPrivateFromFields(fields);
}

export function isCommunityClosed(fields: KpmgBeyondCommunityPageFields): boolean {
  return isCommunityClosedFromFields(fields);
}

export function isJoinRequestAllowed(fields: KpmgBeyondCommunityPageFields): boolean {
  return isJoinRequestAllowedFromFields(fields);
}

export function requiresCommunityApproval(fields: KpmgBeyondCommunityPageFields): boolean {
  return communityRequiresJoinApproval(fields);
}

export type KpmgBeyondDiscussionPageFields = {
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

export const defaultDiscussionPageFields: KpmgBeyondDiscussionPageFields = {
  Title: { value: 'Discussion' },
  Body: { value: '' },
  AuthorName: { value: '' },
  AuthorTitle: { value: '' },
  AuthorCompany: { value: '' },
  AuthorImage: { value: { src: '', alt: '' } },
  PublishedDate: { value: '' },
  LikeCount: { value: '0' },
  CommentCount: { value: '0' },
  ViewCount: { value: '0' },
  AdminApproved: { value: '1' },
  LinkPreviewTitle: { value: '' },
  LinkPreviewSummary: { value: '' },
  LinkPreviewImage: { value: { src: '', alt: '' } },
  LinkPreviewUrl: { value: { href: '' } },
};

export function useKpmgBeyondDiscussionPageFields(
  props: ComponentProps & { fields?: Partial<KpmgBeyondDiscussionPageFields> }
): KpmgBeyondDiscussionPageFields {
  const { page } = useSitecore();
  const routeFields = page.layout?.sitecore?.route?.fields as
    | Partial<KpmgBeyondDiscussionPageFields>
    | undefined;
  return { ...defaultDiscussionPageFields, ...routeFields, ...props.fields };
}

export function useKpmgBeyondDiscussionRouteItemId(): string | null {
  const { page } = useSitecore();
  return resolveSitecoreRouteItemId(page) ?? null;
}

export function useKpmgBeyondDiscussionCommunityContext(
  discussionId: string | null | undefined
): {
  communityId: string | undefined;
  communityTitle: string | undefined;
  contextLoading: boolean;
} {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryCommunityId = searchParams.get('communityId')?.trim() || undefined;
  const [apiCommunity, setApiCommunity] = useState<
    { id?: string; title?: string } | null | undefined
  >(undefined);

  const pathnameCommunity = useMemo(
    () => resolveCommunityContextFromPathname(pathname),
    [pathname]
  );

  const immediateCommunityId = queryCommunityId ?? pathnameCommunity?.id;
  const immediateCommunityTitle =
    pathnameCommunity?.title ??
    (immediateCommunityId ? getKnownCommunityTitle(immediateCommunityId) : undefined);

  useEffect(() => {
    if (immediateCommunityId || !discussionId) {
      setApiCommunity(undefined);
      return;
    }
    let cancelled = false;
    setApiCommunity(null);
    fetch(`/api/kpmg-beyond/communities/context?itemId=${encodeURIComponent(discussionId)}`)
      .then(async (response) => {
        if (!response.ok) {
          return null;
        }
        const data = (await response.json()) as { community?: { id?: string; title?: string } };
        return data.community ?? null;
      })
      .then((community) => {
        if (!cancelled) {
          setApiCommunity(community);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setApiCommunity(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [discussionId, immediateCommunityId]);

  const communityId = immediateCommunityId ?? apiCommunity?.id ?? undefined;
  const communityTitle =
    immediateCommunityTitle ??
    apiCommunity?.title ??
    (communityId ? getKnownCommunityTitle(communityId) : undefined);
  const contextLoading =
    Boolean(discussionId && !communityId) &&
    (apiCommunity === null || apiCommunity === undefined);

  return {
    communityId,
    communityTitle,
    contextLoading,
  };
}
