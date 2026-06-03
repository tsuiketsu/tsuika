import BookmarksPageHeader from "./-components/header";
import BookmarksLayout from "./-components/layouts/bookmarks-layout";
import ActionBar from "./-components/toolbar";
import { useBookmarks, usePinnedBookmarks } from "./-query-hooks";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/_authenticated/bookmarks/$slug")({
  component: Bookmarks,
  loader: async ({ params }) => {
    return params;
  },
});

function Bookmarks() {
  const [query, setQuery] = useState("");

  const slug = Route.useLoaderData().slug;

  // Pinned Bookmarks
  const {
    data: pinnedData,
    fetchNextPage: fetchMorePinned,
    isFetching: isFetchingPinned,
    isFetched: isFetchedPinned,
    hasNextPage: hasMorePinned,
  } = usePinnedBookmarks({
    query,
    slug,
    enabled:
      slug.split("/")[0] !== "tag" &&
      !["all", "archived", "unsorted", "favorites"].includes(
        slug.split("/")[1]
      ),
  });

  // Regular Bookmarks
  const {
    data,
    fetchNextPage,
    isFetching: isFetchingRegular,
    isFetched: isFetchedRegular,
    hasNextPage,
  } = useBookmarks({
    query,
    slug,
    enabled: !hasMorePinned,
  });

  const bookmarks = useMemo(() => {
    return [
      ...(pinnedData?.pages.flatMap((page) => page.data) ?? []),
      ...(data?.pages.flatMap((page) => page.data) ?? []),
    ];
  }, [data?.pages, pinnedData?.pages]);

  return (
    <div className="flex size-full flex-col">
      <div className="border-foreground/15 space-y-6">
        <BookmarksPageHeader slug={slug} />
        <ActionBar
          slug={slug}
          total={bookmarks.length}
          onQueryChange={(value) => setQuery(value)}
        />
      </div>
      <hr />
      <BookmarksLayout
        isFetching={isFetchingRegular || isFetchingPinned}
        isFetched={isFetchedPinned || isFetchedRegular}
        isError={false}
        slug={slug}
        query={query}
        bookmarks={bookmarks}
        fetchNextFn={async () => {
          if (hasMorePinned && !isFetchingPinned) {
            await fetchMorePinned();
          }

          if (hasNextPage && !isFetchingRegular) {
            await fetchNextPage();
          }
        }}
      />
    </div>
  );
}
