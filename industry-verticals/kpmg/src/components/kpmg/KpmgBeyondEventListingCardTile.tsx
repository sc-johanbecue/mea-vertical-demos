'use client';

import type { JSX } from 'react';
import { Link as SitecoreLink, Text } from '@sitecore-content-sdk/nextjs';
import { IconPlay } from './kpmg-beyond-icons';
import type { KpmgBeyondEventCardFields } from './KpmgBeyondEventCard';
import { useEditingHydrationProps } from './kpmg-editing-hydration';
import type { TextField } from '@sitecore-content-sdk/nextjs';

export type KpmgBeyondEventListingCardTileProps = {
  fields: KpmgBeyondEventCardFields & {
    IsOnDemandEvent?: TextField;
    Summary?: TextField;
  };
  id?: string;
  className?: string;
  componentKey: string;
};

function isOnDemand(value: string | number | undefined): boolean {
  const normalized = String(value ?? '')
    .trim()
    .toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes';
}

function DateBadge({ fields }: { fields: KpmgBeyondEventCardFields }): JSX.Element {
  return (
    <div
      className="absolute bottom-3 right-3 flex h-[60px] w-[60px] flex-col items-center justify-center bg-kpmg-date text-white xl:h-[72px] xl:w-[72px]"
      data-cy="event-date-box"
    >
      <Text
        tag="p"
        field={fields.EventDay}
        className="m-0 w-full text-center text-xl font-bold leading-none xl:text-[1.75rem]"
        data-cy="event-date"
      />
      <Text
        tag="p"
        field={fields.EventMonth}
        className="m-0 mt-1 w-full text-center text-[10px] font-semibold uppercase leading-none tracking-wide xl:text-xs"
      />
    </div>
  );
}

export function KpmgBeyondEventListingCardTile({
  fields,
  id,
  className,
  componentKey,
}: KpmgBeyondEventListingCardTileProps): JSX.Element {
  const onDemand = isOnDemand(fields.IsOnDemandEvent?.value);
  const imageSrc = fields.Image?.value?.src?.trim();
  const imageAlt = fields.Image?.value?.alt;
  const ariaLabel =
    (typeof imageAlt === 'string' && imageAlt) ||
    (typeof fields.EventTitle?.value === 'string' && fields.EventTitle.value) ||
    'Event';
  const editingHydration = useEditingHydrationProps();

  return (
    <SitecoreLink
      key={componentKey}
      {...editingHydration}
      field={fields.Link}
      className={[
        'component kpmg-beyond-event-listing-card mb-9 block w-full max-w-[1059px] no-underline last:mb-0',
        className || '',
      ].join(' ')}
      id={id}
      data-cy="content-tile"
    >
      <article className="group flex flex-col overflow-hidden bg-kpmg-card sm:flex-row sm:justify-between">
        <div className="flex flex-col justify-center px-5 py-3 sm:w-[45%] xl:w-[42%]">
          <Text
            tag="p"
            field={fields.CategoryLabel}
            className="m-0 line-clamp-1 text-xs uppercase text-kpmg-label xl:text-base"
            data-cy="tile-label"
          />
          <Text
            tag="span"
            field={fields.Time}
            className="mt-1 block text-sm opacity-80"
            data-cy="event-time"
          />
          <Text
            tag="h3"
            field={fields.EventTitle}
            className="title mt-2 line-clamp-3 text-base font-semibold leading-6 text-white group-hover:underline xl:text-lg"
            data-cy="tile-title"
          />
          <Text
            tag="p"
            field={fields.Summary}
            className="mt-3 hidden line-clamp-4 text-sm opacity-80 sm:block"
            data-cy="tile-summary"
          />
        </div>
        <div className="relative mt-3 w-full shrink-0 bg-kpmg-elevated sm:mt-3 sm:w-[45%] xl:w-[42%]">
          <div className="relative w-full sm:pt-[50%]" data-cy="tile-image">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={ariaLabel}
                className="block h-auto max-h-none w-full object-contain object-center sm:absolute sm:inset-0 sm:h-full sm:max-h-none sm:object-cover"
              />
            ) : (
              <div className="min-h-[180px] w-full sm:absolute sm:inset-0 sm:min-h-0" aria-hidden />
            )}
            {!onDemand ? <DateBadge fields={fields} /> : null}
            {onDemand ? (
              <>
                <div className="absolute inset-0 flex items-center justify-center">
                  <IconPlay data-cy="video-icon" />
                </div>
                <span className="absolute bottom-3 left-3 bg-kpmg-purple px-2 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                  ON DEMAND EVENT
                </span>
              </>
            ) : null}
          </div>
        </div>
      </article>
    </SitecoreLink>
  );
}
