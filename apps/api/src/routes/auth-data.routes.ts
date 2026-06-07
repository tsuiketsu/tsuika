import { and, eq, ne, sql } from "drizzle-orm";
import { db } from "@/db";
import { user } from "@/db/schema/auth.schema";
import { throwError } from "@/errors/handlers";
import { createRouter } from "@/lib/create-app";
import {
  getAuthDataSession,
  getAuthDataUser,
  UserEditableSchema,
  updateAuthDateUser,
} from "@/openapi/routes/auth-data";
import type { SuccessResponse } from "@/types";
import { getUserId } from "@/utils";
import {
  type CreateObjectResponse,
  deleteObject,
  saveObject,
} from "@/utils/storage";

const router = createRouter();
const BUCKET = "user-profile";

// -----------------------------------------
// GET USER SESSION
// -----------------------------------------
router.openapi(getAuthDataSession, async (c) => {
  const session = c.get("session");
  const user = c.get("user");

  if (!user) return c.json(null, 401);

  return c.json(
    {
      session,
      user,
    },
    200,
  );
});

router.get("/verification-email/:id", async (c) => {
  const id = c.req.param("id");

  if (!id) {
    throwError("REQUIRED_FIELD", "ID is required", "verifications.get");
  }

  const data = await db.query.verification.findFirst({
    where: (verification, { eq }) => eq(verification.id, id),
    columns: {
      identifier: true,
    },
  });

  if (!data?.identifier) {
    throwError(
      "NOT_FOUND",
      `Verification entry with id ${id} not found`,
      "verifications.get",
    );
  }

  return c.json<SuccessResponse<{ email: string }>>({
    success: true,
    message: "Successfully fetched email from verification entry",
    data: {
      email: data.identifier.replace("email-verification-otp-", ""),
    },
  });
});

// -----------------------------------------
// GET USER PROFILE
// -----------------------------------------
router.openapi(getAuthDataUser, async (c) => {
  const userId = await getUserId(c);

  const response = await db.query.user.findFirst({
    where: eq(user.id, userId),
    columns: {
      name: true,
      username: true,
      image: true,
    },
  });

  if (!response) {
    throwError("INTERNAL_ERROR", "Profile not found", "users.get");
  }

  return c.json(
    {
      success: true,
      data: { ...response, image: response.image?.split("|")[1] },
      message: "Successfully fetched profile",
    },
    200,
  );
});

// -----------------------------------------
// UPDATE NAME, USERNAME, IMAGE
// -----------------------------------------
router.openapi(updateAuthDateUser, async (c) => {
  const source = "users.patch";
  const userId = await getUserId(c);

  const { name, username, image } = await c.req.parseBody();

  // IMPORTANT: Check for username existence

  if (username && userId) {
    const found = await db.query.user.findFirst({
      where: and(ne(user.id, userId), eq(user.username, username as string)),
      columns: { username: true },
    });

    if (found) {
      throwError("CONFLICT", "Username is taken", source);
    }
  }

  // Upload file to cloud

  let cloudImage: CreateObjectResponse | null = null;

  if (image && image instanceof File) {
    cloudImage = await saveObject({
      origin: "local",
      fileUri: image,
      bucket: BUCKET,
    });
  }

  const newImage = cloudImage ? `${cloudImage.fileId}|${cloudImage.url}` : null;

  const response = await db.execute(sql`
    WITH old_data AS (
      SELECT id, name, username, image
      FROM auth.users 
      WHERE id = ${userId}
    )
    UPDATE auth.users
    SET
       username = COALESCE(${username ?? null}, old_data.username),
       name = COALESCE(${name ?? null}, old_data.name),
       image = COALESCE(${newImage ?? null}, old_data.image)
    FROM old_data
    WHERE auth.users.id = old_data.id
    RETURNING
      auth.users.name as name,
      auth.users.username as username,
      auth.users.image as image_url,
      old_data.image as old_image_url
  `);

  if (!response || response.rows[0] == null) {
    throwError("INTERNAL_ERROR", "Failed to update user profile", source);
  }

  // Cleanup old image

  const newImageUri = response.rows[0]["image_url"] as string;
  const oldImageUri = response.rows[0]["old_image_url"] as string;

  if (oldImageUri && oldImageUri !== newImageUri) {
    const fileId = oldImageUri.split("|")[0];
    fileId && deleteObject(BUCKET, fileId);
  }

  return c.json(
    {
      success: true,
      data: UserEditableSchema.parse({
        ...response.rows[0],
        image: newImageUri.split("|")[1],
      }),
      message: "Successfully updated profile",
    },
    200,
  );
});

export default router;
