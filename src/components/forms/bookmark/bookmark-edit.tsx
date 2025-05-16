import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Modal from "@/components/ui/modal";
import { updateInfQueryData } from "@/lib/query.utils";
import { editBookmark } from "@/queries/bookmark.queries";
import type { Bookmark, BookmarkFormSchemaType } from "@/types/bookmark";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SquarePen } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import BookmarkForm from "./bookmark-form";

interface PropsType {
  bookmark: Bookmark;
}

export default function EditBookmark({ bookmark }: PropsType) {
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
    onSuccess: ({ status, data: { data, message } }) => {
      if (status !== 200) {
        toast.error(message || "Failed to add bookmark");
        return;
      }

      queryClient.setQueryData<{ pages: { data: Bookmark[] }[] }>(
        ["bookmarks"],
        (old) => updateInfQueryData(old, data, (old) => old.id),
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
      triggerButton={
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
        >
          <SquarePen className="text-foreground" />
          Edit
        </DropdownMenuItem>
      }
      btnTxt="Save"
    >
      <BookmarkForm
        data={bookmark}
        onSubmit={(payload) => mutation.mutate({ id: bookmark.id, payload })}
      />
    </Modal>
  );
}
