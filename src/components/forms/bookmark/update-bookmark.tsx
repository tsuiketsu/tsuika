import BookmarkForm from "./form";
import useMutationSubmit from "./hooks/use-mutation-submit";
import Modal from "@/components/ui/modal";
import { useSecuredFolders } from "@/hooks/secured-folder.hook";
import {
  deleteInfQueryData,
  mutationError,
  updateInfQueryData,
} from "@/lib/query.utils";
import type { Setter } from "@/lib/utils";
import { editBookmark } from "@/queries/bookmark.queries";
import BookmarkThumbnail from "@/routes/_authenticated/bookmarks/-components/bookmark-cards/thumbnail";
import useBookmarkContext from "@/routes/_authenticated/bookmarks/-components/context/use-context";
import type { Bookmark } from "@/types/bookmark";
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

  // NOTE: This should not throw error as update should always be within
  // bookmark context not otherwise
  const { slug } = useBookmarkContext();
  const { folderId, isSecured } = useSecuredFolders();

  const mutation = useMutation({
    mutationKey: ["editBookmark"],
    mutationFn: editBookmark,
    onSuccess: ({ data: { data, message } }, { payload }) => {
      const queryKey: unknown[] = ["bookmarks", slug, query];

      if (isSecured) {
        queryKey.push({ isEncrypted: true });
      }

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

      // Update dedicated bookmark pages information
      queryClient.setQueryData<Bookmark>(["bookmark", bookmark.id], (old) =>
        !old ? old : Object.assign({}, old, data)
      );

      toast.success(message || "Successfully updated bookmark");
      setOpen(false);
    },
    onError: mutationError("Failed to update bookmark"),
  });

  const onSubmit = useMutationSubmit((payload) =>
    mutation.mutate({ id: bookmark.id, payload })
  );

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
      <div className="relative">
        <BookmarkThumbnail
          layout="grid"
          title={bookmark.title}
          image={bookmark.thumbnail}
          width={bookmark.thumbnailWidth}
          height={bookmark.thumbnailHeight}
        />
        <div className="absolute top-2 right-2 size-9 rounded-sm bg-white/80 p-1 shadow-xl backdrop-blur-sm">
          <img
            src={bookmark.faviconUrl ?? ""}
            className="size-full rounded-sm object-contain"
            alt="favicon"
          />
        </div>
      </div>
      <BookmarkForm
        data={bookmark}
        onSubmit={onSubmit}
        isPending={mutation.isPending}
      />
    </Modal>
  );
}
