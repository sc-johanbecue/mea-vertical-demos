import { NextRequest, NextResponse } from 'next/server';
import { fetchArticleCardsByIds } from '@/lib/kpmg-beyond/fetch-folder-cards';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const language = request.nextUrl.searchParams.get('language') || 'en';
  const idsParam = request.nextUrl.searchParams.get('ids') || '';
  const ids = idsParam
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);

  if (!ids.length) {
    return NextResponse.json({ cards: [] });
  }

  try {
    const cards = await fetchArticleCardsByIds(ids, language);
    return NextResponse.json({
      cards: cards.map((card) => ({
        id: card.id,
        fields: {
          CategoryLabel: card.CategoryLabel,
          DateLabel: card.DateLabel,
          ArticleTitle: card.ArticleTitle,
          Summary: card.Summary,
          Image: card.Image,
          Link: card.Link,
          IsOnDemandEvent: card.IsOnDemandEvent,
        },
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load related articles';
    console.error('[kpmg-beyond/related-articles]', message);
    return NextResponse.json({ error: message, cards: [] }, { status: 500 });
  }
}
