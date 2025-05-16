import { type } from "arktype";

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

export const BookmarkFormSchema = type({
  url: "string",
  title: "string<255",
  "description?": "string<500",
  thumbnail: "string?",
});
export type BookmarkFormSchemaType = type.infer<typeof BookmarkFormSchema>;
