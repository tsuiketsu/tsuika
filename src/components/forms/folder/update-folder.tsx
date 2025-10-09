import FolderForm from "./folder-form";
import type { FolderInsertSchemaType } from "./types";
import Modal from "@/components/ui/modal";
import { mutationError, updateInfQueryData } from "@/lib/query.utils";
import type { Setter } from "@/lib/utils";
import { updateFolder } from "@/queries/folder.queries";
import type { Folder } from "@/types/folder";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface PropsType {
  folder: Folder;
  open: boolean;
  setOpen: Setter<boolean>;
}

export default function UpdateFolder({ folder, open, setOpen }: PropsType) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["updateFolder"],
    mutationFn: async ({
      id,
      payload,
    }: {
      id: Folder["id"];
      payload: FolderInsertSchemaType;
    }) => await updateFolder(id, payload),
    onSuccess: ({ data: { data, message } }) => {
      queryClient.setQueryData<{ pages: { data: Folder[] }[] }>(
        ["folders"],
        (old) => updateInfQueryData(old, data, (old) => old.id)
      );

      toast.success(message || "Successfully updated folder");
      setOpen(false);
    },
    onError: mutationError("Failed to update folder"),
  });

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      form="folder-form"
      title="Edit Folder"
      desc="When you're happy with it, just hit the save button"
      isPending={mutation.isPending}
      btnTxt="Save"
    >
      <FolderForm
        data={folder}
        onSubmit={(payload) => mutation.mutate({ id: folder.id, payload })}
      />
    </Modal>
  );
}
