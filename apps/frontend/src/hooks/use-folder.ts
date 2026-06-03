import { useInfiniteScrollObserver } from "./infinite-scroll-observer";
import { fetchFolders } from "@/queries/folder.queries";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useFoldersData = () => {
  const { data, isFetching, fetchNextPage, hasNextPage, isFetched } =
    useInfiniteQuery({
      queryKey: ["folders"],
      queryFn: ({ pageParam }) => fetchFolders({ pageParam }),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      staleTime: 1000 * 60 * 60 * 24,
      retry: 0,
    });

  const ref = useInfiniteScrollObserver(fetchNextPage, isFetching);

  const shouldFetchNext = useMemo(() => {
    return !isFetching && hasNextPage;
  }, [hasNextPage, isFetching]);

  const folders = useMemo(() => {
    return data?.pages.flatMap(({ data }) => data) ?? [];
  }, [data]);

  return {
    data,
    folders,
    isFetching,
    hasNextPage,
    shouldFetchNext,
    ref,
    isFetched,
  };
};

export const useFolderName = (id: string | undefined | null) => {
  const { folders, isFetching } = useFoldersData();

  const folderName = useMemo(
    () => (id ? folders.find((folder) => folder.id === id)?.name : null),
    [folders, id]
  );

  return { folderName, isFetching };
};
