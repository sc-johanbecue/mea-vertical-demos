import { event } from '@sitecore-cloudsdk/events/browser';
import config from 'sitecore.config';
import { ensureCloudSdkInitialized } from '@/lib/cdp/cdp-cloud-sdk-init';
import { appendCdpEvent } from '@/lib/cdp/cdp-session-tracker';

export const CDP_BEYOND_EVENT_REGISTER_TYPE = 'BeyondEventRegister';
export const CDP_BEYOND_EVENT_CANCEL_TYPE = 'BeyondEventCancel';

type BeyondEventCdpPayload = {
  eventId: string;
  eventName: string;
};

async function sendBeyondEventSubscriptionCdpEvent(
  type: string,
  payload: BeyondEventCdpPayload
): Promise<void> {
  const eventId = payload.eventId.trim();
  const eventName = payload.eventName.trim();
  if (!eventId || !eventName) {
    return;
  }

  const page = typeof window !== 'undefined' ? window.location.pathname : '/';

  await ensureCloudSdkInitialized(config.defaultSite);
  await event({
    type,
    channel: 'WEB',
    currency: 'EUR',
    language: 'EN',
    page,
    extensionData: {
      eventId,
      eventName,
    },
  });

  appendCdpEvent({
    type,
    createdAt: new Date().toISOString(),
    arbitraryData: { eventId, eventName, page },
  });
}

/** Sends a Cloud SDK custom event when a user registers for a Beyond event. */
export async function trackBeyondEventRegistration(payload: BeyondEventCdpPayload): Promise<void> {
  await sendBeyondEventSubscriptionCdpEvent(CDP_BEYOND_EVENT_REGISTER_TYPE, payload);
}

/** Sends a Cloud SDK custom event when a user cancels a Beyond event registration. */
export async function trackBeyondEventCancellation(payload: BeyondEventCdpPayload): Promise<void> {
  await sendBeyondEventSubscriptionCdpEvent(CDP_BEYOND_EVENT_CANCEL_TYPE, payload);
}
