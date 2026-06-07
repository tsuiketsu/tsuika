import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { folder } from "@/db/schema/folder.schema";
import { throwError } from "@/errors/handlers";

// Get folder row's id (primary key)
export const getFolderId = async (userId: string, publicId: string) => {
  const data = await db.query.folder.findFirst({
    where: and(eq(folder.userId, userId), eq(folder.publicId, publicId)),
    columns: { id: true },
  });

  if (!data) {
    throwError(
      "NOT_FOUND",
      `Folder with id ${publicId} no found`,
      "bookmarks.folders.get",
    );
  }

  return data.id;
};
