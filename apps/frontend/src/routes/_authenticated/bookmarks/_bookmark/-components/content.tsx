import TagsComponent from "./tags";
import EditorToolbar from "@/components/editor/toolbar";
import Image from "@/components/image";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import useDefaultEditor from "@/hooks/default-editor.hook";
import { updateInfQueryData } from "@/lib/query.utils";
import { editBookmark } from "@/queries/bookmark.queries";
import { useNavbarStore } from "@/stores/navbar.store";
import type { Bookmark } from "@/types/bookmark";
import { decryptBookmark } from "@/utils/encryption.utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EditorContent } from "@tiptap/react";
import clsx from "clsx";
import { format } from "date-fns";
import {
  BookOpenIcon,
  CalendarClockIcon,
  PencilLineIcon,
  SaveIcon,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface PropsType {
  bookmark: Bookmark;
}

const Switch = ({
  value,
  onChange,
  className,
}: {
  value: boolean;
  onChange: (state: boolean) => void;
  className?: string;
}) => {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => onChange(!value)}
      className={className}
    >
      {!value ? <PencilLineIcon /> : <BookOpenIcon />}
    </Button>
  );
};

export default function Content({ bookmark }: PropsType) {
  const [isEditable, setIsEditable] = useState(false);
  const { editor } = useDefaultEditor(
    "tsuika-editor",
    bookmark?.description ?? ""
  );
  const queryClient = useQueryClient();

  useEffect(() => editor.setEditable(false), [editor]);

  const mutation = useMutation({
    mutationKey: ["update-bookmark"],
    mutationFn: editBookmark,
    onSuccess: ({ data: { data } }) => {
      queryClient.setQueryData<Bookmark>(["bookmark", bookmark.id], (old) =>
        !old ? old : Object.assign({}, old, data)
      );

      if (bookmark.folderId) {
        queryClient.setQueryData<{ pages: { data: Bookmark[] }[] }>(
          ["bookmarks", `folder/${bookmark.folderId}`, ""],
          (old) => updateInfQueryData(old, data, (item) => item.id)
        );
      }

      toast.success("Bookmark updated!");
    },

    onError(error) {
      toast.error("Failed to update bookmark");
      console.error(error);
    },
  });

  const setEditableState = useCallback(
    (state: boolean) => {
      editor.setEditable(state);
      setIsEditable(state);
    },
    [editor]
  );

  const createdAt = new Date(bookmark.createdAt);
  const [content, setContent] = useState<Bookmark | null>(null);

  useEffect(() => {
    if (bookmark) {
      (async () => {
        if (bookmark.isEncrypted && bookmark.folderId) {
          const data = await decryptBookmark(bookmark, bookmark.folderId);
          setContent(data);
        } else setContent(bookmark);
      })();
    }
  }, [bookmark]);

  const setNavbarModule = useNavbarStore((s) => s.setCustomModule);
  const destroyNavbarModule = useNavbarStore((s) => s.destroyModule);

  useEffect(() => {
    setNavbarModule(
      <Switch
        value={isEditable}
        onChange={(state) => setEditableState(state)}
        className="size-8"
      />
    );

    return () => destroyNavbarModule();
  }, [destroyNavbarModule, isEditable, setEditableState, setNavbarModule]);

  if (!content) {
    return null;
  }

  return (
    <div className="relative mx-auto flex w-full max-w-3xl flex-col">
      <div className="space-y-2">
        <h1 className="text-foreground/90 text-3xl font-bold">
          {content.title}
        </h1>
        <div className="inline-flex items-center gap-2">
          <Popover>
            <div className="inline-flex items-center gap-2 font-medium">
              <PopoverTrigger asChild>
                <Button variant="secondary" size="icon" className="size-8">
                  <CalendarClockIcon size={14} />
                </Button>
              </PopoverTrigger>
              <span className="text-sm">
                {content?.updatedAt
                  ? formatDate(content.updatedAt)
                  : formatDate(content?.createdAt)}
              </span>
            </div>
            <PopoverContent className="size-auto p-0">
              <Calendar
                mode="single"
                defaultMonth={createdAt}
                selected={createdAt}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="mt-4 mb-4 space-y-2">
        <Image src={content.thumbnail} alt={content.title} />
      </div>
      {isEditable && (
        <div className="bg-card sticky top-16 mb-2 inline-flex shrink-0 justify-between overflow-x-auto rounded-lg p-1 pr-0">
          <EditorToolbar editor={editor} />
          <div className="sticky right-0 ml-4 bg-inherit pr-1 pl-2">
            <Button
              variant="outline"
              isLoading={mutation.isPending}
              size="sm"
              className="min-w-20"
              onClick={() =>
                mutation.mutate({
                  id: content.id,
                  payload: {
                    url: content.url,
                    title: content.title,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    description: (editor.storage as any).markdown.getMarkdown(),
                  },
                })
              }
            >
              <SaveIcon />
              Save
            </Button>
          </div>
        </div>
      )}

      {bookmark.description?.trim() !== "" || isEditable ? (
        <EditorContent
          selected
          editor={editor}
          className={clsx("h-full", isEditable && "bg-card rounded-xl p-4")}
        />
      ) : (
        <div className="text-muted-foreground text-center">
          Content Description is not provided, add Description to view it here
        </div>
      )}
      <hr className="my-4" />
      <TagsComponent tags={content?.tags ?? []} />
    </div>
  );
}

function formatDate(timestamp: Date | string | undefined) {
  return timestamp ? format(new Date(timestamp), "dd/MM/yy hh:mm:ss") : "";
}
