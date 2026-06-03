import { faker } from "@faker-js/faker";
import { createRoute, z } from "@hono/zod-openapi";
import { createSelectSchema } from "drizzle-zod";
import { user } from "@/db/schema/auth.schema";
import {
  folderInsertSchema,
  folderSelectSchema,
} from "@/db/schema/folder.schema";
import { ERROR_DEFINITIONS } from "@/errors/codes";
import { FolderPermissionLevelSchema } from "@/types/schema.types";
import { addExamples } from "@/utils/zod-utils";
import { folderExamples as examples } from "../examples";
import {
  createErrorObject,
  createIdParamSchema,
  createSources,
  createSuccessObject,
  jsonContentRequired,
} from "../helpers";
import { generateFakerNanoid } from "../utils";

const tags = ["Folders"];

const SelectSchema = addExamples(folderSelectSchema, examples);

const sources = createSources("folders");

const generateRandomFolders = (length: number) =>
  Array.from({ length }).map(() => ({
    id: generateFakerNanoid(),
    name: faker.word.sample(),
  }));

// -----------------------------------------
// GET ALL FOLDERS
// -----------------------------------------
export const getAllFolders = createRoute({
  method: "get",
  path: "/all",
  description: "Get all folders",
  summary: "Fetch All",
  tags,
  operationId: "folders_all_get",
  responses: {
    200: createSuccessObject({
      data: z.array(z.object({ id: z.string(), name: z.string() })).openapi({
        example: generateRandomFolders(5),
      }),
      message: "Successfully fetched folders",
    }),
  },
  [ERROR_DEFINITIONS.NOT_FOUND.status]: createErrorObject({
    message: "No folders found for the current user",
    code: "NOT_FOUND",
    source: sources.get,
  }),
});

// -----------------------------------------
// GET TOTAL FOLDERS COUNT
// -----------------------------------------
export const getTotalFoldersCount = createRoute({
  method: "get",
  path: "/total-count",
  description: "Get total folders count",
  summary: "Total Folders",
  tags,
  operationId: "folders_total_get",
  responses: {
    200: createSuccessObject({
      data: z.object({
        total: z.number().openapi({
          example: 5,
        }),
      }),
      message: "Successfully fetched total folders count",
    }),
  },
  [ERROR_DEFINITIONS.NOT_FOUND.status]: createErrorObject({
    message: "No folders found",
    code: "NOT_FOUND",
    source: sources.get,
  }),
});

// -----------------------------------------
// GET FOLDERS
// -----------------------------------------
export const getFolders = createRoute({
  method: "get",
  path: "/",
  description: "Get folders in pagination format",
  summary: "Fetch Many",
  tags,
  operationId: "folders_many_get",
  responses: {
    200: createSuccessObject({
      data: z.array(SelectSchema),
      message: "Successfully fetched folders",
      isPagination: true,
    }),
    [ERROR_DEFINITIONS.NOT_FOUND.status]: createErrorObject({
      message: "No folders found for the current user",
      code: "NOT_FOUND",
      source: sources.get,
    }),
  },
});

// -----------------------------------------
// ADD NEW FOLDER
// -----------------------------------------
export const createFolder = createRoute({
  method: "post",
  path: "/",
  description: "Create new folder",
  summary: "Create",
  tags,
  operationId: "folders_create_post",
  request: {
    body: jsonContentRequired(folderInsertSchema),
  },
  responses: {
    200: createSuccessObject({
      data: SelectSchema,
      message: "Successfully added folder",
    }),
    [ERROR_DEFINITIONS.MISSING_PARAMETER.status]: createErrorObject({
      message: `Missing: ${Object.keys(examples.settings ?? {}).join(", ")}`,
      code: "MISSING_PARAMETER",
      source: sources.post,
    }),
    [ERROR_DEFINITIONS.CONFLICT.status]: createErrorObject({
      message: `Folder with name ${faker.word.sample} already exists`,
      code: "CONFLICT",
      source: sources.post,
    }),
    [ERROR_DEFINITIONS.INTERNAL_ERROR.status]: createErrorObject({
      message: "Failed to add folder",
      code: "INTERNAL_ERROR",
      source: sources.post,
    }),
  },
});

// -----------------------------------------
// UPDATE FOLDER
// -----------------------------------------
export const updateFolder = createRoute({
  method: "put",
  path: "/{id}",
  description: "Create new folder",
  summary: "Create",
  tags,
  operationId: "folders_create_post",
  request: {
    params: createIdParamSchema("id"),
    body: jsonContentRequired(folderInsertSchema),
  },
  responses: {
    200: createSuccessObject({
      data: SelectSchema,
      message: "Successfully updated folder",
    }),
    [ERROR_DEFINITIONS.INTERNAL_ERROR.status]: createErrorObject({
      message: "Failed to add folder",
      code: "INTERNAL_ERROR",
      source: sources.put,
    }),
  },
});

// -----------------------------------------
// DELETE FOLDER
// -----------------------------------------
export const deleteFolder = createRoute({
  method: "delete",
  path: "/{id}",
  description: "Delete folder",
  summary: "Remove",
  tags,
  operationId: "folders_remove_delete",
  request: {
    params: createIdParamSchema("id"),
  },
  responses: {
    200: createSuccessObject({
      data: SelectSchema,
      message: "Successfully deleted selected folder",
    }),
    [ERROR_DEFINITIONS.INTERNAL_ERROR.status]: createErrorObject({
      message: "Failed to delete folder",
      code: "INTERNAL_ERROR",
      source: sources.delete,
    }),
  },
});

// -----------------------------------------
// GET COLLABORATIVE FOLDERS
// -----------------------------------------
export const getCollabFolders = createRoute({
  method: "get",
  path: "/collabs",
  description: "Get all folders that are shared with other members",
  summary: "Fetch Collaborative",
  tags,
  operationId: "folders_fetch_collabs_get",
  responses: {
    200: createSuccessObject({
      data: z.array(
        z.object({
          folder: folderSelectSchema.extend({ id: z.number() }),
          permissionLevel: FolderPermissionLevelSchema,
          owner: createSelectSchema(user)
            .pick({
              name: true,
              username: true,
              image: true,
            })
            .partial({ name: true, image: true }),
        }),
      ),
      message: "Successfully fetched all shared folders",
    }),
    [ERROR_DEFINITIONS.INTERNAL_ERROR.status]: createErrorObject({
      message: "Failed to fetch folders",
      code: "INTERNAL_ERROR",
      source: sources.get,
    }),
    [ERROR_DEFINITIONS.NOT_FOUND.status]: createErrorObject({
      message: "Folders not found",
      code: "NOT_FOUND",
      source: sources.get,
    }),
  },
});
