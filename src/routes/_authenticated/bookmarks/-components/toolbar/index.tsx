import BulkEdit from "./bulk-edit";
import LayoutPicker from "./layout-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSecuredFolders } from "@/hooks/secured-folder.hook";
import { useSecureFolderStore } from "@/stores/secure-folder.store";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { LockIcon, SearchIcon } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";

interface PropsType {
  slug: string;
  total: number;
  onQueryChange: (value: string) => void;
}

type InputType = {
  query: string;
};

export default function ActionBar({ slug, total, onQueryChange }: PropsType) {
  const { handleSubmit, register } = useForm<InputType>();

  const onSubmit: SubmitHandler<InputType> = (data) => {
    onQueryChange?.(data.query);
  };

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
      <form
        className={clsx(
          "w-full gap-2",
          slug.includes("tag") || folder.isSecured ? "hidden" : "inline-flex"
        )}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="relative">
          <Input
            type="text"
            className="h-8 w-58 pl-7"
            placeholder="Search..."
            onInput={(e) =>
              e.currentTarget.value.trim() === "" && onQueryChange("")
            }
            {...register("query", {
              required: true,
              setValueAs: (v) => encodeURI(v),
            })}
          />
          <SearchIcon
            className="text-muted-foreground absolute top-2 left-2"
            size={16}
          />
        </div>
      </form>
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
