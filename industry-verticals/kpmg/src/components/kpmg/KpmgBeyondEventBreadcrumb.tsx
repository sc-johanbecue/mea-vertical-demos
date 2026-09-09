'use client';

import type { JSX } from 'react';
import Link from 'next/link';
import { ComponentProps } from '@/lib/component-props';
import { useEditingHydrationProps } from './kpmg-editing-hydration';
import {
  isEventOnDemandFromFields,
  useKpmgBeyondEventPageFields,
} from './kpmg-beyond-event-route-fields';

export type KpmgBeyondEventBreadcrumbProps = ComponentProps;

export const Default = (props: KpmgBeyondEventBreadcrumbProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = useKpmgBeyondEventPageFields(props);
  const editingHydration = useEditingHydrationProps();
  const tabLabel = isEventOnDemandFromFields(fields) ? 'On demand' : 'Upcoming';

  return (
    <nav
      key={id ?? props.rendering?.uid}
      {...editingHydration}
      id={id}
      aria-label="Breadcrumb"
      data-cy="event-breadcrumb"
      className={[
        'component kpmg-beyond-event-breadcrumb mx-auto w-full max-w-[1059px] px-5 pt-6 xl:px-[60px]',
        styles || '',
      ].join(' ')}
    >
      <div className="flex flex-wrap items-center gap-2 text-sm text-white/70">
        <Link href="/events" className="text-kpmg-label no-underline hover:underline">
          Events
        </Link>
        <span aria-hidden>&gt;</span>
        <span>{tabLabel}</span>
        <span aria-hidden>&gt;</span>
        <span className="text-white">Event</span>
      </div>
    </nav>
  );
};
