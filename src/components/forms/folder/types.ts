import { z } from "zod";

export const folderInsertSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }).max(50),
    description: z.string().max(200).optional(),
    isEncrypted: z.boolean(),
    password: z.string().optional(),
    isLinkPreview: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isEncrypted && !data.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password is required",
        path: ["password"],
      });
    }
  });

export type FolderInsertSchemaType = z.infer<typeof folderInsertSchema>;
