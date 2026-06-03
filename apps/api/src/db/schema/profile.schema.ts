import { jsonb, pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { timestamps } from "../constants";
import { user } from "./auth.schema";

export const profile = pgTable("profiles", {
  userId: text("user_id")
    .references(() => user.id, {
      onDelete: "cascade",
    })
    .primaryKey(),
  preferencesJson: jsonb(),
  ...timestamps,
});

export const profileSelectSchema = createSelectSchema(profile, {
  preferencesJson: () => z.object({}),
}).omit({
  userId: true,
});

export const profileInsertSchema = createInsertSchema(profile, {
  userId: z.string().optional(),
  preferencesJson: z.object({}),
});
