import TaskForm from "./task-form";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { insertInfQueryData } from "@/lib/query.utils";
import { insertTask } from "@/queries/task.queries";
import type { Task, TaskType } from "@/types/task";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { Plus } from "lucide-react";
import { useRef, type RefObject } from "react";
import { toast } from "sonner";

interface PropsType {
  contentType: TaskType;
  contentId: string;
  customTrigger?: React.ReactNode;
  triggerRef?: RefObject<HTMLButtonElement | null>;
}

export default function InsertTask({
  contentType,
  contentId,
  customTrigger,
  triggerRef,
}: PropsType) {
  const queryClient = useQueryClient();
  const localRef = useRef<HTMLButtonElement>(null);
  const ref = triggerRef ?? localRef;

  const mutation = useMutation({
    mutationKey: ["insert-task", contentType],
    mutationFn: insertTask,
    onSuccess: ({ data: { data } }) => {
      queryClient.setQueryData<{ pages: { data: Task[] }[] }>(
        ["tasks", { type: contentType }],
        (old) => insertInfQueryData(old, data)
      );

      toast.success("Successfully added task");
      ref.current?.click();
    },

    onError: (error) => {
      console.error(error);
      toast.error("Failed to add task");
    },
  });

  return (
    <Modal
      form="task-form"
      title="Create Task"
      desc="When you're happy with it, just hit the Create button"
      triggerButton={
        customTrigger ?? (
          <Button
            variant="ghost"
            size="icon"
            className={clsx({ hidden: triggerRef })}
            ref={ref}
          >
            <Plus size={20} />
          </Button>
        )
      }
      isPending={mutation.isPending}
      btnTxt="Create Task"
    >
      <TaskForm
        type={contentType}
        onSubmit={(payload) => mutation.mutate({ contentId, payload })}
      />
    </Modal>
  );
}
