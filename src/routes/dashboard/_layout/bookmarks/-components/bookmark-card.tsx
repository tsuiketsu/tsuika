import BookmarkThumbnail from "./bookmark-thumbnail";
import useBookmarkContext from "./context/use-context";
import DeleteBookmark from "@/components/forms/bookmark/bookmark-delete";
import EditBookmark from "@/components/forms/bookmark/bookmark-edit";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Bookmark } from "@/types/bookmark";
import clsx from "clsx";
import dayjs from "dayjs";
import { ChevronRight, Dot, Ellipsis } from "lucide-react";
import React, { useRef } from "react";
import { parse } from "tldts";

interface PropsType {
  bookmark: Bookmark;
}

const BookmarkActions = ({ bookmark }: PropsType) => {
  const deleteButtonRef = useRef<HTMLButtonElement>(null);
  const editButtonRef = useRef<HTMLButtonElement>(null);

  const { query } = useBookmarkContext();

  return (
    <React.Fragment>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="group absolute top-4 right-4 h-7 rounded-full bg-white/80 text-black shadow-xl hover:bg-white">
            More <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="z-40 w-56">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              editButtonRef.current?.click();
            }}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              deleteButtonRef.current?.click();
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteBookmark id={bookmark.id} query={query} ref={deleteButtonRef} />
      <EditBookmark bookmark={bookmark} query={query} ref={editButtonRef} />
    </React.Fragment>
  );
};

export default function BookmarkCard({ bookmark }: PropsType) {
  const domain = parse(bookmark.url).domain;

  return (
    <div className="bg-card group @container relative overflow-hidden rounded-md border p-2 select-none">
      <div className="relative overflow-hidden">
        <BookmarkThumbnail
          image={bookmark.thumbnail || undefined}
          title={bookmark.title}
        />
        <div className="absolute bottom-0 flex size-full h-auto max-h-4/5 w-full translate-y-full flex-col rounded-t-lg border bg-[#0D0D0D] p-3 text-sm font-medium transition-transform duration-500 ease-in-out group-hover:translate-y-0">
          <p className="mb-2 line-clamp-4 @sm:line-clamp-6 @lg:line-clamp-9 @lg:text-base">
            {bookmark.description}
          </p>
          <Button
            variant="secondary"
            size="sm"
            className="mt-auto ml-auto"
            asChild
          >
            <a href={bookmark.url} target="_blank" rel="noreferrer">
              Open Link
            </a>
          </Button>
        </div>
      </div>
      <section className="font-roboto @container space-y-2">
        <h3 className="truncate pt-2 text-sm font-medium">{bookmark.title}</h3>
        <div className="text-foreground/60 inline-flex items-center -space-x-1 text-xs font-medium">
          <Button
            variant="info"
            size="sm"
            className="h-auto py-1.5 text-xs"
            asChild
          >
            <a
              href={`https://${domain}`}
              target="_blank"
              className="rounded-sm px-2 py-1"
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
              "h-auto py-1.5 text-xs"
            )}
          >
            <span>{dayjs(bookmark.createdAt).format("MMM DD, HH:MM")}</span>
          </div>
        </div>
      </section>
      <BookmarkActions bookmark={bookmark} />
      <Button
        size="icon"
        className={clsx(
          "dark:bg-secondary dark:text-secondary-foreground invisible absolute right-2 bottom-2 size-7 translate-x-full rounded-full duration-500 group-hover:visible group-hover:translate-x-0 group-hover:-rotate-90"
        )}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
