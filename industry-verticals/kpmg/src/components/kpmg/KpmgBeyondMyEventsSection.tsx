'use client';

import type { JSX } from 'react';
import { useMemo } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { Default as EventCardDefault } from './KpmgBeyondEventCard';
import { useEditingHydrationProps } from './kpmg-editing-hydration';
import { useKpmgBeyondEventSubscription } from './kpmg-beyond-event-subscription';
import {
  getEventItemsFromFields,
  getSitecoreItemId,
  resolveMyEventsSectionFields,
  type KpmgBeyondMyEventsSectionFields,
} from './kpmg-beyond-events-section-shared';

export type KpmgBeyondMyEventsSectionProps = ComponentProps & {
  fields: KpmgBeyondMyEventsSectionFields;
};

export const Default = (props: KpmgBeyondMyEventsSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const renderingFields = props.rendering?.fields as KpmgBeyondMyEventsSectionFields | undefined;
  const fields = resolveMyEventsSectionFields(props.fields, renderingFields);
  const componentKey = id ?? props.rendering?.uid ?? 'my-events-section';
  const editingHydration = useEditingHydrationProps();
  const { subscribedEventIds, isLoading } = useKpmgBeyondEventSubscription(undefined);

  const eventItems = useMemo(
    () => getEventItemsFromFields(fields, renderingFields),
    [fields, renderingFields]
  );

  const subscribedItems = useMemo(() => {
    const subscribedSet = new Set(subscribedEventIds);
    return eventItems.filter((item) => subscribedSet.has(getSitecoreItemId(item)));
  }, [eventItems, subscribedEventIds]);

  return (
    <section
      key={componentKey}
      {...editingHydration}
      id={id}
      data-cy="my-events-section"
      className={['component kpmg-beyond-my-events w-full px-5 pt-8 xl:px-4', styles || ''].join(' ')}
    >
      <Text
        tag="h2"
        field={fields.Title}
        className="m-0 mb-6 text-[22px] font-semibold text-white xl:mb-8 xl:text-[28px]"
        data-cy="my-events-title"
      />

      {isLoading ? (
        <p className="text-sm text-white/70">Loading your events…</p>
      ) : subscribedItems.length === 0 ? (
        <Text
          tag="p"
          field={fields.EmptyMessage}
          className="text-sm text-white/70"
          data-cy="my-events-empty-message"
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {subscribedItems.map((item) => (
            <EventCardDefault
              key={item.id}
              params={{ ...props.params, RenderingIdentifier: item.id }}
              rendering={{
                ...(props.rendering ?? { componentName: 'KpmgBeyondEventCard' }),
                uid: `${props.rendering?.uid ?? componentKey}-${item.id}`,
              }}
              fields={item.fields}
            />
          ))}
        </div>
      )}
    </section>
  );
};
