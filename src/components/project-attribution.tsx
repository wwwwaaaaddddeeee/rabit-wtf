"use client";

import { Link } from "react-aria-components";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** RAC `Button` omits `href`; `Link` shares the same styles via `buttonVariants`. */
export function ProjectAttribution() {
  return (
    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">
      <span>a project by </span>
      <Link
        href="https://brianawade.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-describedby="attribution-new-tab-hint"
        className={cn(
          buttonVariants({ variant: "link", size: "sm" }),
          "inline h-auto min-h-0 px-0 py-0 align-baseline font-normal"
        )}
      >
        wade
      </Link>
      <span id="attribution-new-tab-hint" className="sr-only">
        {`Opens Wade's portfolio in a new tab`}
      </span>
    </p>
  );
}
