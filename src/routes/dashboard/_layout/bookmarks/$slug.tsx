import BookmarkSkeleton from "./-components/bookmark-skeleton";
import BookmarkContextProvider from "./-components/context/context-provider";
import { useInfiniteScrollObserver } from "@/hooks/infinite-scroll-observer";
import { fetchBookmarks } from "@/queries/bookmark.queries";
import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense, lazy, useMemo } from "react";

const BookmarkCards = lazy(() => import("./-components/bookmark-cards"));

export const Route = createFileRoute("/dashboard/_layout/bookmarks/$slug")({
  component: Bookmarks,
  loader: async ({ params }) => {
    return params;
  },
});

function Bookmarks() {
  const slug = Route.useLoaderData().slug;

  const { data, fetchNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["bookmarks", slug],
    queryFn: ({ pageParam }) => fetchBookmarks({ pageParam, slug }),
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
    <div className="@container/dash relative size-full">
      <div className="grid w-full auto-rows-min gap-4 @2xl/dash:grid-cols-2 @5xl/dash:grid-cols-3 @7xl/dash:grid-cols-4">
        <BookmarkContextProvider query={slug}>
          <Suspense fallback={<BookmarkSkeleton />}>
            <BookmarkCards bookmarks={bookmarks} />
          </Suspense>
        </BookmarkContextProvider>
        {Array.from({ length: isFetching ? 16 : 0 }).map((_, idx) => (
          <BookmarkSkeleton key={`bm-skleton-${idx}`} />
        ))}
        <span ref={sneakyRef} className="h-1" />
      </div>
    </div>
  );
}
