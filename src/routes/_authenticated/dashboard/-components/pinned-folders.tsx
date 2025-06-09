import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchFolders } from "@/queries/folder.queries";
import { useUserProfileStore } from "@/stores/user-profile.store";
import type { Folder } from "@/types/folder";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { FolderIcon } from "lucide-react";
import { useMemo } from "react";

const Skeletions = () =>
  Array.from({ length: 6 }).map((_, idx) => (
    <Skeleton key={`folder-${idx}`} className="h-[52px]" />
  ));

const Folders = ({ folders }: { folders: Folder[] }) =>
  folders.map((folder) => (
    <Button
      variant="outline"
      key={folder.id}
      className="inline-flex h-auto justify-between p-2 pl-4"
      asChild
    >
      <Link to="/bookmarks/$slug" params={{ slug: `folder/${folder.id}` }}>
        <span>{folder.name}</span>
        <span className="rounded-md border p-2">
          <FolderIcon />
        </span>
      </Link>
    </Button>
  ));

export default function PinnedFolders() {
  const profile = useUserProfileStore((s) => s.profile);

  const folderIds = useMemo(
    () => profile?.preferencesJson.pinnedFolders ?? [],
    [profile?.preferencesJson.pinnedFolders]
  );

  const { data, isFetching } = useQuery({
    queryKey: ["pinned-folders", folderIds],
    queryFn: async () =>
      await fetchFolders({
        pageParam: 0,
        folderIds,
      }),
    enabled: folderIds.length > 0,
  });

  if (!isFetching && (!data || data?.data.length === 0)) {
    return null;
  }

  return (
    <div className="w-full space-y-4">
      <h4 className="font-bold">Pinned Folders</h4>
      <div className="grid grid-cols-3 gap-2 overflow-hidden @2xl:grid-cols-6 @6xl:grid-cols-3">
        {isFetching ? <Skeletions /> : <Folders folders={data?.data ?? []} />}
      </div>
    </div>
  );
}
