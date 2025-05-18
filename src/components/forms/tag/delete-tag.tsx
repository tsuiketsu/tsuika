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
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import type { Tag } from "@/types/tag";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";
import { deleteTag } from "@/queries/tags.queries";

export default function Deletetag({
  id,
  ref,
}: Pick<React.ComponentProps<"button">, "ref"> & { id: number }) {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["deleteTag"],
    mutationFn: async ({ id }: { id: number }) => await deleteTag(id),
    onSuccess: ({ status, data: { message } }) => {
      if (status !== 200) {
        toast.error(message || "Failed to delete tag");
        return;
      }

      queryClient.setQueryData<{ pages: { data: Tag[] }[] }>(["tags"], (old) =>
        deleteInfQueryData(old, id, (old) => old.id)
      );

      toast.success(message || "Successfully deleted tag");
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
