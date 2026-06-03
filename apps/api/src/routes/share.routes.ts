import type { CookieOptions } from "better-auth";
import { eq } from "drizzle-orm";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import jwt from "jsonwebtoken";
import { db } from "@/db";
import { user } from "@/db/schema/auth.schema";
import { bookmark } from "@/db/schema/bookmark.schema";
import { folder } from "@/db/schema/folder.schema";
import { sharedFolder } from "@/db/schema/shared-folder.schema";
import { throwError } from "@/errors/handlers";
import { createRouter } from "@/lib/create-app";
import {
  getSharedFolderContent,
  lockSharedFolder,
  unlockSharedFolder,
} from "@/openapi/routes/share";
import { createThumbnailURL, omit } from "@/utils";
import { verifyHash } from "@/utils/crypto";
import { bookmarkPublicFields } from "./bookmark.routes";

const router = createRouter();
const BUCKET = "thumbnails";

const cookieOpts: CookieOptions = {
  secure: true,
  httpOnly: true,
  maxAge: 60 * 60 * 1000,
  sameSite: "None",
  domain: `.${process.env.DOMAIN}`,
};

// -----------------------------------------
// GET SHARED FOLDER'S CONTENT (BOOKMARKS)
// -----------------------------------------
router.openapi(getSharedFolderContent, async (c) => {
  const source = "share-folders.get";

  const { username, publicId } = c.req.param();

  if (!publicId) {
    throwError("MISSING_PARAMETER", "publicId is required", source);
  }

  const response = await db
    .select({
      title: sharedFolder.title,
      note: sharedFolder.title,
      isPublic: sharedFolder.isPublic,
      isLocked: sharedFolder.isLocked,
      password: sharedFolder.password,
      salt: sharedFolder.salt,
      createdBy: sharedFolder.createdBy,
      expiresAt: sharedFolder.expiresAt,
      createdAt: sharedFolder.createdAt,
      updatedAt: sharedFolder.updatedAt,
      folder: {
        id: folder.id,
        name: folder.name,
        description: folder.description,
      },
      author: {
        username: user.username,
        name: user.name,
        image: user.image,
      },
    })
    .from(sharedFolder)
    .innerJoin(folder, eq(folder.id, sharedFolder.folderId))
    .innerJoin(user, eq(user.username, username))
    .where(eq(sharedFolder.publicId, publicId));

  if (!response || response[0] == null) {
    throwError("NOT_FOUND", "User or Folder not found", source);
  }

  const target = response[0];

  if (!target.isPublic) {
    throwError("FORBIDDEN", "User unpublished this folder", source);
  }

  if (target.expiresAt && Date.now() > new Date(target.expiresAt).getTime()) {
    throwError(
      "FORBIDDEN",
      `This content expired at ${target.expiresAt}`,
      source,
    );
  }

  if (target.isLocked) {
    const cookie = getCookie(c, `unlock_${publicId}`);

    if (!cookie) {
      throwError("UNAUTHORIZED", "User is not authorized", source);
    }

    type Payload = {
      id: string;
      iat: number;
    };

    let payload: Payload;

    try {
      payload = jwt.verify(cookie, process.env.JWT_SECRET) as Payload;
    } catch (_error) {
      throwError("UNAUTHORIZED", "Invalid or expired token", source);
    }

    const issuedAtMs = payload?.iat ? payload.iat * 1000 : 0;
    const updatedAtMs = new Date(target.updatedAt).getTime();

    const isMissingId = !payload?.id;
    const isWrongId = payload?.id !== publicId;
    const isStaleToken = updatedAtMs > issuedAtMs;

    if (isMissingId || isWrongId || isStaleToken) {
      throwError("UNAUTHORIZED", "Invalid or expired token", source);
    }
  }

  const bookmarkFields = omit(bookmarkPublicFields, [
    "isArchived",
    "isEncrypted",
    "isFavourite",
    "isPinned",
    "nonce",
    "updatedAt",
  ]);

  const bookmarks = await db
    .select(bookmarkFields)
    .from(bookmark)
    .where(eq(bookmark.folderId, target.folder.id));

  if (!bookmarks || bookmarks[0] == null) {
    throwError("INTERNAL_ERROR", "Failed to fetch folder's data", source);
  }

  return c.json(
    {
      success: true,
      data: Object.assign(
        {},
        {
          ...omit(target, ["isPublic"]),
          folder: omit(target.folder, ["id"]),
        },
        {
          bookmarks: bookmarks.map((b) => ({
            ...b,
            thumbnail: createThumbnailURL(b.thumbnail, BUCKET),
          })),
        },
      ),
      message: "Successfully fetched bookmarks",
    },
    200,
  );
});

// -----------------------------------------
// UNLOCK SHARED FOLDER IF LOCKED
// -----------------------------------------
router.openapi(unlockSharedFolder, async (c) => {
  const source = "share.folder.unlock";
  const publicId = c.req.param("publicId");

  const { password } = await c.req.json();

  if (!password || password.trim() === "") {
    throwError("REQUIRED_FIELD", "Password is required", source);
  }

  const target = await db.query.sharedFolder.findFirst({
    where: (folder, { eq }) => eq(folder.publicId, publicId),
    columns: {
      publicId: true,
      password: true,
      salt: true,
    },
  });

  if (!target) {
    throwError("NOT_FOUND", "Requested folder not found", source);
  }

  let isValid: boolean;

  try {
    console.log("running");
    isValid = await verifyHash(password, target.password!, target.salt!);
    console.log(isValid);
  } catch (_error) {
    throwError("INTERNAL_ERROR", "Failed to verify password", source);
  }

  if (!isValid) {
    throwError("UNAUTHORIZED", "Password is incorrect", source);
  }

  const token = jwt.sign({ id: target.publicId }, process.env.JWT_SECRET, {
    expiresIn: "60m",
  });

  setCookie(c, `unlock_${target.publicId}`, token, cookieOpts);

  return c.json({ success: true, message: "Folder unlocked!" }, 200);
});

// -----------------------------------------
// LOCK SHARED FOLDER
// -----------------------------------------
router.openapi(lockSharedFolder, async (c) => {
  const publicId = c.req.param("publicId");

  if (!publicId) {
    throwError("REQUIRED_FIELD", "id is required", "share.folder.lock");
  }

  deleteCookie(c, `unlock_${publicId}`, cookieOpts);

  return c.json(
    {
      success: true,
      data: null,
      message: `Successfully locked folder with id ${publicId}`,
    },
    200,
  );
});

export default router;
