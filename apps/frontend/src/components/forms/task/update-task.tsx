import TaskForm from "./task-form";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { mutationError, updateInfQueryData } from "@/lib/query.utils";
import { updateTask } from "@/queries/task.queries";
import type { Task, TaskType } from "@/types/task";
import { Slot } from "@radix-ui/react-slot";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { Plus } from "lucide-react";
import { useRef, type RefObject } from "react";
import { toast } from "sonner";

interface PropsType {
  task: Task;
  contentType: TaskType;
  customTrigger?: React.ReactNode;
  triggerRef?: RefObject<HTMLButtonElement | null>;
}

export default function UpdateTask({
  task,
  contentType,
  customTrigger,
  triggerRef,
}: PropsType) {
  const queryClient = useQueryClient();
  const localRef = useRef<HTMLButtonElement>(null);
  const ref = triggerRef ?? localRef;

  const mutation = useMutation({
    mutationKey: ["update-task", contentType],
    mutationFn: updateTask,
    onSuccess: ({ data: { data } }) => {
      queryClient.setQueryData<{ pages: { data: Task[] }[] }>(
        ["tasks"],
        (old) => updateInfQueryData(old, data, (old) => old.id)
      );

      toast.success("Successfully updated task");
      ref.current?.click();
    },
    onError: mutationError("Failed to update task"),
  });

  return (
    <Modal
      form="task-form"
      title="Update task"
      desc="When you're happy with it, just hit the Create button"
      triggerButton={
        <Slot ref={ref}>
          {customTrigger ?? (
            <Button
              variant="ghost"
              size="icon"
              className={clsx({ hidden: triggerRef })}
            >
              <Plus size={20} />
            </Button>
          )}
        </Slot>
      }
      isPending={mutation.isPending}
      btnTxt="Update"
    >
      <TaskForm
        type={contentType}
        data={task}
        onSubmit={(payload) => mutation.mutate({ id: task.id, payload })}
      />
    </Modal>
  );
}
