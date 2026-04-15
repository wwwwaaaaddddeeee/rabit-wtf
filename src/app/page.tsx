import Image from "next/image";
import { getBookmarks } from "@/lib/bookmarks";
import { Feed } from "@/components/feed";
import siteHeaderIcon from "./site-header-icon.png";

export const dynamic = "force-dynamic";

export default async function Home() {
  let bookmarks: Awaited<ReturnType<typeof getBookmarks>> = [];
  try {
    bookmarks = await getBookmarks();
  } catch {
    bookmarks = [];
  }

  return (
    <>
      <main className="w-full max-w-[640px] mx-auto px-5 py-16 sm:py-24">
        <header className="mb-12">
          <h1 className="flex items-center gap-2 sm:gap-2.5 text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            <Image
              src={siteHeaderIcon}
              alt=""
              width={28}
              height={28}
              className="size-6 sm:size-7 shrink-0 rounded-lg"
              priority
            />
            rabit.wtf
          </h1>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-2">
            things found on the internet
          </p>
        </header>

        <Feed bookmarks={bookmarks} />
      </main>
    </>
  );
}
