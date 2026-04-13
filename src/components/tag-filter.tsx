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
    <div className="flex flex-wrap gap-2 mb-10">
      {activeTag && (
        <button
          onClick={() => onTagSelect(null)}
          className="text-[13px] px-3 py-1 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium cursor-pointer hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors duration-150"
        >
          &times; {activeTag}
        </button>
      )}
      {visible
        .filter((t) => t.tag !== activeTag)
        .slice(0, 12)
        .map(({ tag, count }) => (
          <button
            key={tag}
            onClick={() => onTagSelect(tag)}
            className="text-[13px] px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-200 transition-all duration-150 cursor-pointer"
          >
            {tag}
            <span className="ml-1.5 text-zinc-400 dark:text-zinc-600 text-[11px]">
              {count}
            </span>
          </button>
        ))}
    </div>
  );
}
