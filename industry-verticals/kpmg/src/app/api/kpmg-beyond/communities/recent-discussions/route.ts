import { NextRequest, NextResponse } from 'next/server';
import { fetchRecentDiscussionsForCommunities } from '@/lib/kpmg-beyond/fetch-community-content';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const language = request.nextUrl.searchParams.get('language') || 'en';
  const communityIds = (request.nextUrl.searchParams.get('communityIds') || '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);

  if (!communityIds.length) {
    return NextResponse.json({ discussions: [] });
  }

  const discussions = await fetchRecentDiscussionsForCommunities(communityIds, language, 2);
  return NextResponse.json({ discussions });
}
