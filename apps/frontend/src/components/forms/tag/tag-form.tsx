import { buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  TagInsertSchema,
  type Tag,
  type TagInsertSchemaType,
} from "@/types/tag";
import { getTextColor } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Hash } from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { useForm } from "react-hook-form";

interface PropsType {
  data?: Tag;
  onSubmit: (payload: TagInsertSchemaType) => void;
}

export default function TagForm({ data, onSubmit }: PropsType) {
  const form = useForm<TagInsertSchemaType>({
    resolver: zodResolver(TagInsertSchema),
    defaultValues: data
      ? Object.fromEntries(
          Object.entries(data).filter(([_, value]) => value != null)
        )
      : {},
  });

  return (
    <Form {...form}>
      <form
        id="tag-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tag Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., study, linux, foss, android"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <div className="inline-flex items-center gap-2">
                Preview:
                <div
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-6 gap-1 rounded-full"
                  )}
                  style={{
                    backgroundColor: field.value,
                    color: field.value ? getTextColor(field.value) : "inherit",
                  }}
                >
                  <Hash size={16} />
                  <span>{form.watch("name") || "Tsuika"}</span>
                </div>
              </div>
              <FormControl>
                <HexColorPicker
                  color={field.value}
                  style={{ width: "auto" }}
                  onChange={field.onChange}
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
