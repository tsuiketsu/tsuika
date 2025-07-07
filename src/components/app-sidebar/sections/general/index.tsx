import BookmarkOptions from "./bookmark-options";
import FolderOptions from "./folder-options";
import SidebarLink from "./sidebar-link";
import TagOptions from "./tag-opitons";
import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar";
import { LayoutDashboard } from "lucide-react";

export default function GeneralSection() {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarLink
          label="Dashboard"
          navigate={{ to: "/dashboard" }}
          icon={LayoutDashboard}
          tooltip="Dashboard"
        />
        <BookmarkOptions menuId={1} />
        <FolderOptions menuId={2} />
        <TagOptions menuId={3} />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
