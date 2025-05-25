import { insertInfQueryData } from "@/lib/query.utils";
import { insertTag } from "@/queries/tags.queries";
import type { Tag } from "@/types/tag";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import type { RefObject } from "react";
import { toast } from "sonner";

const useTagInsertMutation = (
  triggerBtnRef?: RefObject<HTMLButtonElement | null>
) => {
  const queryClient = useQueryClient();

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
      triggerBtnRef?.current?.click();
    },
  });

  return mutation;
};

export default useTagInsertMutation;
