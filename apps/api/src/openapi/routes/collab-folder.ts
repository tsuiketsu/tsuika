import { createRoute, z } from "@hono/zod-openapi";
import { ERROR_DEFINITIONS } from "@/errors/codes";
import {
  FolderPermissionLevelSchema,
  FolderPermissionLevelSchema as permissionLevel,
} from "@/types/schema.types";
import { userSchema } from "../common/schema";
import {
  createErrorObject,
  createIdParamSchema,
  createSources,
  createSuccessObject,
  jsonContentRequired,
} from "../helpers";

const tags = ["Collab Folder"];
const sources = createSources("collab-folders");

const UserSelectSchema = userSchema.pick({
  username: true,
  email: true,
  image: true,
});

const InsertSchema = z.object({
  identifier: z.string(),
  folderPublicId: z.string(),
  permissionLevel: FolderPermissionLevelSchema,
});

// -----------------------------------------
// INSERT USER INTO COLLAB-FOLDERS TABLE
// -----------------------------------------
export const createCollabFolderEntry = createRoute({
  method: "post",
  path: "/",
  description: "Add user as collaborator of a folder",
  summary: "Create Entry",
  tags,
  operationId: "collab_folder_post",
  request: {
    body: jsonContentRequired(
      z.object({
        identifier: z.string(),
        folderPublicId: z.string(),
        permissionLevel: permissionLevel,
      }),
    ),
  },
  responses: {
    200: createSuccessObject({
      data: z.object({
        id: z.string(),
        user: UserSelectSchema,
      }),
      message: "User successfully added as a collaborator with 'role' access.",
    }),
    [ERROR_DEFINITIONS.CONFLICT.status]: createErrorObject({
      message:
        "User cannot share with themselves (userId matches sharedWithUserId)/" +
        "User already added to folder",
      code: "CONFLICT",
      source: sources.post,
    }),
  },
});

// -----------------------------------------
// GET MEMBERS BY FOLDER_ID
// -----------------------------------------
export const getCollabFolderMembers = createRoute({
  method: "get",
  path: "/{folderPublicId}",
  description: "Get members of folders by id",
  summary: "Fetch Members",
  tags,
  operationId: "collab_folder_members_get",
  request: {
    params: createIdParamSchema("folderPublicId"),
  },
  responses: {
    200: createSuccessObject({
      data: z.array(
        userSchema
          .pick({ name: true, username: true, image: true })
          .extend({ permissionLevel: z.string() }),
      ),
      message: "Successfully fetched users",
    }),
    [ERROR_DEFINITIONS.NOT_FOUND.status]: createErrorObject({
      message: "Folder not found/No Members found/Owner not found",
      code: "NOT_FOUND",
      source: sources.get,
    }),
  },
});

// -----------------------------------------
// CHANGE MEMBER'S PERMISSION LEVEL
// -----------------------------------------
export const changeCollabFolderMemberPermission = createRoute({
  method: "patch",
  path: "/{folderPublicId}",
  description: "Change folder's member permission/role",
  summary: "Change Permission",
  tags,
  operationId: "collab_folder_change_permission_get",
  request: {
    params: createIdParamSchema("folderPublicId"),
    body: jsonContentRequired(InsertSchema.omit({ folderPublicId: true })),
  },
  responses: {
    200: createSuccessObject({
      data: z.object({
        id: z.string(),
        permissionLevel: z.string(),
      }),
      message: `Permission level updated: now set to <role>`,
    }),
    [ERROR_DEFINITIONS.UNAUTHORIZED.status]: createErrorObject({
      message:
        "Only owner or admins can change other user's permissions/" +
        "Users cannot change their own roles or privileges",
      code: "UNAUTHORIZED",
      source: sources.patch,
    }),
    [ERROR_DEFINITIONS.NOT_FOUND.status]: createErrorObject({
      message: "Folder not found",
      code: "NOT_FOUND",
      source: sources.patch,
    }),
    [ERROR_DEFINITIONS.INTERNAL_ERROR.status]: createErrorObject({
      message: "Failed to update permission level",
      code: "INTERNAL_ERROR",
      source: sources.patch,
    }),
  },
});
