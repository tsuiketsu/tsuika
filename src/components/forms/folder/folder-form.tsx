import { type FolderInsertSchemaType, folderInsertSchema } from "./types";
import { Checkbox } from "@/components/ui/checkbox";
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
import type { Folder } from "@/types/folder";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface PropsType {
  data?: Folder;
  onSubmit: (payload: FolderInsertSchemaType) => void;
}

export default function FolderForm({ onSubmit }: PropsType) {
  const form = useForm<FolderInsertSchemaType>({
    resolver: zodResolver(folderInsertSchema),
    defaultValues: {
      name: "",
      description: "",
      isEncrypted: false,
      password: "",
    },
  });

  const [isEnabled, setIsEnabled] = useState(false);

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
        <FormField
          control={form.control}
          name="isEncrypted"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="inline-flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(v) => {
                      setIsEnabled(v as boolean);
                      field.onChange(v);
                    }}
                  />
                  Password Encryption
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        {isEnabled && (
          <FormField
            disabled={!isEnabled}
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={Array.from({ length: 32 }).fill("•").join(" ")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </form>
    </Form>
  );
}
