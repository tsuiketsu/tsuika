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
import { ChevronDown, EditIcon, ExpandIcon, ShrinkIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { type Control } from "react-hook-form";

export default function ContentField({
  description,
  control,
}: {
  description: string | undefined;
  control: Control<BookmarkFormSchemaType>;
}) {
  const [isExtended, setIsExtended] = useState(false);
  const [isTextExpand, setIsTextExpand] = useState(false);
  const [isShowMoreVisible, setIsShowMoreVisible] = useState(false);

  const editor = useDefaultEditor(
    "bookmark-form-description",
    description || ""
  );

  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      if (editorRef.current.clientHeight > 148) {
        setIsShowMoreVisible(true);
        editor.setEditable(false);
      }
    }
  }, [editor]);

  return (
    <FormField
      control={control}
      name="description"
      render={({ field: { value, onChange, ...field } }) => (
        <FormItem className="group w-full">
          <FormLabel>Description</FormLabel>
          <FormControl>
            <div
              className={clsx(
                "bg-card rounded-lg border p-2",
                isExtended
                  ? "fixed inset-0 z-10" + " overflow-y-auto"
                  : "relative overflow-hidden"
              )}
            >
              <div
                className={clsx(
                  "absolute top-1 right-1 inline-flex gap-1 transition-opacity duration-200",
                  !isExtended && "opacity-0 group-hover:opacity-100"
                )}
              >
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setIsTextExpand((prev) => !prev)}
                  className={clsx("size-7 active:scale-none", {
                    hidden: !isShowMoreVisible || isExtended,
                  })}
                >
                  <ChevronDown
                    className={clsx("transition-transform", {
                      "-rotate-180": isTextExpand,
                    })}
                  />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="size-7"
                  onClick={() => {
                    setIsExtended((prev) => !prev);
                    if (isShowMoreVisible) {
                      editor.setEditable(!isExtended);
                    }
                  }}
                >
                  {isExtended ? (
                    <ShrinkIcon />
                  ) : isShowMoreVisible ? (
                    <EditIcon />
                  ) : (
                    <ExpandIcon />
                  )}
                </Button>
              </div>
              <EditorContent
                innerRef={editorRef}
                value={value}
                editor={editor}
                onInput={() =>
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange((editor.storage as any).markdown.getMarkdown())
                }
                className={clsx(
                  "min-h-30",
                  isExtended
                    ? "bg-secondary mx-auto mt-40 min-h-screen max-w-3xl rounded-xl border p-4"
                    : !isTextExpand && isShowMoreVisible && "line-clamp-6"
                )}
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
