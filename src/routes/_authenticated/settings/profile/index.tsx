import ProfileImageForm from "./-profile-image-form";
import TextField from "@/components/primitives/form/text-field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import useUserProfile from "@/hooks/user-profile.hook";
import { updateUserProfile } from "@/queries/auth.queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/_authenticated/settings/profile/")({
  component: ProfileComponent,
});

const FILE_SIZE_LIMIT = 2 * 1024 * 1024;

const formSchema = z.object({
  name: z.string().optional(),
  username: z.string().optional(),
  image: z
    .instanceof(File)
    .refine((file) => file.type.includes("image"), {
      message: "Invalid file type, image file expected",
    })
    .refine((file) => file.size <= FILE_SIZE_LIMIT, {
      message: "File should not exceed 2MB",
    })
    .optional(),
});

export type ProfileFormSchema = z.infer<typeof formSchema>;

function ProfileComponent() {
  const [_, setIsUsernameAvailable] = useState(true);

  const { data: user, refetch, isFetching } = useUserProfile();

  const form = useForm<ProfileFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
    },
  });

  useEffect(() => {
    form.setValue("name", user?.name ?? "");
    form.setValue("username", user?.username ?? "");
  }, [form, user]);

  const mutation = useMutation({
    mutationKey: ["update-user-profile"],
    mutationFn: updateUserProfile,
    onMutate: () => setIsUsernameAvailable(true),
    onSuccess: (data) => {
      if (data.code === "CONFLICT") {
        setIsUsernameAvailable(false);
        toast.error("Username taken!");
      } else {
        refetch();
        toast.success("Successfully updated profile");
      }
    },
  });

  const onSubmit: SubmitHandler<ProfileFormSchema> = (data) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {isFetching ? (
          <div className="flex items-center gap-2 pb-6">
            <Skeleton className="size-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-34" />
              <Skeleton className="h-7 w-28" />
            </div>
          </div>
        ) : (
          user && <ProfileImageForm user={user} control={form.control} />
        )}
        <TextField
          control={form.control}
          fieldName="username"
          placeholder={isFetching ? "Loading..." : "e.g. johnwick"}
          className="lowercase"
          disabled={isFetching}
        />
        <TextField
          control={form.control}
          fieldName="name"
          placeholder={isFetching ? "Loading..." : "e.g. John Wick"}
          disabled={isFetching}
        />
        <Button
          type="submit"
          isLoading={mutation.isPending}
          className="w-full @lg/dash:w-38"
          disabled={isFetching}
        >
          Save Profile
        </Button>
      </form>
    </Form>
  );
}
