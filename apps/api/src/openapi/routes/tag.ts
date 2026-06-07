import { createRoute, z } from "@hono/zod-openapi";
import { tagInsertSchema, tagSelectSchema } from "@/db/schema/tag.schema";
import { ERROR_DEFINITIONS } from "@/errors/codes";
import { addExamples } from "@/utils/zod-utils";
import { tagExamples } from "../examples";
import {
  createErrorObject,
  createIdParamSchema,
  createSources,
  createSuccessObject,
  jsonContentRequired,
} from "../helpers";

const sources = createSources("tags");
const tags = ["Tags"];

// -----------------------------------------
// ADD NEW TAG
// -----------------------------------------
export const createTag = createRoute({
  method: "post",
  path: "/",
  summary: "Create",
  description: "Create new tag",
  tags,
  operationId: "tags_create_post",
  request: {
    body: jsonContentRequired(tagInsertSchema),
  },
  responses: {
    200: createSuccessObject({
      data: addExamples(tagSelectSchema, {
        ...tagExamples[0],
      }),
      message: "Successfully added tag",
    }),
    [ERROR_DEFINITIONS.INVALID_PARAMETER.status]: createErrorObject({
      message: "Color must be a valid CSS color value",
      code: "INVALID_PARAMETER",
      source: sources.post,
    }),
    [ERROR_DEFINITIONS.INTERNAL_ERROR.status]: createErrorObject({
      message: "Failed to add tag",
      code: "INTERNAL_ERROR",
      source: sources.post,
    }),
  },
});

// -----------------------------------------
// GET TOTAL TAGS COUNT
// -----------------------------------------
export const getTotalTagsCount = createRoute({
  method: "get",
  path: "/total-tags",
  summary: "Total Count",
  description: "Get total count of all tags",
  tags,
  operationId: "tags_total_count_get",
  responses: {
    200: createSuccessObject({
      data: z.object({ total: z.number() }),
      message: "Successfully fetched total tags count",
    }),
    [ERROR_DEFINITIONS.NOT_FOUND.status]: createErrorObject({
      message: "No tags found",
      code: "NOT_FOUND",
      source: sources.get,
    }),
  },
});

// -----------------------------------------
// GET ALL TAGS
// -----------------------------------------
export const getAllTags = createRoute({
  method: "get",
  path: "/",
  summary: "Fetch All",
  description: "Get all tags",
  tags,
  operationId: "tags_all_get",
  request: { query: z.object({ orderBy: z.enum(["asc", "desc"]).optional() }) },
  responses: {
    200: createSuccessObject({
      data: z.array(tagSelectSchema).openapi({ example: tagExamples }),
      message: "Successfully fetched all tags",
      isPagination: true,
    }),
    [ERROR_DEFINITIONS.INVALID_PARAMETER.status]: createErrorObject({
      message: "Invalid order direction",
      code: "INVALID_PARAMETER",
      source: sources.get,
    }),
    [ERROR_DEFINITIONS.NOT_FOUND.status]: createErrorObject({
      message: "No tags found",
      code: "NOT_FOUND",
      source: sources.get,
    }),
  },
});

// -----------------------------------------
// SEARCH TAG
// -----------------------------------------
export const searchTag = createRoute({
  method: "get",
  path: "/search",
  summary: "Search",
  description: "Search for tag by id or name",
  tags,
  operationId: "tags_search_get",
  request: { query: z.object({ id: z.string(), name: z.string() }) },
  responses: {
    200: createSuccessObject({
      data: z.array(tagSelectSchema).openapi({ example: tagExamples }),
      message: "Successfully fetched tags",
      isPagination: true,
    }),
    [ERROR_DEFINITIONS.MISSING_PARAMETER.status]: createErrorObject({
      message:
        "Missing required parameter: either `name` or `id` must be provided. " +
        "If both are provided, `id` will take priority.",
      code: "MISSING_PARAMETER",
      source: sources.get,
    }),
    [ERROR_DEFINITIONS.NOT_FOUND.status]: createErrorObject({
      message: "No tags found",
      code: "NOT_FOUND",
      source: sources.get,
    }),
  },
});

// -----------------------------------------
// UPDATE TAG
// -----------------------------------------
export const updateTag = createRoute({
  method: "put",
  path: "/{id}",
  summary: "Update",
  description: "Update tag by id",
  tags,
  operationId: "tags_update_put",
  request: {
    params: createIdParamSchema("id"),
    body: jsonContentRequired(
      tagInsertSchema.pick({ color: true, name: true }),
    ),
  },
  responses: {
    200: createSuccessObject({
      data: tagSelectSchema,
      message: "Successfully updated tag",
    }),
    [ERROR_DEFINITIONS.INTERNAL_ERROR.status]: createErrorObject({
      message: "Failed to update tag",
      code: "INTERNAL_ERROR",
      source: sources.put,
    }),
  },
});

// -----------------------------------------
// DELETE TAG
// -----------------------------------------
export const deleteTag = createRoute({
  method: "delete",
  path: "/{id}",
  summary: "Remove",
  description: "Delete tag by tag id",
  tags,
  operationId: "tags_delete",
  request: {
    params: createIdParamSchema("id"),
  },
  responses: {
    200: createSuccessObject({
      data: z.any().optional(),
      message: "Successfully deleted tag",
    }),
    [ERROR_DEFINITIONS.INTERNAL_ERROR.status]: createErrorObject({
      message: "Failed to delete tag",
      code: "INTERNAL_ERROR",
      source: sources.delete,
    }),
  },
});
