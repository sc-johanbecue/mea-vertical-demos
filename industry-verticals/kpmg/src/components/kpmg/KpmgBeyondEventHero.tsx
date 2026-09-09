'use client';



import type { JSX } from 'react';

import { Text, useSitecore } from '@sitecore-content-sdk/nextjs';

import { ComponentProps } from '@/lib/component-props';

import { resolveSitecoreRouteItemId } from '@/lib/kpmg-auth0-events';

import { useEditingHydrationProps } from './kpmg-editing-hydration';

import { useKpmgBeyondEventPageFields } from './kpmg-beyond-event-route-fields';

import { useKpmgBeyondEventSubscription } from './kpmg-beyond-event-subscription';



export type KpmgBeyondEventHeroProps = ComponentProps;



function DateBadge({

  fields,

}: {

  fields: ReturnType<typeof useKpmgBeyondEventPageFields>;

}): JSX.Element {

  return (

    <div className="absolute right-4 top-4 flex h-[72px] w-[72px] flex-col items-center justify-center bg-kpmg-date text-white">

      <Text tag="p" field={fields.EventDay} className="m-0 text-[1.75rem] font-bold leading-none" />

      <Text

        tag="p"

        field={fields.EventMonth}

        className="m-0 mt-1 text-xs font-semibold uppercase leading-none tracking-wide"

      />

    </div>

  );

}



export const Default = (props: KpmgBeyondEventHeroProps): JSX.Element => {

  const id = props.params.RenderingIdentifier;

  const { styles } = props.params;

  const fields = useKpmgBeyondEventPageFields(props);

  const { page } = useSitecore();

  const editingHydration = useEditingHydrationProps();

  const eventId = resolveSitecoreRouteItemId(page);
  const eventName = fields.EventTitle?.value?.toString().trim() ?? '';
  const { subscribed, pending, toggleSubscription, isLoading } =
    useKpmgBeyondEventSubscription(eventId, eventName);

  const imageSrc = fields.Image?.value?.src?.trim();

  const imageAlt =

    (typeof fields.Image?.value?.alt === 'string' && fields.Image.value.alt.trim()) ||

    (typeof fields.EventTitle?.value === 'string' && fields.EventTitle.value) ||

    'Event';

  const joinText = fields.JoinLink?.value?.text?.toString().trim() || 'Join now';



  return (

    <section

      key={id ?? props.rendering?.uid}

      {...editingHydration}

      id={id}

      data-cy="event-hero"

      className={[

        'component kpmg-beyond-event-hero mx-auto w-full max-w-[1059px] px-5 py-8 xl:px-[60px]',

        styles || '',

      ].join(' ')}

    >

      <div className="flex flex-col gap-6 xl:flex-row">

        <div className="relative min-h-[220px] flex-1 overflow-hidden bg-kpmg-card xl:min-h-[320px]">

          {imageSrc ? (

            <div

              className="absolute inset-0 bg-cover bg-center"

              style={{ backgroundImage: `url("${imageSrc.replace(/"/g, '\\"')}")` }}

              role="img"

              aria-label={imageAlt}

            />

          ) : null}

        </div>



        <aside className="relative w-full bg-kpmg-purple/40 p-6 xl:w-[380px] xl:shrink-0">

          <DateBadge fields={fields} />

          <ul className="m-0 mt-16 list-none space-y-4 p-0 text-sm text-white/90 xl:mt-20">

            <li className="flex items-start gap-3">

              <span aria-hidden>📅</span>

              <Text tag="span" field={fields.DateDisplay} />

            </li>

            <li className="flex items-start gap-3">

              <span aria-hidden>📍</span>

              <Text tag="span" field={fields.Location} />

            </li>

            <li className="flex items-start gap-3">

              <span aria-hidden>⏱</span>

              <span>

                Duration: <Text tag="span" field={fields.Duration} className="inline" />

              </span>

            </li>

          </ul>



          <div className="mt-8">

            <button

              type="button"

              disabled={pending || isLoading}

              onClick={() => void toggleSubscription()}

              className={[

                'inline-flex min-h-[48px] w-full items-center justify-center rounded-full px-8 py-3 text-base font-semibold text-white transition-opacity',

                subscribed

                  ? 'border border-white/30 bg-transparent hover:bg-white/10'

                  : 'bg-kpmg-purple hover:opacity-90',

                pending || isLoading ? 'cursor-wait opacity-70' : '',

              ].join(' ')}

              data-cy={subscribed ? 'event-cancel-registration' : 'event-join-now'}

            >

              {subscribed ? (

                <Text tag="span" field={fields.CancelRegistrationLabel} />

              ) : (

                joinText

              )}

            </button>



            {subscribed ? (

              <Text

                tag="p"

                field={fields.RegisteredMessage}

                className="mt-4 text-sm leading-6 text-white/80"

                data-cy="event-registered-message"

              />

            ) : null}

          </div>

        </aside>

      </div>

    </section>

  );

};

