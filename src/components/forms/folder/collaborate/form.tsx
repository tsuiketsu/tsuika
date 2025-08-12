import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

    if (!identifier) {
      toast.error("You must enter either e-mail or username");
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
      >
        <UserPlus />
      </Button>
    </form>
  );
};

export default AddCollaborativeUserForm;
