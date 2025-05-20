import TagItem from "./tag-item";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import type { Tag } from "@/types/tag";

interface PropsType {
  tags: Tag[];
  isFetching: boolean;
}

export default function TagItems({ tags, isFetching }: PropsType) {
  return (
    <SidebarMenu className="felx felx-col gap-1 select-none">
      {tags.map((tag) => (
        <TagItem key={tag.id} tag={tag} />
      ))}
      {isFetching &&
        Array.from({ length: 8 }).map((_, idx) => (
          <SidebarMenuItem key={`tag-ske-${idx}`}>
            <Skeleton className="h-8 w-full rounded" />
          </SidebarMenuItem>
        ))}
    </SidebarMenu>
  );
}
