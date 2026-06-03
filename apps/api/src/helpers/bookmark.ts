import { createSelectSchema } from "drizzle-zod";
import type z from "zod";
import { bookmark } from "@/db/schema/bookmark.schema";
import meil from "@/lib/meil";

// Constants
const TASK_WAIT_TIMEOUT = 1000000;
const MEIL_INDEX = "bookmarks";

// Types
const selectSchema = createSelectSchema(bookmark);

type Bookmark = z.infer<typeof selectSchema>;

type BookmarkMeili = Partial<Bookmark> & {
  folderPublicId: string | null;
};

// Functions
export async function setupIndex() {
  if (!meil) return;

  let isIndexCreated = true;

  try {
    await meil.getIndex(MEIL_INDEX);
  } catch (_error) {
    isIndexCreated = false;
  }

  if (!isIndexCreated) {
    await meil.createIndex(MEIL_INDEX, { primaryKey: "id" });
  }

  await meil
    .index(MEIL_INDEX)
    .updateFilterableAttributes(["userId", "folderPublicId"])
    .waitTask({ timeout: TASK_WAIT_TIMEOUT })
    .catch((error) =>
      console.error("Failed operation: updateFilterableAttributes", error),
    );
}

export async function addDocument(documents: BookmarkMeili[]) {
  if (!meil) return;

  await setupIndex();

  await meil
    .index(MEIL_INDEX)
    .addDocuments(documents)
    .waitTask({ timeout: TASK_WAIT_TIMEOUT })
    .catch((error) => console.error("Failed to add bookmark index", error));
}

export async function updateDocuments(documents: BookmarkMeili[]) {
  if (!meil) return;

  await setupIndex();

  await meil
    .index(MEIL_INDEX)
    .updateDocuments(documents)
    .waitTask({ timeout: TASK_WAIT_TIMEOUT })
    .catch((error) => console.error("Failed to add bookmark index", error));
}

export async function deleteDocument(id: number) {
  if (!meil) return;

  await meil
    .index(MEIL_INDEX)
    .deleteDocument(id)
    .waitTask({ timeout: TASK_WAIT_TIMEOUT })
    .catch((error) =>
      console.error("Failed to delete bookmark document index", error),
    );
}

export async function deleteDocumentInBulk(ids: number[]) {
  if (!meil) return;

  await meil
    .index(MEIL_INDEX)
    .deleteDocuments(ids)
    .waitTask({ timeout: TASK_WAIT_TIMEOUT })
    .catch((error) =>
      console.error("Failed to delete bookmark indexes", error),
    );
}
