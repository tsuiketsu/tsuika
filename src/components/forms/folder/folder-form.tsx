import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FolderInsertSchema,
  type Folder,
  type FolderInsertSchemaType,
} from "@/types/folder";
import { arktypeResolver } from "@hookform/resolvers/arktype";
import { useForm } from "react-hook-form";

interface PropsType {
  data?: Folder;
  onSubmit: (payload: FolderInsertSchemaType) => void;
}

export default function FolderForm({ data, onSubmit }: PropsType) {
  const form = useForm<FolderInsertSchemaType>({
    resolver: arktypeResolver(FolderInsertSchema),
    defaultValues: data
      ? Object.fromEntries(
          Object.entries(data).filter(([_, value]) => value != null)
        )
      : {},
  });

  return (
    <Form {...form}>
      <form
        id="folder-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Project Ideas" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Folder to store some project ideas"
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
