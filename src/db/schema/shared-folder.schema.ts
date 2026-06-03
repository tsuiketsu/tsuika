import { relations } from "drizzle-orm";
import {
  bigserial,
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";
import { timestamps } from "../constants";
import { user } from "./auth.schema";
import { folder } from "./folder.schema";

export const sharedFolder = pgTable("shared_folders", {
  id: bigserial({ mode: "number" }).primaryKey(),
  publicId: text().unique().notNull(),
  folderId: integer()
    .unique()
    .notNull()
    .references(() => folder.id, { onDelete: "cascade" }),
  createdBy: text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text(),
  note: text(),
  isLocked: boolean(),
  password: text(),
  salt: text(),
  isPublic: boolean().notNull().default(true),
  viewCount: integer(),
  lastViewedAt: timestamp({ withTimezone: true }),
  expiresAt: timestamp({ withTimezone: true }),
  unpublishedAt: timestamp({ withTimezone: true }),
  ...timestamps,
});

export const sharedFolderRelations = relations(sharedFolder, ({ one }) => ({
  author: one(user, {
    fields: [sharedFolder.createdBy],
    references: [user.id],
  }),

  folder: one(folder, {
    fields: [sharedFolder.folderId],
    references: [folder.id],
  }),
}));

// const sharedFolderPublicFields = {
//   id: sf.publicId,
//   title: sf.title,
//   note: sf.note,
//   isLocked: sf.isLocked,
//   isPublic: sf.isPublic,
//   viewCount: sf.viewCount,
//   lastViewedAt: sf.lastViewedAt,
//   expiresAt: sf.expiresAt,
//   unpublishedAt: sf.unpublishedAt,
//   createdAt: sf.createdBy,
//   updatedAt: sf.updatedAt,
// };

export const sharedFolderSelectSchema = createSelectSchema(sharedFolder, {
  id: z.string(),
}).omit({
  publicId: true,
  folderId: true,
  createdBy: true,
  password: true,
  salt: true,
});
export const sharedFolderInsertSchema = createInsertSchema(sharedFolder, {
  folderId: z.string(),
  password: z.string().optional(),
}).omit({ publicId: true, createdBy: true });
export const sharedFolderUpdateSchema = createUpdateSchema(sharedFolder);
