import type { User } from "@/lib/auth-client";
import type { Bookmark } from "./bookmark";
import type { Folder } from "./folder";

export interface SharedFolderData {
  title: string;
  note: string;
  expiresAt: Date;
  isLocked: boolean;
  folder: Pick<Folder, "id" | "name" | "description">;
  author: Pick<User, "username" | "name" | "image">;
  createdAt: Date;
  updatedAt: Date;
  bookmarks: Omit<
    Bookmark,
    | "isArchived"
    | "isEncrypted"
    | "isFavourite"
    | "isPinned"
    | "nonce"
    | "updatedAt"
  >[];
}
