import BookmarkForm from "./bookmark-form";
import { useBookmarPathSlug } from "./use-slug.hook";
import Modal from "@/components/ui/modal";
import { useSecuredFolders } from "@/hooks/secured-folder.hook";
import { deleteInfQueryData, updateInfQueryData } from "@/lib/query.utils";
import type { Setter } from "@/lib/utils";
import { editBookmark } from "@/queries/bookmark.queries";
import type { Bookmark, BookmarkFormSchemaType } from "@/types/bookmark";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface PropsType {
  bookmark: Bookmark;
  query: string;
  open: boolean;
  setOpen: Setter<boolean>;
}

export default function UpdateBookmark({
  bookmark,
  query,
  open,
  setOpen,
}: PropsType) {
  const queryClient = useQueryClient();
  const { slug } = useBookmarPathSlug();
  const { folderId, isSecured } = useSecuredFolders();

  const mutation = useMutation({
    mutationKey: ["editBookmark"],
    mutationFn: async ({
      id,
      payload,
    }: {
      id: Bookmark["id"];
      payload: BookmarkFormSchemaType;
    }) => await editBookmark(id, payload),
    onSuccess: ({ status, data: { data, message } }, { payload }) => {
      if (status !== 200) {
        toast.error(message || "Failed to add bookmark");
        return;
      }

      const queryKey = isSecured
        ? ["bookmarks", slug, "", { isEncrypted: true }]
        : ["bookmarks", slug, query];

      if (payload.folderId && folderId !== payload.folderId) {
        queryClient.setQueryData<{ pages: { data: Bookmark[] }[] }>(
          queryKey,
          (old) => deleteInfQueryData(old, bookmark.id, (old) => old.id)
        );

        return;
      }

      queryClient.setQueryData<{ pages: { data: Bookmark[] }[] }>(
        queryKey,
        (old) => updateInfQueryData(old, data, (old) => old.id)
      );

      toast.success(message || "Successfully updated bookmark");
      setOpen(false);
    },
  });

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      form="bookmark-form"
      title="Update bookmark"
      desc="When you're happy with it, just hit the save button"
      isPending={mutation.isPending}
      btnTxt="Save"
    >
      <BookmarkForm
        data={bookmark}
        onSubmit={(payload) => mutation.mutate({ id: bookmark.id, payload })}
      />
    </Modal>
  );
}
