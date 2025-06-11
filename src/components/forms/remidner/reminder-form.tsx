import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  reminderPriorities,
  reminderStatus,
  reminderTypes,
  type Reminder,
  type ReminderInsertSchema,
  type ReminderPriority,
  type ReminderStatus,
  type ReminderType,
} from "@/types/remidner";
import { combineDateAndTime, splitDateAndTime } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  note: z.string(),
  priority: z.enum(
    Object.values(reminderPriorities) as [
      ReminderPriority,
      ...ReminderPriority[],
    ]
  ),
  status: z.enum(
    Object.values(reminderStatus) as [ReminderStatus, ...ReminderStatus[]]
  ),
  remindDate: z
    .object(
      {
        date: z.string(),
        time: z.string(),
      },
      { message: "You must pick date and time to continue" }
    )
    .refine((v) => v.date !== "" && v.time !== "", {
      message: "You must pick date and time to continue",
    }),
  type: z.enum(
    Object.values(reminderTypes) as [ReminderType, ...ReminderType[]]
  ),
});

const getButtonVariant = (value: ReminderPriority) => {
  switch (value) {
    case "low":
      return "info";
    case "normal":
      return "default";
    case "high":
      return "destructive";
  }
};

interface PropsType {
  data?: Reminder;
  type: ReminderType;
  onSubmit: (payload: ReminderInsertSchema) => void;
}

export default function ReminderForm({ type, data, onSubmit }: PropsType) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: data
      ? {
          ...data,
          remindDate: splitDateAndTime(data.remindDate),
        }
      : {
          type,
          note: "",
          priority: "normal",
          status: "pending",
          remindDate: { date: "", time: "10:30:00" },
        },
  });

  const _onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (payload) => {
    const { date, time } = payload.remindDate;

    onSubmit({
      ...payload,
      remindDate: combineDateAndTime(date, time).toISOString(),
    });
  };

  return (
    <Form {...form}>
      <form
        id="reminder-form"
        onSubmit={form.handleSubmit(_onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="grid grid-cols-3 gap-4">
                  {Object.values(reminderPriorities).map((value, idx) => (
                    <Button
                      key={`value-${idx}`}
                      variant={
                        field.value === value
                          ? getButtonVariant(value)
                          : "outline"
                      }
                      size="sm"
                      className={clsx("capitalize", {
                        "rounded-full": field.value === value,
                      })}
                      onClick={() => field.onChange(value)}
                    >
                      {value}
                    </Button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="remindDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date &amp; Time</FormLabel>
              <FormControl>
                <DateTimePicker
                  value={field.value}
                  onValueChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="capitalize">
                Note <span className="text-muted-foreground">(optional)</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Finish reading before assignment"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
