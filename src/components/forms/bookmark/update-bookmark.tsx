import BookmarkForm from "./bookmark-form";
import { useBookmarPathSlug } from "./use-slug.hook";
import Modal from "@/components/ui/modal";
import { deleteInfQueryData, updateInfQueryData } from "@/lib/query.utils";
import { editBookmark } from "@/queries/bookmark.queries";
import type { Bookmark, BookmarkFormSchemaType } from "@/types/bookmark";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";

interface PropsType extends Pick<React.ComponentProps<"button">, "ref"> {
  bookmark: Bookmark;
  query: string;
}

export default function UpdateBookmark({ bookmark, ref, query }: PropsType) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { slug } = useBookmarPathSlug();

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

      const queryId = slug.split("/").slice(-1).join("");

      if (payload.folderId && queryId !== payload.folderId) {
        queryClient.setQueryData<{ pages: { data: Bookmark[] }[] }>(
          ["bookmarks", slug, query],
          (old) => deleteInfQueryData(old, bookmark.id, (old) => old.id)
        );

        return;
      }

      queryClient.setQueryData<{ pages: { data: Bookmark[] }[] }>(
        ["bookmarks", slug, query],
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
      triggerButton={<button ref={ref} type="button" className="hidden" />}
      btnTxt="Save"
    >
      <BookmarkForm
        data={bookmark}
        onSubmit={(payload) => mutation.mutate({ id: bookmark.id, payload })}
      />
    </Modal>
  );
}
