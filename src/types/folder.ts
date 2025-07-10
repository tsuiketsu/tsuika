import type { KdfOptions } from "@/utils/noble";
import { z } from "zod";

export type Folder = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean | null;
  publicId: string | null;
  expiresAt: Date | null;
  viewCount: number | null;
  keyDerivation: KeyDerivation | null;
};

export type SharedFolder = {
  id: string;
  title: string;
  note: string;
  expiresAt: Date;
  isLocked: boolean | null;
  isPublic: boolean;
  viewCount: number;
  lastViewdAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export interface KeyDerivation extends KdfOptions {
  salt: string;
  mac: string;
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
