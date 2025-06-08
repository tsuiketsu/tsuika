import { Button } from "@/components/ui/button";
import type { Bookmark } from "@/types/bookmark";
import clsx from "clsx";
import { Ellipsis, ArrowUpRight } from "lucide-react";
import { parse } from "tldts";

interface PropsType {
  bookmark: Bookmark;
}

export default function BookmarkListItem({ bookmark }: PropsType) {
  const { domain } = parse(bookmark.url);

  return (
    <div className={clsx("group flex cursor-pointer items-center gap-2")}>
      <img
        src={bookmark.faviconUrl}
        className="aspect-square size-10 rounded-sm"
      />
      <div className="flex flex-col">
        <h4 className="line-clamp-1 text-xs font-medium">{bookmark.title}</h4>
        <span className="text-muted-foreground text-xs">{domain}</span>
      </div>
      <div className="ml-auto flex space-x-2">
        <Button variant="ghost" size="icon" className="size-6">
          <Ellipsis />
        </Button>
        <a href={bookmark.url} target="_blank" rel="noreferrer">
          <Button variant="ghost" size="icon" className="size-6">
            <ArrowUpRight className="transition-transform group-hover:rotate-45" />
          </Button>
        </a>
      </div>
    </div>
  );
}
