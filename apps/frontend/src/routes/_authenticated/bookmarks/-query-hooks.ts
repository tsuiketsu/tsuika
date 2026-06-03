import { fetchBookmarks } from "@/queries/bookmark.queries";
import { bookmarkFilters } from "@/types/bookmark";
import { useInfiniteQuery } from "@tanstack/react-query";

type Args = {
  slug: string;
  query: string;
  enabled: boolean;
};

export const usePinnedBookmarks = ({ slug, query, enabled }: Args) => {
  const data = useInfiniteQuery({
    queryKey: ["bookmarks", slug, query, { isPinned: true }],
    queryFn: ({ pageParam }) =>
      fetchBookmarks({
        pageParam,
        slug,
        query,
        filter: bookmarkFilters.PINNED,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: enabled,
  });

  return data;
};

export const useBookmarks = ({ slug, query, enabled }: Args) => {
  const data = useInfiniteQuery({
    queryKey: ["bookmarks", slug, query],
    queryFn: ({ pageParam }) =>
      fetchBookmarks({
        pageParam,
        slug,
        query,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: enabled,
  });

  return data;
};
