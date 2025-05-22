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
import { type Alphabet, options } from "@/constants";
import { cn } from "@/lib/utils";
import type { Bookmark } from "@/types/bookmark";
import dayjs from "dayjs";
import { Dot, Ellipsis, SquarePen, Trash } from "lucide-react";
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
          <Button variant="ghost" size="icon" className="size-6">
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => editButtonRef.current?.click()}>
            <SquarePen />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => deleteButtonRef.current?.click()}>
            <Trash /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteBookmark id={bookmark.id} ref={deleteButtonRef} />
      <EditBookmark bookmark={bookmark} query={query} ref={editButtonRef} />
    </React.Fragment>
  );
};

export default function BookmarkCard({ bookmark }: PropsType) {
  const domain = parse(bookmark.url).domain;
  const titleChar = bookmark.title[0].toUpperCase() as Alphabet;

  return (
    <div className="space-y-2 select-none">
      <div
        className="@container relative overflow-hidden rounded-md accent-transparent"
        style={{
          aspectRatio: "5/3",
          backgroundColor: options.alphabetColors[titleChar].bg,
          color: options.alphabetColors[titleChar].color,
        }}
      >
        <span className="font-cal-sans absolute bottom-[14%] left-[4%] size-full text-[74cqw] font-extrabold select-none">
          {titleChar}
        </span>
      </div>
      <section className="font-roboto space-y-1">
        <div className="inline-flex w-full items-center justify-between">
          <Button
            variant="link"
            className="block h-auto p-0 text-base font-bold capitalize"
            asChild
          >
            <a href={bookmark.url} target="_blank" rel="noreferrer">
              {bookmark.title}
            </a>
          </Button>
          <BookmarkActions bookmark={bookmark} />
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
    </div>
  );
}
