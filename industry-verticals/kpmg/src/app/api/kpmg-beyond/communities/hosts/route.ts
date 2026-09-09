import { NextRequest, NextResponse } from 'next/server';
import { fetchCommunityHosts } from '@/lib/kpmg-beyond/fetch-community-content';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const communityId = request.nextUrl.searchParams.get('communityId');
  const language = request.nextUrl.searchParams.get('language') || 'en';
  if (!communityId) {
    return NextResponse.json({ error: 'communityId is required' }, { status: 400 });
  }
  const hosts = await fetchCommunityHosts(communityId, language);
  return NextResponse.json({ hosts });
}
