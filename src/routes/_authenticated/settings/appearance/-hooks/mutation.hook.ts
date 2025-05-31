import { useFont } from "@/components/font/context/use-font";
import { updatePreferences } from "@/queries/profile.queries";
import type { Preferences, Profile } from "@/types/profile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const toastMessage = {
  failed: "Failed to update preferences",
  success: "Updated & applied successfully!",
};

export const usePreferencesMutation = (preferences: Preferences) => {
  const { setFont } = useFont();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["updatePreferences"],
    mutationFn: updatePreferences,
    onSuccess: ({ status, data: { data, message } }) => {
      if (status !== 200) {
        toast.error(message || toastMessage.failed);
        return;
      }

      queryClient.setQueryData<Profile>(["profile"], (old) => data ?? old);
      toast.success(toastMessage.success);
      setFont(preferences.font);
    },
    onError: () => toast.error(toastMessage.failed),
  });

  return mutation;
};
