import BookmarkFolder from "./bookmark-folder";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useFolderData } from "@/hooks/user-folder.hook";
import { ChevronDown } from "lucide-react";

const BookmarkFoldersSkeletons = ({ isEnabled }: { isEnabled: boolean }) => {
  if (!isEnabled) {
    return null;
  }

  return Array.from({ length: 22 }).map((_, idx) => (
    <SidebarMenuItem key={`sidebar-folder-ske-${idx}`}>
      <Skeleton className="h-8 w-full" />
    </SidebarMenuItem>
  ));
};

export default function BookmarkFolders() {
  const { ref: sneakyRef, data, folders, isFetching } = useFolderData(30);

  if (!isFetching && data?.pages.length === 0) {
    return null;
  }

  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarGroup>
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger>
            Folders
            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {folders.map((folder) => (
                <BookmarkFolder key={`folder-${folder.id}`} folder={folder} />
              ))}
              <BookmarkFoldersSkeletons isEnabled={isFetching} />
              <span ref={sneakyRef} className="h-0.5" />
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}
