import BookmarkForm from "./bookmark-form";
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

export default function EditBookmark({ bookmark, ref, query }: PropsType) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["editBookmark"],
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: BookmarkFormSchemaType;
    }) => await editBookmark(id, payload),
    onSuccess: ({ status, data: { data, message } }, { payload }) => {
      if (status !== 200) {
        toast.error(message || "Failed to add bookmark");
        return;
      }

      const prevBookmark = (
        queryClient.getQueryData(["bookmarks", query]) as
          | { pages: { data: Bookmark[] }[] }
          | undefined
      )?.pages.flatMap((bookmarks) =>
        bookmarks.data.find(({ id }) => id === bookmark.id)
      )?.[0];

      if (prevBookmark && prevBookmark.folderId !== payload.folderId) {
        queryClient.setQueryData<{ pages: { data: Bookmark[] }[] }>(
          ["bookmarks", query],
          (old) => deleteInfQueryData(old, bookmark.id, (old) => old.id)
        );

        return;
      }

      queryClient.setQueryData<{ pages: { data: Bookmark[] }[] }>(
        ["bookmarks", query],
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
