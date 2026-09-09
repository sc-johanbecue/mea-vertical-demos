import { NextRequest, NextResponse } from "next/server";
import {
  fetchFolderCardItems,
  resolveCardsFolderId,
} from "@/lib/kpmg-beyond/fetch-folder-cards";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const language = request.nextUrl.searchParams.get("language") || "en";
  let folderId = request.nextUrl.searchParams.get("folderId");
  const dataSourceId = request.nextUrl.searchParams.get("dataSourceId");

  if (!folderId && dataSourceId) {
    folderId = await resolveCardsFolderId(dataSourceId, language);
  }

  if (!folderId) {
    return NextResponse.json(
      { error: "folderId or dataSourceId with CardsFolder is required" },
      { status: 400 },
    );
  }

  try {
    const cards = await fetchFolderCardItems(folderId, language);
    return NextResponse.json({ cards, folderId });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load folder cards";
    console.error("[kpmg-beyond/folder-cards]", message);
    return NextResponse.json({ error: message, cards: [] }, { status: 500 });
  }
}
