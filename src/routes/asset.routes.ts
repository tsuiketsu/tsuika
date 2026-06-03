import type { z } from "@hono/zod-openapi";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { asset, assetSelectSchema } from "@/db/schema/asset.schema";
import { throwError } from "@/errors/handlers";
import { createRouter } from "@/lib/create-app";
import { createSources } from "@/openapi/helpers";
import { createAsset, getAsset } from "@/openapi/routes/asset";
import { getUserId } from "@/utils";
import { type objectInsertSchema, saveObject } from "@/utils/storage";

const router = createRouter();
const sources = createSources("assets");
const BUCKET = "assets";

// -----------------------------------------
// GET ASSET
// -----------------------------------------
router.openapi(getAsset, async (c) => {
  const fileId = c.req.param("fileId");
  const userId = await getUserId(c);

  const data = await db.query.asset.findFirst({
    where: and(eq(asset.userId, userId), eq(asset.fileId, fileId)),
    columns: {
      fileId: true,
      filename: true,
      mimeType: true,
      size: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!data) {
    throwError("NOT_FOUND", "Failed to get asset", sources.get);
  }

  return c.json(
    {
      success: true,
      data: assetSelectSchema.parse(data),
      message: "Successfully fetched asset",
    },
    200,
  );
});

// -----------------------------------------
// INSERT ASSET
// -----------------------------------------
router.openapi(createAsset, async (c) => {
  const body = await c.req.parseBody();

  const file = await saveObject({
    ...(body as z.infer<typeof objectInsertSchema>),
    bucket: BUCKET,
  });

  if (!file || !file.fileId) {
    throwError("INTERNAL_ERROR", "Failed to insert asset", sources.post);
  }

  const userId = await getUserId(c);

  const response = await db
    .insert(asset)
    .values({
      fileId: file.fileId,
      filename: file.name,
      size: file.size,
      mimeType: file.mimeType,
      userId: userId,
      updatedAt: sql`NOW()`,
    })
    .returning();

  if (!response || response[0] == null) {
    throwError("INTERNAL_ERROR", "Failed to insert asset", sources.post);
  }

  return c.json(
    {
      success: true,
      data: assetSelectSchema.parse(response[0]),
      message: "Successfully inserted asset",
    },
    200,
  );
});

export default router;
