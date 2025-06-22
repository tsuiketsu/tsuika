import { z } from "zod";

export interface Bookmark {
  id: string;
  title: string;
  description?: string;
  url: string;
  folderId: string | null;
  faviconUrl?: string;
  thumbnail?: string;
  nonce?: string;
  isEncrypted: boolean;
  isPinned: boolean;
  isFavourite: boolean;
  isArchived: boolean;
  thumbnailHeight?: number;
  thumbnailWidth?: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export const BookmarkFormSchema = z.object({
  folderId: z.string().optional(),
  url: z.string().url(),
  title: z.string().max(255).optional(),
  description: z.string().max(5000).optional(),
  thumbnail: z.string().optional(),
  isEncrypted: z.boolean().optional(),
  nonce: z.string().optional(),
  faviconUrl: z.string().optional(),
  tags: z
    .array(z.object({ id: z.string(), name: z.string(), color: z.string() }))
    .optional(),
});

export type BookmarkFormSchemaType = z.infer<typeof BookmarkFormSchema>;

export type CategoryType = "tag" | "folder";

export type BookmarkFlag = "pin" | "favorite" | "archive";

export const bookmarkFilters = {
  ARCHIVED: "archived",
  FAVORITES: "favorites",
  PINNED: "pinned",
  ENCRYPTED: "encrypted",
} as const;

export type BookmarkFilter =
  (typeof bookmarkFilters)[keyof typeof bookmarkFilters];
