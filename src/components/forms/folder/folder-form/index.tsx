import { type FolderInsertSchemaType, folderInsertSchema } from "../types";
import EncryptionOptions from "./encryption-options";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { Folder } from "@/types/folder";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface PropsType {
  data?: Folder;
  onSubmit: (payload: FolderInsertSchemaType) => void;
}

export default function FolderForm({ data, onSubmit }: PropsType) {
  const form = useForm<FolderInsertSchemaType>({
    resolver: zodResolver(folderInsertSchema),
    defaultValues: {
      name: data?.name ?? "",
      description: data?.description ?? "",
      isEncrypted: false,
      password: "",
      isLinkPreview: data?.settings?.isLinkPreview,
      encryptionPreset: "standard",
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

        {!data?.settings?.keyDerivation && (
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
        )}

        {isEnabled && !data?.settings?.keyDerivation && (
          <>
            <hr />
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
                      placeholder={Array.from({ length: 32 })
                        .fill("•")
                        .join(" ")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="encryptionPreset"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <EncryptionOptions
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <hr />
          </>
        )}

        {(isEnabled || Boolean(data?.settings?.keyDerivation)) && (
          <FormField
            control={form.control}
            name="isLinkPreview"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormControl className="inline-flex w-full items-start justify-between text-sm font-medium">
                  <div>
                    <div>
                      <span>Enable link preview</span>
                      <p className="text-muted-foreground w-11/12 text-xs">
                        Generates link previews using an external server. This
                        does not break encryption but may go against strict
                        end-to-end encryption philosophy.
                      </p>
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={onChange}
                      {...field}
                    />
                  </div>
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
