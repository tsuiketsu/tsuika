import { useInfiniteScrollObserver } from "./infinite-scroll-observer";
import { fetchFolders } from "@/queries/folder.queries";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useFolderData = () => {
  const { data, isFetching, fetchNextPage } = useInfiniteQuery({
    queryKey: ["folders"],
    queryFn: ({ pageParam }) => fetchFolders({ pageParam, limit: 30 }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const ref = useInfiniteScrollObserver(fetchNextPage, isFetching);

  const folders = useMemo(() => {
    return data?.pages.flatMap(({ data }) => data) ?? [];
  }, [data]);

  return { data, folders, isFetching, ref };
};
