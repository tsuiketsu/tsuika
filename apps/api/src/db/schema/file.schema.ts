import { bigint, index, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { referenceUser, timestamps } from "../constants";

export const file = pgTable(
  "files",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: referenceUser,
    storageKey: text().notNull().unique(),
    bucket: text().notNull(),
    originalName: text().notNull(),
    mimeType: text().notNull(),
    sizeBytes: bigint({ mode: "number" }).notNull(),
    createdAt: timestamps.createdAt,
  },
  (t) => [
    index("files_uploaded_by_idx").on(t.userId),
    index("files_mime_type_idx").on(t.mimeType),
  ],
);
