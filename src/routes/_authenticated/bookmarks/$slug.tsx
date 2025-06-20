import {
  BookmarkSkeleton,
  BookmarkSkeletons,
} from "./-components/bookmark-cards/skeletions";
import BookmarkContextProvider from "./-components/context/context-provider";
import BookmarksPageHeader from "./-components/header";
import SecureFolder from "./-components/secure-folder";
import ActionBar from "./-components/toolbar";
import { useBookmarks, usePinnedBookmarks } from "./-query-hooks";
import FallbackScreen from "@/components/fallback";
import { CardsLayout } from "@/components/layouts/cards-layout";
import { useInfiniteScrollObserver } from "@/hooks/infinite-scroll-observer";
import { useSecuredFolders } from "@/hooks/secured-folder.hook";
import useLayoutStore from "@/stores/layout.store";
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
  const [query, setQuery] = useState("");

  const slug = Route.useLoaderData().slug;
  const layout = useLayoutStore((s) => s.layout);

  const {
    isFetching: isFoldersFetching,
    folder: selectedFolder,
    isLocked,
    isSecured,
  } = useSecuredFolders(slug);

  // Pinned Bookmarks
  const {
    data: pinnedData,
    fetchNextPage: fetchMorePinned,
    isFetching: isFetchingPinned,
    hasNextPage: hasMorePinned,
  } = usePinnedBookmarks({
    query,
    slug,
    enabled: !isSecured && slug.split("/")[1] !== "all",
  });

  // Regular Bookmarks
  const { data, fetchNextPage, isFetching, hasNextPage } = useBookmarks({
    query,
    slug,
    enabled: !isSecured && !hasMorePinned,
  });

  const handleFetch = async () => {
    if (hasMorePinned && !isFetchingPinned) {
      await fetchMorePinned();
    } else if (hasNextPage && !isFetching) {
      await fetchNextPage();
    }
  };

  const isLoading = useMemo(() => {
    return isFoldersFetching || isFetching || isFetchingPinned;
  }, [isFetching, isFetchingPinned, isFoldersFetching]);

  const sneakyRef = useInfiniteScrollObserver(handleFetch, isFetching);

  const bookmarks = useMemo(() => {
    const regular = data?.pages.flatMap((page) => page.data) ?? [];
    const pinned = pinnedData?.pages.flatMap((page) => page.data) ?? [];

    return [...pinned, ...regular];
  }, [data?.pages, pinnedData?.pages]);

  if (!isFoldersFetching && selectedFolder && isLocked) {
    return <SecureFolder key={slug} folder={selectedFolder} />;
  }

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
      {!isLoading && bookmarks.length === 0 ? (
        <FallbackScreen
          title="No bookmarks found"
          description="Add a bookmark to see here"
          icon={Ghost}
        />
      ) : (
        <CardsLayout
          layout={layout}
          className={clsx("relative", { "pb-20": isLoading })}
        >
          <BookmarkContextProvider query={query}>
            <Suspense fallback={<BookmarkSkeleton layout={layout} />}>
              <BookmarkCards bookmarks={bookmarks} />
            </Suspense>
          </BookmarkContextProvider>
          <BookmarkSkeletons
            isLoading={isLoading}
            bookmarksLength={bookmarks.length}
          />
          <span ref={sneakyRef} className="h-1" />
        </CardsLayout>
      )}
    </div>
  );
}
