import TaskForm from "./task-form";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { insertInfQueryData } from "@/lib/query.utils";
import type { Setter } from "@/lib/utils";
import { insertTask } from "@/queries/task.queries";
import type { Task, TaskType } from "@/types/task";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface PropsType {
  contentType: TaskType;
  contentId: string;
  customTrigger?: React.ReactNode;
  open: boolean;
  setOpen: Setter<boolean>;
  isButtonHidden?: boolean;
}

export default function InsertTask({
  contentType,
  contentId,
  customTrigger,
  open,
  setOpen,
  isButtonHidden = false,
}: PropsType) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["insert-task", contentType],
    mutationFn: insertTask,
    onSuccess: ({ data: { data } }) => {
      queryClient.setQueryData<{ pages: { data: Task[] }[] }>(
        ["tasks", { type: contentType }],
        (old) => insertInfQueryData(old, data)
      );

      toast.success("Successfully added task");
      setOpen(false);
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
      open={open}
      onOpenChange={setOpen}
      triggerButton={
        customTrigger ??
        (!isButtonHidden ? (
          <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
            <Plus size={20} />
          </Button>
        ) : null)
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
