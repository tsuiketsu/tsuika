import { z } from "zod";

export interface Bookmark {
  id: string;
  title: string;
  description?: string;
  url: string;
  folderId: string | null;
  favicon_url?: string;
  thumbnail?: string;
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
  description: z.string().max(500).optional(),
  tags: z
    .array(z.object({ id: z.string(), name: z.string(), color: z.string() }))
    .optional(),
});

export type BookmarkFormSchemaType = z.infer<typeof BookmarkFormSchema>;

export type CategoryType = "tag" | "folder";
