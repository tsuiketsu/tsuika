import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as assetSchema from "./schema/asset.schema";
import * as authSchema from "./schema/auth.schema";
import * as bookmarkSchema from "./schema/bookmark.schema";
import * as bookmarkTasks from "./schema/bookmark.schema";
import * as bookmarkTagSchema from "./schema/bookmark-tag.schema";
import * as collabFolderSchema from "./schema/collab-folder.schema";
import * as folderSchema from "./schema/folder.schema";
import * as profileSchema from "./schema/profile.schema";
import * as sharedFolderSchema from "./schema/shared-folder.schema";
import * as tagSchema from "./schema/tag.schema";
import * as taskSchema from "./schema/task.schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle({
  schema: {
    ...authSchema,
    ...profileSchema,
    ...bookmarkSchema,
    ...tagSchema,
    ...bookmarkTagSchema,
    ...folderSchema,
    ...taskSchema,
    ...bookmarkTasks,
    ...sharedFolderSchema,
    ...collabFolderSchema,
    ...assetSchema,
  },
  client: pool,
  casing: "snake_case",
});
