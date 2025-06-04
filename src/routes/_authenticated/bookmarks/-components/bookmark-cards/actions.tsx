import useBookmarkContext from "../context/use-context";
import DeleteBookmark from "@/components/forms/bookmark/bookmark-delete";
import EditBookmark from "@/components/forms/bookmark/bookmark-edit";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Bookmark } from "@/types/bookmark";
import { Ellipsis } from "lucide-react";
import React, { useRef } from "react";

export default function BookmarkActions({ bookmark }: { bookmark: Bookmark }) {
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
}
