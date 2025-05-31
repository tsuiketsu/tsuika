import ProfileImageForm from "./-profile-image-form";
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
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import type { User } from "better-auth/types";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

export const Route = createFileRoute("/_authenticated/settings/profile/")({
  component: ProfileComponent,
});

const FILE_SIZE_LIMIT = 2 * 1024 * 1024;

const formSchema = z.object({
  name: z.string(),
  profileImage: z
    .instanceof(File)
    .refine((file) => file.type.includes("image"), {
      message: "Invalid file type, image file expected",
    })
    .refine((file) => file.size <= FILE_SIZE_LIMIT, {
      message: "File should not exceed 2MB",
    }),
});

export type ProfileFormSchema = z.infer<typeof formSchema>;

function ProfileComponent() {
  const { session }: { session: { user: User } } = useLoaderData({
    from: "/_authenticated",
  });

  const form = useForm<ProfileFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: session.user.name },
  });

  const onSubmit: SubmitHandler<ProfileFormSchema> = (_) => {};

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ProfileImageForm control={form.control} />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. John Wick" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full @lg/dash:w-38">
          Save Profile
        </Button>
      </form>
    </Form>
  );
}
