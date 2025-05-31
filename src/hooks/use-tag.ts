import { useInfiniteScrollObserver } from "./infinite-scroll-observer";
import { fetchAllTags } from "@/queries/tags.queries";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useTagsData = () => {
  const { data, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["tags"],
    queryFn: fetchAllTags,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const shouldFetchNext = useMemo(() => {
    return !isFetching && hasNextPage;
  }, [hasNextPage, isFetching]);

  const ref = useInfiniteScrollObserver(fetchNextPage, isFetching);

  const tags = useMemo(() => {
    return data?.pages.flatMap(({ data }) => data) ?? [];
  }, [data]);

  return { data, tags, isFetching, hasNextPage, shouldFetchNext, ref };
};
