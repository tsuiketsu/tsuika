import TagItem from "./tag-item";
import Show from "@/components/show";
import { SidebarMenuItem, SidebarMenuSub } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import type { Tag } from "@/types/tag";

interface PropsType {
  sneakyRef: (instance: Element | null) => void;
  tags: Tag[];
  isFetching: boolean;
}

export default function TagItems({ sneakyRef, tags, isFetching }: PropsType) {
  return (
    <SidebarMenuSub className="felx felx-col gap-1 select-none">
      {tags.map((tag) => (
        <TagItem key={tag.id} tag={tag} />
      ))}
      <Show when={isFetching}>
        {Array.from({ length: 8 }).map((_, idx) => (
          <SidebarMenuItem key={`tag-ske-${idx}`}>
            <Skeleton className="h-8 w-full rounded-md" />
          </SidebarMenuItem>
        ))}
      </Show>
      <span ref={sneakyRef} className="h-0.5" />
    </SidebarMenuSub>
  );
}
