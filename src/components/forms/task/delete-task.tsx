import {
  AlertDialog,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteInfQueryData } from "@/lib/query.utils";
import { deleteTask } from "@/queries/task.queries";
import type { Task } from "@/types/task";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { useState } from "react";

interface PropsType {
  taskId: string;
}

export default function DeleteTask({ taskId }: PropsType) {
  const [checked, setChecked] = useState(false);
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["update-task"],
    mutationFn: deleteTask,
    onSuccess: ({ data: { data } }) => {
      queryClient.setQueryData<{ pages: { data: Task[] }[] }>(
        ["tasks"],
        (old) => deleteInfQueryData(old, data.deletedId, (old) => old.id)
      );

      setOpen(false);
      setChecked(!checked);
    },

    onError: console.error,
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="bg-card size-7 text-xs shadow-none"
        >
          <Trash className="size-3" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="w-full">Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            isLoading={mutation.isPending}
            className="w-full min-w-32"
            onClick={(e) => {
              e.preventDefault();
              mutation.mutate({ id: taskId });
            }}
          >
            Delete Task
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
