import { insertTag } from "@/queries/tags.queries";
import type { Tag } from "@/types/tag";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const useTagInsertMutation = ({
  onSuccess,
}: {
  onSuccess: (data: Tag) => void;
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["insertTag"],
    mutationFn: insertTag,
    onSuccess: ({ status, data: { data, message } }) => {
      if (status !== 200) {
        toast.error(message || "Failed to add tag");
        return;
      }

      queryClient.setQueryData<Tag[]>(["tags"], (old) =>
        old && old.length > 0 ? [...old, data] : [data]
      );

      onSuccess(data);
      toast.success(message || "Successfully added tag");
    },
  });

  return mutation;
};

export default useTagInsertMutation;
