import { z } from "zod";

export type Tag = {
  id: string;
  name: string;
  color: string;
  useCount: number;
  created_at: Date | string;
  updated_at: Date | string;
};

export const TagInsertSchema = z.object({
  name: z.string().max(29).optional(),
  color: z.string().min(6).max(14).optional(),
});

export type TagInsertSchemaType = z.infer<typeof TagInsertSchema>;
export type TagInsertSchemaWithId = Pick<Tag, "id" | "name" | "color">;
