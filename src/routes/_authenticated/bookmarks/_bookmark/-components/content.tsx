import EditorToolbar from "@/components/editor/toolbar";
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
import type { Bookmark } from "@/types/bookmark";
import type { Tag } from "@/types/tag";
import { decryptBookmark } from "@/utils/encryption.utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { EditorContent } from "@tiptap/react";
import clsx from "clsx";
import { format } from "date-fns";
import {
  BookOpenIcon,
  CalendarClockIcon,
  PencilLineIcon,
  SaveIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PropsType {
  bookmark: Bookmark;
}

const Tags = ({ tags }: { tags: Tag[] }) => (
  <div
    className={clsx("mx-auto flex w-full flex-wrap gap-2", {
      hidden: tags?.length === 0,
    })}
  >
    {tags?.map((tag, idx) => (
      <Button
        variant="info"
        size="sm"
        key={`bookmar-details-tag-${idx}`}
        className="h-7 gap-0.5 sm:h-7"
        asChild
      >
        <Link
          to="/bookmarks/$slug"
          params={{
            slug: `tag/${tag.id}`,
          }}
        >
          {tag.name}
        </Link>
      </Button>
    ))}
  </div>
);

const Switch = ({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (state: boolean) => void;
}) => {
  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={() => onChange(!value)}
      className="size-8"
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

  const mutaton = useMutation({
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

  const setEditableState = (state: boolean) => {
    editor.setEditable(state);
    setIsEditable(state);
  };

  const createdAt = new Date(bookmark.createdAt);

  const [decryptedContent, setDecryptedContent] = useState<Bookmark | null>(
    null
  );

  useEffect(() => {
    if (bookmark) {
      (async () => {
        if (bookmark.isEncrypted && bookmark.folderId) {
          const data = await decryptBookmark(bookmark, bookmark.folderId);
          setDecryptedContent(data);
        } else setDecryptedContent(bookmark);
      })();
    }
  }, [bookmark]);

  if (!decryptedContent) {
    return null;
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col">
      <div className="inline-flex w-full items-end pb-2 select-none">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary" size="sm">
              {decryptedContent?.updatedAt && <CalendarClockIcon size={14} />}
              {decryptedContent?.updatedAt
                ? formatDate(decryptedContent.updatedAt)
                : formatDate(decryptedContent?.createdAt)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="size-auto p-0">
            <Calendar
              mode="single"
              defaultMonth={createdAt}
              selected={createdAt}
            />
          </PopoverContent>
        </Popover>
        <span className="ml-auto" role="separator" />
        {isEditable && (
          <Button
            variant="secondary"
            size="sm"
            className="mr-2"
            isLoading={mutaton.isPending}
            onClick={() =>
              mutaton.mutate({
                id: decryptedContent.id,
                payload: {
                  url: decryptedContent.url,
                  title: decryptedContent.title,
                  description:
                    // FIX: Add type declarations later
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (editor.storage as any).markdown.getMarkdown(),
                },
              })
            }
          >
            <SaveIcon />
            Save
          </Button>
        )}
        {/* NOTE: Allow delete bookmark from here */}
        {/* <Button variant="destructive" size="sm" className="mr-2"> */}
        {/*   <TrashIcon /> */}
        {/*   Delete Bookmark */}
        {/* </Button> */}
        <Switch
          value={isEditable}
          onChange={(state) => setEditableState(state)}
        />
      </div>
      <div className="mb-6 space-y-2">
        <div className="aspect-video" role="banner">
          <img
            src={decryptedContent?.thumbnail}
            alt={decryptedContent?.title}
            className="size-full rounded-lg object-cover select-none"
          />
        </div>
        <Tags tags={decryptedContent?.tags ?? []} />
      </div>
      {isEditable && (
        <div className="bg-card mb-2 inline-flex justify-between overflow-x-auto rounded-lg p-1">
          <EditorToolbar editor={editor} />
          <Button
            variant="secondary"
            size="icon"
            className="hidden sm:inline-flex"
            onClick={() => setEditableState(false)}
          >
            <XIcon />
          </Button>
        </div>
      )}
      <EditorContent
        selected
        editor={editor}
        className={clsx(isEditable && "bg-card rounded-xl p-4")}
      />
    </div>
  );
}

function formatDate(timestamp: Date | string | undefined) {
  return timestamp ? format(new Date(timestamp), "dd/MM hh:mm:ss") : "";
}
