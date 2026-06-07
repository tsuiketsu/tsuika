import { createRoute } from "@hono/zod-openapi";
import { assetSelectSchema } from "@/db/schema/asset.schema";
import { ERROR_DEFINITIONS } from "@/errors/codes";
import { objectInsertSchema } from "@/utils/storage";
import {
  createErrorObject,
  createIdParamSchema,
  createSources,
  createSuccessObject,
  jsonContentRequired,
} from "../helpers";

const tags = ["Assets"];
const sources = createSources("assets");

// -----------------------------------------
// GET ASSET
// -----------------------------------------
export const getAsset = createRoute({
  method: "get",
  path: "/{fileId}",
  summary: "Fetch one",
  tags,
  operationId: "asset_one_get",
  request: {
    params: createIdParamSchema("fileId"),
  },
  responses: {
    200: createSuccessObject({
      data: assetSelectSchema,
      message: "Successfully fetched asset",
    }),
    [ERROR_DEFINITIONS.NOT_FOUND.status]: createErrorObject({
      message: "asset not found",
      code: "NOT_FOUND",
      source: sources.get,
    }),
  },
});

// -----------------------------------------
// INSERT asset
// -----------------------------------------
export const createAsset = createRoute({
  method: "post",
  path: "/",
  summary: "Create",
  tags,
  operationId: "asset_create_one_insert",
  request: {
    body: jsonContentRequired(objectInsertSchema),
  },
  responses: {
    200: createSuccessObject({
      data: assetSelectSchema,
      message: "Successfully inserted asset",
    }),
    [ERROR_DEFINITIONS.INTERNAL_ERROR.status]: createErrorObject({
      message: "Failed to insert asset",
      code: "INTERNAL_ERROR",
      source: sources.post,
    }),
  },
});
