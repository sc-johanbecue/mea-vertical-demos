'use client';

import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import { Image as SitecoreImage, Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import type { CommunityHostItem } from '@/lib/kpmg-beyond/fetch-community-content';
import { useEditingHydrationProps } from './kpmg-editing-hydration';
import {
  useKpmgBeyondCommunityPageFields,
  useKpmgBeyondCommunityRouteItemId,
} from './kpmg-beyond-community-route-fields';

export type KpmgBeyondCommunityHostsSectionProps = ComponentProps;

export const Default = (props: KpmgBeyondCommunityHostsSectionProps): JSX.Element => {
  const fields = useKpmgBeyondCommunityPageFields(props);
  const communityId = useKpmgBeyondCommunityRouteItemId();
  const editingHydration = useEditingHydrationProps();
  const [hosts, setHosts] = useState<CommunityHostItem[]>([]);

  useEffect(() => {
    if (!communityId) {
      return;
    }
    let cancelled = false;
    fetch(`/api/kpmg-beyond/communities/hosts?communityId=${encodeURIComponent(communityId)}`)
      .then(async (response) => {
        const data = (await response.json()) as { hosts?: CommunityHostItem[] };
        if (!cancelled) {
          setHosts(data.hosts ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setHosts([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [communityId]);

  if (!hosts.length) {
    return <></>;
  }

  return (
    <section
      {...editingHydration}
      data-cy="community-hosts"
      className="component kpmg-beyond-community-hosts w-full px-5 py-8 xl:px-[60px]"
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <h2 className="mb-6 text-xl font-semibold text-white">Community hosts</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {hosts.map((host) => (
            <article key={host.id} className="flex items-center gap-4 bg-kpmg-card px-4 py-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-kpmg-elevated">
                {host.fields.HostImage?.value?.src ? (
                  <SitecoreImage field={host.fields.HostImage} className="h-full w-full object-cover" />
                ) : (
                  <Text
                    tag="span"
                    field={host.fields.HostInitials}
                    className="text-sm font-semibold text-white"
                  />
                )}
              </div>
              <div>
                <Text
                  tag="p"
                  field={host.fields.HostRole}
                  className="m-0 text-xs font-semibold uppercase tracking-wide text-kpmg-label"
                />
                <Text tag="p" field={host.fields.HostName} className="m-0 text-base font-semibold text-white" />
                <Text tag="p" field={host.fields.HostCompany} className="m-0 text-sm text-white/70" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
