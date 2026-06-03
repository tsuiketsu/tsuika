import { faker } from "@faker-js/faker";
import { createRoute, z } from "@hono/zod-openapi";
import { BOOKMARK_FILTERS } from "@/constants";
import {
  bookmarkInsertSchema,
  bookmarkSelectSchema,
} from "@/db/schema/bookmark.schema";
import { tagSelectSchema } from "@/db/schema/tag.schema";
import { ERROR_DEFINITIONS } from "@/errors/codes";
import { bookmarkExamples as examples } from "@/openapi/examples";
import { bookmarkFlags } from "@/types/schema.types";
import { omit } from "@/utils";
import { addExamples } from "@/utils/zod-utils";
import { paginationQuerySchema } from "../common/schema";
import {
  createErrorObject,
  createIdParamSchema,
  createSources,
  createSuccessObject,
  createUnauthorizedByRoleObject,
  jsonContentRequired,
} from "../helpers";
import { generateFakerNanoIds, generateFakerNanoid } from "../utils";

const tags = ["Bookmarks"];

const sources = createSources("bookmarks");

const SelectSchema = addExamples(
  bookmarkSelectSchema,
  omit(examples, ["id"]),
).extend({
  id: z.string().openapi({ example: examples.publicId }),
  folderId: z.string().optional().openapi({ example: generateFakerNanoid() }),
  tags: z
    .array(
      tagSelectSchema
        .pick({ name: true, color: true })
        .extend({ id: z.string() }),
    )
    .optional()
    .openapi({ example: examples.tags }),
});

const InsertSchema = bookmarkInsertSchema.omit({
  id: true,
  thumbnailHeight: true,
  thumbnailWidth: true,
  createdAt: true,
  updatedAt: true,
});

// -----------------------------------------
// ADD NEW BOOKMARK
// -----------------------------------------
export const createBookmark = createRoute({
  method: "post",
  path: "/",
  description: "Add new bookmark",
  summary: "Create",
  tags,
  operationId: "bookmark_post",
  request: {
    body: jsonContentRequired(InsertSchema),
  },
  responses: {
    200: createSuccessObject({
      data: SelectSchema,
      message: "Bookmark added successfully 🔖",
    }),
    [ERROR_DEFINITIONS.INVALID_PARAMETER.status]: createErrorObject({
      message: "Url is required",
      code: "INVALID_PARAMETER",
      source: sources.post,
    }),
    [ERROR_DEFINITIONS.INTERNAL_ERROR.status]: createErrorObject({
      message: "Failed to add bookmark",
      code: "INTERNAL_ERROR",
      source: sources.post,
    }),
  },
});

// -----------------------------------------
// GET TOTAL BOOKMARKS COUNT
// -----------------------------------------
export const getTotalBookmarksCount = createRoute({
  method: "get",
  path: "/total-count",
  description: "Total bookmarks count",
  summary: "Total Count",
  tags,
  operationId: "bookmarks_total_count_get",
  responses: {
    200: createSuccessObject({
      data: z.object({ total: z.number().openapi({ example: 1 }) }),
      message: "Successfully fetched total bookmarks count",
    }),
    [ERROR_DEFINITIONS.NOT_FOUND.status]: createErrorObject({
      code: "NOT_FOUND",
      message: "No bookmarks found",
      source: sources.get,
    }),
  },
});

// -----------------------------------------
// GET ALL BOOKMARK URLS
// -----------------------------------------
export const getBookmarkUrls = createRoute({
  method: "get",
  path: "/urls",
  description: "Get all bookmark URLs",
  summary: "Fetch URLs",
  tags,
  operationId: "bookmark_urls_get",
  request: {
    query: z.object({
      folderId: z.string().openapi({
        example: generateFakerNanoid(),
      }),
    }),
  },
  responses: {
    200: createSuccessObject({
      data: z.object({
        urls: z.array(z.string()).openapi({
          example: Array.from({ length: 4 }).map(() => faker.internet.url()),
        }),
      }),
      message: "Successfully fetched urls",
    }),
    [ERROR_DEFINITIONS.INTERNAL_ERROR.status]: createErrorObject({
      desc: "Failed to fetch urls",
      message: "Failed to fetch urls",
      code: "INTERNAL_ERROR",
      source: sources.get,
    }),
  },
});

// -----------------------------------------
// GET ALL BOOKMARKS OR QUERY BY PARAM
// -----------------------------------------
export const getBookmarks = createRoute({
  method: "get",
  path: "/",
  description: "Get all bookmarks",
  summary: "Fetch All",
  tags,
  operationId: "bookmarks_id_get",
  request: {
    query: z
      .object({
        query: z.string().optional(),
        filter: z.preprocess(
          (val) => (val === "" ? undefined : val),
          z.enum(BOOKMARK_FILTERS).optional(),
        ),
      })
      .extend(paginationQuerySchema.shape)
      .partial(),
  },
  responses: {
    200: createSuccessObject({
      data: z.array(SelectSchema),
      message: "Successfully fetched bookmarks",
      isPagination: true,
    }),
    [ERROR_DEFINITIONS.NOT_FOUND.status]: createErrorObject({
      desc: "If bookmarks not found",
      message: "Bookmarks not found",
      code: "NOT_FOUND",
      source: sources.get,
    }),
  },
});

// -----------------------------------------
// SEARCH BOOKMARKS
// -----------------------------------------
export const searchBookmarks = createRoute({
  method: "get",
  path: "/search",
  summary: "Search",
  tags,
  operationId: "bookmarks_search_get",
  request: {
    query: z.object({
      query: z.string().optional(),
      folderPublicId: z.string().optional(),
    }),
  },
  responses: {
    200: createSuccessObject({
      data: z.array(
        SelectSchema.pick({
          id: true,
          url: true,
          title: true,
          thumbnail: true,
        }).extend({
          folderPublicId: z.string(),
        }),
      ),
      message: "Successfully fetched results",
      isPagination: true,
    }),
    [ERROR_DEFINITIONS.INTERNAL_ERROR.status]: createErrorObject({
      message: "Failed to fetch search results",
      code: "INTERNAL_ERROR",
      source: sources.get,
    }),
    [ERROR_DEFINITIONS.NOT_FOUND.status]: createErrorObject({
      message: "Not bookmarks with the given query found",
      code: "NOT_FOUND",
      source: sources.get,
    }),
  },
});

// -----------------------------------------
// GET BOOKMARKS BY TAG PUBLIC ID
// -----------------------------------------
export const getBookmarkByTagId = createRoute({
  method: "get",
  path: "/tag/{publicId}",
  description: "Get bookmark by id",
  summary: "Fetch by ID",
  tags,
  operationId: "bookmark_id_get",
  request: {
    query: paginationQuerySchema,
  },
  responses: {
    200: createSuccessObject({
      data: z.array(SelectSchema),
      message: "Successfully fetched bookmarks",
    }),
    [ERROR_DEFINITIONS.INVALID_PARAMETER.status]: createErrorObject({
      desc: "If publicId not provided or empty string",
      message: "Invalid tag id",
      code: "INVALID_PARAMETER",
      source: sources.get,
    }),
    [ERROR_DEFINITIONS.NOT_FOUND.status]: createErrorObject({
      desc: "If tag with provided id not found or no bookmark exists under that tag",
      message: `No bookmarks associated with tag ${generateFakerNanoid()}`,
      code: "NOT_FOUND",
      source: sources.get,
    }),
  },
});

// -----------------------------------------
// GET BOOKMARKS BY FOLDER ID
// -----------------------------------------
export const getBookmarksByFolderId = createRoute({
  method: "get",
  path: "/folder/{id}",
  description: "Get bookmarks by folder",
  summary: "Folder contents",
  tags,
  operationId: "bookmarks_by_folder_id_get",
  request: {
    query: paginationQuerySchema,
  },
  responses: {
    200: createSuccessObject({
      data: z.array(SelectSchema),
      message: "Successfully fetched all bookmarks",
    }),
    // 200: {
    //   description: "Successfully fetched all bookmarks",
    //   content: {
    //     "application/json": {
    //       schema: addExamples(successSchema, {
    //         message: "Successfully fetched all bookmarks",
    //       }).extend({
    //         data: z.array(SelectSchema),
    //         pagination: paginationSchema,
    //       }),
    //     },
    //   },
    // },
    [ERROR_DEFINITIONS.INVALID_INPUT.status]: createErrorObject({
      desc: "Missing folderId parameter",
      code: "INVALID_PARAMETER",
      message: "Invalid folder name",
      source: sources.get,
    }),
    [ERROR_DEFINITIONS.NOT_FOUND.status]: createErrorObject({
      desc: "No bookmarks found",
      code: "NOT_FOUND",
      message: "No bookmarks exists in the folder",
      source: sources.get,
    }),
  },
});

// -----------------------------------------
// GET BOOKMARK BY ID
// -----------------------------------------
export const getBookmarkById = createRoute({
  method: "get",
  path: "/{id}",
  description: "Get bookmark by id",
  summary: "Fetch One",
  tags,
  operationId: "bookmark_id_get",
  responses: {
    200: createSuccessObject({
      data: SelectSchema,
      message: "Successfully fetched bookmark",
    }),
    [ERROR_DEFINITIONS.MISSING_PARAMETER.status]: createErrorObject({
      desc: "If bookmark id not provided",
      message: "Bookmark ID is required",
      code: "MISSING_PARAMETER",
      source: sources.get,
    }),
    [ERROR_DEFINITIONS.UNAUTHORIZED.status]: createUnauthorizedByRoleObject(
      sources.get,
    ),
    [ERROR_DEFINITIONS.NOT_FOUND.status]: createErrorObject({
      desc: "If bookmark not found by provided bookmark_id",
      message: `Bookmark with ${generateFakerNanoid()} not found`,
      code: "NOT_FOUND",
      source: sources.get,
    }),
  },
});

// -----------------------------------------
// UPDATE BOOKMARK
// -----------------------------------------
export const updateBookmark = createRoute({
  method: "put",
  path: "/{id}",
  summary: "Update",
  tags,
  operationId: "bookmark_update_put",
  request: {
    body: jsonContentRequired(InsertSchema),
  },
  responses: {
    200: createSuccessObject({
      data: SelectSchema,
      message: "Bookmark updated successfully 🔖",
    }),
    [ERROR_DEFINITIONS.UNAUTHORIZED.status]: createUnauthorizedByRoleObject(
      sources.put,
    ),
    [ERROR_DEFINITIONS.NOT_FOUND.status]: createErrorObject({
      message: "Bookmark not found",
      code: "NOT_FOUND",
      source: sources.put,
    }),
    [ERROR_DEFINITIONS.INTERNAL_ERROR.status]: createErrorObject({
      message: "Failed to update bookmark",
      code: "INTERNAL_ERROR",
      source: sources.put,
    }),
  },
});

// -----------------------------------------
// DELETE BOOKMARKS IN BULK
// -----------------------------------------
export const deleteBookmarkInBulk = createRoute({
  method: "delete",
  path: "/bulk",
  summary: "Delete Many",
  tags,
  operationId: "bookmarks_bulk_delete",
  request: {
    body: jsonContentRequired(
      z.object({
        bookmarkIds: z.array(z.string()),
      }),
    ),
  },
  responses: {
    200: createSuccessObject({
      data: z.array(
        z.string().openapi({
          example: generateFakerNanoIds(5),
        }),
      ),
      message: "Successfully deleted selected bookmarks",
    }),
    [ERROR_DEFINITIONS.UNAUTHORIZED.status]: createUnauthorizedByRoleObject(
      sources.delete,
    ),
    [ERROR_DEFINITIONS.MISSING_PARAMETER.status]: createErrorObject({
      message: "Bookmark IDs are required",
      code: "MISSING_PARAMETER",
      source: sources.delete,
    }),
  },
});

// -----------------------------------------
// DELETE BOOKMARK BY ID
// -----------------------------------------
export const deleteBookmarkById = createRoute({
  method: "delete",
  path: "/{id}",
  summary: "Delete One",
  tags,
  operationId: "bookmarks_by_id_delete",
  request: { params: createIdParamSchema("id") },
  responses: {
    200: createSuccessObject({
      data: z.null(),
      message: "Successfully deleted bookmark 🔖",
    }),
    [ERROR_DEFINITIONS.UNAUTHORIZED.status]: createUnauthorizedByRoleObject(
      sources.delete,
    ),
    [ERROR_DEFINITIONS.INTERNAL_ERROR.status]: createErrorObject({
      message: "Failed to delete bookmark",
      code: "INTERNAL_ERROR",
      source: sources.delete,
    }),
  },
});

// -----------------------------------------
// UPDATE BOOKMARK THUMBNAIL
// -----------------------------------------
export const updateBookmarkThumbnail = createRoute({
  method: "patch",
  path: "/{id}/thumbnail",
  summary: "Change thumbnail",
  tags,
  operationId: "bookmarks_update_thumbnail_patch",
  request: { params: createIdParamSchema("id") },
  responses: {
    200: createSuccessObject({
      data: z.object({
        thumbnail: z.string().openapi({
          example: "https://placehold.co/1280x698",
        }),
      }),
      message: "Successfully updated thumbnail",
    }),
    [ERROR_DEFINITIONS.UNAUTHORIZED.status]: createUnauthorizedByRoleObject(
      sources.patch,
    ),
    [ERROR_DEFINITIONS.REQUIRED_FIELD.status]: createErrorObject({
      message: "Thumbnail image file is required",
      code: "REQUIRED_FIELD",
      source: sources.patch,
    }),
    [ERROR_DEFINITIONS.THIRD_PARTY_SERVICE_FAILED.status]: createErrorObject({
      message: "Failed to update thumbnail",
      code: "THIRD_PARTY_SERVICE_FAILED",
      source: sources.patch,
    }),
  },
});

// -----------------------------------------
// ADD BOOKMARKS TO A FOLDER IN BULK
// -----------------------------------------
export const addBookmarksToFolder = createRoute({
  method: "patch",
  path: "/folder/{folderId}/bulk-assign-folder",
  summary: "Move",
  description: "Move selected bookmarks by id to a specified folder",
  tags,
  operationId: "bookmarks_move_to_folder_patch",
  request: {
    params: createIdParamSchema("folderId"),
    body: jsonContentRequired(
      z.object({
        bookmarkIds: z.array(z.string()),
      }),
    ),
  },
  responses: {
    200: createSuccessObject({
      data: z.null(),
      message: `Bookmarks added to selected folder with id ${generateFakerNanoid()}`,
    }),
    [ERROR_DEFINITIONS.MISSING_PARAMETER.status]: createErrorObject({
      message: "folderId  required",
      code: "MISSING_PARAMETER",
      source: sources.patch,
    }),
    [ERROR_DEFINITIONS.INTERNAL_ERROR.status]: createErrorObject({
      message: "Failed to add bookmarks to folder",
      code: "INTERNAL_ERROR",
      source: sources.patch,
    }),
  },
});

// -----------------------------------------
// TOGGLE BOOKMARK PIN, FAVORITE, ARCHIVE
// -----------------------------------------
export const toggleBookmarkFlag = createRoute({
  method: "patch",
  path: "/{id}/{flag}",
  summary: "Toggle Flag",
  description: "Toggle bookmark flag",
  tags,
  operationId: "bookmark_flag_toggle_patch",
  request: {
    body: jsonContentRequired(
      z.object({
        state: z.boolean(),
      }),
    ),
    params: z.object({
      id: z.string().openapi({
        param: { name: "id", in: "path" },
      }),
      flag: z.enum(Object.values(bookmarkFlags)).openapi({
        param: { name: "flag", in: "path" },
      }),
    }),
  },
  responses: {
    200: createSuccessObject({
      data: z.any().optional(),
      message: "Successfully set flag",
    }),
    [ERROR_DEFINITIONS.NOT_FOUND.status]: createErrorObject({
      message: `Bookmark with id ${generateFakerNanoid()} not found`,
      code: "NOT_FOUND",
      source: sources.patch,
    }),
    [ERROR_DEFINITIONS.UNAUTHORIZED.status]: createUnauthorizedByRoleObject(
      sources.patch,
    ),
    [ERROR_DEFINITIONS.MISSING_PARAMETER.status]: createErrorObject({
      message: "Bookmark ID is required",
      code: "MISSING_PARAMETER",
      source: sources.patch,
    }),
    [ERROR_DEFINITIONS.INTERNAL_ERROR.status]: createErrorObject({
      message: "Failed to change flag",
      code: "INTERNAL_ERROR",
      source: sources.patch,
    }),
  },
});
