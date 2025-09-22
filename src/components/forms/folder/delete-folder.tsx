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
import type { Setter } from "@/lib/utils";
import { deleteFolder } from "@/queries/folder.queries";
import type { Folder } from "@/types/folder";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface PropsType {
  id: Folder["id"];
  open: boolean;
  setOpen: Setter<boolean>;
}

export default function DeleteFolder({ id, open, setOpen }: PropsType) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["deleteFolder"],
    mutationFn: async ({ id }: Pick<Folder, "id">) => await deleteFolder(id),
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
