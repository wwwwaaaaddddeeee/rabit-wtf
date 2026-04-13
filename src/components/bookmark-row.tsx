"use client";

import { motion } from "framer-motion";
import type { Bookmark } from "@/lib/types";
import { formatDate } from "@/lib/time";

export function BookmarkRow({
  bookmark,
  index,
  onTagClick,
}: {
  bookmark: Bookmark;
  index: number;
  onTagClick: (tag: string) => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.04,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="group"
    >
      <a
        href={bookmark.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex gap-4 py-5 transition-opacity duration-200 hover:opacity-70"
      >
        {bookmark.cover && (
          <div className="shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 ring-1 ring-zinc-200/50 dark:ring-zinc-700/50">
            <img
              src={bookmark.cover}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500 truncate">
              {bookmark.domain}
            </span>
            <span className="text-zinc-300 dark:text-zinc-700 text-[10px]">&middot;</span>
            <span className="text-[11px] text-zinc-400 dark:text-zinc-600 shrink-0">
              {formatDate(bookmark.created)}
            </span>
          </div>
          <h2 className="text-[15px] font-semibold leading-snug text-zinc-900 dark:text-zinc-100 line-clamp-2">
            {bookmark.title}
          </h2>
          {bookmark.excerpt && (
            <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
              {bookmark.excerpt}
            </p>
          )}
        </div>
      </a>
      {bookmark.aiTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 -mt-2 pb-4">
          {bookmark.aiTags.map((tag) => (
            <button
              key={tag}
              onClick={(e) => {
                e.preventDefault();
                onTagClick(tag);
              }}
              className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-50 dark:bg-zinc-800/50 text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-150 cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </motion.article>
  );
}
