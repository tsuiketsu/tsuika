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
import { deleteTag } from "@/queries/tags.queries";
import type { Tag } from "@/types/tag";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type RefObject } from "react";
import { toast } from "sonner";

interface PropsType {
  ref: RefObject<HTMLButtonElement | null>;
  id: Tag["id"];
}

export default function Deletetag({ id, ref }: PropsType) {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["deleteTag"],
    mutationFn: async ({ id }: Pick<Tag, "id">) => await deleteTag(id),
    onSuccess: ({ status, data: { message } }, { id }) => {
      if (status !== 200) {
        toast.error(message || "Failed to delete tag");
        return;
      }

      queryClient.setQueryData<Tag[]>(["tags"], (old) =>
        old?.filter((t) => t.id !== id)
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
            Deleting this tag will remove it from{" "}
            <b className="text-destructive">all associated bookmarks</b>. This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="min-w-24">Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={() => mutation.mutate({ id })}
            isLoading={mutation.isPending}
            className="min-w-30"
          >
            Yes, I&apos;m sure
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
