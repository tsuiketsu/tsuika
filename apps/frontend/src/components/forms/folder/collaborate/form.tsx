import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "@/lib/auth-client";
import {
  addUserToFolder,
  invalidateCollaboratorsData,
} from "@/queries/collab-folder.queries";
import { userRoles } from "@/types/folder";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PropsType {
  folderId: string;
}

const AddCollaborativeUserForm = ({ folderId }: PropsType) => {
  const [identifier, setIdentifier] = useState("");

  const queryClient = useQueryClient();
  const profile = useSession();

  const mutation = useMutation({
    mutationKey: ["add-user-to-folder"],
    mutationFn: addUserToFolder,
    onSuccess: () => {
      invalidateCollaboratorsData(queryClient, folderId);
    },
    onError: (error: AxiosError<{ code: string }>) => {
      if (error.response?.data.code === "CONFLICT") {
        toast.error("User already exists");
      } else {
        toast.error("Failed to add user");
      }
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const user = profile.data?.user;

    if (!user) {
      toast.error("Something went wrong, user not found");
      return;
    }

    if (!identifier) {
      toast.error("You must enter either e-mail or username");
      return;
    }

    if ([user.username, user.email].includes(identifier)) {
      toast.error("You can't add your self");
      return;
    }

    mutation.mutate({
      identifier,
      folderId,
      role: userRoles.VIEWER,
    });
  };

  return (
    <form className="inline-flex w-full items-center gap-2" onSubmit={onSubmit}>
      <Input
        placeholder="Add members by e-mail or username"
        onInput={(e) => setIdentifier(e.currentTarget.value.trim())}
      />
      <Button
        type="submit"
        size="icon"
        isLoading={mutation.isPending}
        disabled={!identifier || identifier.trim() === ""}
        className="size-12 sm:size-8"
      >
        <UserPlus />
      </Button>
    </form>
  );
};

export default AddCollaborativeUserForm;
