import useBookmarkContext from "../../context/use-context";
import { setFlag } from "./api";
import { getBookmarkFlagInfo } from "./constants";
import { useBookmarkFlagActionsReducer } from "./reducer";
import type { DefaultAction } from "./types";
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
import React, { lazy, useState } from "react";

const InsertTask = lazy(() => import("@/components/forms/task/insert-task"));

const DeleteBookmark = lazy(
  () => import("@/components/forms/bookmark/delete-bookmark")
);

const UpdateBookmark = lazy(
  () => import("@/components/forms/bookmark/update-bookmark")
);

export default function BookmarkActions({ bookmark }: { bookmark: Bookmark }) {
  const [openUpdateForm, setOpenUpdateForm] = useState(false);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [openTaskForm, setOpenTaskForm] = useState(false);

  const queryClient = useQueryClient();
  const { query } = useBookmarkContext();
  const { slug } = useLoaderData({ from: "/_authenticated/bookmarks/$slug" });
  const { isSecured } = useSecuredFolders();

  const [flagActions, dispatch] = useBookmarkFlagActionsReducer(bookmark, slug);

  const onTaskAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenTaskForm(true);
  };

  const onEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenUpdateForm(true);
  };

  const onDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDeleteConfirmation(true);
  };

  return (
    <div className="group top-2 right-2 z-10 space-x-2 rounded-full">
      <DropdownMenu>
        <DropdownMenuTrigger className="cursor-pointer hover:scale-95" asChild>
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

      <InsertTask
        contentType="bookmark"
        contentId={bookmark.id}
        isButtonHidden
        open={openTaskForm}
        setOpen={setOpenTaskForm}
      />

      <UpdateBookmark
        bookmark={bookmark}
        query={query}
        open={openUpdateForm}
        setOpen={setOpenUpdateForm}
      />

      <DeleteBookmark
        id={bookmark.id}
        query={query}
        open={openDeleteConfirmation}
        setOpen={setOpenDeleteConfirmation}
      />
    </div>
  );
}
