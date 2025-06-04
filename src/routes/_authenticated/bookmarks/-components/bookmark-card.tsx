import BookmarkThumbnail from "./bookmark-thumbnail";
import useBookmarkContext from "./context/use-context";
import DeleteBookmark from "@/components/forms/bookmark/bookmark-delete";
import EditBookmark from "@/components/forms/bookmark/bookmark-edit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Bookmark } from "@/types/bookmark";
import dayjs from "dayjs";
import { Ellipsis } from "lucide-react";
import React, { useRef } from "react";
import { parse } from "tldts";

interface PropsType {
  bookmark: Bookmark;
}

export default function BookmarkCard({ bookmark }: PropsType) {
  return (
    <div className="bg-card group @container/main overflow-hidden rounded-md border p-2 duration-150 select-none">
      <div className="@container relative z-10 overflow-hidden rounded-b-sm">
        <BookmarkThumbnail
          image={bookmark.thumbnail || undefined}
          title={bookmark.title}
          height={bookmark.thumbnailHeight}
          width={bookmark.thumbnailWidth}
        />
      </div>
      <section className="space-y-2.5">
        <h3 className="truncate transition-transform duration-200">
          {bookmark.title}
        </h3>
        <div className="inline-flex w-full items-center justify-between">
          <Extras url={bookmark.url} createdAt={bookmark.createdAt} />
          <Actions bookmark={bookmark} />
        </div>
      </section>
    </div>
  );
}

const Extras = (props: { url: string; createdAt: string | Date }) => {
  const domain = parse(props.url).domain;
  return (
    <div className="text-foreground/60 inline-flex items-center space-x-2 text-xs font-medium">
      <Button variant="info" className="h-6 px-2 text-xs" asChild>
        <a href={`https://${domain}`} target="_blank" rel="noreferrer">
          {domain}
        </a>
      </Button>
      <Badge variant="outline">
        <span>{dayjs(props.createdAt).format("MMM DD, YYYY")}</span>
      </Badge>
    </div>
  );
};

const Actions = ({ bookmark }: PropsType) => {
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);
  const { query } = useBookmarkContext();

  const onEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    editButtonRef.current?.click();
  };

  const onDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteButtonRef.current?.click();
  };

  return (
    <div className="group top-2 right-2 z-10 space-x-2 rounded-full">
      <DropdownMenu>
        <DropdownMenuTrigger className="pointer-cursor hover:scale-95">
          <Ellipsis size={20} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteBookmark id={bookmark.id} query={query} ref={deleteButtonRef} />
      <EditBookmark bookmark={bookmark} query={query} ref={editButtonRef} />
    </div>
  );
};
