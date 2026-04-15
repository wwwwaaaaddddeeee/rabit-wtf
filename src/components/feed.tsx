"use client";

import { useState, useMemo } from "react";
import type { Bookmark } from "@/lib/types";
import { BookmarkCard } from "./bookmark-row";
import { TagFilter } from "./tag-filter";

export function Feed({ bookmarks }: { bookmarks: Bookmark[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const b of bookmarks) {
      for (const t of b.aiTags) {
        counts.set(t, (counts.get(t) || 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }, [bookmarks]);

  const filtered = useMemo(() => {
    if (!activeTag) return bookmarks;
    return bookmarks.filter((b) => b.aiTags.includes(activeTag));
  }, [bookmarks, activeTag]);

  return (
    <>
      <TagFilter
        tags={tagCounts}
        activeTag={activeTag}
        onTagSelect={setActiveTag}
      />

      <div className="space-y-4">
        {filtered.map((bookmark) => (
          <BookmarkCard
            key={bookmark.id}
            bookmark={bookmark}
            onTagClick={setActiveTag}
          />
        ))}

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {bookmarks.length === 0
                ? "Nothing here yet. Save some bookmarks to your Raindrop showcase collection."
                : `No bookmarks tagged "${activeTag}".`}
            </p>
            {activeTag && (
              <button
                type="button"
                onClick={() => setActiveTag(null)}
                className="mt-3 text-xs text-zinc-600 dark:text-zinc-300 underline underline-offset-2 hover:text-zinc-900 dark:hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-zinc-400 dark:focus-visible:ring-offset-zinc-950 rounded-sm px-0.5 -mx-0.5 cursor-pointer"
              >
                Clear filter
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
