import { NextRequest, NextResponse } from 'next/server';
import {
  fetchCommunityListItems,
} from '@/lib/kpmg-beyond/fetch-community-content';
import { communityListItemsToSectionItems } from '@/components/kpmg/kpmg-beyond-communities-explore-section-shared';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const language = request.nextUrl.searchParams.get('language') || 'en';
  const folderId = request.nextUrl.searchParams.get('folderId');

  if (!folderId) {
    return NextResponse.json({ error: 'folderId is required' }, { status: 400 });
  }

  try {
    const items = await fetchCommunityListItems(folderId, language);
    return NextResponse.json(
      { items: communityListItemsToSectionItems(items) },
      { headers: { 'Cache-Control': 'private, max-age=60, stale-while-revalidate=120' } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load communities';
    return NextResponse.json({ error: message, items: [] }, { status: 500 });
  }
}
