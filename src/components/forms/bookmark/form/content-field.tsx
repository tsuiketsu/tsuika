import { Button } from "@/components/ui/button.tsx";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import useDefaultEditor from "@/hooks/default-editor.hook.ts";
import { type BookmarkFormSchemaType } from "@/types/bookmark";
import { EditorContent } from "@tiptap/react";
import clsx from "clsx";
import { ExpandIcon, ShrinkIcon } from "lucide-react";
import { useState } from "react";
import { type Control } from "react-hook-form";

export default function ContentField({
  description,
  control,
}: {
  description: string | undefined;
  control: Control<BookmarkFormSchemaType>;
}) {
  const [isExtended, setIsExtended] = useState(false);

  const editor = useDefaultEditor(
    "bookmark-form-description",
    description || ""
  );

  return (
    <FormField
      control={control}
      name="description"
      render={({ field: { value, onChange, ...field } }) => (
        <FormItem className="w-full">
          <FormLabel>Description</FormLabel>
          <FormControl>
            <div
              className={clsx(
                "bg-card rounded-lg border p-2",
                isExtended ? "fixed inset-0 z-10 overflow-y-auto" : "relative"
              )}
            >
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-1 right-1"
                onClick={() => setIsExtended((prev) => !prev)}
              >
                {isExtended ? <ShrinkIcon /> : <ExpandIcon />}
              </Button>
              <EditorContent
                value={value}
                editor={editor}
                onInput={() =>
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange((editor.storage as any).markdown.getMarkdown())
                }
                className={clsx("min-h-30", {
                  "bg-secondary mx-auto mt-40 min-h-screen max-w-3xl rounded-xl border p-4":
                    isExtended,
                })}
                {...field}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
