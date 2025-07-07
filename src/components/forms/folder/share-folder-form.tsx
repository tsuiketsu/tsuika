import TextField from "@/components/primitives/form/text-field";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import {
  Form,
  FormMessage,
  FormLabel,
  FormItem,
  FormField,
  FormControl,
} from "@/components/ui/form";
import type { SharedFolder } from "@/types/folder";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().optional(),
  note: z.string().optional(),
  expires_at: z
    .object(
      {
        date: z.string(),
        time: z.string(),
      },
      { message: "You must pick date and time to continue" }
    )
    .refine((v) => v.date !== "" && v.time !== "", {
      message: "You must pick date and time to continue",
    })
    .optional(),
});

export type ShareFolderFormSchema = z.infer<typeof formSchema>;

interface PropsType {
  data?: SharedFolder;
  onSubmit: (payload: ShareFolderFormSchema) => void;
}

export default function ShareFolderForm({ onSubmit }: PropsType) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  return (
    <Form {...form}>
      <form
        id="share-folder-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <TextField
          type="input"
          control={form.control}
          placeholder="My Shared Bookmarks"
          fieldName="title"
        />

        <TextField
          type="textarea"
          control={form.control}
          placeholder="Explore this collection of my favorite website links, handpicked for you to discover and enjoy."
          fieldName="note"
          className="min-h-20"
        />
        <FormField
          control={form.control}
          name="expires_at"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiry Time</FormLabel>
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
      </form>
    </Form>
  );
}
