import FolderPicker from "@/components/folder-picker";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  deleteInfQueryDataInBulk,
  insertInfQueryDataInBulk,
} from "@/lib/query.utils";
import { bulkMoveBookmarksToFolder } from "@/queries/bookmark.queries";
import { useToolbarStore } from "@/stores/toolbar.store";
import type { InfiniteQueryResponse as IQR } from "@/types";
import type { Bookmark } from "@/types/bookmark";
import type { Folder } from "@/types/folder";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLoaderData } from "@tanstack/react-router";
import clsx from "clsx";
import { FolderInput, MoveRight } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";

export default function FolderForm() {
  const bookmarkIds = useToolbarStore((s) => s.bookmarkIds);
  const toggleEdit = useToolbarStore((s) => s.toggleBulkEdit);

  const dialogCloseRef = useRef<HTMLButtonElement>(null);
  const [folderId, setFolderId] = useState<string | null>(null);
  const { slug } = useLoaderData({ from: "/_authenticated/bookmarks/$slug" });

  const queryClient = useQueryClient();

  const errorToast = (message: string | undefined) => {
    toast.error(message || "Failed to move bookmarks to selected folder");
  };

  const queryKey = useMemo(() => ["bookmarks", slug, ""], [slug]);

  const mutation = useMutation({
    mutationKey: ["move-bookmarks-to-folder"],
    mutationFn: async ({
      folderId,
      bookmarks,
    }: {
      folderId: Folder["id"];
      bookmarks: Bookmark[];
    }) => {
      return await bulkMoveBookmarksToFolder(
        folderId,
        bookmarks.map((b) => b.id)
      );
    },
    onSuccess: ({ status, statusText }, { bookmarks }) => {
      if (status !== 200) {
        errorToast(statusText);
        return;
      }

      queryClient.setQueryData<IQR<Bookmark>>(queryKey, (old) =>
        deleteInfQueryDataInBulk(old, bookmarkIds, (old) => old.id)
      );

      queryClient.setQueryData<IQR<Bookmark>>(
        [queryKey[0], `folder/${folderId}`, ""],
        (old) => insertInfQueryDataInBulk(old, bookmarks)
      );

      dialogCloseRef.current?.click();
      toggleEdit();
    },
    onError: (error) => errorToast(error.message),
  });

  const onSubmitHandler = () => {
    if (!folderId) {
      toast.info("Pick a folder first");
      return;
    }

    const list = queryClient.getQueryData([
      "bookmarks",
      slug,
      "",
    ]) as IQR<Bookmark>;

    const bookmarks =
      list?.pages?.flatMap(({ data }) =>
        data.filter((b) => bookmarkIds.includes(b.id))
      ) ?? [];

    mutation.mutate({ folderId, bookmarks });
  };

  return (
    <Dialog>
      <DialogTrigger
        className={clsx({ hidden: bookmarkIds.length === 0 })}
        asChild
      >
        <Button variant="outline">
          <FolderInput /> Move
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Move bookmarks to...</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
          <FolderPicker onChange={setFolderId} />
        </DialogHeader>
        <DialogFooter>
          <DialogClose ref={dialogCloseRef} />
          <Button
            isLoading={mutation.isPending}
            disabled={!folderId}
            onClick={onSubmitHandler}
            className="min-w-28"
          >
            Move <MoveRight />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
