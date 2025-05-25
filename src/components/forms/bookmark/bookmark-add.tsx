import BookmarkForm from "./bookmark-form";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { insertInfQueryData } from "@/lib/query.utils";
import { addBookmark } from "@/queries/bookmark.queries";
import type { Bookmark } from "@/types/bookmark";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BookmarkPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PropsType {
  query: string;
}

export default function AddBookmark({ query }: PropsType) {
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
        ["bookmarks", query],
        (old) => insertInfQueryData(old, data)
      );

      toast.success(message || "Successfully added bookmark");
      setOpen(false);
    },
  });

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="ml-auto"
        onClick={() => setOpen(true)}
      >
        <BookmarkPlus />
      </Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        form="bookmark-form"
        title="Create bookmark"
        desc="When you're happy with it, just hit the Create button"
        isPending={mutation.isPending}
        btnTxt="Create"
      >
        <BookmarkForm onSubmit={mutation.mutate} />
      </Modal>
    </>
  );
}
