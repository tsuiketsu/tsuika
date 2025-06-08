import { defaultFolders } from "./constants";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Bookmark } from "lucide-react";

const DefaultFolders = () => (
  <SidebarMenuSub>
    {defaultFolders.map((folder) => (
      <SidebarMenuSubItem key={`folder-${folder.title}`}>
        <SidebarMenuButton asChild>
          <Link {...folder.link} className="[&.active]:bg-secondary">
            <folder.icon />
            {folder.title}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuSubItem>
    ))}
  </SidebarMenuSub>
);

export default function BookmarkOptions() {
  return (
    <SidebarMenu>
      <Collapsible defaultOpen={true} className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip="Default bookmark folders">
              <Bookmark />
              <span>Bookmark</span>
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <DefaultFolders />
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  );
}
