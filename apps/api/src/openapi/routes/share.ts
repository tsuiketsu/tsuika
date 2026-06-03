import { createRoute, z } from "@hono/zod-openapi";
import {
  sharedFolderInsertSchema,
  sharedFolderSelectSchema,
} from "@/db/schema/shared-folder.schema";
import { ERROR_DEFINITIONS } from "@/errors/codes";
import {
  createErrorObject,
  createIdParamSchema,
  createSources,
  createSuccessObject,
  jsonContentRequired,
} from "../helpers";

const tags = ["Shared Folder"];
const sources = createSources("shared-folders");

// -----------------------------------------
// INSERT INTO SHARED-FOLDERS | SHARE FOLDER
// -----------------------------------------
export const insertIntoSharedFolders = createRoute({
  method: "post",
  path: "/",
  summary: "Publish",
  tags,
  operationId: "shared-folders_post",
  request: {
    body: jsonContentRequired(sharedFolderInsertSchema),
  },
  responses: {
    200: createSuccessObject({
      data: sharedFolderSelectSchema,
      message: "Successfully made folder public",
    }),
    [ERROR_DEFINITIONS.INTERNAL_ERROR.status]: createErrorObject({
      message: "Failed to make folder public",
      code: "INTERNAL_ERROR",
      source: sources.post,
    }),
  },
});

// -----------------------------------------
// UPDATE SHARED FOLDER
// -----------------------------------------
export const updateSharedFolder = createRoute({
  method: "put",
  path: "/{publicId}",
  description: "Update shared folder",
  summary: "Update",
  tags,
  operationId: "shared-folders_update_put",
  request: {
    params: createIdParamSchema("publicId"),
    body: jsonContentRequired(sharedFolderInsertSchema),
  },
  responses: {
    200: createSuccessObject({
      data: sharedFolderSelectSchema,
      message: "Successfully updated shared-folder",
    }),
    [ERROR_DEFINITIONS.MISSING_PARAMETER.status]: createErrorObject({
      message: "publicId is missing",
      code: "MISSING_PARAMETER",
      source: sources.put,
    }),
    [ERROR_DEFINITIONS.INTERNAL_ERROR.status]: createErrorObject({
      message: "Failed to update folder",
      code: "INTERNAL_ERROR",
      source: sources.put,
    }),
  },
});

// -----------------------------------------
// GET SHARED FOLDER INFO
// -----------------------------------------
export const getSharedFolderInfo = createRoute({
  method: "get",
  path: "/{publicId}",
  description: "Ger folder's info/metadata",
  summary: "Folder Info",
  tags,
  operationId: "shared-folders_info_get",
  request: { params: createIdParamSchema("publicId") },
  responses: {
    200: createSuccessObject({
      data: sharedFolderSelectSchema,
      message: "Successfully fetched shared-folder entry",
    }),
    [ERROR_DEFINITIONS.MISSING_PARAMETER.status]: createErrorObject({
      message: "publicId is missing",
      code: "MISSING_PARAMETER",
      source: sources.get,
    }),
    [ERROR_DEFINITIONS.INTERNAL_ERROR.status]: createErrorObject({
      message: "Failed to fetch shared-folder info",
      code: "INTERNAL_ERROR",
      source: sources.get,
    }),
  },
});

// -----------------------------------------
// UN-PUBLISH FOLDER
// -----------------------------------------
export const unpublishSharedFolder = createRoute({
  method: "patch",
  path: "/{publicId}/unpublish",
  summary: "Unpublish",
  tags,
  operationId: "shared-folders_info_get",
  request: { params: createIdParamSchema("publicId") },
  responses: {
    200: createSuccessObject({
      data: z.object({ id: z.string() }),
      message: "Successfully unpublished folder",
    }),
    [ERROR_DEFINITIONS.MISSING_PARAMETER.status]: createErrorObject({
      message: "publicId is missing",
      code: "MISSING_PARAMETER",
      source: sources.patch,
    }),
    [ERROR_DEFINITIONS.INTERNAL_ERROR.status]: createErrorObject({
      message: "Failed to un-publish folder",
      code: "INTERNAL_ERROR",
      source: sources.patch,
    }),
  },
});

// -----------------------------------------
// GET SHARED FOLDER'S CONTENT (BOOKMARKS)
// -----------------------------------------
export const getSharedFolderContent = createRoute({
  method: "get",
  path: "/{username}/folder/{publicId}",
  description: "Get bookmarks from shared folder",
  summary: "Fetch bookmarks",
  tags,
  operationId: "shared-folders_bookmarks_get",
  request: {
    params: z.object({
      username: z.string(),
      publicId: z.string(),
    }),
  },
  responses: {
    200: createSuccessObject({
      data: z.any(),
      message: "Successfully fetched bookmarks",
    }),
    [ERROR_DEFINITIONS.MISSING_PARAMETER.status]: createErrorObject({
      message: "publicId is required",
      code: "MISSING_PARAMETER",
      source: sources.get,
    }),
    [ERROR_DEFINITIONS.NOT_FOUND.status]: createErrorObject({
      message: "User or Folder not found",
      code: "NOT_FOUND",
      source: sources.get,
    }),
    [ERROR_DEFINITIONS.FORBIDDEN.status]: createErrorObject({
      message: "User unpublished this folder/This content expired at <date>",
      code: "FORBIDDEN",
      source: sources.get,
    }),
    [ERROR_DEFINITIONS.UNAUTHORIZED.status]: createErrorObject({
      message: "User is not authorized/Invalid or expired token",
      code: "UNAUTHORIZED",
      source: sources.get,
    }),
    [ERROR_DEFINITIONS.INTERNAL_ERROR.status]: createErrorObject({
      message: "Failed to fetch folder's data",
      code: "INTERNAL_ERROR",
      source: sources.get,
    }),
  },
});

// -----------------------------------------
// UNLOCK SHARED FOLDER IF LOCKED
// -----------------------------------------
export const unlockSharedFolder = createRoute({
  method: "post",
  path: "/folder/{publicId}/unlock",
  description: "Unlock published/shared folder if locked with password",
  summary: "Unlock Folder",
  tags,
  operationId: "shared-folders_unlock_post",
  request: {
    params: createIdParamSchema("publicId"),
  },
  responses: {
    200: createSuccessObject({
      data: z.any().optional(),
      message: "Folder unlocked!",
    }),
    [ERROR_DEFINITIONS.NOT_FOUND.status]: createErrorObject({
      message: "Requested folder not found",
      code: "NOT_FOUND",
      source: "share.folder.unlock.post",
    }),
    [ERROR_DEFINITIONS.INTERNAL_ERROR.status]: createErrorObject({
      message: "Failed to verify password",
      code: "NOT_FOUND",
      source: "share.folder.unlock.post",
    }),
    [ERROR_DEFINITIONS.UNAUTHORIZED.status]: createErrorObject({
      message: "Password is incorrect",
      code: "UNAUTHORIZED",
      source: "share.folder.unlock.post",
    }),
  },
});

// -----------------------------------------
// LOCK SHARED FOLDER
// -----------------------------------------
export const lockSharedFolder = createRoute({
  method: "post",
  path: "/folder/{publicId}/lock",
  description: "Lock published/shared folder if unlocked",
  summary: "Lock Folder",
  tags,
  operationId: "shared-folders_lock_post",
  request: {
    params: createIdParamSchema("publicId"),
  },
  responses: {
    200: createSuccessObject({
      data: z.any().nullable(),
      message: "Successfully locked folder with id <passed_folder_id>",
    }),
    [ERROR_DEFINITIONS.REQUIRED_FIELD.status]: createErrorObject({
      message: "id is required",
      code: "REQUIRED_FIELD",
      source: "share.folder.lock.post",
    }),
  },
});
