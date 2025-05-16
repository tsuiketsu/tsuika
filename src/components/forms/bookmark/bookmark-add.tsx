import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { composeInfQryData } from "@/lib/query.utils";
import { addBookmark } from "@/queries/bookmark.queries";
import type { Bookmark } from "@/types/bookmark";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BookmarkPlus, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import BookmarkForm from "./bookmark-form";

export default function AddBookmark() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["addBookmark"],
    mutationFn: addBookmark,
    onSuccess: ({ status, data: { data, message } }) => {
      if (status !== 200) {
        toast.error(message || "Failed to add bookmark");
        return;
      }

      queryClient.setQueryData<{ pages: { data: Bookmark[] }[] }>(
        ["bookmarks"],
        (old) => composeInfQryData(old, data),
      );

      toast.success(message || "Successfully added bookmark");
      setOpen(false);
    },
  });

  return (
    <>
      <Button variant="ghost" className="ml-auto" onClick={() => setOpen(true)}>
        {mutation.isPending ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          <BookmarkPlus />
        )}
      </Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        form="bookmark-form"
        title="Create bookmark"
        desc="When you're happy with it, just hit the Create button"
        btnTxt="Create"
      >
        <BookmarkForm mutation={mutation} />
      </Modal>
    </>
  );
}
