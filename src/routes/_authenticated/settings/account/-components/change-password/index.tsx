import ChangePasswordForm from "./form";
import { usePasswordFormMutation } from "./mutation-hook";
import {
  passwordFormScheme as formSchema,
  type PasswordFormType as FormSchema,
} from "./schema";
import Show from "@/components/show";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

const initialValues = {
  password: {
    currentPassword: (Array.from({ length: 24 }).fill("•") as string[]).join(
      " "
    ),
    newPassword: "",
    confirmNewPassword: "",
  },
  revokeOtherSessions: true,
};

export default function ChangePassword() {
  const [isDisabled, setIsDisabled] = useState(true);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  const mutation = usePasswordFormMutation({
    onSuccess: () => {
      setIsDisabled(true);
      form.reset({
        password: {
          currentPassword: initialValues.password.currentPassword,
        },
      });
    },
  });

  return (
    <div className="space-y-4">
      <ChangePasswordForm
        form={form}
        onSubmit={mutation.mutate}
        isLoading={mutation.isPending}
        isDisabled={isDisabled}
      />
      <Show when={isDisabled}>
        <Button
          variant="secondary"
          className="ml-auto min-w-36"
          onClick={() => {
            setIsDisabled(false);
            form.reset({
              ...initialValues,
              password: { ...initialValues.password, currentPassword: "" },
            });
          }}
        >
          Change password
        </Button>
      </Show>
    </div>
  );
}
