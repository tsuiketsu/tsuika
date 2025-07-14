import { unpublishFolder } from "@/queries/share-folder.queries";
import { publishFolder } from "@/queries/share-folder.queries";
import type { SharedFolder } from "@/types/folder";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const getQueryKey = (id: string) => ["shared-folder", id];

type VoidFunc = {
  onSuccessFunc: () => void;
};

// PUBLISH FOLDER
export const usePublishMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["publish-folder"],
    mutationFn: publishFolder,
    onSuccess: ({ status, data: { data, message } }) => {
      if (status !== 200) {
        toast.error(message || "Failed to add folder");
        return;
      }

      const queryKey = getQueryKey(data.id);
      const payload = queryClient.getQueryData(queryKey);

      if (payload) {
        queryClient.setQueryData<SharedFolder>(queryKey, (old) => ({
          ...old,
          ...data,
          isPublic: true,
        }));
      }
    },
  });
};

// UPDATE SHARED FOLDER
export const useUpdateMutation = ({ onSuccessFunc }: VoidFunc) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-published-folder"],
    mutationFn: publishFolder,
    onSuccess: ({ status, data: { data, message } }) => {
      if (status !== 200) {
        toast.error(message || "Failed to add folder");
        return;
      }

      const queryKey = getQueryKey(data.id);
      const payload = queryClient.getQueryData(queryKey);

      if (payload) {
        queryClient.setQueryData<SharedFolder>(queryKey, (old) => ({
          ...old,
          ...data,
        }));
      }

      onSuccessFunc?.();
    },
  });
};

// UN-PUBLISH SHARED FOLDER
export const useUnpublishMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["unpublish-folder"],
    mutationFn: unpublishFolder,
    onSuccess: ({ status, data: { message } }, folderId) => {
      if (status !== 200) {
        toast.error(message || "Failed to add folder");
        return;
      }

      queryClient.setQueryData<SharedFolder>(
        getQueryKey(folderId),
        (old) =>
          ({
            ...old,
            isPublic: false,
          }) as SharedFolder
      );
    },
  });
};
