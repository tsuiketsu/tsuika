import TagItem from "./tag-item";
import { SidebarMenu } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import type { Tag } from "@/types/tag";

interface PropsType {
  tags: Tag[];
  isFetching: boolean;
}

export default function TagItems({ tags, isFetching }: PropsType) {
  return (
    <SidebarMenu className="select-none">
      {tags.map((tag) => (
        <TagItem key={tag.id} tag={tag} />
      ))}
      {isFetching &&
        Array.from({ length: 8 }).map((_, idx) => (
          <Skeleton key={`tag-ske-${idx}`} className="h-6 w-full rounded" />
        ))}
    </SidebarMenu>
  );
}
