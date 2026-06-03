import { relations } from "drizzle-orm";
import {
  bigserial,
  integer,
  pgEnum,
  pgTable,
  text,
  unique,
} from "drizzle-orm/pg-core";
import { createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { timestamps } from "../constants";
import { user } from "./auth.schema";
import { folder } from "./folder.schema";

export const permissionLevel = pgEnum("permission_level", [
  "viewer",
  "editor",
  "admin",
]);

export const collabFolder = pgTable(
  "collaborative_folders",
  {
    id: bigserial({ mode: "number" }).primaryKey(),
    publicId: text().unique(),
    folderId: integer()
      .notNull()
      .references(() => folder.id, { onDelete: "cascade" }),
    ownerUserId: text()
      .notNull()
      .references(() => user.id, { onDelete: "set null" }),
    sharedWithUserId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    permissionLevel: permissionLevel().notNull().default("viewer"),
    ...timestamps,
  },
  (table) => [unique().on(table.folderId, table.sharedWithUserId)],
);

export const collabFolderRelations = relations(collabFolder, ({ one }) => ({
  owner: one(user, {
    fields: [collabFolder.ownerUserId],
    references: [user.id],
  }),

  sharedWith: one(user, {
    fields: [collabFolder.sharedWithUserId],
    references: [user.id],
  }),

  folder: one(folder, {
    fields: [collabFolder.folderId],
    references: [folder.id],
  }),
}));

export const collabFolderSelectSchema = createSelectSchema(collabFolder);
export const collabFolderUpdateSchema = createUpdateSchema(collabFolder);
