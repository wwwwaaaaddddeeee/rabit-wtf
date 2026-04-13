import { fetchAllBookmarks } from "./raindrop";
import { enrichWithTags } from "./tags";
import { MOCK_BOOKMARKS } from "./mock-data";
import type { Bookmark } from "./types";

let cachedBookmarks: Bookmark[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 120_000;

function hasValidEnv(): boolean {
  const token = process.env.RAINDROP_TOKEN;
  const collectionId = process.env.RAINDROP_COLLECTION_ID;
  return !!token && !token.startsWith("your_") && !!collectionId && !collectionId.startsWith("your_");
}

export async function getBookmarks(): Promise<Bookmark[]> {
  if (!hasValidEnv()) {
    return MOCK_BOOKMARKS;
  }

  const now = Date.now();

  if (cachedBookmarks && now - cacheTimestamp < CACHE_TTL) {
    return cachedBookmarks;
  }

  const raw = await fetchAllBookmarks();
  const enriched = await enrichWithTags(raw);

  cachedBookmarks = enriched;
  cacheTimestamp = now;

  return enriched;
}

export function searchBookmarks(
  bookmarks: Bookmark[],
  query: string
): Bookmark[] {
  const q = query.toLowerCase();
  return bookmarks.filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      b.domain.toLowerCase().includes(q) ||
      b.excerpt.toLowerCase().includes(q) ||
      b.aiTags.some((t) => t.includes(q)) ||
      b.raindropTags.some((t) => t.toLowerCase().includes(q))
  );
}
