import TagItems from "./tag-items";
import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar";
import { useInfiniteScrollObserver } from "@/hooks/infinite-scroll-observer";
import { fetchAllTags } from "@/queries/tags.queries";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export default function TagsTab() {
  const { data, isFetching, fetchNextPage } = useInfiniteQuery({
    queryKey: ["tags"],
    queryFn: fetchAllTags,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const sneakyRef = useInfiniteScrollObserver(fetchNextPage, isFetching);

  const tags = useMemo(() => {
    return data?.pages.flatMap(({ data }) => data) ?? [];
  }, [data]);

  if (!isFetching && tags.length === 0) {
    return <div>No Tags</div>;
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <TagItems tags={tags} isFetching={isFetching} />
        <span ref={sneakyRef} className="h-0.5" />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
