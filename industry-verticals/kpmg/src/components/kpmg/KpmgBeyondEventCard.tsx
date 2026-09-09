'use client';

import type { JSX } from 'react';
import {
  ImageField,
  LinkField,
  Link as SitecoreLink,
  Text,
  TextField,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { useEditingHydrationProps } from './kpmg-editing-hydration';

export interface KpmgBeyondEventCardFields {
  CategoryLabel: TextField;
  Time: TextField;
  EventTitle: TextField;
  Summary: TextField;
  Image: ImageField;
  Link: LinkField;
  EventDay: TextField;
  EventMonth: TextField;
  Location?: TextField;
}

const defaultFields: KpmgBeyondEventCardFields = {
  CategoryLabel: { value: 'TAX' },
  Time: { value: '10.00 AM' },
  EventTitle: { value: 'Higher Education Indirect Tax Roundtables 2026 (London)' },
  Summary: { value: '' },
  Image: { value: { src: '', alt: 'Event' } },
  Link: { value: { href: '#' } },
  EventDay: { value: '3' },
  EventMonth: { value: 'JUN' },
};

export type KpmgBeyondEventCardProps = ComponentProps & {
  fields: KpmgBeyondEventCardFields;
};

/** Vertical event tile — same layout on mobile and desktop (category → image → time → title). */
export const Default = (props: KpmgBeyondEventCardProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;
  const imageSrc = fields.Image?.value?.src?.trim();
  const imageAlt = fields.Image?.value?.alt;
  const ariaLabel =
    (typeof imageAlt === 'string' && imageAlt) ||
    (typeof fields.EventTitle?.value === 'string' && fields.EventTitle.value) ||
    'Event';

  const componentKey = props.rendering?.uid ?? id ?? 'event-card';
  const editingHydration = useEditingHydrationProps();

  return (
    <SitecoreLink
      key={componentKey}
      {...editingHydration}
      field={fields.Link}
      className={['component kpmg-beyond-event-card group block w-full shrink-0 no-underline', styles || ''].join(' ')}
      id={id}
      data-cy="upcoming-events-tile"
    >
      <article className="kpmg-beyond-event-card__article flex h-full flex-col bg-kpmg-elevated px-4 pb-5 pt-4">
        <Text
          tag="span"
          field={fields.CategoryLabel}
          className="text-xs font-normal uppercase tracking-wide text-kpmg-label xl:text-sm"
          data-cy="upcoming-events-tile-label"
        />

        <div className="relative mt-3 w-full">
          <div
            className="kpmg-beyond-event-card__image h-[200px] w-full bg-kpmg-card bg-cover bg-center xl:h-[220px]"
            style={imageSrc ? { backgroundImage: `url("${imageSrc.replace(/"/g, '\\"')}")` } : undefined}
            data-cy="upcoming-events-tile-image"
            role={imageSrc ? 'img' : undefined}
            aria-label={ariaLabel}
          />
          <DateBadge fields={fields} />
        </div>

        <div className="mt-8 pr-18">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm leading-snug text-white/80 xl:text-base">
            <Text tag="span" field={fields.Time} data-cy="upcoming-events-tile-time" />
            {fields.Location?.value ? (
              <Text tag="span" field={fields.Location} data-cy="upcoming-events-tile-location" />
            ) : null}
          </div>
          <Text
            tag="p"
            field={fields.EventTitle}
            className="title m-0 mt-1.5 line-clamp-3 text-base font-semibold leading-snug text-white group-hover:underline xl:text-lg xl:leading-7"
            data-cy="upcoming-events-tile-title"
          />
        </div>
      </article>
    </SitecoreLink>
  );
};

function DateBadge({ fields }: { fields: KpmgBeyondEventCardFields }): JSX.Element {
  return (
    <div
      className="absolute bottom-0 right-0 flex h-[72px] w-[72px] translate-y-1/2 flex-col items-center justify-center bg-kpmg-date text-white"
      data-cy="event-date-box"
    >
      <Text
        tag="p"
        field={fields.EventDay}
        className="m-0 w-full text-center text-[1.75rem] font-bold leading-none"
        data-cy="event-date"
      />
      <Text
        tag="p"
        field={fields.EventMonth}
        className="m-0 mt-1 w-full text-center text-xs font-semibold uppercase leading-none tracking-wide"
      />
    </div>
  );
}
