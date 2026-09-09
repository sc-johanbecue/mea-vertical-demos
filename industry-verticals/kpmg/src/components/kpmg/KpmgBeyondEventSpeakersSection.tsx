'use client';

import type { JSX } from 'react';
import { RichText } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { useEditingHydrationProps } from './kpmg-editing-hydration';
import { useKpmgBeyondEventPageFields } from './kpmg-beyond-event-route-fields';

export type KpmgBeyondEventSpeakersSectionProps = ComponentProps;

export const Default = (props: KpmgBeyondEventSpeakersSectionProps): JSX.Element | null => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = useKpmgBeyondEventPageFields(props);
  const editingHydration = useEditingHydrationProps();
  const speakersHtml = fields.SpeakersBody?.value?.toString().trim();

  if (!speakersHtml) {
    return null;
  }

  return (
    <section
      key={id ?? props.rendering?.uid}
      {...editingHydration}
      id={id}
      data-cy="event-speakers"
      className={[
        'component kpmg-beyond-event-speakers mx-auto w-full max-w-[1059px] px-5 py-8 xl:px-[60px]',
        styles || '',
      ].join(' ')}
    >
      <h2 className="m-0 mb-6 text-xl font-semibold text-white xl:text-2xl">Speakers</h2>
      <div className="text-base leading-7 text-white/90 [&_p]:mb-4">
        <RichText field={fields.SpeakersBody} />
      </div>
    </section>
  );
};
