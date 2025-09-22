import { useBookmarPathSlug } from "./use-slug.hook";
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
import { useSecuredFolders } from "@/hooks/secured-folder.hook";
import { deleteInfQueryData } from "@/lib/query.utils";
import type { Setter } from "@/lib/utils";
import { deleteBookmark } from "@/queries/bookmark.queries";
import type { Bookmark } from "@/types/bookmark";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface PropsType {
  id: Bookmark["id"];
  query: string;
  open: boolean;
  setOpen: Setter<boolean>;
}

export default function DeleteBookmark({
  id,
  query,
  open,
  setOpen,
}: PropsType) {
  const { slug } = useBookmarPathSlug();
  const { isSecured } = useSecuredFolders();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["deleteBookmark"],
    mutationFn: async ({ id }: Pick<Bookmark, "id">) =>
      await deleteBookmark(id),
    onSuccess: ({ status, data: { message } }) => {
      if (status !== 200) {
        toast.error(message || "Failed to delete bookmark");
        return;
      }

      const queryKey = isSecured
        ? ["bookmarks", slug, "", { isEncrypted: true }]
        : ["bookmarks", slug, query];

      queryClient.setQueryData<{ pages: { data: Bookmark[] }[] }>(
        queryKey,
        (old) => deleteInfQueryData(old, id, (old) => old.id)
      );

      toast.success(message || "Successfully deleted bookmark");
      setOpen(false);
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action is irreversible. The selected bookmark will be
            permanently deleted from our servers
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
