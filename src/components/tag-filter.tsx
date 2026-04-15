"use client";

export function TagFilter({
  tags,
  activeTag,
  onTagSelect,
}: {
  tags: { tag: string; count: number }[];
  activeTag: string | null;
  onTagSelect: (tag: string | null) => void;
}) {
  const visible = tags.filter((t) => t.count >= 2 || t.tag === activeTag);
  if (visible.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-10" role="toolbar" aria-label="Filter bookmarks by tag">
      {activeTag && (
        <button
          type="button"
          onClick={() => onTagSelect(null)}
          aria-label={`Clear filter: ${activeTag}`}
          className="text-[13px] px-3 py-1 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium cursor-pointer hover:bg-zinc-700 dark:hover:bg-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-zinc-400 dark:focus-visible:ring-offset-zinc-950 transition-colors duration-150"
        >
          <span aria-hidden="true">&times;</span>
          <span className="ml-1">{activeTag}</span>
        </button>
      )}
      {visible
        .filter((t) => t.tag !== activeTag)
        .slice(0, 12)
        .map(({ tag, count }) => (
          <button
            key={tag}
            type="button"
            onClick={() => onTagSelect(tag)}
            aria-label={`Filter by ${tag}, ${count} bookmarks`}
            className="text-[13px] px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-zinc-400 dark:focus-visible:ring-offset-zinc-950 transition-all duration-150 cursor-pointer"
          >
            {tag}
            <span className="ml-1.5 text-zinc-500 dark:text-zinc-400 text-[11px]">
              {count}
            </span>
          </button>
        ))}
    </div>
  );
}
