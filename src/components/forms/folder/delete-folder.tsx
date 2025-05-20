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
import { deleteFolder } from "@/queries/folder.queries";
import type { Folder } from "@/types/folder";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";

export default function DeleteFolder({
  id,
  ref,
}: Pick<React.ComponentProps<"button">, "ref"> & { id: number }) {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["deleteFolder"],
    mutationFn: async ({ id }: { id: number }) => await deleteFolder(id),
    onSuccess: ({ status, data: { message } }) => {
      if (status !== 200) {
        toast.error(message || "Failed to delete folder");
        return;
      }

      queryClient.setQueryData<{ pages: { data: Folder[] }[] }>(
        ["folders"],
        (old) => deleteInfQueryData(old, id, (old) => old.id)
      );

      toast.success(message || "Successfully deleted folder");
      setOpen(false);
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger ref={ref} className="hidden" />
      <AlertDialogContent className="select-none">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action is irreversible. Deleting this folder will also remove
            all related <b className="text-destructive">bookmarks</b>{" "}
            permanently.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="w-24">Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={() => mutation.mutate({ id })}
            isLoading={mutation.isPending}
          >
            Yes, I&apos;m sure
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
