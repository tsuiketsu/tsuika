import { eq, sql } from "drizzle-orm";
import { throwError } from "@/errors/handlers";
import { getProfile, updateUserPreferences } from "@/openapi/routes/profile";
import { createThumbnailURL, getUserId } from "@/utils";
import {
  type CreateObjectResponse,
  deleteObject,
  saveObject,
} from "@/utils/storage";
import { db } from "../db";
import { profile } from "../db/schema/profile.schema";
import { createRouter } from "../lib/create-app";

const router = createRouter();
const BUCKET = "user-profile";

const whereUserId = (userId: string) => {
  return eq(profile.userId, userId);
};

// -----------------------------------------
// GET USER PROFILE
// -----------------------------------------
router.openapi(getProfile, async (c) => {
  const userId = await getUserId(c);

  const data = await db.query.profile.findFirst({
    where: whereUserId(userId),
    columns: { userId: false },
  });

  if (!data) {
    throwError("NOT_FOUND", "User profile not found", "profiles.get");
  }

  // biome-ignore lint/suspicious/noExplicitAny: false
  const thumbnail = (data.preferencesJson as any)["dashboardThumbnail"];

  return c.json(
    {
      success: true,
      data: {
        ...data,
        preferencesJson: Object.assign({}, data.preferencesJson, {
          dashboardThumbnail: thumbnail
            ? createThumbnailURL(thumbnail, BUCKET)
            : null,
        }),
      },
      message: "Successfully fetched user's profile",
    },
    200,
  );
});

// -----------------------------------------
// Update Preferences
// -----------------------------------------
router.openapi(updateUserPreferences, async (c) => {
  const formData = await c.req.parseBody();
  const userId = await getUserId(c);

  // Upload dashboardThumbnail if exists
  let cloudImage: CreateObjectResponse | null = null;
  const image = formData?.dashboardThumbnail as unknown;

  if (image && image instanceof File) {
    cloudImage = await saveObject({
      origin: "local",
      fileUri: image,
      bucket: BUCKET,
    });
  }

  const data = await db.transaction(async (tx) => {
    const prev = await tx.query.profile.findFirst({
      where: eq(profile.userId, userId),
      columns: {
        preferencesJson: true,
      },
    });

    const updated = await tx
      .insert(profile)
      .values({
        userId,
        preferencesJson: Object.assign({}, formData, {
          dashboardThumbnail: cloudImage?.fileId,
        }),
      })
      .onConflictDoUpdate({
        target: profile.userId,
        where: whereUserId(userId),
        set: {
          preferencesJson: Object.assign(
            {},
            prev?.preferencesJson ?? {},
            formData,
            cloudImage?.fileId && {
              dashboardThumbnail: cloudImage?.fileId ?? null,
            },
          ),
          updatedAt: sql`now()`,
        },
      })
      .returning();

    if (!updated || updated[0] == null) {
      throwError(
        "INTERNAL_ERROR",
        "Failed to update user preferences",
        "profiles.post",
      );
    }

    return { prev, updated: updated[0] };
  });

  // biome-ignore lint/suspicious/noExplicitAny: false
  const prevThumbnailFileId = (data.prev?.preferencesJson as any)
    .dashboardThumbnail;

  // Clean up previous dashboardThumbnail
  if (prevThumbnailFileId) {
    console.log(prevThumbnailFileId);
    await deleteObject(BUCKET, prevThumbnailFileId);
  }

  return c.json(
    {
      success: true,
      data: {
        ...data.updated,
        preferencesJson: Object.assign(
          {},
          data.updated.preferencesJson,
          (cloudImage?.fileId || prevThumbnailFileId) && {
            dashboardThumbnail: createThumbnailURL(
              cloudImage?.fileId ?? prevThumbnailFileId,
              BUCKET,
            ),
          },
        ),
      },
      message: "Successfully updated preferences",
    },
    200,
  );
});

export default router;
