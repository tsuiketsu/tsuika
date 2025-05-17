import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteInfQueryData } from "@/lib/query.utils";
import { deleteBookmark } from "@/queries/bookmark.queries";
import type { Bookmark } from "@/types/bookmark";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";

export default function DeleteBookmark({
  id,
  ref,
}: Pick<React.ComponentProps<"button">, "ref"> & { id: number }) {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["editBookmark"],
    mutationFn: async ({ id }: { id: number }) => await deleteBookmark(id),
    onSuccess: ({ status, data: { message } }) => {
      if (status !== 200) {
        toast.error(message || "Failed to delete bookmark");
        return;
      }

      queryClient.setQueryData<{ pages: { data: Bookmark[] }[] }>(
        ["bookmarks"],
        (old) => deleteInfQueryData(old, id, (old) => old.id)
      );

      toast.success(message || "Successfully deleted bookmark");
      setOpen(false);
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger ref={ref} className="hidden" />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="w-24">Cancel</AlertDialogCancel>
          <Button
            onClick={() => mutation.mutate({ id })}
            isLoading={mutation.isPending}
            className="w-24"
          >
            Contine
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
