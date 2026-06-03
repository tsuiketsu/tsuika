import { setFlag } from "../api";
import { getBookmarkFlagInfo } from "../constants";
import { useBookmarkFlagActionsReducer } from "../reducer";
import type { DefaultAction } from "../types";
import type { BookmarkActionLayoutProps as PropsType } from "../types";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import type { BookmarkFlag } from "@/types/bookmark";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { CircleCheck, Edit, Ellipsis, Trash2 } from "lucide-react";
import { useState } from "react";

export default function BookmarkActionsMobileLayout({
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
    <Drawer open={open} onOpenChange={setOpen}>
      {isVisible && (
        <DrawerTrigger className="cursor-pointer hover:scale-95" asChild>
          <Ellipsis size={18} />
        </DrawerTrigger>
      )}
      <DrawerContent className="w-full px-4 pb-8">
        <DrawerHeader>
          <DrawerHeader className="line-clamp-1 px-0 text-xs select-none">
            <DrawerDescription className="px-0 text-start">
              {bookmark.title}
            </DrawerDescription>
          </DrawerHeader>
        </DrawerHeader>
        {(Object.entries(flagActions) as [BookmarkFlag, DefaultAction][]).map(
          ([flag, action], idx) => {
            const info = getBookmarkFlagInfo(action.isActive)[flag];

            // NOTE: Temporally disabled on secured folders until handled
            if (isSecured || !action.isVisible) return null;

            return (
              <Button
                variant="ghost"
                key={`default-option-${idx}`}
                className="justify-start"
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
                <info.icon className={clsx(info.style, "size-5")} />
                {info.label}
              </Button>
            );
          }
        )}
        <Button
          variant="ghost"
          onClick={onTaskAdd}
          // NOTE: Temporally disabled on secured folders until handled
          className={clsx({ hidden: isSecured }, "justify-start")}
        >
          <CircleCheck className="text-foreground size-5" />
          Add as Task
        </Button>
        <Button variant="ghost" onClick={onEdit} className="justify-start">
          <Edit className="text-foreground size-5" />
          Edit Bookmark
        </Button>
        <Button variant="ghost" onClick={onDelete} className="justify-start">
          <Trash2 className="text-foreground size-5" />
          Delete Bookmark
        </Button>
      </DrawerContent>
    </Drawer>
  );
}
