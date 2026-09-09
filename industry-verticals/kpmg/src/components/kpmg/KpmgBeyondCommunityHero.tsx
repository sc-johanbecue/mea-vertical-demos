'use client';

import type { JSX } from 'react';
import { Image as SitecoreImage, RichText, Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { useEditingHydrationProps } from './kpmg-editing-hydration';
import {
  isCommunityClosed,
  isCommunityPrivate,
  isJoinRequestAllowed,
  useKpmgBeyondCommunityPageFields,
  useKpmgBeyondCommunityRouteItemId,
} from './kpmg-beyond-community-route-fields';
import { useKpmgBeyondCommunityMembership } from './kpmg-beyond-community-membership';

export type KpmgBeyondCommunityHeroProps = ComponentProps;

export const Default = (props: KpmgBeyondCommunityHeroProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = useKpmgBeyondCommunityPageFields(props);
  const communityId = useKpmgBeyondCommunityRouteItemId();
  const communityTitle = fields.Title?.value?.toString();
  const { joined, pending, applyOrJoin, cancelApplication, status, error, isOwner, applicationPending } =
    useKpmgBeyondCommunityMembership(communityId ?? undefined, communityTitle);
  const editingHydration = useEditingHydrationProps();
  const closed = isCommunityClosed(fields);
  const isPrivate = isCommunityPrivate(fields);
  const joinAllowed = isJoinRequestAllowed(fields);
  const memberCount = fields.MemberCount?.value?.toString() || '0';
  const privacy = fields.PrivacyStatus?.value?.toString() || 'Public';

  let actionLabel = 'Apply';
  if (closed || isPrivate) {
    actionLabel = fields.ClosedLabel?.value?.toString() || (isPrivate ? 'Private' : 'Closed');
  } else if (isOwner || status === 'owner') {
    actionLabel = 'Owner';
  } else if (joined) {
    actionLabel = 'Joined';
  } else if (status === 'requested') {
    actionLabel = 'Applied';
  }

  return (
    <section
      {...editingHydration}
      id={id}
      data-cy="community-hero"
      className={['component kpmg-beyond-community-hero w-full px-5 pt-6 xl:px-[60px]', styles || ''].join(' ')}
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="relative mb-6 aspect-[16/5] w-full overflow-hidden bg-kpmg-card">
          <SitecoreImage field={fields.BannerImage} className="h-full w-full object-cover" />
        </div>
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="m-0 text-sm text-white/80">
              {privacy}
              <span className="mx-2">•</span>
              <span className="underline">{memberCount} Members</span>
            </p>
            <Text tag="h1" field={fields.Title} className="mt-2 text-3xl font-semibold text-white xl:text-4xl" />
          </div>
          {joinAllowed && (
            <div className="flex shrink-0 flex-col items-end gap-2">
              {applicationPending ? (
                <>
                  <button
                    type="button"
                    disabled
                    className="rounded-full border border-white/30 bg-transparent px-6 py-3 text-sm font-medium text-white opacity-80"
                  >
                    Applied
                  </button>
                  <p className="m-0 max-w-xs text-right text-sm text-white/70">
                    Membership pending approval
                  </p>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => void cancelApplication()}
                    className="text-sm text-white/80 underline transition-colors hover:text-white disabled:opacity-60"
                  >
                    {pending ? 'Cancelling…' : 'Cancel application'}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  disabled={joined || pending || isOwner}
                  onClick={() => void applyOrJoin()}
                  className={[
                    'rounded-full px-6 py-3 text-sm font-medium transition-colors',
                    joined || isOwner
                      ? 'border border-white/30 bg-transparent text-white'
                      : 'bg-kpmg-purple text-white hover:opacity-90 disabled:opacity-60',
                  ].join(' ')}
                >
                  {pending ? 'Saving…' : actionLabel}
                </button>
              )}
              {error ? <p className="m-0 max-w-xs text-right text-sm text-red-300">{error}</p> : null}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export type KpmgBeyondCommunityAboutProps = ComponentProps;

export const About = (props: KpmgBeyondCommunityAboutProps): JSX.Element => {
  const fields = useKpmgBeyondCommunityPageFields(props);
  const editingHydration = useEditingHydrationProps();
  return (
    <section {...editingHydration} className="component kpmg-beyond-community-about w-full px-5 py-8 xl:px-[60px]">
      <div className="mx-auto w-full max-w-[1200px]">
        <h2 className="mb-4 text-xl font-semibold text-white">About</h2>
        <RichText field={fields.About} className="prose prose-invert max-w-none text-white/85" />
      </div>
    </section>
  );
};

export type KpmgBeyondCommunitySupportProps = ComponentProps;

export const Support = (props: KpmgBeyondCommunitySupportProps): JSX.Element => {
  const fields = useKpmgBeyondCommunityPageFields(props);
  const editingHydration = useEditingHydrationProps();
  const email = fields.SupportEmail?.value?.toString().trim();
  return (
    <section {...editingHydration} className="component kpmg-beyond-community-support w-full px-5 py-8 xl:px-[60px]">
      <div className="mx-auto grid w-full max-w-[1200px] gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-xl font-semibold text-white">Community support</h2>
          <RichText field={fields.SupportText} className="prose prose-invert max-w-none text-white/85" />
          {email ? (
            <a href={`mailto:${email}`} className="mt-3 inline-block text-kpmg-purple underline">
              Send an email
            </a>
          ) : null}
        </div>
        <div>
          <h2 className="mb-4 text-xl font-semibold text-white">Community guidelines</h2>
          <RichText field={fields.Guidelines} className="prose prose-invert max-w-none text-white/85" />
        </div>
      </div>
    </section>
  );
};
