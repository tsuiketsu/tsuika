import { SuggestionBoxFallback } from "./suggestion-box";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { searchTagsByName } from "@/queries/tags.queries";
import type { BookmarkFormSchemaType } from "@/types/bookmark";
import { useQuery } from "@tanstack/react-query";
import { invariant } from "@tanstack/react-router";
import { useDebounce } from "@uidotdev/usehooks";
import clsx from "clsx";
import { LoaderCircle } from "lucide-react";
import { lazy, Suspense, useState } from "react";
import type { Control } from "react-hook-form";

const TagList = lazy(() => import("./tag-list"));
const SuggestionBox = lazy(() => import("./suggestion-box"));

interface PropsType {
  control: Control<BookmarkFormSchemaType>;
}

export default function TagOptions({ control }: PropsType) {
  const [query, setQuery] = useState("");

  const debouncedQuery = useDebounce(query, 200);

  const { data: tags, isFetching } = useQuery({
    queryKey: ["tags", debouncedQuery],
    queryFn: () => searchTagsByName(debouncedQuery),
    enabled: debouncedQuery.trim() !== "",
  });

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
                {query !== "" && !!tags && tags.length > 0 && (
                  <SuggestionBox
                    field={field}
                    tags={tags}
                    setQuery={setQuery}
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
