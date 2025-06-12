import ReminderForm from "./reminder-form";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { updateInfQueryData } from "@/lib/query.utils";
import { updateReminder } from "@/queries/reminder.queries";
import type { Reminder, ReminderType } from "@/types/reminder";
import { Slot } from "@radix-ui/react-slot";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { Plus } from "lucide-react";
import { useRef, type RefObject } from "react";
import { toast } from "sonner";

interface PropsType {
  reminder: Reminder;
  contentType: ReminderType;
  customTrigger?: React.ReactNode;
  triggerRef?: RefObject<HTMLButtonElement | null>;
}

export default function UpdateReminder({
  reminder,
  contentType,
  customTrigger,
  triggerRef,
}: PropsType) {
  const queryClient = useQueryClient();
  const localRef = useRef<HTMLButtonElement>(null);
  const ref = triggerRef ?? localRef;

  const mutation = useMutation({
    mutationKey: ["update-reminder", contentType],
    mutationFn: updateReminder,
    onSuccess: ({ data: { data } }) => {
      queryClient.setQueryData<{ pages: { data: Reminder[] }[] }>(
        ["reminders"],
        (old) => updateInfQueryData(old, data, (old) => old.id)
      );

      toast.success("Successfully updated reminder");
      ref.current?.click();
    },

    onError: (error) => {
      console.error(error);
      toast.error("Failed to updated reminder");
    },
  });

  return (
    <Modal
      form="reminder-form"
      title="Update Reminder"
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
      <ReminderForm
        type={contentType}
        data={reminder}
        onSubmit={(payload) => mutation.mutate({ id: reminder.id, payload })}
      />
    </Modal>
  );
}
