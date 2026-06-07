import { relations } from "drizzle-orm";
import { bigserial, integer, pgTable, text, unique } from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";
import { timestamps } from "../constants";
import { user } from "./auth.schema";
import { bookmarkTag } from "./bookmark-tag.schema";

export const tag = pgTable(
  "tags",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    publicId: text("public_id").notNull().unique(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    color: text("color").notNull(),
    useCount: integer("use_count").default(0),
    ...timestamps,
  },
  (t) => [unique().on(t.userId, t.name)],
);

export const tagRelations = relations(tag, ({ one, many }) => ({
  owner: one(user, {
    fields: [tag.userId],
    references: [user.id],
    relationName: "owner",
  }),

  bookmarkTag: many(bookmarkTag),
}));

export const tagSelectSchema = createSelectSchema(tag)
  .omit({
    userId: true,
    publicId: true,
  })
  .extend({ id: z.string() });

export const tagInsertSchema = createInsertSchema(tag, {
  name: z.string({ message: "Tag Name is required" }).max(30),
  color: z.string({ message: "Tag Color is required" }).min(6).max(15),
}).pick({ name: true, color: true });

export const tagUpdateSchema = createUpdateSchema(tag, {
  id: z.string(),
  name: z.string().max(30).optional(),
  color: z.string().min(6).max(15).optional(),
}).pick({ name: true, color: true });
