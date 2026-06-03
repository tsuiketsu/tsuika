import type { PasswordFormType as FormSchema } from "./schema";
import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const errorToast = (message: string | undefined) => {
  toast.error(message || "Something went wrong, please try again later");
};

export const usePasswordFormMutation = ({
  onSuccess,
}: {
  onSuccess: () => void;
}) => {
  return useMutation({
    mutationKey: ["change-email"],
    mutationFn: async ({
      password: { currentPassword, newPassword },
      revokeOtherSessions,
    }: Pick<FormSchema, "password" | "revokeOtherSessions">) => {
      return authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions,
      });
    },
    onSuccess: ({ error }) => {
      if (error) {
        console.error(error);
        errorToast(error.message);
        return;
      }

      onSuccess();
      toast.success("Successfully updated your password!");
    },
    onError: (error) => errorToast(error.message),
  });
};
