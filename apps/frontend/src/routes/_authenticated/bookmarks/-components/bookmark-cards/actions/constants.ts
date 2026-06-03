import type { DefaultAction } from "./types";
import type { BookmarkFlag } from "@/types/bookmark";
import { Star, Pin, ArchiveRestore, Archive, PinOff } from "lucide-react";

export const getBookmarkFlagInfo = (isActive: boolean) => {
  return {
    favorite: {
      icon: Star,
      style: isActive ? "text-yellow-500 fill-yellow-500" : "text-foreground",
      label: isActive ? "Remove from Favourites" : "Mark as Favourite",
    },
    archive: {
      label: isActive ? "Unarchive" : "Archive",
      icon: isActive ? ArchiveRestore : Archive,
      style: "text-foreground",
    },
    pin: {
      label: isActive ? "Unpin Bookmark" : "Pin Bookmark",
      icon: isActive ? PinOff : Pin,
      style: "text-foreground",
    },
  };
};

export const initialFlagActions: { [key in BookmarkFlag]: DefaultAction } = {
  favorite: {
    isActive: false,
    isVisible: false,
    key: "isFavourite",
  },
  archive: {
    isActive: false,
    isVisible: false,
    key: "isArchived",
  },
  pin: {
    isActive: false,
    isVisible: false,
    key: "isPinned",
  },
};
