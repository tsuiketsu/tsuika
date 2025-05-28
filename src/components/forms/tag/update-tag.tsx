import TagForm from "./tag-form";
import Modal from "@/components/ui/modal";
import { updateInfQueryData } from "@/lib/query.utils";
import { updateTag } from "@/queries/tags.queries";
import type { Tag, TagInsertSchemaWithId } from "@/types/tag";
import type { TagInsertSchemaType } from "@/types/tag";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type RefObject } from "react";
import { toast } from "sonner";

interface PropsType {
  tag: Tag;
  ref: RefObject<HTMLButtonElement | null>;
  onChange?: (value: TagInsertSchemaWithId) => void;
}

export default function UpdateTag({ tag, ref, onChange }: PropsType) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["updateTag"],
    mutationFn: async ({
      id,
      payload,
    }: {
      id: Tag["id"];
      payload: TagInsertSchemaType;
    }) => await updateTag(id, payload),
    onSuccess: ({ status, data: { data, message } }) => {
      if (status !== 200) {
        toast.error(message || "Failed to add tag");
        return;
      }

      queryClient.setQueryData<{ pages: { data: Tag[] }[] }>(["tags"], (old) =>
        updateInfQueryData(old, data, (old) => old.id)
      );

      toast.success(message || "Successfully updated tag");
      ref.current?.click();
    },
  });

  return (
    <Modal
      form="tag-form"
      title="Edit Tag"
      desc="When you're happy with it, just hit the save button"
      isPending={mutation.isPending}
      triggerButton={<button ref={ref} type="button" className="hidden" />}
      btnTxt="Save"
    >
      <TagForm
        data={tag}
        onSubmit={(payload) => {
          if (onChange) {
            onChange(payload as Tag);
            ref.current?.click();
            return;
          }
          mutation.mutate({ id: tag.id, payload });
        }}
      />
    </Modal>
  );
}
