"use client";

import type { Bookmark } from "@/lib/types";
import { formatDate } from "@/lib/time";

export function BookmarkCard({
  bookmark,
  onTagClick,
}: {
  bookmark: Bookmark;
  onTagClick: (tag: string) => void;
}) {
  return (
    <article className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
      <a
        href={bookmark.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-4 sm:p-5 transition-colors duration-150 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
      >
        <div className="flex items-center gap-2.5 mb-3">
          <span className="text-[12px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            {bookmark.domain}
          </span>
          <span className="text-zinc-300 dark:text-zinc-700 text-[10px]">
            &middot;
          </span>
          <span className="text-[12px] text-zinc-400 dark:text-zinc-600">
            {formatDate(bookmark.created)}
          </span>
        </div>

        {bookmark.excerpt && (
          <p className="text-[14px] text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed line-clamp-3">
            {bookmark.excerpt}
          </p>
        )}

        <div className="flex gap-3.5 items-start rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 p-3">
          {bookmark.cover && (
            <div className="shrink-0 w-16 h-20 rounded-lg overflow-hidden bg-zinc-200 dark:bg-zinc-700">
              <img
                src={bookmark.cover}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}
          <div className="flex-1 min-w-0 py-0.5">
            <h2 className="text-[15px] font-semibold leading-snug text-zinc-900 dark:text-zinc-100 line-clamp-2">
              {bookmark.title}
            </h2>
          </div>
        </div>
      </a>

      {bookmark.aiTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-4 sm:px-5 pb-4">
          {bookmark.aiTags.map((tag) => (
            <button
              key={tag}
              onClick={(e) => {
                e.preventDefault();
                onTagClick(tag);
              }}
              className="text-[11px] px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors duration-150 cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </article>
  );
}
