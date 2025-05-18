import Modal from "@/components/ui/modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertTag } from "@/queries/tags.queries";
import { toast } from "sonner";
import type { Tag } from "@/types/tag";
import { useRef } from "react";
import TagForm from "./tag-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { insertInfQueryData } from "@/lib/query.utils";

export default function InsertTag() {
  const queryClient = useQueryClient();
  const ref = useRef<HTMLButtonElement>(null);

  const mutation = useMutation({
    mutationKey: ["insertTag"],
    mutationFn: insertTag,
    onSuccess: ({ status, data: { data, message } }) => {
      if (status !== 200) {
        toast.error(message || "Failed to add tag");
        return;
      }

      queryClient.setQueryData<{ pages: { data: Tag[] }[] }>(["tags"], (old) =>
        insertInfQueryData(old, data)
      );

      toast.success(message || "Successfully added tag");
      ref.current?.click();
    },
  });
  return (
    <Modal
      form="tag-form"
      title="Create Tag"
      desc="When you're happy with it, just hit the Create button"
      triggerButton={
        <Button ref={ref} variant="ghost" className="size-8">
          <Plus size={20} />
        </Button>
      }
      isPending={mutation.isPending}
      btnTxt="Create"
    >
      <TagForm onSubmit={mutation.mutate} />
    </Modal>
  );
}
