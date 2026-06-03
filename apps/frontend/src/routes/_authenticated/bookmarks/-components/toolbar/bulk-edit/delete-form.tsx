import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useSecuredFolders } from "@/hooks/secured-folder.hook";
import { deleteInfQueryDataInBulk } from "@/lib/query.utils";
import { bulkDeleteBookmarks } from "@/queries/bookmark.queries";
import { useToolbarStore } from "@/stores/toolbar.store";
import type { InfiniteQueryResponse as IQR } from "@/types";
import type { Bookmark } from "@/types/bookmark";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { Trash } from "lucide-react";
import { useMemo, useRef } from "react";
import { toast } from "sonner";

export default function DeleteForm({ slug }: { slug: string }) {
  const bookmarkIds = useToolbarStore((s) => s.bookmarkIds);
  const toggleEdit = useToolbarStore((s) => s.toggleBulkEdit);
  const dialogCloseRef = useRef<HTMLButtonElement>(null);
  const folder = useSecuredFolders();

  const queryClient = useQueryClient();

  const errorToast = () => {
    toast.error("Failed to delete bookmarks");
  };

  const queryKey = useMemo(
    () =>
      folder.isSecured
        ? ["bookmarks", slug, "", { isEncrypted: true }]
        : ["bookmarks", slug, ""],
    [slug, folder.isSecured]
  );

  const mutation = useMutation({
    mutationKey: ["delete-bookmarks"],
    mutationFn: async (ids: Bookmark["id"][]) => {
      return await bulkDeleteBookmarks(ids);
    },
    onSuccess: (res) => {
      if (!res.success) {
        console.error(res.message);
        errorToast();
        return;
      }

      queryClient.setQueryData<IQR<Bookmark>>(queryKey, (old) =>
        deleteInfQueryDataInBulk(old, res.data, (old) => old.id)
      );

      dialogCloseRef.current?.click();
      toggleEdit();
    },
    onError: (error) => {
      console.error(error);
      errorToast();
    },
  });

  const onSubmitHandler = () => {
    mutation.mutate(bookmarkIds);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger
        className={clsx({ hidden: bookmarkIds.length === 0 })}
        asChild
      >
        <Button variant="destructive" size="sm">
          <Trash /> Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="select-none">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Bookmarks</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the selected bookmarks? This action
            is irreversible once completed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel ref={dialogCloseRef}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            isLoading={mutation.isPending}
            disabled={bookmarkIds.length === 0}
            onClick={onSubmitHandler}
            className="min-w-28"
          >
            Yes, I&apos;m sure
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
