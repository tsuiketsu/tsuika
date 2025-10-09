import { mutationError } from "@/lib/query.utils";
import { unpublishFolder } from "@/queries/share-folder.queries";
import { publishFolder } from "@/queries/share-folder.queries";
import type { SharedFolder } from "@/types/folder";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
    onSuccess: ({ data: { data } }) => {
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
    onError: mutationError("Failed publish folder"),
  });
};

// UPDATE SHARED FOLDER
export const useUpdateMutation = ({ onSuccessFunc }: VoidFunc) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-published-folder"],
    mutationFn: publishFolder,
    onSuccess: ({ data: { data } }) => {
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
    onError: mutationError("Failed to update folder"),
  });
};

// UN-PUBLISH SHARED FOLDER
export const useUnpublishMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["unpublish-folder"],
    mutationFn: unpublishFolder,
    onSuccess: (_, folderId) => {
      queryClient.setQueryData<SharedFolder>(
        getQueryKey(folderId),
        (old) =>
          ({
            ...old,
            isPublic: false,
          }) as SharedFolder
      );
    },
    onError: mutationError("Failed to un-publish folder"),
  });
};
