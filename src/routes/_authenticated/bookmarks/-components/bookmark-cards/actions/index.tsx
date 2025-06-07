import useBookmarkContext from "../../context/use-context";
import { setFlag } from "./api";
import { getBookmarkFlagInfo } from "./constants";
import { useBookmarkFlagActionsReducer } from "./reducer";
import type { DefaultAction } from "./types";
import DeleteBookmark from "@/components/forms/bookmark/bookmark-delete";
import EditBookmark from "@/components/forms/bookmark/bookmark-edit";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import type { Bookmark, BookmarkFlag } from "@/types/bookmark";
import { useQueryClient } from "@tanstack/react-query";
import { useLoaderData } from "@tanstack/react-router";
import { Edit, Ellipsis, Trash2 } from "lucide-react";
import React, { useRef } from "react";

export default function BookmarkActions({ bookmark }: { bookmark: Bookmark }) {
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);
  const queryClient = useQueryClient();
  const { query } = useBookmarkContext();
  const { slug } = useLoaderData({ from: "/_authenticated/bookmarks/$slug" });

  const [flagActions, dispatch] = useBookmarkFlagActionsReducer(bookmark, slug);

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
        <DropdownMenuTrigger className="pointer-cursor hover:scale-95" asChild>
          <Ellipsis size={18} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-4 w-[224px]">
          <DropdownMenuLabel>
            <span className="line-clamp-1 text-xs select-none">
              {bookmark.title}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {(Object.entries(flagActions) as [BookmarkFlag, DefaultAction][]).map(
            ([flag, action], idx) => {
              const info = getBookmarkFlagInfo(action.isActive)[flag];

              if (!action.isVisible) return null;

              return (
                <DropdownMenuItem
                  key={`default-option-${idx}`}
                  onClick={setFlag({
                    bookmark,
                    queryClient,
                    flag,
                    state: !bookmark[action.key],
                    dispatch,
                    slug,
                    query,
                  })}
                >
                  <info.icon className={info.style} />
                  {info.label}
                </DropdownMenuItem>
              );
            }
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="text-foreground" />
            Edit Bookmark
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={onDelete}>
            <Trash2 className="text-foreground" />
            Delete Bookmark
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteBookmark id={bookmark.id} query={query} ref={deleteButtonRef} />
      <EditBookmark bookmark={bookmark} query={query} ref={editButtonRef} />
    </div>
  );
}
