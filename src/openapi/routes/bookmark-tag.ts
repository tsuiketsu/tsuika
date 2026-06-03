import { createRoute, z } from "@hono/zod-openapi";
import { bookmarkTagSelectSchema } from "@/db/schema/bookmark-tag.schema";
import { ERROR_DEFINITIONS } from "@/errors/codes";
import { bookmarkTagInsertSchema } from "@/types/schema.types";
import {
  createErrorObject,
  createSources,
  createSuccessObject,
  jsonContentRequired,
} from "../helpers";

const tags = ["Bookmark Tags"];
const sources = createSources("bookmark-tags");

// -----------------------------------------
// ADD BOOKMARK TAGS
// -----------------------------------------
export const createBookmarkTags = createRoute({
  method: "post",
  path: "/",
  summary: "Set tags",
  description: "Assign one or multiple tags to a bookmark",
  tags,
  operationId: "bookmark-tags_post",
  request: {
    body: jsonContentRequired(bookmarkTagInsertSchema),
  },
  responses: {
    200: createSuccessObject({
      data: z.array(bookmarkTagSelectSchema),
      message: "Successfully added tags to bookmark",
    }),
    [ERROR_DEFINITIONS.MISSING_PARAMETER.status]: createErrorObject({
      message: "bookmarkId and at least one tagId are required.",
      code: "MISSING_PARAMETER",
      source: sources.post,
    }),
    [ERROR_DEFINITIONS.CONFLICT.status]: createErrorObject({
      message:
        "Failed to add tags to bookmark. One or more tags may" +
        " already be associated with this bookmark.",
      code: "CONFLICT",
      source: sources.post,
    }),
  },
});

// -----------------------------------------
// REMOVE BOOKMARK TAGS
// -----------------------------------------
export const removeBookmarkTags = createRoute({
  method: "delete",
  path: "/",
  summary: "Unset tags",
  description: "Unset one or multiple tags from bookmark",
  tags,
  operationId: "bookmark-tags_delete",
  request: {
    body: jsonContentRequired(bookmarkTagInsertSchema),
  },
  responses: {
    200: createSuccessObject({
      data: z.array(bookmarkTagSelectSchema),
      message: "Successfully added tags to bookmark",
    }),
    [ERROR_DEFINITIONS.MISSING_PARAMETER.status]: createErrorObject({
      message: "bookmarkId and at least one tagId are required.",
      code: "MISSING_PARAMETER",
      source: sources.delete,
    }),
    [ERROR_DEFINITIONS.CONFLICT.status]: createErrorObject({
      message:
        "Failed to remove tags from bookmark. One or more tags" +
        " may not be associated with this bookmark",
      code: "CONFLICT",
      source: sources.delete,
    }),
  },
});
