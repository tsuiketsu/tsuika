import DeleteBookmark from "@/components/forms/bookmark/bookmark-delete";
import EditBookmark from "@/components/forms/bookmark/bookmark-edit";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Alphabet, options } from "@/constants";
import { cn } from "@/lib/utils";
import type { Bookmark } from "@/types/bookmark";
import dayjs from "dayjs";
import { Dot, Ellipsis } from "lucide-react";
import { parse } from "tldts";

interface PropsType {
  bookmark: Bookmark;
}

const BookmarkActions = ({ bookmark }: { bookmark: Bookmark }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-6">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <EditBookmark bookmark={bookmark} />
        <DeleteBookmark id={bookmark.id} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default function BookmarkCard({ bookmark }: PropsType) {
  const domain = parse(bookmark.url).domain;
  const titleChar = bookmark.title[0].toUpperCase() as Alphabet;

  return (
    <div className="space-y-2 select-none">
      <div
        className="@container accent-transparent rounded-md relative overflow-hidden"
        style={{
          aspectRatio: "5/3",
          backgroundColor: options.alphabetColors[titleChar].bg,
          color: options.alphabetColors[titleChar].color,
        }}
      >
        <span className="text-[74cqw] size-full font-cal-sans absolute bottom-[14%] left-[4%] select-none font-extrabold">
          {titleChar}
        </span>
      </div>
      <section className="font-roboto space-y-1">
        <div className="inline-flex items-center w-full justify-between">
          <Button
            variant="link"
            className="font-bold capitalize block p-0 h-auto text-base"
            asChild
          >
            <a href={bookmark.url} target="_blank" rel="noreferrer">
              {bookmark.title}
            </a>
          </Button>
          <BookmarkActions bookmark={bookmark} />
        </div>
        <div className="text-xs -space-x-1 text-foreground/60 font-medium inline-flex items-center">
          <Button
            variant="info"
            size="sm"
            className="h-auto py-1.5 text-xs"
            asChild
          >
            <a
              href={domain ?? bookmark.url}
              target="_blank"
              className="px-2 rounded-sm py-1"
              rel="noreferrer"
            >
              {domain}
            </a>
          </Button>
          <Dot />
          <div
            className={cn(
              buttonVariants({
                variant: "secondary",
                size: "sm",
              }),
              "text-xs py-1.5 h-auto"
            )}
          >
            <span>{dayjs(bookmark.created_at).format("MMM DD, HH:MM")}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
