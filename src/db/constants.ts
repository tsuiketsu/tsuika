import { text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./schema/auth.schema";

export const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
};

export const referenceUser = text()
  .references(() => user.id, {
    onDelete: "cascade",
  })
  .notNull();
