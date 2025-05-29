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
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoaderData } from "@tanstack/react-router";
import type { User } from "better-auth/types";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formScheme = z.object({
  email: z.string().email(),
});

type InputType = z.infer<typeof formScheme>;

export default function ChangeEmail() {
  const [isDisabled, setIsDisabled] = useState(true);

  const { session }: { session: { user: User } } = useLoaderData({
    from: "/_authenticated",
  });

  const form = useForm<InputType>({
    resolver: zodResolver(formScheme),
    defaultValues: { email: session.user.email },
  });

  const onSubmit: SubmitHandler<InputType> = (data) => {
    toast(data.email);
  };

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
            className="ml-auto w-36"
          >
            Change Email
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
