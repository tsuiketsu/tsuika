import { defaultTagId } from "./constants";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { options } from "@/constants";
import { searchTagsByName } from "@/queries/tags.queries";
import type { BookmarkFormSchemaType } from "@/types/bookmark";
import type { Tag, TagInsertSchemaWithId } from "@/types/tag";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import clsx from "clsx";
import isEqual from "lodash.isequal";
import kebabCase from "lodash.kebabcase";
import { LoaderCircle } from "lucide-react";
import { lazy, Suspense, useEffect, useState } from "react";
import type { Control } from "react-hook-form";

// Lazy Imports
const TagList = lazy(() => import("./tag-list"));
const SuggestionBox = lazy(() => import("./suggestion-box"));

export const SuggestionBoxFallback = () => (
  <div className="bg-card absolute w-full space-y-2 rounded-lg border p-2">
    {Array.from({ length: 4 }).map((_, idx) => (
      <Skeleton key={`tag-sugg-ske-${idx}`} className="h-8 w-full" />
    ))}
  </div>
);

interface PropsType {
  control: Control<BookmarkFormSchemaType>;
}

export default function TagOptions({ control }: PropsType) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 200);
  const [randomColor, setRandomColor] = useState("");
  const [randomTag, setRandomTag] = useState<TagInsertSchemaWithId | null>(
    null
  );

  const { data: tags, isFetching } = useQuery({
    queryKey: ["tags", debouncedQuery],
    queryFn: () => searchTagsByName(debouncedQuery),
    enabled: debouncedQuery.trim() !== "",
  });

  useEffect(() => {
    if (!randomColor) {
      setRandomColor(options.randomColor);
    }
  }, [randomColor]);

  useEffect(() => {
    if (debouncedQuery) {
      setRandomTag((prev) => {
        const newObj = {
          id: defaultTagId,
          name: kebabCase(debouncedQuery),
          color: randomColor,
        };

        if (!prev || (debouncedQuery && !isEqual(prev, newObj))) {
          return newObj;
        }

        return prev;
      });
    }
  }, [debouncedQuery, randomColor]);

  return (
    <FormField
      control={control}
      name="tags"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tags</FormLabel>
          <FormControl>
            <div className="relative space-y-3">
              <div className="space-y-3">
                <div className="relative flex items-center">
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.currentTarget.value)}
                    placeholder="Search for tags..."
                  />
                  <LoaderCircle
                    className={clsx("absolute right-2 animate-spin", {
                      hidden: !isFetching,
                    })}
                    size={18}
                  />
                </div>
              </div>
              <Suspense fallback={<SuggestionBoxFallback />}>
                {query !== "" && tags && (
                  <SuggestionBox
                    field={field}
                    tags={tags.length === 0 ? ([randomTag] as Tag[]) : tags}
                    setQuery={setQuery}
                    setTag={setRandomTag}
                  />
                )}
              </Suspense>
              <Suspense fallback={<Skeleton className="h-8 w-full" />}>
                {!!field.value && field.value.length > 0 && (
                  <TagList tags={field.value} />
                )}
              </Suspense>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
