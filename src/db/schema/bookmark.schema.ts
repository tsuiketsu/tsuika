import { relations } from "drizzle-orm";
import {
  bigserial,
  boolean,
  integer,
  pgTable,
  text,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { timestamps } from "../constants";
import { user } from "./auth.schema";
import { bookmarkTag } from "./bookmark-tag.schema";
import { folder } from "./folder.schema";
import { tagSelectSchema } from "./tag.schema";

export const bookmark = pgTable("bookmarks", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  publicId: text("public_id").notNull().unique(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  folderId: integer("folder_id").references(() => folder.id, {
    onDelete: "cascade",
  }),
  title: text("title").notNull().default("Untitled"),
  description: text("description"),
  url: text("url").notNull(),
  faviconUrl: text("favicon_url"),
  thumbnail: text("thumbnail"),
  thumbnailWidth: integer("thumbnail_width"),
  thumbnailHeight: integer("thumbnail_height"),
  nonce: text("nonce"),
  isEncrypted: boolean().default(false),
  isPinned: boolean().default(false),
  isFavourite: boolean().default(false),
  isArchived: boolean().default(false),
  ...timestamps,
});

export const bookmarkRelations = relations(bookmark, ({ one, many }) => ({
  owner: one(user, {
    fields: [bookmark.userId],
    references: [user.id],
    relationName: "owner",
  }),

  bookmarkFolder: one(folder, {
    fields: [bookmark.folderId],
    references: [folder.id],
  }),

  bookmarkTag: many(bookmarkTag),
}));

export const bookmarkSelectSchema = createSelectSchema(bookmark, {
  id: z.string(),
  publicId: z.string().optional(),
  folderId: z.string().optional(),
})
  .omit({ userId: true })
  .extend({
    tags: z
      .array(
        tagSelectSchema.pick({ name: true, color: true }).extend({
          id: z.string(),
        }),
      )
      .optional(),
  });

export const bookmarkInsertSchema = createInsertSchema(bookmark, {
  folderId: z.string().optional(),
  title: z
    .string()
    .max(255)
    .transform((val) => (val.trim() === "" ? undefined : val))
    .optional(),
  description: z.string().optional(),
  url: z.string(),
  nonce: z.string().optional(),
  faviconUrl: z.string().optional(),
  thumbnail: z.string().optional(),
})
  .omit({ userId: true, publicId: true })
  .extend({
    tags: z
      .array(
        tagSelectSchema
          .pick({ name: true, color: true })
          .extend({ id: z.string() }),
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.isEncrypted) {
      try {
        new URL(data.url);
      } catch (_error) {
        ctx.addIssue({
          code: "custom",
          message: "Must be a valid URL",
          path: ["url"],
        });
      }
    } else if (!data.nonce) {
      ctx.addIssue({
        code: "custom",
        message: "nonce is required",
        path: ["nonce"],
      });
    }
  });
