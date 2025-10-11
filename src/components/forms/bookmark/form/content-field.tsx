import LazyBoundary from "@/components/lazy-boundary";
import { Button, buttonVariants } from "@/components/ui/button.tsx";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import AIStreamWriter from "@/features/genai/components/text";
import useDefaultEditor from "@/hooks/default-editor.hook.ts";
import { type BookmarkFormSchemaType } from "@/types/bookmark";
import { isValidURL } from "@/utils";
import { Editor, EditorContent } from "@tiptap/react";
import type { VariantProps } from "class-variance-authority";
import clsx from "clsx";
import {
  ChevronDown,
  EditIcon,
  LoaderCircle,
  MaximizeIcon,
  MinimizeIcon,
  SaveIcon,
} from "lucide-react";
import { lazy, useEffect, useRef, useState } from "react";
import { Controller, useWatch, type Control } from "react-hook-form";
import { toast } from "sonner";

// Lazy Imports
const EditorToolbar = lazy(() => import("@/components/editor/toolbar"));

const AISummaryGenerator = ({
  editor,
  control,
  variant,
  className,
}: {
  editor: Editor;
  control: Control<BookmarkFormSchemaType>;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  className?: string;
}) => {
  const url = useWatch({ control, name: "url" });

  return (
    <Controller
      control={control}
      name="description"
      render={({ field }) => (
        <AIStreamWriter
          variant={variant}
          prompt={url}
          className={className}
          onClick={() => {
            editor.commands.setContent("");
            field.onChange("");
          }}
          onValueChange={(value) => {
            const setValue = (text: string) => {
              editor.commands.setContent(text);
              field.onChange(text);
            };

            if (!value || value.includes("FAILED")) {
              toast.error(
                "Couldn't summarize the content. Please try another URL."
              );
              setValue("");
            } else {
              setValue(value);
            }
          }}
        />
      )}
    />
  );
};

export default function ContentField({
  description,
  control,
  isLoading,
}: {
  description: string | undefined;
  control: Control<BookmarkFormSchemaType>;
  isLoading: boolean;
}) {
  const [isExtended, setIsExtended] = useState(false);
  const [isTextExpand, setIsTextExpand] = useState(false);
  const [isShowMoreVisible, setIsShowMoreVisible] = useState(false);

  const { editor, onValueChange: onEditorvalueChange } = useDefaultEditor(
    "bookmark-form-description",
    description || ""
  );

  const url = useWatch({ control, name: "url" });
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
      render={({ field: { onChange, ...field } }) => (
        <FormItem className="group w-full">
          <FormLabel>Description</FormLabel>
          <FormControl>
            <div
              className={clsx(
                "z-10 rounded-lg border",
                isExtended
                  ? "bg-secondary fixed inset-0 z-20 overflow-y-auto"
                  : "dark:bg-card relative overflow-hidden bg-transparent p-3"
              )}
            >
              <div className="absolute right-1 bottom-1 z-20 inline-flex gap-1 transition-opacity duration-200">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setIsTextExpand((prev) => !prev)}
                  className={clsx("border active:scale-none", {
                    hidden: !isShowMoreVisible || isExtended,
                  })}
                >
                  <ChevronDown
                    className={clsx("transition-transform", {
                      "-rotate-180": isTextExpand,
                    })}
                  />
                </Button>
                {isValidURL(url) && !isExtended && (
                  <AISummaryGenerator
                    variant="secondary"
                    editor={editor}
                    control={control}
                  />
                )}
                <Button
                  variant="secondary"
                  size="icon"
                  className={clsx({ hidden: isExtended }, "border")}
                  onClick={() => {
                    setIsExtended((prev) => !prev);
                    if (isShowMoreVisible) {
                      editor.setEditable(!isExtended);
                    }
                  }}
                >
                  {isShowMoreVisible ? <EditIcon /> : <MaximizeIcon />}
                </Button>
              </div>
              <div
                className={clsx(
                  "mx-auto flex max-w-3xl flex-col gap-2",
                  isExtended && "mt-40"
                )}
              >
                {isExtended && (
                  <div className="bg-secondary sticky top-0.5 z-10 mx-1 inline-flex gap-2 overflow-x-auto rounded-lg p-2">
                    <LazyBoundary>
                      <EditorToolbar editor={editor} />
                    </LazyBoundary>
                    <div className="bg-secondary fixed right-6 bottom-4 inline-flex gap-2 rounded-xl p-2 sm:relative sm:right-0 sm:bottom-0 sm:ml-auto sm:bg-none sm:p-0">
                      {isValidURL(url) && (
                        <AISummaryGenerator
                          variant="outline"
                          editor={editor}
                          control={control}
                        />
                      )}
                      <Button
                        variant="outline"
                        size="icon"
                        className="ml-auto"
                        onClick={() => setIsExtended(false)}
                      >
                        <MinimizeIcon />
                      </Button>
                      <Button
                        type="submit"
                        form="bookmark-form"
                        size="icon"
                        isLoading={isLoading}
                        customLoader={<LoaderCircle className="animate-spin" />}
                      >
                        <SaveIcon />
                      </Button>
                    </div>
                  </div>
                )}
                <EditorContent
                  innerRef={editorRef}
                  editor={editor}
                  onPaste={onEditorvalueChange(onChange)}
                  onInput={onEditorvalueChange(onChange)}
                  className={clsx(
                    isExtended
                      ? "bg-card min-h-screen rounded-xl border p-4"
                      : !isTextExpand && isShowMoreVisible && "line-clamp-6"
                  )}
                  {...field}
                />
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
