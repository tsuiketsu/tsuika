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
import type { Task } from "@/types/task";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

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

    onError: console.error,
  });

  return (
    <>
      <Checkbox checked={checked} onClick={() => setOpen(true)} />
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{task.note}</AlertDialogTitle>
            <AlertDialogDescription className="line-clamp-3">
              {task.content.title}
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
