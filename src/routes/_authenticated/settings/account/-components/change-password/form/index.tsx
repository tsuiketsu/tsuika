import type { PasswordFormType as FormSchema } from "../schema";
import PasswordField from "./password-field";
import RevokeSessions from "./revoke-sessions-field";
import Show from "@/components/show";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import type { SubmitHandler, UseFormReturn } from "react-hook-form";

export default function ChangePasswordForm({
  isDisabled,
  form,
  onSubmit,
  isLoading,
}: {
  isDisabled: boolean;
  form: UseFormReturn<FormSchema>;
  onSubmit: (payload: FormSchema) => void;
  isLoading: boolean;
}) {
  const formSubmit: SubmitHandler<FormSchema> = (data) => onSubmit(data);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(formSubmit)}
        className="flex flex-col gap-4"
      >
        <PasswordField
          title="Password"
          placeholder="Enter new password"
          control={form.control}
          fieldName="password.currentPassword"
          isDisabled={isDisabled}
        />
        <Show when={!isDisabled}>
          <div className="space-y-4">
            <PasswordField
              title="New Password"
              placeholder="Enter new password"
              control={form.control}
              fieldName="password.newPassword"
            />
            <PasswordField
              title="Confirm new password"
              placeholder="Enter your new password"
              control={form.control}
              fieldName="password.confirmNewPassword"
            />
          </div>
          <RevokeSessions control={form.control} />

          <Button type="submit" className="ml-auto w-36" isLoading={isLoading}>
            Save
          </Button>
        </Show>
      </form>
    </Form>
  );
}
