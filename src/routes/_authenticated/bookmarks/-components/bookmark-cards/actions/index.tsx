import useBookmarkContext from "../../context/use-context";
import { setFlag } from "./api";
import { getBookmarkFlagInfo } from "./constants";
import { useBookmarkFlagActionsReducer } from "./reducer";
import type { DefaultAction } from "./types";
import DeleteBookmark from "@/components/forms/bookmark/delete-bookmark";
import UpdateBookmark from "@/components/forms/bookmark/update-bookmark";
import InsertTask from "@/components/forms/task/insert-task";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useSecuredFolders } from "@/hooks/secured-folder.hook";
import type { Bookmark, BookmarkFlag } from "@/types/bookmark";
import { useQueryClient } from "@tanstack/react-query";
import { useLoaderData } from "@tanstack/react-router";
import clsx from "clsx";
import { CircleCheck, Edit, Ellipsis, Trash2 } from "lucide-react";
import React, { useRef } from "react";

export default function BookmarkActions({ bookmark }: { bookmark: Bookmark }) {
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);
  const insertTaskRef = useRef<HTMLButtonElement>(null);
  const queryClient = useQueryClient();
  const { query } = useBookmarkContext();
  const { slug } = useLoaderData({ from: "/_authenticated/bookmarks/$slug" });
  const { isSecured } = useSecuredFolders();

  const [flagActions, dispatch] = useBookmarkFlagActionsReducer(bookmark, slug);

  const onTaskAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    insertTaskRef.current?.click();
  };

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

              // NOTE: Temporally disabled on secured folders until handled
              if (isSecured || !action.isVisible) return null;

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
          {!isSecured && <DropdownMenuSeparator />}
          <DropdownMenuItem
            onClick={onTaskAdd}
            // NOTE: Temporally disabled on secured folders until handled
            className={clsx({ hidden: isSecured })}
          >
            <CircleCheck className="text-foreground" />
            Add as Task
          </DropdownMenuItem>
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
      <UpdateBookmark bookmark={bookmark} query={query} ref={editButtonRef} />
      <InsertTask
        contentType="bookmark"
        contentId={bookmark.id}
        triggerRef={insertTaskRef}
      />
    </div>
  );
}
