import {
  AlertDialog,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { updateInfQueryData } from "@/lib/query.utils";
import { updateTaskStatus } from "@/queries/task.queries";
import type { ErrorResponse } from "@/types";
import type { Task } from "@/types/task";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";

interface PropsType {
  task: Task;
}

export default function TaskCheckbox({ task }: PropsType) {
  const [checked, setChecked] = useState(false);
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["update-task"],
    mutationFn: updateTaskStatus,
    onSuccess: ({ data: { data } }) => {
      queryClient.setQueryData<{ pages: { data: Task[] }[] }>(
        ["tasks"],
        (old) => updateInfQueryData(old, data as Task, (old) => old.id)
      );

      setOpen(false);
      setChecked(!checked);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      if (error.status === 403) {
        toast.error(error.response?.data.message || "Failed to update task");
      }

      console.error(error);
    },
  });

  return (
    <>
      <Checkbox
        checked={checked}
        onClick={() => setOpen(true)}
        className="ml-auto"
      />
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{task.content.title}</AlertDialogTitle>
            <AlertDialogDescription className="line-clamp-3">
              {task.content.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                isLoading={mutation.isPending}
                className="min-w-32"
                onClick={(e) => {
                  e.preventDefault();
                  mutation.mutate({
                    id: task.id,
                    status: checked ? "pending" : task.status,
                  });
                }}
              >
                Mark as {checked ? "un-done" : "done"}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
