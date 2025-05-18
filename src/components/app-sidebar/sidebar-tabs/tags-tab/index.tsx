import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar";
import { fetchAllTags } from "@/queries/tags.queries";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import TagItems from "./tag-items";

export default function TagsTab() {
  const { data, status } = useInfiniteQuery({
    queryKey: ["tags"],
    queryFn: fetchAllTags,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const tags = useMemo(() => {
    return data?.pages.flatMap(({ data }) => data) ?? [];
  }, [data]);

  if (status !== "pending" && tags.length === 0) {
    return <div>No Tags</div>;
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <TagItems tags={tags} isFetching={status === "pending"} />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
