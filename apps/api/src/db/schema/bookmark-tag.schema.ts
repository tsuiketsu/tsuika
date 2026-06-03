import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { user } from "./auth.schema";
import { bookmark } from "./bookmark.schema";
import { tag } from "./tag.schema";

export const bookmarkTag = pgTable(
  "bookmark_tags",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tag.id, { onDelete: "cascade" }),
    bookmarkId: integer("bookmark_id")
      .notNull()
      .references(() => bookmark.id, { onDelete: "cascade" }),
    appliedAt: timestamp("applied_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.bookmarkId, table.tagId] })],
);

export const bookmarkTagRelations = relations(bookmarkTag, ({ one }) => ({
  owner: one(user, {
    fields: [bookmarkTag.userId],
    references: [user.id],
    relationName: "owner",
  }),

  bookmark: one(bookmark, {
    fields: [bookmarkTag.bookmarkId],
    references: [bookmark.id],
  }),

  tag: one(tag, {
    fields: [bookmarkTag.tagId],
    references: [tag.id],
  }),
}));

export const bookmarkTagSelectSchema = createSelectSchema(bookmarkTag);
