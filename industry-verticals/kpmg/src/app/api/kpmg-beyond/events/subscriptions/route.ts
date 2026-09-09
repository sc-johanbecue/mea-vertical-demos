import { NextResponse } from 'next/server';
import { readSubscribedEventIds } from '@/lib/kpmg-auth0-events';
import { getKpmgAuth0Session } from '@/lib/kpmg-auth0-session';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getKpmgAuth0Session();
  if (!session?.user) {
    return NextResponse.json({ subscribedEventIds: [] }, { status: 401 });
  }

  return NextResponse.json({
    subscribedEventIds: readSubscribedEventIds(session.user),
  });
}
