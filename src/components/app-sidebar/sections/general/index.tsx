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
        />
        <BookmarkOptions />
        <FolderOptions />
        <TagOptions />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
