import type { Bookmark } from "./bookmark";
import type { Folder } from "./folder";
import type { User } from "@/lib/auth-client";

export interface SharedFolderData {
  title: string;
  note: string;
  expiresAt: Date;
  folder: Pick<Folder, "name" | "description">;
  author: Pick<User, "username" | "name">;
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
