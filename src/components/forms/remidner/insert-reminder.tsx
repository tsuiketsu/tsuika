import ReminderForm from "./reminder-form";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { insertInfQueryData } from "@/lib/query.utils";
import { insertReminder } from "@/queries/reminder.queries";
import type { Reminder, ReminderType } from "@/types/remidner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { Plus } from "lucide-react";
import { useRef, type RefObject } from "react";
import { toast } from "sonner";

interface PropsType {
  contentType: ReminderType;
  contentId: string;
  customTrigger?: React.ReactNode;
  triggerRef?: RefObject<HTMLButtonElement | null>;
}

export default function InsertReminder({
  contentType,
  contentId,
  customTrigger,
  triggerRef,
}: PropsType) {
  const queryClient = useQueryClient();
  const localRef = useRef<HTMLButtonElement>(null);
  const ref = triggerRef ?? localRef;

  const mutation = useMutation({
    mutationKey: ["insert-reminder", contentType],
    mutationFn: insertReminder,
    onSuccess: ({ data: { data } }) => {
      queryClient.setQueryData<{ pages: { data: Reminder[] }[] }>(
        ["reminders", { type: contentType }],
        (old) => insertInfQueryData(old, data)
      );

      toast.success("Successfully added reminder");
      ref.current?.click();
    },

    onError: (error) => {
      console.error(error);
      toast.error("Failed to add reminder");
    },
  });

  return (
    <Modal
      form="reminder-form"
      title="Create Reminder"
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
      btnTxt="Remind Me"
    >
      <ReminderForm
        type={contentType}
        onSubmit={(payload) => mutation.mutate({ contentId, payload })}
      />
    </Modal>
  );
}
