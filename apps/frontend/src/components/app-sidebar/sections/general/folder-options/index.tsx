import { ChevronRight, FolderOpen } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSidebarStore } from "@/stores/sidebar.store";
import BookmarkFolders from "./bookmark-folders";

export default function FolderOptions({ menuId }: { menuId: number }) {
  const { isExpanded, updateState } = useSidebarStore();

  return (
    <SidebarMenu>
      <Collapsible
        defaultOpen={isExpanded(menuId)}
        onOpenChange={(s) => updateState(menuId, s)}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip="Folders">
              <FolderOpen />
              <span>Folders</span>
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <BookmarkFolders />
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  );
}
