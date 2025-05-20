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
} from "@/components/ui/sidebar";
import { fetchAllFolders } from "@/queries/folder.queries";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { useMemo } from "react";

export default function BookmarkFolders() {
  const { data, isFetching } = useInfiniteQuery({
    queryKey: ["folders"],
    queryFn: fetchAllFolders,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const folders = useMemo(() => {
    return data?.pages.flatMap(({ data }) => data) ?? [];
  }, [data]);

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
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}
