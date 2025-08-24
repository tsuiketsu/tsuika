import { BookmarkSkeletons } from "../bookmark-cards/skeletons";
import BookmarkContextProvider from "../context/context-provider";
import FallbackScreen from "@/components/fallback";
import { CardsLayout } from "@/components/layouts/cards-layout";
import { useInfiniteScrollObserver } from "@/hooks/infinite-scroll-observer";
import useLayoutStore from "@/stores/layout.store";
import type { Bookmark } from "@/types/bookmark";
import clsx from "clsx";
import { GhostIcon } from "lucide-react";
import { lazy, Suspense } from "react";

interface PropsType {
  isFetching: boolean;
  isFetched: boolean;
  isError: boolean;
  slug: string;
  query: string;
  bookmarks: Bookmark[];
  fetchNextFn: () => void;
}

const BookmarkCards = lazy(() => import("../bookmark-cards"));

export default function BookmarksLayout({
  isFetching,
  isFetched,
  isError,
  slug,
  query,
  bookmarks,
  fetchNextFn,
}: PropsType) {
  const layout = useLayoutStore((s) => s.layout);
  const sneakyRef = useInfiniteScrollObserver(fetchNextFn, isFetching);

  if ((isFetched && bookmarks.length === 0) || isError) {
    return (
      <FallbackScreen
        title="No bookmarks found"
        description="Add a bookmark to see here"
        icon={GhostIcon}
      />
    );
  }

  return (
    <CardsLayout
      layout={layout}
      className={clsx("relative", { "pb-20": isFetching })}
    >
      <BookmarkContextProvider slug={slug} query={query}>
        <Suspense
          fallback={
            <BookmarkSkeletons
              isLoading={true}
              bookmarksLength={bookmarks.length ?? 9}
            />
          }
        >
          <BookmarkCards bookmarks={bookmarks} />
        </Suspense>
      </BookmarkContextProvider>

      <BookmarkSkeletons
        isLoading={isFetching}
        bookmarksLength={bookmarks.length}
      />
      <span ref={sneakyRef} className="h-1" />
    </CardsLayout>
  );
}
