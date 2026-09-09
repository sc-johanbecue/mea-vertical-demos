import { NextResponse } from 'next/server';
import type { User } from '@auth0/nextjs-auth0/types';
import { patchAuth0ManagementUser } from '@/lib/auth0-management';
import {
  readSubscribedEventIds,
  SUBSCRIBED_EVENT_IDS_METADATA_KEY,
  withEventSubscription,
} from '@/lib/kpmg-auth0-events';
import { getKpmgAuth0Session } from '@/lib/kpmg-auth0-session';

export const dynamic = 'force-dynamic';

type SubscribeRequest = {
  eventId?: string;
  subscribe?: boolean;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export async function POST(request: Request) {
  const session = await getKpmgAuth0Session();
  const user = session?.user;
  const domain = process.env.AUTH0_DOMAIN;

  if (!user?.sub || !domain) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: SubscribeRequest;
  try {
    body = (await request.json()) as SubscribeRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const eventId = body.eventId?.trim();
  if (!eventId) {
    return NextResponse.json({ error: 'Missing eventId' }, { status: 400 });
  }

  const subscribe = body.subscribe ?? true;
  const existingMetadata = asRecord((user as User & { user_metadata?: unknown }).user_metadata);
  const existingIds = readSubscribedEventIds(user);
  const nextIds = withEventSubscription(existingIds, eventId, subscribe);

  const result = await patchAuth0ManagementUser(domain, user.sub, {
    user_metadata: {
      ...existingMetadata,
      [SUBSCRIBED_EVENT_IDS_METADATA_KEY]: nextIds,
    },
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: result.status });
  }

  return NextResponse.json({ ok: true, subscribedEventIds: nextIds });
}
