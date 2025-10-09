import BookmarkForm from "./form";
import useMutationSubmit from "./hooks/use-mutation-submit";
import { useBookmarPathSlug } from "./use-slug.hook";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { useSecuredFolders } from "@/hooks/secured-folder.hook";
import { insertInfQueryData, mutationError } from "@/lib/query.utils";
import { addBookmark } from "@/queries/bookmark.queries";
import type { Bookmark } from "@/types/bookmark";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { BookmarkPlus } from "lucide-react";
import { useState, type RefObject } from "react";

interface PropsType {
  triggerRef?: RefObject<HTMLButtonElement | null>;
}

export default function InsertBookmark({ triggerRef }: PropsType) {
  const { slug } = useBookmarPathSlug();
  const { isSecured } = useSecuredFolders();

  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["addBookmark", slug, ""],
    mutationFn: addBookmark,
    onSuccess: ({ data: { data } }, bookmark) => {
      if (!slug.includes("tag")) {
        const queryKey: unknown[] = [
          "bookmarks",
          slug.includes("folder")
            ? bookmark.folderId
              ? `folder/${bookmark.folderId}`
              : "folder/unsorted"
            : isSecured
              ? `folder/${bookmark.folderId}`
              : slug,
          "",
        ];

        if (isSecured) {
          queryKey.push({ isEncrypted: true });
        }

        queryClient.setQueryData<{ pages: { data: Bookmark[] }[] }>(
          queryKey,
          (old) => insertInfQueryData(old, data)
        );
      }

      setOpen(false);
    },
    onError: mutationError("Something went wrong! Failed to add bookmark"),
  });

  const onSubmit = useMutationSubmit(mutation.mutate);

  const title = isSecured ? "Create Bookmark (encrypted)" : "Create bookmark";
  const desc = isSecured
    ? "With a secured folder, metadata won't be fetched automatically via URL;" +
      " you must enter it manually, a known limitation"
    : "When you're happy with it, just hit the Create button";

  return (
    <>
      <Button
        ref={triggerRef}
        variant="outline"
        size="icon"
        className={clsx("ml-auto", { hidden: triggerRef })}
        onClick={() => setOpen(true)}
      >
        <BookmarkPlus />
      </Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        form="bookmark-form"
        title={title}
        desc={desc}
        isPending={mutation.isPending}
        btnTxt="Create"
      >
        <BookmarkForm onSubmit={onSubmit} isPending={mutation.isPending} />
      </Modal>
    </>
  );
}
