import {
  BookmarkSkeleton,
  BookmarkSkeletons,
} from "./-components/bookmark-cards/skeletions";
import BookmarkContextProvider from "./-components/context/context-provider";
import BookmarksPageHeader from "./-components/header";
import ActionBar from "./-components/toolbar";
import FallbackScreen from "@/components/fallback";
import { CardsLayout } from "@/components/layouts/cards-layout";
import { useInfiniteScrollObserver } from "@/hooks/infinite-scroll-observer";
import { fetchBookmarks } from "@/queries/bookmark.queries";
import useLayoutStore from "@/stores/layout.store";
import { bookmarkFilters } from "@/types/bookmark";
import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import clsx from "clsx";
import { Ghost } from "lucide-react";
import { Suspense, lazy, useMemo, useState } from "react";

const BookmarkCards = lazy(() => import("./-components/bookmark-cards"));

export const Route = createFileRoute("/_authenticated/bookmarks/$slug")({
  component: Bookmarks,
  loader: async ({ params }) => {
    return params;
  },
});

function Bookmarks() {
  const slug = Route.useLoaderData().slug;
  const layout = useLayoutStore((s) => s.layout);
  const [query, setQuery] = useState("");

  // Pinned Bookmarks
  const {
    data: pinnedData,
    fetchNextPage: fetchMorePinned,
    isFetching: isFetchingPinned,
    hasNextPage: hasMorePinned,
  } = useInfiniteQuery({
    queryKey: ["bookmarks", slug, query, { isPinned: true }],
    queryFn: ({ pageParam }) =>
      fetchBookmarks({
        pageParam,
        slug,
        query,
        filter: bookmarkFilters.PINNED,
      }),
    initialPageParam: 1,
    retry: 1,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: slug.split("/")[1] !== "all",
  });

  // Regular Bookmarks
  const { data, fetchNextPage, isFetching, hasNextPage } = useInfiniteQuery({
    queryKey: ["bookmarks", slug, query],
    queryFn: ({ pageParam }) =>
      fetchBookmarks({
        pageParam,
        slug,
        query,
      }),
    initialPageParam: 1,
    retry: 1,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !hasMorePinned,
  });

  const handleFetch = async () => {
    if (hasMorePinned && !isFetchingPinned) {
      await fetchMorePinned();
    } else if (hasNextPage && !isFetching) {
      await fetchNextPage();
    }
  };

  const sneakyRef = useInfiniteScrollObserver(handleFetch, isFetching);

  const bookmarks = useMemo(() => {
    const regular = data?.pages.flatMap((page) => page.data) ?? [];
    const pinned = pinnedData?.pages.flatMap((page) => page.data) ?? [];

    return [...pinned, ...regular];
  }, [data?.pages, pinnedData?.pages]);

  return (
    <div className="flex size-full flex-col">
      <div className="space-y-6">
        <BookmarksPageHeader slug={slug} />
        <ActionBar
          slug={slug}
          total={bookmarks.length}
          onQueryChange={(value) => setQuery(value)}
        />
      </div>
      {!isFetching && bookmarks.length === 0 ? (
        <FallbackScreen
          title="No bookmarks found"
          description="Add a bookmark to see here"
          icon={Ghost}
        />
      ) : (
        <CardsLayout
          layout={layout}
          className={clsx("relative", { "pb-20": isFetching })}
        >
          <BookmarkContextProvider query={query}>
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
      )}
    </div>
  );
}
