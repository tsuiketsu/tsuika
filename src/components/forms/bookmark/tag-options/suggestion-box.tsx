import { Button, buttonVariants } from "@/components/ui/button";
import { cn, type Setter } from "@/lib/utils";
import type { BookmarkFormSchemaType } from "@/types/bookmark";
import type { Tag } from "@/types/tag";
import { getTextColor } from "@/utils";
import clsx from "clsx";
import { Dot, Hash } from "lucide-react";
import type { ControllerRenderProps } from "react-hook-form";

interface PropsType {
  field: ControllerRenderProps<BookmarkFormSchemaType, "tags">;
  tags: Tag[] | undefined;
  setQuery: Setter<string>;
}

const SuggestionBox = ({ field, tags, setQuery }: PropsType) => (
  <ul className="bg-card absolute max-h-45 w-full space-y-2 overflow-y-auto rounded-lg border p-1 shadow-xl">
    {tags?.map((tag, idx) => (
      <Button
        variant="ghost"
        key={`tag-${idx}`}
        className="hover:bg-secondary w-full justify-start px-1 text-sm capitalize"
        onClick={() => {
          if (!field.value?.some((t) => t.name === tag.name)) {
            field.onChange([...(field.value || []), tag]);
          } else {
            field.onChange(field.value.filter(({ name }) => name !== tag.name));
          }
          setQuery("");
        }}
      >
        <span
          className={cn(buttonVariants({ size: "icon" }), "size-7 rounded-sm")}
          style={{
            backgroundColor: tag.color,
            color: getTextColor(tag.color),
          }}
        >
          <Hash />
        </span>
        <span className="block w-full text-start">{tag.name}</span>
        <div
          className={clsx({
            hidden: !field.value?.some(({ name }) => name === tag.name),
          })}
        >
          <Dot />
        </div>
      </Button>
    ))}
  </ul>
);

export default SuggestionBox;
