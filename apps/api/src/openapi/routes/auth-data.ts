import { createRoute, z } from "@hono/zod-openapi";
import { ERROR_DEFINITIONS } from "@/errors/codes";
import { sessionSchema, userSchema } from "../common/schema";
import {
  createErrorObject,
  createSources,
  createSuccessObject,
  jsonContentRequired,
} from "../helpers";

const tags = ["Auth"];
const sources = createSources("users");
export const UserEditableSchema = userSchema.pick({
  name: true,
  username: true,
  image: true,
});

// -----------------------------------------
// GET USER SESSION
// -----------------------------------------
export const getAuthDataSession = createRoute({
  method: "get",
  path: "/session",
  summary: "Session",
  description: "Fetch User's Session",
  tags,
  operationId: "auth_session_get",
  responses: {
    200: {
      description: "Session Info",
      content: {
        "application/json": {
          schema: z
            .object({
              session: sessionSchema.optional().nullable(),
              user: userSchema.optional().nullable(),
            })
            .optional()
            .nullable(),
        },
      },
    },
    [ERROR_DEFINITIONS.UNAUTHORIZED.status]: {
      description: "",
      content: { "application/json": { schema: z.any() } },
    },
  },
});

// -----------------------------------------
// GET USER PROFILE
// -----------------------------------------
export const getAuthDataUser = createRoute({
  method: "get",
  path: "/user",
  summary: "User",
  description: "Get user's profile",
  tags,
  operationId: "auth_user_get",
  responses: {
    200: createSuccessObject({
      data: UserEditableSchema,
      message: "Successfully fetched profile",
    }),
    [ERROR_DEFINITIONS.INTERNAL_ERROR.status]: createErrorObject({
      message: "Profile not found",
      code: "INTERNAL_ERROR",
      source: sources.get,
    }),
  },
});

// -----------------------------------------
// UPDATE NAME, USERNAME, IMAGE
// -----------------------------------------
export const updateAuthDateUser = createRoute({
  method: "patch",
  path: "/user",
  summary: "Update User",
  description: "Update user profile details, name, username and image",
  tags,
  operationId: "auth_user_update_patch",
  request: { body: jsonContentRequired(UserEditableSchema.partial()) },
  responses: {
    200: createSuccessObject({
      data: UserEditableSchema,
      message: "Successfully updated profile",
    }),
    [ERROR_DEFINITIONS.CONFLICT.status]: createErrorObject({
      message: "Username is taken",
      code: "CONFLICT",
      source: sources.patch,
    }),
    [ERROR_DEFINITIONS.INTERNAL_ERROR.status]: createErrorObject({
      message: "Failed to update user profile",
      code: "INTERNAL_ERROR",
      source: sources.patch,
    }),
  },
});
