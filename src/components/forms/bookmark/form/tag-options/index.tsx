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
import { useTagsData } from "@/hooks/use-tag";
import type { BookmarkFormSchemaType } from "@/types/bookmark";
import type { Tag, TagInsertSchemaWithId } from "@/types/tag";
import clsx from "clsx";
import fuzzy from "fuzzysort";
import kebabCase from "lodash.kebabcase";
import { LoaderCircle } from "lucide-react";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { type Control } from "react-hook-form";
import { shallow } from "zustand/shallow";

// Lazy Imports
const TagList = lazy(() => import("./tag-list"));
const AIAutoTagger = lazy(() => import("./ai-auto-taggger"));
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
  const [randomColor, setRandomColor] = useState("");
  const [randomTag, setRandomTag] = useState<TagInsertSchemaWithId | null>(
    null
  );

  const { data, isFetching } = useTagsData();

  const prepedTags = useMemo(() => {
    return data?.map((t) => ({ name: fuzzy.prepare(t.name), entry: t })) ?? [];
  }, [data]);

  const tags = useMemo(() => {
    return (
      fuzzy
        .go(query, prepedTags, {
          all: false,
          key: "name",
        })
        .map((t) => t.obj.entry) ?? []
    );
  }, [prepedTags, query]);

  useEffect(() => {
    if (!randomColor) {
      setRandomColor(options.randomColor);
    }
  }, [randomColor]);

  useEffect(() => {
    if (query && tags.length === 0) {
      setRandomTag((prev) => {
        const newObj = {
          id: defaultTagId,
          name: kebabCase(query),
          color: randomColor,
        };

        if (!prev || (query && !shallow(prev, newObj))) {
          return newObj;
        }

        return prev;
      });
    }
  }, [query, randomColor, tags.length]);

  return (
    <FormField
      control={control}
      name="tags"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tags </FormLabel>
          <FormControl>
            <div className="relative space-y-3">
              <div className="space-y-3">
                <div className="relative flex items-center">
                  <div className="relative w-full">
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.currentTarget.value)}
                      placeholder="Search for tags..."
                    />
                    {data && data?.length > 0 && (
                      <Suspense
                        fallback={
                          <Skeleton className="absolute top-1.5 right-1.5 h-9 w-[68px] sm:top-1 sm:right-1 sm:h-7" />
                        }
                      >
                        <AIAutoTagger tags={data} control={control} />
                      </Suspense>
                    )}
                  </div>
                  <LoaderCircle
                    className={clsx("absolute right-2 animate-spin", {
                      hidden: !isFetching,
                    })}
                    size={18}
                  />
                </div>
              </div>
              <Suspense fallback={<SuggestionBoxFallback />}>
                {query !== "" && (
                  <SuggestionBox
                    field={field}
                    tags={
                      tags.length === 0
                        ? ((randomTag ? [randomTag] : []) as Tag[])
                        : tags
                    }
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
