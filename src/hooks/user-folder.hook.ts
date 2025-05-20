import { useInfiniteScrollObserver } from "./infinite-scroll-observer";
import { fetchFolders } from "@/queries/folder.queries";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useFolderData = (limit?: number) => {
  const { data, isFetching, fetchNextPage } = useInfiniteQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["folders"],
    queryFn: ({ pageParam }) => fetchFolders({ pageParam, limit }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const ref = useInfiniteScrollObserver(fetchNextPage, isFetching);

  const folders = useMemo(() => {
    return data?.pages.flatMap(({ data }) => data) ?? [];
  }, [data]);

  return { data, folders, isFetching, ref };
};
