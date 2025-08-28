import BulkEdit from "./bulk-edit";
import LayoutPicker from "./layout-picker";
import SearchInput from "./search-input";
import { Button } from "@/components/ui/button";
import { useSecuredFolders } from "@/hooks/secured-folder.hook";
import { useSecureFolderStore } from "@/stores/secure-folder.store";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { LockIcon } from "lucide-react";

interface PropsType {
  slug: string;
  total: number;
  onQueryChange: (value: string) => void;
}

export default function ActionBar({ slug, total, onQueryChange }: PropsType) {
  const queryClient = useQueryClient();

  const { folderId, ...folder } = useSecuredFolders();

  const lockFolderHandler = () => {
    // Remove key derivations of folder
    useSecureFolderStore.getState().removeKey(folderId);

    // Remove all bookmarks cache related to current folder
    queryClient.removeQueries({
      queryKey: ["bookmarks", `folder/${folderId}`, "", { isEncrypted: true }],
    });
  };

  return (
    <div className="flex items-center gap-4 pb-4">
      {folder.isSecured && (
        <Button variant="secondary" size="sm" onClick={lockFolderHandler}>
          <LockIcon /> Lock
        </Button>
      )}
      <SearchInput
        slug={slug}
        isFolderSecured={folder.isSecured}
        onValueChange={onQueryChange}
      />
      <span
        className={clsx(
          "bg-secondary rounded-sm px-3 py-1 text-sm whitespace-nowrap",
          {
            hidden: !slug.includes("tag"),
          }
        )}
      >
        Showing {total} results
      </span>
      <div className="ml-auto inline-flex w-full items-center justify-end space-x-2">
        <BulkEdit slug={slug} />
        <LayoutPicker />
      </div>
    </div>
  );
}
