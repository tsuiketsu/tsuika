import { and, eq, inArray } from "drizzle-orm";
import { throwError } from "@/errors/handlers";
import {
  createBookmarkTags,
  removeBookmarkTags,
} from "@/openapi/routes/bookmark-tag";
import { db } from "../db";
import { bookmarkTag } from "../db/schema/bookmark-tag.schema";
import { createRouter } from "../lib/create-app";
import type { BookmarkTagType } from "../types/schema.types";
import { getUserId } from "../utils";

const router = createRouter();

// -----------------------------------------
// ADD BOOKMARK TAGS
// -----------------------------------------
router.openapi(createBookmarkTags, async (c) => {
  const { tagIds, bookmarkId } = c.req.valid("json");

  if (!bookmarkId || !tagIds || tagIds.length === 0) {
    throwError(
      "MISSING_PARAMETER",
      "bookmarkId and at least one tagId are required.",
      "bookmark-tags.post",
    );
  }

  const userId = await getUserId(c);

  const data: BookmarkTagType[] = await db
    .insert(bookmarkTag)
    .values(
      tagIds.map((tagId) => ({
        bookmarkId,
        tagId,
        userId,
      })),
    )
    .onConflictDoNothing()
    .returning();

  if (data.length === 0 || data[0] == null) {
    throwError(
      "CONFLICT",
      "Failed to add tags to bookmark. One or more tags may already be associated with this bookmark.",
      "bookmark-tags.post",
    );
  }

  return c.json(
    {
      success: true,
      data,
      message: "Successfully added tags to bookmark",
    },
    200,
  );
});

// -----------------------------------------
// REMOVE BOOKMARK TAGS
// -----------------------------------------
router.openapi(removeBookmarkTags, async (c) => {
  const { tagIds, bookmarkId } = c.req.valid("json");

  if (!bookmarkId || !tagIds || tagIds.length === 0) {
    throwError(
      "MISSING_PARAMETER",
      "bookmarkId and at least one tagId are required.",
      "bookmark-tags.delete",
    );
  }

  const userId = await getUserId(c);

  const data: BookmarkTagType[] = await db
    .delete(bookmarkTag)
    .where(
      and(
        eq(bookmarkTag.userId, userId),
        eq(bookmarkTag.bookmarkId, bookmarkId),
        inArray(bookmarkTag.tagId, tagIds),
      ),
    )
    .returning();

  if (data.length === 0 || data[0] == null) {
    throwError(
      "CONFLICT",
      "Failed to remove tags from bookmark. One or more tags may not be associated with this bookmark",
      "bookmark-tags.delete",
    );
  }

  return c.json(
    {
      success: true,
      data,
      message: "Successfully deleted one or more tags from bookmark",
    },
    200,
  );
});

export default router;
