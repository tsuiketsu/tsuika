import { Skeleton } from "@/components/ui/skeleton";
import { fetchFolders } from "@/queries/folder.queries";
import { useUserProfileStore } from "@/stores/user-profile.store";
import type { Folder } from "@/types/folder";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { FolderIcon } from "lucide-react";
import { useMemo } from "react";

const Skeletons = () =>
  Array.from({ length: 6 }).map((_, idx) => (
    <Skeleton key={`folder-${idx}`} className="h-[52px]" />
  ));

const Folders = ({ folders }: { folders: Folder[] }) =>
  folders.map((folder) => (
    <Link
      key={folder.id}
      to="/bookmarks/$slug"
      params={{ slug: `folder/${folder.id}` }}
      className="bg-card inline-flex items-center justify-between rounded-xl border py-2 pr-2 pl-4"
    >
      <span className="truncate text-sm">{folder.name}</span>
      <span className="rounded-md border p-2">
        <FolderIcon />
      </span>
    </Link>
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
      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-2 overflow-hidden">
        {isFetching ? <Skeletons /> : <Folders folders={data?.data ?? []} />}
      </div>
    </div>
  );
}
