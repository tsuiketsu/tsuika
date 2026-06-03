import { updatePreferences } from "@/queries/profile.queries";
import { useUserProfileStore } from "@/stores/user-profile.store";
import type { Preferences, Profile } from "@/types/profile";
import { mergeOnlyUpdatedFields } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const toastMessage = {
  failed: "Failed to update preferences",
  success: "Updated & applied successfully!",
};

export const updatePreferencesHandler = async (preferences: Preferences) => {
  const prev = useUserProfileStore.getState().profile?.preferencesJson;

  return await updatePreferences(
    mergeOnlyUpdatedFields(preferences, prev ?? {})
  );
};

export const usePreferencesMutation = (
  onSuccess?: (value: Preferences) => void
) => {
  const queryClient = useQueryClient();
  const setPreferences = useUserProfileStore((s) => s.setPreferences);

  const mutation = useMutation({
    mutationKey: ["updatePreferences"],
    mutationFn: updatePreferencesHandler,
    onSuccess: ({ status, data: { data, message } }, preferences) => {
      if (status !== 200) {
        console.error(message);
        toast.error(toastMessage.failed);
        return;
      }

      queryClient.setQueryData<Profile>(["profile"], (old) => data ?? old);
      toast.success(toastMessage.success);

      setPreferences(data.preferencesJson);
      onSuccess?.(preferences);
    },
    onError: (error) => {
      console.error(error);
      toast.error(toastMessage.failed);
    },
  });

  return mutation;
};
