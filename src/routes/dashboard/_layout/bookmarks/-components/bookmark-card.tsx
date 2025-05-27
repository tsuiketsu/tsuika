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
import dayjs from "dayjs";
import { Dot, Ellipsis } from "lucide-react";
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
          <Button className="group absolute top-4 right-4 z-10 h-7 rounded-full bg-white/80 text-black shadow-xl hover:bg-white">
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
      <div className="relative z-10 overflow-hidden rounded-b-sm">
        <BookmarkThumbnail
          image={bookmark.thumbnail || undefined}
          title={bookmark.title}
          height={bookmark.thumbnailHeight}
          width={bookmark.thumbnailWidth}
        />
        <div className="bg-background/90 text-foreground absolute bottom-0 flex size-full h-auto max-h-4/5 w-full translate-y-full flex-col rounded-t-lg p-3 font-medium shadow-xl transition-transform duration-500 ease-in-out group-hover:translate-y-1">
          <h3 className="pb-2 text-sm font-bold @lg:text-base">
            {bookmark.title}
          </h3>
          <p className="mb-2 line-clamp-4 text-xs @sm:line-clamp-6 @lg:line-clamp-9 @lg:text-sm">
            {bookmark.description}
          </p>
        </div>
      </div>
      <section className="font-roboto @container space-y-4">
        <div className="relative overflow-hidden pt-2 text-sm font-medium">
          <h3 className="border-e-secondary-foreground truncate transition-transform duration-200 group-hover:-translate-y-8">
            {bookmark.title}
          </h3>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noreferrer"
            className="lef-0 text-info absolute top-2 block translate-y-4 transition-transform duration-200 ease-linear group-hover:translate-y-0"
          >
            {bookmark.url}
          </a>
        </div>
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
        size="sm"
        className="border-primary absolute right-2 bottom-2 mt-auto ml-auto h-7 translate-y-9 rounded-full font-bold duration-300 ease-in-out group-hover:translate-y-0"
        asChild
      >
        <a href={bookmark.url} target="_blank" rel="noreferrer">
          Open Link
        </a>
      </Button>
    </div>
  );
}
