import { relations } from "drizzle-orm";
import {
  bigserial,
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { referenceUser, timestamps } from "../constants";
import { user } from "./auth.schema";
import { bookmark } from "./bookmark.schema";

// Enums
export const status = pgEnum("status", ["pending", "dismissed", "done"]);
export const priority = pgEnum("priority", ["low", "normal", "high"]);

// Schema
export const bookmarkTask = pgTable("bookmark_tasks", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  publicId: text().notNull().unique(),
  contentId: integer()
    .notNull()
    .unique()
    .references(() => bookmark.id, { onDelete: "cascade" }),
  userId: referenceUser,
  note: text(),
  status: status().default("pending"),
  priority: priority().default("normal"),
  isDone: boolean().notNull().default(false),
  remindAt: timestamp({ withTimezone: true }).notNull(),
  ...timestamps,
});

// Relations
export const bookmarkTasksRelations = relations(bookmarkTask, ({ one }) => ({
  owner: one(user, {
    fields: [bookmarkTask.userId],
    references: [user.id],
    relationName: "owner",
  }),
}));

// Validations
export const bookmarkTaskSelectSchema = createSelectSchema(bookmarkTask, {
  id: z.string(),
}).omit({
  publicId: true,
  userId: true,
  contentId: true,
});

export const bookmarkTaskInsertSchema = createInsertSchema(bookmarkTask, {
  note: (z) => z.max(255),
  remindAt: z.string().refine((val) => !Number.isNaN(new Date(val).getTime()), {
    message: "Invalid date string",
  }),
}).pick({
  note: true,
  priority: true,
  remindAt: true,
});
