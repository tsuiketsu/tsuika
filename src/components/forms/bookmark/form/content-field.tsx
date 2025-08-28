import EditorToolbar from "@/components/editor/toolbar";
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
import {
  ChevronDown,
  EditIcon,
  LoaderCircle,
  MaximizeIcon,
  MinimizeIcon,
  SaveIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { type Control } from "react-hook-form";

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
                "rounded-lg border",
                isExtended
                  ? "bg-secondary fixed inset-0 z-10" + " overflow-y-auto"
                  : "dark:bg-card relative overflow-hidden bg-transparent p-3"
              )}
            >
              <div className="absolute top-1 right-1 inline-flex gap-1 transition-opacity duration-200">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setIsTextExpand((prev) => !prev)}
                  className={clsx("active:scale-none", {
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
                  variant="outline"
                  size="icon"
                  className={clsx({ hidden: isExtended })}
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
                  <div className="bg-secondary sticky top-0.5 mx-1 inline-flex gap-2 overflow-x-auto rounded-lg p-2">
                    <EditorToolbar editor={editor} />
                    <div className="bg-secondary fixed right-6 bottom-4 inline-flex gap-2 rounded-xl p-2 sm:relative sm:right-0 sm:bottom-0 sm:ml-auto sm:bg-none sm:p-0">
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
                  value={value}
                  editor={editor}
                  onInput={() =>
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange((editor.storage as any).markdown.getMarkdown())
                  }
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
