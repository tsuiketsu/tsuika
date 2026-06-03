import { z } from "zod";
import type { bookmarkTaskSelectSchema } from "@/db/schema/task.schema";
import type { bookmarkSelectSchema } from "../db/schema/bookmark.schema";
import type { bookmarkTagSelectSchema } from "../db/schema/bookmark-tag.schema";
import type { folderSelectSchema } from "../db/schema/folder.schema";
import type { tagSelectSchema } from "../db/schema/tag.schema";

export type BookmarkType = z.infer<typeof bookmarkSelectSchema>;
export type TagType = z.infer<typeof tagSelectSchema>;

export const bookmarkFlags = {
  isPinned: "pin",
  isArchived: "archive",
  isFavourite: "favorite",
};
export type BookmarkFlag = keyof typeof bookmarkFlags;

export type BookmarkTagType = z.infer<typeof bookmarkTagSelectSchema>;
export const bookmarkTagInsertSchema = z.object({
  bookmarkId: z.number(),
  tagIds: z.array(z.number()),
});

export type FolderType = z.infer<typeof folderSelectSchema>;
export const FolderPermissionLevelSchema = z.enum([
  "viewer",
  "editor",
  "admin",
]);

// Task Types
export type Task = z.infer<typeof bookmarkTaskSelectSchema> & {
  type: ContentCategoryType;
};

export const contentCategoryTypes = {
  BOOKMARK: "bookmark",
  NOTE: "note",
  CODE_SNIPPET: "code_snippet",
} as const;

export type ContentCategoryType =
  (typeof contentCategoryTypes)[keyof typeof contentCategoryTypes];

export enum TaskStatus {
  PENDING = "pending",
  DISMISSED = "dismissed",
  DONE = "done",
}

export enum TaskPriority {
  LOW = "low",
  NORMAL = "normal",
  HIGH = "high",
}

export type TaskType = z.infer<typeof bookmarkTaskSelectSchema>;
