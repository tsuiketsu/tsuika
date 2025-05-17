import { useInfiniteScrollObserver } from "@/hooks/infinite-scroll-observer";
import { fetchBookmarks } from "@/queries/bookmark.queries";
import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense, lazy, useMemo } from "react";
import BookmarkSkeleton from "./-components/bookmark-skeleton";

const BookmarkCards = lazy(() => import("./-components/bookmark-cards"));

export const Route = createFileRoute("/dashboard/_layout/bookmarks/")({
  component: Bookmarks,
});

function Bookmarks() {
  const { data, isFetching, fetchNextPage } = useInfiniteQuery({
    queryKey: ["bookmarks"],
    queryFn: ({ pageParam }) => fetchBookmarks({ pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const sneakyRef = useInfiniteScrollObserver(fetchNextPage, isFetching);

  const bookmarks = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  if (!isFetching && bookmarks.length === 0) {
    return null;
  }

  return (
    <div className="@container/dash size-full relative">
      <div className="w-full grid gap-4 @7xl/dash:grid-cols-4 @5xl/dash:grid-cols-3 @2xl/dash:grid-cols-2 grid-flow auto-rows-min">
        <Suspense fallback={<BookmarkSkeleton />}>
          <BookmarkCards bookmarks={bookmarks} />
        </Suspense>
        {Array.from({ length: isFetching ? 16 : 0 }).map((_, idx) => (
          <BookmarkSkeleton key={`bm-skleton-${idx}`} />
        ))}
        <span ref={sneakyRef} className="h-1" />
      </div>
    </div>
  );
}
