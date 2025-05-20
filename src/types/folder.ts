import { z } from "zod";

export type Folder = {
  id: number;
  user_id?: string;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
};

export const FolderInsertSchema = z.object({
  name: z.string().max(50),
  description: z.string().max(200).optional(),
});

export type FolderInsertSchemaType = z.infer<typeof FolderInsertSchema>;
