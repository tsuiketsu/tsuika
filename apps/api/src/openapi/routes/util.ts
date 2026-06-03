import { createRoute, z } from "@hono/zod-openapi";
import { ERROR_DEFINITIONS } from "@/errors/codes";
import { LinkPreviewSchema } from "@/types/link-preview.types";
import {
  createErrorObject,
  createSources,
  createSuccessObject,
} from "../helpers";

const tags = ["Utils"];
const sources = createSources("utils");

export const createLinkPreview = createRoute({
  method: "get",
  path: "/link-preview",
  summary: "Get URL metadata",
  tags,
  operationId: "utils_link_preview_get",
  request: {
    query: z.object({
      url: z.string(),
    }),
  },
  responses: {
    200: createSuccessObject({
      data: LinkPreviewSchema.partial(),
      message: "Successfully fetched link preview",
    }),
    [ERROR_DEFINITIONS.INVALID_PARAMETER.status]: createErrorObject({
      message: "URL is either missing or invalid",
      code: "INVALID_PARAMETER",
      source: sources.get,
    }),
    [ERROR_DEFINITIONS.INTERNAL_ERROR.status]: createErrorObject({
      message: "Failed to fetch link preview",
      code: "INTERNAL_ERROR",
      source: sources.get,
    }),
  },
});
