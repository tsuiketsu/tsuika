import type { cn } from "@/lib/utils";
import type { LucideIconElement } from "@/types";
import type { Bookmark } from "@/types/bookmark";
import type React from "react";

export type BookmarkFlagKey = keyof Pick<
  Bookmark,
  "isFavourite" | "isArchived" | "isPinned"
>;

export interface DefaultAction {
  isActive: boolean;
  isVisible: boolean;
  key: BookmarkFlagKey;
}

export interface BookmarkFlagInfo {
  icon: LucideIconElement;
  style: ReturnType<typeof cn>;
  label: string;
}

export interface BookmarkActionLayoutProps {
  isVisible: boolean;
  bookmark: Bookmark;
  slug: string;
  query: string;
  isSecured: boolean;
  onTaskAdd: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  onEdit: (e: React.MouseEvent) => void;
}
