import {
  CommandDialog,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandEmpty,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import type { Setter } from "@/lib/utils";
import { searchBookmarks } from "@/queries/bookmark.queries";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useDebounce } from "@uidotdev/usehooks";
import { LoaderCircle, SearchIcon } from "lucide-react";
import { useState } from "react";

interface PropsType {
  open: boolean;
  setOpen: Setter<boolean>;
}

export default function SearchWindow({ open, setOpen }: PropsType) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const debouncedQuery = useDebounce(query, 400);

  const run = (command: () => void) => () => {
    setOpen(false);
    command();
  };

  const { data, isLoading } = useQuery({
    queryKey: ["bookmarks-search", debouncedQuery],
    queryFn: async () => await searchBookmarks(debouncedQuery),
    enabled: debouncedQuery.trim() !== "",
  });

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <div className="inline-flex h-12 items-center border-b pl-3">
        {isLoading ? (
          <LoaderCircle className="text-muted-foreground" size={20} />
        ) : (
          <SearchIcon className="text-muted-foreground" size={20} />
        )}
        <Input
          placeholder="Search bookmarks..."
          onInput={(e) => setQuery(e.currentTarget.value)}
          className="border-none bg-transparent focus-visible:ring-0 dark:bg-transparent"
        />
      </div>
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {data && data?.length > 0 && (
          <CommandGroup heading="Results">
            {data?.map((b, idx) => (
              <CommandItem
                key={`cmd-bmark-${idx}`}
                className="inline-flex h-18 w-full cursor-pointer"
                onSelect={run(() =>
                  navigate({
                    to: "/bookmarks/b/$id",
                    params: { id: b.publicId },
                  })
                )}
              >
                <div className="aspect-video w-24 shrink-0 overflow-hidden rounded-sm">
                  <img
                    src={b.thumbnail}
                    alt=""
                    className="size-full object-cover"
                  />
                </div>
                <div className="flex w-full flex-col overflow-hidden text-xs">
                  <span className="block truncate">{b.title}</span>
                  <a
                    href={b.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-info truncate underline"
                  >
                    {b.url}
                  </a>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
