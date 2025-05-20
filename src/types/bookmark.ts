import { z } from "zod";

export interface Bookmark {
  id: number;
  user_id: string;
  title: string;
  description?: string;
  url: string;
  favicon_url?: string;
  thumbnail?: string;
  is_pinned: boolean;
  is_favourite: boolean;
  is_archived: boolean;
  created_at: Date | string;
  updated_at: Date | string;
}

export const BookmarkFormSchema = z.object({
  folderId: z.number().optional(),
  url: z.string().url(),
  title: z.string().max(255),
  description: z.string().max(500).optional(),
  thumbnail: z.string().url().optional(),
  tags: z
    .array(z.object({ id: z.number(), name: z.string(), color: z.string() }))
    .optional(),
});

export type BookmarkFormSchemaType = z.infer<typeof BookmarkFormSchema>;
