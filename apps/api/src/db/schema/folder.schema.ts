import { bigserial, jsonb, pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { timestamps } from "../constants";
import { user } from "./auth.schema";

export const folder = pgTable("folders", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  publicId: text("public_id").notNull().unique(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  settings: jsonb("settings"),
  ...timestamps,
});

export const folderSelectSchema = createSelectSchema(folder, {
  id: z.string(),
  settings: z.any(),
}).omit({
  publicId: true,
  userId: true,
});

export const folderInsertSchema = createInsertSchema(folder)
  .pick({
    name: true,
    description: true,
  })
  .extend({
    settings: z
      .object({
        defaultView: z.enum(["grid", "masonry", "compact"]).optional(),
        isLinkPreview: z.boolean().optional(),
        isEncrypted: z.boolean().optional(),
        keyDerivation: z
          .object({
            mac: z.string(),
            salt: z.string(),
            m: z.number().positive(),
            p: z.number().positive(),
            t: z.number().positive(),
            dkLen: z.number().positive(),
          })
          .optional(),
      })
      .optional(),
  });
