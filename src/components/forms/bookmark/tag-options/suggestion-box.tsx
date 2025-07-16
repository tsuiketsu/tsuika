/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { defaultTagId } from "./constants";
import { Button, buttonVariants } from "@/components/ui/button";
import useTagInsertMutation from "@/hooks/insert-tag-mutation.hook";
import { cn, type Setter } from "@/lib/utils";
import type { BookmarkFormSchemaType } from "@/types/bookmark";
import type { Tag, TagInsertSchemaWithId } from "@/types/tag";
import { getTextColor } from "@/utils";
import clsx from "clsx";
import { Dot, Hash, LoaderCircle, Palette, Plus } from "lucide-react";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import type { ControllerRenderProps } from "react-hook-form";

const UpdateTag = lazy(() => import("../../tag/update-tag"));

interface PropsType {
  field: ControllerRenderProps<BookmarkFormSchemaType, "tags">;
  tags: Tag[] | undefined;
  setQuery: Setter<string>;
  setTag: Setter<TagInsertSchemaWithId | null>;
}

const SuggestionBox = ({ field, tags, setQuery, setTag }: PropsType) => {
  const [tagsState, setTagsState] = useState<TagInsertSchemaWithId[]>(
    tags ?? []
  );

  useEffect(() => {
    setTagsState(tags ?? []);
  }, [tags]);

  const editButtonRef = useRef<HTMLButtonElement>(null);
  const mutation = useTagInsertMutation({
    onSuccess: (tag) =>
      setTagsState((prev) =>
        prev.map((t) => (t.id === defaultTagId ? tag : t))
      ),
  });

  const addTagHandler = (tag: TagInsertSchemaWithId) => () => {
    mutation.mutate(tag);
  };

  const selectTagHandler = (tag: TagInsertSchemaWithId) => () => {
    if (tag.id === defaultTagId) return;
    if (!field.value?.some((t) => t.name === tag.name)) {
      field.onChange([...(field.value || []), tag]);
    } else {
      field.onChange(field.value.filter(({ name }) => name !== tag.name));
    }
    setQuery("");
  };

  return (
    <ul className="bg-card absolute max-h-45 w-full space-y-2 overflow-y-auto rounded-lg border p-1 shadow-xl">
      {tagsState?.map((tag, idx) => (
        <div key={`tag-${idx}`} className="select-none">
          <div
            className={cn(
              "hover:bg-secondary bg-card text-card-foreground inline-flex w-full items-center justify-start gap-2 rounded-md p-1 px-1 text-sm capitalize",
              tag.id === defaultTagId && "hover:bg-card"
            )}
            onClick={selectTagHandler(tag)}
          >
            <span
              className={cn(
                buttonVariants({ size: "icon" }),
                "size-7 rounded-sm"
              )}
              style={{
                backgroundColor: tag.color,
                color: getTextColor(tag.color),
              }}
            >
              <Hash />
            </span>
            <span className="block w-full text-start">{tag.name}</span>
            <Button
              variant="info"
              className={clsx("size-7 rounded-sm p-0", {
                hidden: tag.id !== defaultTagId,
              })}
              onClick={() => editButtonRef.current?.click()}
            >
              <Palette />
            </Button>
            <Button
              className={clsx("size-7 rounded-sm p-0", {
                hidden: tag.id !== defaultTagId,
              })}
              isLoading={mutation.isPending}
              onClick={addTagHandler(tag)}
              customLoader={<LoaderCircle className="animate-spin" />}
            >
              <Plus />
            </Button>
            <div
              className={clsx({
                hidden: !field.value?.some(({ name }) => name === tag.name),
              })}
            >
              <Dot />
            </div>
          </div>
          <Suspense>
            {tag.id === defaultTagId && (
              <UpdateTag
                tag={tag as Tag}
                ref={editButtonRef}
                onChange={setTag}
              />
            )}
          </Suspense>
        </div>
      ))}
    </ul>
  );
};

export default SuggestionBox;
