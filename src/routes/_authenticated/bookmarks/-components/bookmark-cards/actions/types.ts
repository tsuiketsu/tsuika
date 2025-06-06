import type { cn } from "@/lib/utils";
import type { LucideIconElement } from "@/types";
import type { Bookmark } from "@/types/bookmark";

export type BookmarkFlagKey = keyof Pick<
  Bookmark,
  "isFavourite" | "isArchived" | "isPinned"
>;

export interface DefaultAction {
  isActive: boolean;
  key: BookmarkFlagKey;
}

export interface BookmarkFlagInfo {
  icon: LucideIconElement;
  style: ReturnType<typeof cn>;
  label: string;
}
