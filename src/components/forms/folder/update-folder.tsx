import FolderForm from "./folder-form";
import Modal from "@/components/ui/modal";
import { updateInfQueryData } from "@/lib/query.utils";
import { updateFolder } from "@/queries/folder.queries";
import type { Folder, FolderInsertSchemaType } from "@/types/folder";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type RefObject } from "react";
import { toast } from "sonner";

interface PropsType {
  folder: Folder;
  ref: RefObject<HTMLButtonElement | null>;
}

export default function UpdateFolder({ folder, ref }: PropsType) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["updateFolder"],
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: FolderInsertSchemaType;
    }) => await updateFolder(id, payload),
    onSuccess: ({ status, data: { data, message } }) => {
      if (status !== 200) {
        toast.error(message || "Failed to add folder");
        return;
      }

      queryClient.setQueryData<{ pages: { data: Folder[] }[] }>(
        ["folders"],
        (old) => updateInfQueryData(old, data, (old) => old.id)
      );

      toast.success(message || "Successfully updated folder");
      ref.current?.click();
    },
  });

  return (
    <Modal
      form="folder-form"
      title="Edit Folder"
      desc="When you're happy with it, just hit the save button"
      isPending={mutation.isPending}
      triggerButton={<button ref={ref} type="button" className="hidden" />}
      btnTxt="Save"
    >
      <FolderForm
        data={folder}
        onSubmit={(payload) => mutation.mutate({ id: folder.id, payload })}
      />
    </Modal>
  );
}
