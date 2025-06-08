import TagItem from "./tag-item";
import Show from "@/components/show";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useTagsData } from "@/hooks/use-tag";
import { SquarePlus } from "lucide-react";
import { lazy, Suspense } from "react";

const InsertTag = lazy(() => import("@/components/forms/tag/insert-tag"));

const TagSkeletion = () => (
  <SidebarMenuItem>
    <Skeleton className="h-8 w-full rounded-md" />
  </SidebarMenuItem>
);

const TagSkeletions = ({ isVisible }: { isVisible?: boolean }) => {
  if (!isVisible) return null;

  return Array.from({ length: 5 }).map((_, idx) => (
    <TagSkeletion key={`tag-ske-${idx}`} />
  ));
};

const TagsFallback = () => {
  return (
    <Suspense
      fallback={
        <SidebarMenuSub>
          <TagSkeletion />
        </SidebarMenuSub>
      }
    >
      <SidebarMenuSub>
        <InsertTag
          customTrigger={
            <SidebarMenuButton>
              <SquarePlus />
              Create tag
            </SidebarMenuButton>
          }
        />
      </SidebarMenuSub>
      <InsertTag />
    </Suspense>
  );
};

export default function TagItems() {
  const { ref: sneakyRef, tags, isFetching, shouldFetchNext } = useTagsData();

  if (!isFetching && tags.length === 0) {
    return <TagsFallback />;
  }

  return (
    <SidebarMenuSub className="felx felx-col gap-1 select-none">
      {tags.map((tag) => (
        <TagItem key={tag.id} tag={tag} />
      ))}
      <TagSkeletions isVisible={isFetching} />
      <Show when={shouldFetchNext}>
        <span ref={sneakyRef} className="h-0.5" />
      </Show>
    </SidebarMenuSub>
  );
}
