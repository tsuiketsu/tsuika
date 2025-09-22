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
import { changeEmail, useSession } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formScheme = z.object({
  email: z.string().email(),
});

type InputType = z.infer<typeof formScheme>;

export default function ChangeEmail() {
  const [isDisabled, setIsDisabled] = useState(true);

  const { data } = useSession();

  const errorToast = (message: string | undefined) => {
    toast.error(message || "Failed to change email");
  };

  const mutation = useMutation({
    mutationKey: ["change-email"],
    mutationFn: async (newEmail: string) => {
      return changeEmail({
        newEmail,
      });
    },
    onSuccess: ({ error }) => {
      if (error) {
        console.error(error);
        errorToast(error.message);
        return;
      }

      if (data?.user.emailVerified) {
        toast.success(
          `Check your inbox at ${data?.user.email} for a link to verify your account.`
        );
        return;
      }

      toast.success("Successfully updated your email!");
    },
    onError: (error) => errorToast(error.message),
  });

  const form = useForm<InputType>({
    resolver: zodResolver(formScheme),
    defaultValues: { email: "" },
  });

  const onSubmit: SubmitHandler<InputType> = (data) => {
    mutation.mutate(data.email);
  };

  useEffect(() => {
    if (data?.user.email) {
      form.setValue("email", data?.user.email);
    }
  }, [data?.user.email, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="email"
          disabled={isDisabled}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="e.g. sheerwill@proton.me"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isDisabled ? (
          <Button
            type="button"
            variant="secondary"
            onClick={(e) => {
              e.preventDefault();
              setIsDisabled(false);
              form.reset({ email: "" });
            }}
            className="w-full @lg/dash:w-38"
          >
            Change Email
          </Button>
        ) : (
          <Button
            type="submit"
            isLoading={mutation.isPending}
            className="w-full @lg/dash:w-38"
          >
            Save
          </Button>
        )}
      </form>
    </Form>
  );
}
