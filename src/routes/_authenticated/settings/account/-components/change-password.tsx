import Show from "@/components/show";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { StringKeys } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, type Control, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const PasswordField = ({
  control,
  isDisabled = false,
  title,
  placeholder,
  fieldName,
}: {
  control: Control<InputType>;
  isDisabled?: boolean;
  title: string;
  placeholder: string;
  fieldName: StringKeys<InputType>;
}) => (
  <FormField
    control={control}
    name={fieldName}
    disabled={isDisabled}
    render={({ field }) => (
      <FormItem className="w-full">
        <FormLabel>{title}</FormLabel>
        <FormControl>
          <Input type="password" placeholder={placeholder} {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

const formScheme = z.object({
  previousPassword: z.string(),
  newPassword: z.string(),
  confirmNewPassword: z.string(),
});

type InputType = z.infer<typeof formScheme>;

export default function ChangePassword() {
  const [isDisabled, setIsDisabled] = useState(true);

  const form = useForm<InputType>({
    resolver: zodResolver(formScheme),
    defaultValues: {
      previousPassword: "• • • • • • • • • • • • • • • • • • • •",
    },
  });

  const onSubmit: SubmitHandler<InputType> = (data) => {
    toast(data.previousPassword);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <PasswordField
          title="Password"
          placeholder="Enter new password"
          control={form.control}
          fieldName="previousPassword"
          isDisabled={isDisabled}
        />
        <Show when={!isDisabled}>
          <PasswordField
            title="New password"
            placeholder="Enter new password"
            control={form.control}
            fieldName="newPassword"
          />
          <PasswordField
            title="Confirm new password"
            placeholder="Enter your new password"
            control={form.control}
            fieldName="confirmNewPassword"
          />
        </Show>
        {isDisabled ? (
          <Button
            type="button"
            variant="secondary"
            onClick={(e) => {
              e.preventDefault();
              setIsDisabled(false);
              form.reset({ previousPassword: "" });
            }}
            className="ml-auto w-36"
          >
            Change Password
          </Button>
        ) : (
          <Button type="submit" variant="secondary" className="ml-auto w-36">
            Save
          </Button>
        )}
      </form>
    </Form>
  );
}
