import { and, eq, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { user } from "@/db/schema/auth.schema";
import { collabFolder as cFolder } from "@/db/schema/collab-folder.schema";
import { folder } from "@/db/schema/folder.schema";
import { throwError } from "@/errors/handlers";
import { createRouter } from "@/lib/create-app";
import { getFolderId } from "@/lib/folder.utils";
import {
  changeCollabFolderMemberPermission,
  createCollabFolderEntry,
  getCollabFolderMembers,
} from "@/openapi/routes/collab-folder";
import { getUserId, omit } from "@/utils";
import { generatePublicId } from "@/utils/nanoid";

const router = createRouter();

const parseImage = (image: string): string | null => {
  return image?.split("|")[1] || null;
};

// Gets user by either username or email
const getUserByIdentifier = async (identifier: string) => {
  return await db.query.user.findFirst({
    where: (user, { or, eq }) => {
      return or(eq(user.username, identifier), eq(user.email, identifier));
    },
    columns: {
      id: true,
      username: true,
      email: true,
      image: true,
    },
  });
};

// -----------------------------------------
// INSERT USER INTO COLLAB-FOLDERS TABLE
// -----------------------------------------
router.openapi(createCollabFolderEntry, async (c) => {
  const source = "collab-folders.post";
  const userId = await getUserId(c);

  const { folderPublicId, identifier, permissionLevel } = c.req.valid("json");

  // Check and get user id the folder to be collaborated with
  const sharedWithUser = await getUserByIdentifier(identifier);

  if (!sharedWithUser || !sharedWithUser.id) {
    throwError("NOT_FOUND", "User not found", source);
  }

  if (sharedWithUser?.id === userId) {
    throwError(
      "CONFLICT",
      "User cannot share with themselves (userId matches sharedWithUserId)",
      source,
    );
  }

  // Get folder id
  const folderId = await getFolderId(userId, folderPublicId);

  // Check if user already added to folder
  const userAlreadyAdded = await db.query.collabFolder.findFirst({
    where: and(
      eq(cFolder.folderId, folderId),
      eq(cFolder.sharedWithUserId, sharedWithUser.id),
    ),
    columns: { id: true },
  });

  if (userAlreadyAdded) {
    throwError("CONFLICT", "User already added to folder", source);
  }

  const data = await db
    .insert(cFolder)
    .values({
      publicId: generatePublicId(),
      ownerUserId: userId,
      sharedWithUserId: sharedWithUser.id,
      folderId,
      permissionLevel,
    })
    .onConflictDoNothing()
    .returning({
      id: cFolder.publicId,
    });

  if (!data || data[0] == null || !data[0].id) {
    throwError("INTERNAL_ERROR", "Failed to add user", source);
  }

  return c.json(
    {
      success: true,
      data: { id: data[0].id, user: omit(sharedWithUser, ["id"]) },
      message: `User successfully added as a collaborator with '${permissionLevel}' access.`,
    },
    200,
  );
});

// -----------------------------------------
// GET MEMBERS BY FOLDER_ID
// -----------------------------------------
router.openapi(getCollabFolderMembers, async (c) => {
  const source = "collab-folders.get";
  const folderPublicId = c.req.param("folderPublicId");

  const members = await db
    .select({
      name: user.name,
      username: user.username,
      image: user.image,
      permissionLevel: cFolder.permissionLevel,
    })
    .from(cFolder)
    .innerJoin(folder, eq(cFolder.folderId, folder.id))
    .innerJoin(user, eq(user.id, cFolder.sharedWithUserId))
    .where(eq(folder.publicId, folderPublicId));

  if (!members) {
    throwError("NOT_FOUND", "Folder not found", source);
  }

  if (members.length === 0) {
    throwError("NOT_FOUND", "No members found", source);
  }

  const owner = await db
    .select({ name: user.name, username: user.username, image: user.image })
    .from(cFolder)
    .innerJoin(folder, eq(cFolder.folderId, folder.id))
    .innerJoin(user, eq(user.id, cFolder.ownerUserId))
    .where(eq(folder.publicId, folderPublicId))
    .limit(1);

  if (!owner || owner[0] == null) {
    throwError("NOT_FOUND", "Owner not found", source);
  }

  const parsedMembers = members.map((user) => ({
    ...user,
    image: parseImage(user.image ?? ""),
  }));

  const parsedOwner = {
    ...owner[0],
    image: parseImage(owner[0]?.image ?? ""),
    permissionLevel: "owner",
  };

  return c.json(
    {
      success: true,
      message: "Successfully fetched users",
      data: [parsedOwner, ...parsedMembers],
    },
    200,
  );
});

// -----------------------------------------
// CHANGE MEMBER'S PERMISSION LEVEL
// -----------------------------------------
router.openapi(changeCollabFolderMemberPermission, async (c) => {
  const source = "collab-folders.patch";
  const userId = await getUserId(c);
  const folderId = await getFolderId(userId, c.req.param("folderPublicId"));

  // Check  user's authorization level
  const selectedCollabFolder = await db.query.collabFolder.findFirst({
    where: and(
      eq(cFolder.folderId, folderId),
      or(eq(cFolder.ownerUserId, userId), eq(cFolder.sharedWithUserId, userId)),
    ),
    columns: { ownerUserId: true, permissionLevel: true },
  });

  if (
    selectedCollabFolder?.ownerUserId !== userId &&
    selectedCollabFolder?.permissionLevel !== "admin"
  ) {
    console.log(selectedCollabFolder);
    throwError(
      "UNAUTHORIZED",
      "Only owner or admins can change other user's permissions",
      source,
    );
  }

  // Start the main process of changing other user's permission
  const { identifier, permissionLevel } = c.req.valid("json");
  const member = await getUserByIdentifier(identifier);

  // Prevent users from changing their own role
  if (member?.id === userId) {
    throwError(
      "UNAUTHORIZED",
      "Users cannot change their own roles or privileges",
      source,
    );
  }

  if (!member) {
    throwError("NOT_FOUND", "User not found", source);
  }

  const selectedFolder = await db.query.folder.findFirst({
    where: eq(folder.publicId, c.req.param("folderPublicId")),
    columns: { id: true },
  });

  if (!selectedFolder) {
    throwError("NOT_FOUND", "Folder not found", source);
  }

  const matchCondition = and(
    eq(cFolder.folderId, selectedFolder.id),
    eq(cFolder.sharedWithUserId, member.id),
  );

  const payload = {
    permissionLevel,
    updatedAt: sql`NOW()`,
  };

  const response = (
    await db.update(cFolder).set(payload).where(matchCondition).returning({
      id: cFolder.publicId,
      permissionLevel: cFolder.permissionLevel,
    })
  )?.[0];

  if (!response || !response.id) {
    throwError("INTERNAL_ERROR", "Failed to update permission level", source);
  }

  return c.json(
    {
      success: true,
      message: `Permission level updated: now set to '${permissionLevel}'`,
      data: { id: response.id, permissionLevel: response.permissionLevel },
    },
    200,
  );
});

export default router;
