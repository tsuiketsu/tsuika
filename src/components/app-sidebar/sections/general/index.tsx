import BookmarkOptions from "./bookmark-options";
import FolderOptions from "./folder-options";
import TagOptions from "./tag-opitons";
import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar";

export default function GeneralSection() {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <BookmarkOptions />
        <FolderOptions />
        <TagOptions />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
