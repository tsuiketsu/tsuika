import { z } from "zod";

export type Folder = {
  id: number;
  userId?: string;
  name: string;
  slug: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export const FolderInsertSchema = z.object({
  name: z.string().max(50),
  description: z.string().max(200).optional(),
});

export type FolderInsertSchemaType = z.infer<typeof FolderInsertSchema>;
