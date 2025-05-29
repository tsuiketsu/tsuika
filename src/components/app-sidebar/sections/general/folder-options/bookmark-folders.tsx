import BookmarkFolder from "./bookmark-folder";
import { SidebarMenuSub, SidebarMenuSubItem } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useFoldersData } from "@/hooks/use-folder";

const BookmarkFoldersSkeletons = ({ isEnabled }: { isEnabled: boolean }) => {
  if (!isEnabled) {
    return null;
  }

  return Array.from({ length: 22 }).map((_, idx) => (
    <SidebarMenuSubItem key={`sidebar-folder-ske-${idx}`}>
      <Skeleton className="mx-auto h-7 w-full" />
    </SidebarMenuSubItem>
  ));
};

export default function BookmarkFolders() {
  const { ref: sneakyRef, data, folders, isFetching } = useFoldersData();

  if (!isFetching && data?.pages.length === 0) {
    return null;
  }

  return (
    <SidebarMenuSub>
      {folders.map((folder) => (
        <SidebarMenuSubItem key={`folder-${folder.id}`}>
          <BookmarkFolder folder={folder} />
        </SidebarMenuSubItem>
      ))}
      <BookmarkFoldersSkeletons isEnabled={isFetching} />
      <span ref={sneakyRef} className="h-0.5" />
    </SidebarMenuSub>
  );
}
