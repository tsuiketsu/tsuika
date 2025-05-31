import BookmarkFolder from "./bookmark-folder";
import Show from "@/components/show";
import {
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useFoldersData } from "@/hooks/use-folder";
import { FolderPlus } from "lucide-react";
import { lazy, Suspense } from "react";

const InsertFolder = lazy(
  () => import("@/components/forms/folder/insert-folder")
);

const BookmarkFolderSkeleton = () => (
  <SidebarMenuSubItem>
    <Skeleton className="mx-auto h-7 w-full" />
  </SidebarMenuSubItem>
);

const BookmarkFoldersSkeletons = ({ isEnabled }: { isEnabled: boolean }) => {
  if (!isEnabled) {
    return null;
  }

  return Array.from({ length: 14 }).map((_, idx) => (
    <BookmarkFolderSkeleton key={`sidebar-folder-ske-${idx}`} />
  ));
};

const FoldersFallback = () => (
  <Suspense
    fallback={
      <SidebarMenuSub>
        <BookmarkFolderSkeleton />
      </SidebarMenuSub>
    }
  >
    <SidebarMenuSub>
      <InsertFolder
        customTrigger={
          <SidebarMenuSubButton>
            <FolderPlus />
            Create folder
          </SidebarMenuSubButton>
        }
      />
    </SidebarMenuSub>
  </Suspense>
);

export default function BookmarkFolders() {
  const {
    ref: sneakyRef,
    folders,
    isFetching,
    shouldFetchNext,
  } = useFoldersData();

  if (!isFetching && folders.length === 0) {
    return <FoldersFallback />;
  }

  return (
    <SidebarMenuSub>
      {folders.map((folder) => (
        <SidebarMenuSubItem key={`folder-${folder.id}`}>
          <BookmarkFolder folder={folder} />
        </SidebarMenuSubItem>
      ))}
      <BookmarkFoldersSkeletons isEnabled={isFetching} />
      <Show when={shouldFetchNext}>
        <span ref={sneakyRef} className="h-0.5" />
      </Show>
    </SidebarMenuSub>
  );
}
