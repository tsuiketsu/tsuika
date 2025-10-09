import FolderForm from "./folder-form";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { insertInfQueryData, mutationError } from "@/lib/query.utils";
import { insertFolder } from "@/queries/folder.queries";
import type { Folder } from "@/types/folder";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { Plus } from "lucide-react";
import React, { useRef, type RefObject } from "react";
import { toast } from "sonner";

interface PropsType {
  customTrigger?: React.ReactNode;
  triggerRef?: RefObject<HTMLButtonElement | null>;
}

export default function InsertFolder({ customTrigger, triggerRef }: PropsType) {
  const queryClient = useQueryClient();
  const localRef = useRef<HTMLButtonElement>(null);
  const ref = triggerRef ?? localRef;

  const mutation = useMutation({
    mutationKey: ["insertFolder"],
    mutationFn: insertFolder,
    onSuccess: ({ data: { data, message } }) => {
      queryClient.setQueryData<{ pages: { data: Folder[] }[] }>(
        ["folders"],
        (old) => insertInfQueryData(old, data)
      );

      toast.success(message || "Successfully added folder");
      ref.current?.click();
    },
    onError: mutationError("Failed to add folder"),
  });
  return (
    <Modal
      form="folder-form"
      title="Create Folder"
      desc="When you're happy with it, just hit the Create button"
      triggerButton={
        customTrigger ?? (
          <Button
            variant="ghost"
            size="icon"
            className={clsx({ hidden: triggerRef })}
            ref={ref}
          >
            <Plus size={20} />
          </Button>
        )
      }
      isPending={mutation.isPending}
      btnTxt="Create"
    >
      <FolderForm onSubmit={mutation.mutate} />
    </Modal>
  );
}
