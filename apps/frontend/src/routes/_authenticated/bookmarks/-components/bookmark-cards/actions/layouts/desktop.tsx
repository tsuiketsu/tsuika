import { setFlag } from "../api";
import { getBookmarkFlagInfo } from "../constants";
import { useBookmarkFlagActionsReducer } from "../reducer";
import type { DefaultAction } from "../types";
import type { BookmarkActionLayoutProps as PropsType } from "../types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import type { BookmarkFlag } from "@/types/bookmark";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { CircleCheck, Edit, Ellipsis, Trash2 } from "lucide-react";
import { useState } from "react";

export default function BookmarkActionsDesktopLayout({
  isVisible,
  bookmark,
  slug,
  query,
  isSecured,
  onTaskAdd,
  onDelete,
  onEdit,
}: PropsType) {
  const queryClient = useQueryClient();
  const [flagActions, dispatch] = useBookmarkFlagActionsReducer(bookmark, slug);
  const [open, setOpen] = useState(isVisible);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      {isVisible && (
        <DropdownMenuTrigger className="cursor-pointer hover:scale-95" asChild>
          <Ellipsis size={18} />
        </DropdownMenuTrigger>
      )}
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
  );
}
