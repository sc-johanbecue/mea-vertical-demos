import { NextResponse } from 'next/server';
import { getAuth0ManagementUser } from '@/lib/auth0-management';
import { readRawCommunitiesRecord } from '@/lib/kpmg-auth0-communities';
import { getKpmgAuth0Session } from '@/lib/kpmg-auth0-session';

export const dynamic = 'force-dynamic';

/** Returns community membership from Auth0 (cached Management API read, session fallback). */
export async function GET(): Promise<NextResponse> {
  const session = await getKpmgAuth0Session();
  const domain = process.env.AUTH0_DOMAIN;

  if (!session?.user?.sub || !domain) {
    return NextResponse.json({ communities: {} }, { status: 401 });
  }

  const sessionCommunities = readRawCommunitiesRecord(session.user);
  const managementUser = await getAuth0ManagementUser(domain, session.user.sub);

  if (managementUser.ok) {
    return NextResponse.json({
      communities: readRawCommunitiesRecord(managementUser.user),
      source: 'management-api',
    });
  }

  return NextResponse.json({
    communities: sessionCommunities,
    source: 'session',
  });
}
