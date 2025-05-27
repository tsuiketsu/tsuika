import BookmarkSkeletons from "./-components/bookmark-skeletions";
import BookmarkSkeleton from "./-components/bookmark-skeleton";
import BookmarkContextProvider from "./-components/context/context-provider";
import { CardsLayout } from "@/components/layouts/cards-layout";
import { useInfiniteScrollObserver } from "@/hooks/infinite-scroll-observer";
import { fetchBookmarks } from "@/queries/bookmark.queries";
import useLayoutStore from "@/stores/layout.store";
import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import clsx from "clsx";
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
  const layout = useLayoutStore((s) => s.layout);

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
    <div className="@container/dash size-full">
      <CardsLayout
        layout={layout}
        className={clsx("relative", { "pb-20": isFetching })}
      >
        <BookmarkContextProvider query={slug}>
          <Suspense fallback={<BookmarkSkeleton layout={layout} />}>
            <BookmarkCards bookmarks={bookmarks} />
          </Suspense>
        </BookmarkContextProvider>
        <BookmarkSkeletons
          isLoading={isFetching}
          bookmarksLength={bookmarks.length}
        />
        <span ref={sneakyRef} className="h-1" />
      </CardsLayout>
    </div>
  );
}
