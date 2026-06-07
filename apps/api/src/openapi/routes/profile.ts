import { createRoute } from "@hono/zod-openapi";
import {
  profileInsertSchema,
  profileSelectSchema,
} from "@/db/schema/profile.schema";
import { ERROR_DEFINITIONS } from "@/errors/codes";
import { addExamples } from "@/utils/zod-utils";
import {
  createErrorObject,
  createSources,
  createSuccessObject,
  jsonContentRequired,
} from "../helpers";
import { generateFakerNanoIds } from "../utils";

const tags = ["User Profile"];
const sources = createSources("profile");
const SelectSchema = addExamples(profileSelectSchema, {
  preferencesJson: {
    font: "font-inter",
    pinnedFolders: [generateFakerNanoIds(2)],
  },
});

// -----------------------------------------
// GET USER PROFILE
// -----------------------------------------
export const getProfile = createRoute({
  method: "get",
  path: "/",
  summary: "Fetch",
  description: "Fetch user profile",
  tags,
  operationId: "profiles_get",
  responses: {
    200: createSuccessObject({
      data: SelectSchema,
      message: "Successfully fetched user's profile",
    }),
    [ERROR_DEFINITIONS.NOT_FOUND.status]: createErrorObject({
      message: "User profile not found",
      code: "NOT_FOUND",
      source: sources.get,
    }),
  },
});

// -----------------------------------------
// Update Preferences
// -----------------------------------------
export const updateUserPreferences = createRoute({
  method: "post",
  path: "/",
  summary: "Update Preferences",
  description:
    "Store user preferences such as font, theme, and other " +
    "settings requiring persistent storage.",
  tags,
  operationId: "profiles_preferences_update_post",
  request: { body: jsonContentRequired(profileInsertSchema) },
  responses: {
    200: createSuccessObject({
      data: SelectSchema,
      message: "Successfully updated preferences",
    }),
    [ERROR_DEFINITIONS.INTERNAL_ERROR.status]: createErrorObject({
      message: "Failed to update user preferences",
      code: "INTERNAL_ERROR",
      source: sources.post,
    }),
  },
});
