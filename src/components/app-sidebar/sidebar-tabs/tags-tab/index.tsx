import TagItems from "./tag-items";
import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar";
import { useTagsData } from "@/hooks/use-tag";

export default function TagsTab() {
  const { ref: sneakyRef, tags, isFetching } = useTagsData();

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
