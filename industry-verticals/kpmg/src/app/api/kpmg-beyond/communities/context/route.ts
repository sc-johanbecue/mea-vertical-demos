import { NextRequest, NextResponse } from 'next/server';
import { resolveCommunityContextForSitecoreItem } from '@/lib/kpmg-beyond/fetch-community-content';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const itemId = request.nextUrl.searchParams.get('itemId');
  const language = request.nextUrl.searchParams.get('language') || 'en';
  if (!itemId) {
    return NextResponse.json({ error: 'itemId is required' }, { status: 400 });
  }

  try {
    const community = await resolveCommunityContextForSitecoreItem(itemId, language);
    if (!community) {
      return NextResponse.json({ error: 'Community not found' }, { status: 404 });
    }
    return NextResponse.json({ community });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to resolve community';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
