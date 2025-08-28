import BookmarkGroup from "./bookmark-group";
import { fetchBookmarks } from "@/queries/bookmark.queries";
import { bookmarkFilters, type Bookmark } from "@/types/bookmark";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Pin } from "lucide-react";
import { useMemo } from "react";

export default function PinnedBookmarks() {
  const { data, isFetching } = useInfiniteQuery({
    queryKey: ["bookmarks", { filter: bookmarkFilters.PINNED }],
    queryFn: ({ pageParam }) =>
      fetchBookmarks({
        pageParam,
        limit: 5,
        filter: bookmarkFilters.PINNED,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const bookmarks = useMemo((): Bookmark[] => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data?.pages]);

  return (
    <BookmarkGroup
      title="Pinned Bookmarks"
      navigate={{
        to: "/bookmarks/$slug",
        params: { slug: "folder/favorites" },
      }}
      fallback={{
        title: "No Pins",
        description: "Pin a bookmark to view it here",
        icon: Pin,
      }}
      isFetching={isFetching}
      bookmarks={bookmarks}
    />
  );
}
