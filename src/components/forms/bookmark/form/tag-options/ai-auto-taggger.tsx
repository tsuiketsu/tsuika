import AITextWritter from "@/features/genai/components/text";
import type { BookmarkFormSchemaType } from "@/types/bookmark";
import type { Tag } from "@/types/tag";
import { isValidURL } from "@/utils";
import { useRef } from "react";
import { Controller, useWatch, type Control } from "react-hook-form";

interface PropsType {
  tags: Tag[];
  control: Control<BookmarkFormSchemaType>;
}

export default function AIAutoTagger({ control, tags }: PropsType) {
  const url = useWatch({ control, name: "url" });
  const previousUrl = useRef(url);

  const isSameUrl = () => {
    return !previousUrl.current ? true : url === previousUrl.current;
  };

  if (!isValidURL(url)) {
    return null;
  }

  return (
    <Controller
      control={control}
      name="tags"
      render={({ field }) => (
        <>
          {(field.value?.length === 0 || !isSameUrl()) && (
            <AITextWritter
              className="absolute top-1.5 right-1.5 h-9 text-xs sm:top-1 sm:right-1 sm:h-7"
              btnText="Auto"
              variant="info"
              size="sm"
              systemInstruction="metadata_tagger"
              prompt={JSON.stringify({
                query: url,
                tags: tags.map((t) => ({
                  tag_id: t.id,
                  tag_name: t.name,
                })),
              })}
              onValueChange={(value) => {
                const tagIds = value.split("|");
                if (tagIds.length > 0) {
                  const suggestedTags = tags.filter((tag) =>
                    tagIds.includes(tag.id)
                  );

                  if (suggestedTags.length > 0) {
                    field.onChange(suggestedTags);
                    previousUrl.current = url;
                  }
                }
              }}
            />
          )}
        </>
      )}
    />
  );
}
