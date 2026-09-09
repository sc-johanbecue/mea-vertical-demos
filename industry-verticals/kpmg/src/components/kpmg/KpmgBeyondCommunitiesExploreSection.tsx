'use client';

import type { JSX } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { parseDroplinkItemId } from '@/lib/kpmg-beyond/parse-droplink';
import {
  communityListItemsToSectionItems,
  formatCommunityResultsLabel,
  getCommunityItemsFromFields,
  matchesCommunitySearch,
  resolveKpmgBeyondCommunitiesExploreSectionFields,
  type KpmgBeyondCommunitiesExploreSectionFields,
  type KpmgBeyondCommunitySectionItem,
} from './kpmg-beyond-communities-explore-section-shared';
import { KpmgBeyondCommunityListingCardTile } from './KpmgBeyondCommunityListingCardTile';
import { useEditingHydrationProps } from './kpmg-editing-hydration';
import { useKpmgBeyondCommunityMembershipMap } from './kpmg-beyond-community-membership';
import { normalizeCommunityId } from '@/lib/kpmg-auth0-communities';

export const KPMG_BEYOND_HOME_COMMUNITIES_FOLDER_ID = 'db00b75b-fd7a-4a2c-85f1-c86e1bd69b2f';

export type KpmgBeyondCommunitiesExploreSectionProps = ComponentProps & {
  fields: KpmgBeyondCommunitiesExploreSectionFields;
};

export const Default = (props: KpmgBeyondCommunitiesExploreSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = resolveKpmgBeyondCommunitiesExploreSectionFields(
    props.fields,
    props.rendering?.fields as KpmgBeyondCommunitiesExploreSectionFields | undefined
  );
  const { page } = useSitecore();
  const componentKey = id ?? props.rendering?.uid ?? 'communities-explore-section';
  const editingHydration = useEditingHydrationProps();
  const isEditing = Boolean(page.mode?.isEditing);
  const language = page.locale || 'en';
  const folderId =
    parseDroplinkItemId(fields.CardsFolder) ?? KPMG_BEYOND_HOME_COMMUNITIES_FOLDER_ID;

  const serverItems = useMemo(
    () =>
      getCommunityItemsFromFields(
        fields,
        props.rendering?.fields as KpmgBeyondCommunitiesExploreSectionFields | undefined
      ),
    [fields, props.rendering?.fields]
  );

  const [remoteItems, setRemoteItems] = useState<KpmgBeyondCommunitySectionItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const membershipByCommunityId = useKpmgBeyondCommunityMembershipMap();

  useEffect(() => {
    if (isEditing && serverItems.length > 0) {
      return;
    }
    let cancelled = false;
    fetch(`/api/kpmg-beyond/communities/list?language=${encodeURIComponent(language)}&folderId=${encodeURIComponent(folderId)}`)
      .then(async (response) => {
        const data = (await response.json()) as { items?: KpmgBeyondCommunitySectionItem[] };
        if (!cancelled) {
          setRemoteItems(data.items ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRemoteItems([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [folderId, isEditing, language, serverItems.length]);

  const communityItems = isEditing
    ? serverItems
    : remoteItems.length > 0
      ? remoteItems
      : serverItems;

  const visibleItems = useMemo(
    () => communityItems.filter((item) => matchesCommunitySearch(item, searchQuery)),
    [communityItems, searchQuery]
  );

  return (
    <section
      key={componentKey}
      {...editingHydration}
      id={id}
      data-cy="communities-explore-section"
      className={['component kpmg-beyond-communities-explore w-full px-5 pt-8 xl:px-[60px]', styles || ''].join(' ')}
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Text
            tag="h2"
            field={fields.PageTitle}
            className="m-0 text-[22px] font-semibold text-white xl:text-[28px]"
          />
          <label className="relative block w-full sm:max-w-sm">
            <span className="sr-only">{fields.SearchPlaceholder?.value?.toString() || 'Search'}</span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={fields.SearchPlaceholder?.value?.toString() || 'Search for a community'}
              className="w-full border border-white/20 bg-transparent px-4 py-3 pl-10 text-base text-white outline-none focus:border-kpmg-purple"
            />
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/60" aria-hidden>
              ⌕
            </span>
          </label>
        </div>

        <p className="mb-6 text-sm text-white/70">
          {formatCommunityResultsLabel(
            fields.ResultsLabel?.value?.toString(),
            visibleItems.length,
            communityItems.length
          )}
        </p>

        {visibleItems.length === 0 ? (
          <p className="text-sm text-white/70">
            {searchQuery.trim() ? 'No communities match your search.' : 'No communities to display.'}
          </p>
        ) : (
          visibleItems.map((item) => (
            <KpmgBeyondCommunityListingCardTile
              key={item.id}
              item={item}
              membershipStatus={membershipByCommunityId[normalizeCommunityId(item.id)]}
              componentKey={`${componentKey}-${item.id}`}
            />
          ))
        )}
      </div>
    </section>
  );
};
