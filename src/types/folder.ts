import { z } from "zod";

export type Folder = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  keyDerivation: KeyDerivation | null;
};

export interface KeyDerivation {
  salt: string;
  nonce: string;
  mac: string;
  kdf_algorithm: number;
  kdf_opslimit: number;
  kdf_memlimit: number;
}

export const FolderInsertSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }).max(50),
    description: z.string().max(200).optional(),
    isEncrypted: z.boolean(),
    password: z.string().optional(),
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

export type FolderInsertSchemaType = z.infer<typeof FolderInsertSchema>;
