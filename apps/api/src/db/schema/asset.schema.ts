import { relations } from "drizzle-orm";
import { bigint, bigserial, pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { referenceUser, timestamps } from "../constants";
import { user } from "./auth.schema";

export const asset = pgTable("assets", {
  id: bigserial({ mode: "number" }).primaryKey(),
  userId: referenceUser,
  fileId: text().notNull().unique(),
  size: bigint({ mode: "number" }),
  mimeType: text(),
  filename: text(),
  ...timestamps,
});

export const assetRelations = relations(asset, ({ one }) => ({
  owner: one(user, {
    fields: [asset.userId],
    references: [user.id],
    relationName: "owner",
  }),
}));

export const assetInsertSchema = createInsertSchema(asset);
export const assetSelectSchema = createSelectSchema(asset).omit({
  id: true,
  userId: true,
});
