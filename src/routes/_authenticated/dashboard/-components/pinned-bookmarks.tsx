import BookmarkGroup from "./bookmark-group";
import { fetchBookmarks } from "@/queries/bookmark.queries";
import type { Bookmark } from "@/types/bookmark";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Pin } from "lucide-react";
import { useMemo } from "react";

export default function PinnedBookmarks() {
  const slug = "folder/favorites";
  const query = "";

  const { data, isFetching } = useInfiniteQuery({
    queryKey: ["bookmarks", slug, query],
    queryFn: ({ pageParam }) =>
      fetchBookmarks({
        pageParam,
        slug,
        query,
        limit: 5,
        isPinned: true,
      }),
    initialPageParam: 1,
    retry: 1,
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
        icon: Pin,
      }}
      isFetching={isFetching}
      bookmarks={bookmarks}
    />
  );
}
