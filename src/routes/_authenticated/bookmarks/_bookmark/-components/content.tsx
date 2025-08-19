import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useDefaultEditor from "@/hooks/default-editor.hook";
import { updateInfQueryData } from "@/lib/query.utils";
import { editBookmark } from "@/queries/bookmark.queries";
import type { LucideIconElement } from "@/types";
import type { Bookmark } from "@/types/bookmark";
import type { Tag } from "@/types/tag";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EditorContent } from "@tiptap/react";
import clsx from "clsx";
import { format } from "date-fns";
import { EditIcon, EyeIcon, HashIcon, PencilLineIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PropsType {
  bookmark: Bookmark;
}

const Tags = ({ tags }: { tags: Tag[] }) => (
  <div
    className={clsx(
      "mx-auto flex w-full max-w-3/4 flex-wrap justify-center gap-2 pb-6",
      { hidden: tags?.length === 0 }
    )}
  >
    {tags?.map((tag, idx) => (
      <Badge
        variant="secondary"
        key={`bookmar-details-tag-${idx}`}
        className="gap-0.5"
      >
        <span>
          <HashIcon size={12} />
        </span>
        {tag.name}
      </Badge>
    ))}
  </div>
);

const SwitchButton = (props: {
  onClick: () => void;
  icon: LucideIconElement;
}) => (
  <button
    type="button"
    className="flex h-6 w-1/2 cursor-pointer items-center justify-center"
    onClick={props.onClick}
  >
    <props.icon size={14} className="z-10 text-white mix-blend-exclusion" />
  </button>
);

const Switch = ({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (state: boolean) => void;
}) => {
  return (
    <div className="bg-card relative inline-flex w-16 overflow-hidden rounded-lg border p-0.5">
      <SwitchButton icon={EyeIcon} onClick={() => onChange(false)} />
      <SwitchButton icon={EditIcon} onClick={() => onChange(true)} />
      <span
        className={clsx(
          "bg-secondary absolute h-6 w-1/2 rounded-md",
          value && "right-0.5"
        )}
      />
    </div>
  );
};

export default function Content({ bookmark }: PropsType) {
  const [isEditable, setIsEditable] = useState(false);
  const editor = useDefaultEditor("tsuika-editor", bookmark?.description ?? "");
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

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col">
      <div className="inline-flex w-full items-end pb-2 select-none">
        <Badge className="gap-1">
          {bookmark?.updatedAt && <PencilLineIcon size={14} />}
          {bookmark?.updatedAt
            ? formatDate(bookmark.updatedAt)
            : formatDate(bookmark?.createdAt)}
        </Badge>

        <span className="ml-auto" role="separator" />
        {isEditable && (
          <Button
            variant="secondary"
            className="mr-2 h-7"
            isLoading={mutaton.isPending}
            onClick={() =>
              mutaton.mutate({
                id: bookmark.id,
                payload: {
                  url: bookmark.url,
                  title: bookmark.title,
                  description:
                    // FIX: Add type declarations later
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (editor.storage as any).markdown.getMarkdown(),
                },
              })
            }
          >
            Save
          </Button>
        )}
        <Switch
          value={isEditable}
          onChange={(state) => {
            setIsEditable(state);
            editor.setEditable(state);
          }}
        />
      </div>
      <div className="mb-6 aspect-video" role="banner">
        <img
          src={bookmark?.thumbnail}
          alt={bookmark?.title}
          className="size-full rounded-xl object-cover select-none"
        />
      </div>
      <h2
        className={clsx(
          "mx-auto max-w-11/12 text-center text-2xl font-bold",
          (bookmark?.tags?.length || 0) > 0 ? "mb-2" : "mb-6"
        )}
      >
        {bookmark?.title}
      </h2>
      <Tags tags={bookmark?.tags ?? []} />
      <EditorContent selected editor={editor} />
    </div>
  );
}

function formatDate(timestamp: Date | string | undefined) {
  return timestamp ? format(new Date(timestamp), "dd/MM/yyyy hh:mm:ss") : "";
}
