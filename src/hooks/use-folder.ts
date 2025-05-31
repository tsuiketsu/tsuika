import { useInfiniteScrollObserver } from "./infinite-scroll-observer";
import { fetchFolders } from "@/queries/folder.queries";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useFoldersData = () => {
  const { data, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["folders"],
    queryFn: ({ pageParam }) => fetchFolders({ pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const ref = useInfiniteScrollObserver(fetchNextPage, isFetching);

  const shouldFetchNext = useMemo(() => {
    return !isFetching && hasNextPage;
  }, [hasNextPage, isFetching]);

  const folders = useMemo(() => {
    return data?.pages.flatMap(({ data }) => data) ?? [];
  }, [data]);

  return { data, folders, isFetching, hasNextPage, shouldFetchNext, ref };
};
