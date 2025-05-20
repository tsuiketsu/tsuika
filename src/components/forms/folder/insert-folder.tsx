import FolderForm from "./folder-form";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { insertInfQueryData } from "@/lib/query.utils";
import { insertFolder } from "@/queries/folder.queries";
import type { Folder } from "@/types/folder";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";

export default function InsertFolder() {
  const queryClient = useQueryClient();
  const ref = useRef<HTMLButtonElement>(null);

  const mutation = useMutation({
    mutationKey: ["insertFolder"],
    mutationFn: insertFolder,
    onSuccess: ({ status, data: { data, message } }) => {
      if (status !== 200) {
        toast.error(message || "Failed to add folder");
        return;
      }

      queryClient.setQueryData<{ pages: { data: Folder[] }[] }>(
        ["folders"],
        (old) => insertInfQueryData(old, data)
      );

      toast.success(message || "Successfully added folder");
      ref.current?.click();
    },
  });
  return (
    <Modal
      form="folder-form"
      title="Create Folder"
      desc="When you're happy with it, just hit the Create button"
      triggerButton={
        <Button ref={ref} variant="ghost" className="size-8">
          <Plus size={20} />
        </Button>
      }
      isPending={mutation.isPending}
      btnTxt="Create"
    >
      <FolderForm onSubmit={mutation.mutate} />
    </Modal>
  );
}
